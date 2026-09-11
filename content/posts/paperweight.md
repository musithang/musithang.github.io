---
title: "A perfectly good paperweight"
date: 2026-09-11T08:00:00Z
draft: false
weight: 2
tags: ["homelab", "linux", "android", "networking", "security"]
description: "A phone with no resale value left, a 400 gigabyte kernel rebuild, and a ten-year trip home that took about eleven months instead."
rewrites: 1
---

> Or: what you can make a dead phone do if you refuse to accept that it's dead.

There was a Xiaomi 12T Pro sitting in a drawer, doing nothing. Not broken. Obsolete in that specific way a phone becomes obsolete: the resale value had dropped to "good luck with that," and it had already been replaced, so it stopped being my phone and became the phone in the drawer.

Throwing away a perfectly good piece of silicon felt wrong. Not using it felt worse. So: what if it ran a homelab.

It turns out that sentence is also, structurally, the entire Odyssey. More on that shortly.

## The stupid options, tried first

{{< spec cols="1" >}}
{{< field name="Termux" >}}A sandbox with a terminal stapled on. No real namespaces, no containers, forget it.{{< /field >}}
{{< field name="proot" >}}Fakes a filesystem root. Half your syscalls are emulated and the other half just lie to you.{{< /field >}}
{{< field name="Emulators" >}}Bless their hearts.{{< /field >}}
{{< /spec >}}

Then I found DroidSpaces: real Linux containers, real namespaces, actual hardware access. One problem. The kernel didn't support it.

Of course it didn't.

## Rebuilding a mountain to move a pebble

`CONFIG_PID_NS`, along with the rest of the namespace and cgroup options a container runtime needs, was off in the shipped kernel config. Not hidden, not locked behind a permission. Off, the way a light switch is off. These are compile-time flags baked into the binary, and no amount of root access changes a value that was never there to begin with. The only fix is rebuilding the kernel from source, which on this device means rebuilding the entire OS, because none of the vendor modules come prebuilt either.

{{< note >}}The phone's factory codename is "diting." In Chinese folklore, Diting is a listening beast, said to hear everything that happens underground. I did not pick that. The naming department got there first.{{< /note >}}

I'd already named the homelab after Odysseus, for what felt at the time like a throwaway joke: the whole project was obviously going to be a long way home through problems entirely of my own making. Finding out the hardware had already been mythologically pre-loaded, before I'd chosen anything, felt less like a coincidence and more like the universe filing a joke ahead of schedule.

{{< spec cols="2" >}}
{{< field name="Source tree" >}}~400 GB, full LineageOS checkout{{< /field >}}
{{< field name="Peak build memory" >}}~13 GB just for the build system{{< /field >}}
{{< field name="Vendor modules" >}}Every one compiled from source, none prebuilt{{< /field >}}
{{< field name="Cost of one flag" >}}A multi-hour rebuild of the entire OS{{< /field >}}
{{< /spec >}}

{{< note side="right" >}}If you use fish as your shell, as any sensible person does, `source build/envsetup.sh` fails with something like "missing end to balance this if statement," because the AOSP build system has never heard of fish and never will. Open a plain `bash`, do the incantations there, `exit` back to civilisation when you're done.{{< /note >}}

Two things nearly ended the project before the kernel had even finished compiling. The first: I forgot `git lfs install` before syncing the source, so every binary blob downloaded as a text pointer instead of the actual file. Nothing about this fails loudly. It fails quietly, hours later, as a SHA1 mismatch on an obscure partition image, at which point you get to discover that half your source tree has been lying to you the entire time. The second: `systemd-oomd`, Ubuntu's own out-of-memory killer, took one look at a kernel build eating thirteen gigabytes of RAM and decided this was exactly the kind of process it exists to murder. The build doesn't crash. It just stops, silently, with an exit code that explains nothing. Both fixes are one line each, and both cost me an evening apiece to actually diagnose.

So: swapfile, oomd stopped, lfs installed, config fragment patched, and then a source tree the size of a small operating system, because it is one, rebuilt itself from scratch. It worked. Full containers, actual namespaces, hardware access, on a 2022 flagship that was otherwise headed for a drawer of forgotten gadgets.

## Four stops on the way home

Getting the kernel to boot was, comparatively, the easy part. Getting a working network out of an Android kernel that was never designed to route anything for anyone else took four separate fights, and by this point I was fully committed to the framing, so here they are as four stops on the way home, in order.

