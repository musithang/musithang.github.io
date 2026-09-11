---
title: "A perfectly good paperweight"
date: 2026-09-11T08:00:00Z
draft: false
weight: 2
tags: ["homelab", "linux", "android", "networking", "security"]
description: "A phone with no resale value left, a 400 gigabyte kernel rebuild, and a firewall that turned out to have two heads that don't talk to each other."
rewrites: 1
---

> Or: what you can make a dead phone do if you refuse to accept that it's dead.

There was a Xiaomi 12T Pro sitting in a drawer, doing nothing. Not broken. Obsolete in that specific way a phone becomes obsolete: the resale value had dropped to "good luck with that," and it had already been replaced, so it stopped being my phone and became the phone in the drawer.

Throwing away a perfectly good piece of silicon felt wrong. Not using it felt worse. So: what if it ran a homelab.

## The stupid options, tried first

{{< spec cols="1" >}}
{{< field name="Termux" >}}A sandbox with a terminal stapled on. No real namespaces, no containers, forget it.{{< /field >}}
{{< field name="proot" >}}Fakes a filesystem root. Half your syscalls are emulated and the other half just lie to you.{{< /field >}}
{{< field name="Emulators" >}}Bless their hearts.{{< /field >}}
{{< /spec >}}

Then I found DroidSpaces: real Linux containers, real namespaces, actual hardware access. One problem. The kernel didn't support it.

Of course it didn't.

## Rebuilding a mountain to move a pebble

{{< note >}}The phone's factory codename is "diting." In Chinese folklore, Diting is a listening beast, said to hear everything that happens underground. I did not pick that. The naming department got there first.{{< /note >}}

I'd already named the homelab after Odysseus, for the obvious reason: the whole project turned into a long way home through problems that were entirely of my own making. Finding out the hardware had already been mythologically pre-loaded felt less like a coincidence and more like the universe filing a joke ahead of schedule.

`CONFIG_PID_NS`, along with the rest of the namespace and cgroup options a container runtime needs, was off in the shipped kernel config. Not hidden, not locked behind a permission. Off, the way a light switch is off. These are compile-time flags baked into the binary, and no amount of root access changes a value that was never there to begin with.

{{< spec cols="2" >}}
{{< field name="Source tree" >}}~400 GB, full LineageOS checkout{{< /field >}}
{{< field name="Peak build memory" >}}~13 GB just for the build system, needs a swapfile below 32 GB of RAM{{< /field >}}
{{< field name="Vendor modules" >}}Every one compiled from source, none prebuilt{{< /field >}}
{{< field name="Cost of one flag" >}}A multi-hour rebuild of the entire OS{{< /field >}}
{{< /spec >}}

So I downloaded the entire source tree, found the device's kernel config fragment, turned the missing options back on, and rebuilt the kernel, the vendor image, and every kernel module together, because on this device none of them come prebuilt and all of them have to agree on the same ABI or the phone simply doesn't boot.

It worked. Full containers, actual namespaces, hardware access, on a 2022 flagship that was otherwise headed for a drawer of forgotten gadgets.

## Four stops on the way home

Getting the kernel to boot was, comparatively, the easy part. Getting a working network out of an Android kernel that was never designed to route anything for anyone else took four separate fights, each solved with its own small, specific act of cunning.

{{< log >}}
{{< event at="No road home" >}}Standard Linux keeps its default route in the main routing table. Android keeps it in a separate, interface-specific table instead, invisible to anything that goes looking for it the normal way. VPN traffic had nowhere to go, because as far as the main table was concerned there was no way out of the house at all. The fix is `ip rule`: send that traffic to look up Android's own table instead of the one every guide on the internet assumes exists.{{< /event >}}
{{< event at="Two gatekeepers, one door" >}}Ubuntu 24.04 defaults to the nftables iptables backend. Android's own tethering control still speaks the older xtables dialect, and the two do not share state or know the other exists. A rule written with the new tool does precisely nothing to traffic Android's tethering system is filtering. Every rule that actually has to matter here goes through `iptables-legacy`, deliberately, every single time.{{< /event >}}
{{< event at="The loom unwoven" >}}Android's network daemon pins its packet-filter programs to a path under `/sys/fs/bpf/`, and that path lives on a filesystem wiped clean on every reboot. The programs survive in the kernel. The reference that lets anything else talk to them does not. Every boot, that reference has to be rebuilt from scratch before the firewall can be told the programs exist at all.{{< /event >}}
{{< event at="The guard at the door" >}}Android's tethering control drops a blanket DROP rule into the FORWARD chain by default, to block anything that isn't recognised tethering traffic, which very much includes a homemade VPN. The fix isn't a smarter rule. It's a faster one: insert the ACCEPT rule at position one, ahead of the guard, instead of appending it to the back of a queue it will never reach.{{< /event >}}
{{< /log >}}

None of this is a bug, exactly. It's all Android being extremely good at being Android, on a kernel that was never supposed to route a WireGuard tunnel out of somebody's spare room.

## Drawing the map

Once the routes actually worked, the shape of the thing turned out to be almost embarrassingly simple.

```
                         Internet
                             |
                    home router (NAT)
                             |
                    phone  ::  wlan0
                    192.168.1.0/24
                             |
              +--------------+--------------+
              |                             |
         wg0 (WireGuard)              every container
         10.13.13.0/24                network_mode: host
              |                             |
        VPN clients                  DNS · media · proxy
     (phone, laptop, tablet)          all on the same IP
```

That `network_mode: host` line is doing more work than it looks like. The obvious choice, a Docker bridge network with its own subnet and port mapping, would have needed its own routing table and its own NAT rules, both of which would then be competing with Android's tethering stack for the same job. Two systems, both convinced they're in charge of the same traffic, is not a fight worth having on purpose. Host networking sidesteps it entirely: every container just listens on the phone's one real IP, containers reach each other over `127.0.0.1`, and there is exactly one thing on the box doing routing instead of two arguing about it.

The price is that every container shares one port space, so two things quietly fighting over the same port is now a spreadsheet problem instead of a networking one. A spreadsheet problem is a good trade.

## Everything hears through one door

{{< split cols="2" caption="Same resolver, same blocklist, whether you're on the couch or on the other side of the planet." >}}
{{< pane label="LAN client" >}}
The router hands out the phone's address as the DNS server. Every query, from every device on the network, goes straight there.
{{< /pane >}}
{{< pane label="VPN client" >}}
The WireGuard config sets the same address as DNS, pushed to the client over the tunnel. Same resolver, same blocklist, now wearing a VPN as a disguise.
{{< /pane >}}
{{< /split >}}

Pi-hole sits on port 53 and answers both. It doesn't know or care whether a query arrived over Wi-Fi or through an encrypted tunnel from another continent. A query is a query. If the domain is on the blocklist, the answer is nothing, and the ad never gets far enough to load. My phone has stronger opinions about advertising than most adblockers I've paid for, and it formed all of them for free.

## Locking what shouldn't be open

Host networking means every container can, in principle, be reached on the phone's one address. Most of them shouldn't be reachable from anywhere except the two networks that are supposed to trust each other.

```
for PORT in 19999 5984 5006 3000; do
    iptables-legacy -I INPUT 1 -p tcp --dport "$PORT" -j DROP
    iptables-legacy -I INPUT 1 -p tcp --dport "$PORT" -s 10.13.13.0/24  -j ACCEPT  # VPN
    iptables-legacy -I INPUT 1 -p tcp --dport "$PORT" -s 192.168.1.0/24 -j ACCEPT  # LAN
    iptables-legacy -I INPUT 1 -p tcp --dport "$PORT" -s 127.0.0.0/8    -j ACCEPT  # localhost
done
```

Rules get inserted in reverse order on purpose, so ACCEPT ends up ahead of DROP in the chain, the same trick the tetherctrl guard taught me two sections ago. Insert the exception before the rule it's an exception to, or it never gets read.

What that leaves facing the actual internet is small on purpose: the WireGuard handshake port, and a reverse proxy in front of exactly one service that has its own login and its own reason to exist in public. Everything else, the dashboards, the metrics, the things with no login screen at all because they were never meant to need one, only ever sees traffic from the LAN or from inside the tunnel.

{{< plate label="Eviction notice" ref="MT-A/SEC" stamp="Enforced" footer="Reinstatement requires a working memory and considerably fewer login attempts" >}}
{{< spec cols="1" >}}
{{< field name="Tenant" >}}{{< redacted >}}203.0.113.44{{< /redacted >}}{{< /field >}}
{{< field name="Reason" >}}Five wrong passwords in ten minutes, aimed at the one thing facing the internet{{< /field >}}
{{< field name="Sentence" >}}24 hours, iptables-legacy, no appeal{{< /field >}}
{{< /spec >}}
{{< /plate >}}

Fail2ban watches the login failures and writes that eviction itself, straight into the same INPUT chain, no human involved. Three wrong passwords against the one public-facing login is enough. It does not care who's asking.

## What a listening beast needs, in order to listen

The last problem wasn't networking. It was attention span. Android throttles the CPU hard the moment the screen turns off, down to a few hundred megahertz on this device, which is sensible for a phone nobody is looking at and useless for a server that is meant to keep working at 3 a.m. A minimum frequency floor and a partial wake lock fix it. The screen is allowed to sleep. The phone is not.

A beast whose entire job is listening doesn't get to doze off just because nobody's watching the screen.

## The lock on the tunnel

{{< spec cols="2" >}}
{{< field name="Key exchange" >}}Curve25519{{< /field >}}
{{< field name="Encryption" >}}ChaCha20-Poly1305{{< /field >}}
{{< field name="Hashing" >}}BLAKE2s{{< /field >}}
{{< field name="Handshake" >}}Noise protocol, IKpsk2{{< /field >}}
{{< /spec >}}

Session keys rotate every couple of minutes and never touch the disk, so recording the encrypted traffic today buys an attacker nothing later, even if the long-term key eventually leaks. The whole implementation is around four thousand lines. OpenVPN's is well over a hundred thousand, mostly because it still has to negotiate which cipher to use, which is also the same mechanism that lets you negotiate your way into a weak one. WireGuard skips the negotiation. There is one way to do it, and it's the strong way.

## What's actually running

A DNS resolver that filters its own upstream queries. A WireGuard tunnel that only the devices with the right key can even see. A reverse proxy terminating TLS for the one thing that's allowed to face the internet at all. A media server, a download client, a dashboard, a handful of quieter tools, all sharing one IP because there was never a good reason to give them separate ones.

The exact public address, the exact ports, and the exact map of what's reachable from where are staying off this page. Not because the setup is fragile, but because there is no upside to publishing a floor plan of your own front door.

{{< signature caption="This entry's signature, encoded the same way as every other one on the shelf." >}}