{{< log >}}
{{< event at="No road home" >}}Standard Linux keeps its default route in the main routing table. Android keeps it in a separate, interface-specific table instead, invisible to anything that goes looking for it the normal way. VPN traffic had nowhere to go, because as far as the main table was concerned there was no way out of the house at all. Different god, same problem Odysseus had with Poseidon: the direct route home simply isn't on the map you're allowed to see. The fix is `ip rule`, sending that traffic to look up Android's own table instead of the one every guide on the internet assumes exists.{{< /event >}}
{{< event at="Two gatekeepers, one door" >}}Ubuntu 24.04 defaults to the nftables iptables backend. Android's own tethering control still speaks the older xtables dialect, and the two do not share state or know the other exists. Two heads, like Scylla, and just as unaware of each other: satisfy one and the other eats you regardless. A rule written with the new tool does precisely nothing to traffic Android's tethering system is filtering. Every rule that actually has to matter here goes through `iptables-legacy`, deliberately, every single time.{{< /event >}}
{{< event at="The loom unwoven" >}}Android's network daemon pins its packet-filter programs to a path under `/sys/fs/bpf/`, and that path lives on a filesystem wiped clean on every reboot. The programs survive in the kernel. The reference that lets anything else talk to them does not. Every boot runs its own small version of Penelope's trick: what got carefully assembled the night before is quietly undone by morning, and has to be rewoven from scratch before the firewall can be told the programs exist at all.{{< /event >}}
{{< event at="The guard at the door" >}}Android's tethering control drops a blanket DROP rule into the FORWARD chain by default, to block anything that isn't recognised tethering traffic, which very much includes a homemade VPN. Something is already camped in the doorway, and it has no idea it's supposed to let family through. You don't out-argue a guard like that. You get there first: insert the ACCEPT rule at position one, ahead of it, instead of appending it to the back of a queue it will never reach.{{< /event >}}
{{< /log >}}

None of this is a bug, exactly. It's all Android being extremely good at being Android, on a kernel that was never supposed to route a WireGuard tunnel out of somebody's spare room.

And none of it is likely to be useful to another living soul, if we're honest. The exact combination of this phone, this Android build, and these four specific decisions is about as reusable as a fingerprint. But writing it down means I never have to solve any of these four problems twice, and if one fragment of it, the routing trick, the pin, the insert-before-append order, happens to save somebody else an evening on a completely unrelated project, that's a better outcome than the alternative, which is all of this quietly evaporating the next time I forget how my own network works.

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

{{< note >}}Pi-hole's stats page breaks query volume down by client name. Mine mostly just says "phone," which is technically accurate and mildly confusing every single time I look at it.{{< /note >}}

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

{{< note side="right" >}}WireGuard's entire implementation is small enough that people have genuinely read the whole thing, start to finish. Nobody has ever said that about OpenVPN, and several careers have been built entirely on not finishing the attempt.{{< /note >}}

Session keys rotate every couple of minutes and never touch the disk, so recording the encrypted traffic today buys an attacker nothing later, even if the long-term key eventually leaks. The whole implementation is around four thousand lines. OpenVPN's is well over a hundred thousand, mostly because it still has to negotiate which cipher to use, which is also the same mechanism that lets you negotiate your way into a weak one. WireGuard skips the negotiation. There is one way to do it, and it's the strong way.

## Ithaca, such as it is

Odysseus took ten years to get home. This took about eleven months, which I am choosing to count as an improvement. But the shape of the story holds: the destination was never really a place on a map. It was a working state. My stuff, under my control, doing what I actually need it to do, instead of sitting in a drawer being worth nothing to anyone, including me.

A DNS resolver that filters its own upstream queries. A WireGuard tunnel that only the devices with the right key can even see. A reverse proxy terminating TLS for the one thing that's allowed to face the internet at all. A media server, a download client, a dashboard, a handful of quieter tools, all sharing one IP because there was never a good reason to give them separate ones.

The exact public address, the exact ports, and the exact map of what's reachable from where are staying off this page. Not because the setup is fragile, but because there is no upside to publishing a floor plan of your own front door.

The phone got home. It just needed the drawer part removed first.

{{< signature caption="This entry's signature, encoded the same way as every other one on the shelf." >}}
