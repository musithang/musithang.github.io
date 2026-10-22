---
title: "Taking Things Apart"
description: "On childhood curiosity, invisible radio signals, and the long road from taking toys apart to building instruments in Rust."
date: 2026-10-22
kind: essay
tags: [about, rust, sdr, dsp, personal]
project: sdrtop
evergreen: true
cover: ./image/cover.jpg
coverAlt: "Illustration of a child exploring radios and electronics at a workbench"
draft: false
---

When I was a kid, my toys rarely stayed intact for very long.

I didn't want to break them; I simply wanted to know what lived inside them. How did they work? What made them do what they did? The easiest way to find out, as far as I was concerned, was to take them apart.

Putting them back together took longer, and I enjoyed that part too. When a toy worked again, it felt like something I had earned.

Later, that made me the person in the family, and among my friends, who gets handed the laptop, the phone, or whatever gadget has stopped working.

That curiosity never really went away. It just found bigger things to take apart.

I'd always been drawn to the parts of physics I couldn't see.

Years later, I found myself reading about software-defined radio. The more I learned, the more fascinating it became. The room was silent, and it was full of signals: an entire world of information travelling through the space around me, waiting for a receiver to reveal it.

Eventually, I bought a HackRF One.

I wanted to explore the radio-frequency world around me, listen to signals, and experiment with digital demodulation. What began as curiosity quickly became something more. I wasn't satisfied with discovering that a signal existed. I wanted to understand what it contained, how it was encoded, and what happened between the raw samples and the information on the screen.

I had found something new to take apart.

## Discovering the invisible

With an SDR, radio signals stop being an abstract concept. You can observe them, record them, examine their structure, and begin to understand the processes that make communication possible.

But seeing a signal is only the beginning.

There is a considerable difference between using a program that decodes something for you and understanding how that decoding actually works. I became increasingly interested in the processing itself: the mathematics, the timing, the assumptions, and the decisions that turn a stream of complex samples into meaningful data.

What does a demodulator calculate? Where does timing information come from? How can you tell whether a decoded result is valid? What happens when the signal is weak, the clock is imperfect, or the assumptions behind an algorithm no longer hold?

I started looking beyond the interface and into the machinery underneath it.

Eventually, I wanted to build that machinery myself.

## Building sdrtop

That curiosity became [sdrtop](https://github.com/musithang/sdrtop), an open-source SDR instrument written in Rust.

I wanted a practical tool for exploring radio signals and measurements directly from a terminal. Something that worked naturally on Linux, over SSH, inside tmux, or on a small cyberdeck without requiring a graphical desktop.

So I started writing one.

It has grown into a terminal-based SDR bench tool with spectrum and waterfall displays, hardware backends, IQ inspection, RF measurements, timing analysis, and a set of demodulators. The terminal isn't a limitation I try to overcome; it is home territory. I have used keyboard-driven desktops for years, i3 and Hyprland among them, and most of the tools I reach for are terminal applications. I like tools that expose their state, respond predictably, and stay useful on a machine with more in common with a field laptop than a workstation.

The project has also become a way for me to investigate protocols and physical layers rather than treating them as black boxes.

An FM broadcast is not one signal but a stack. There is the carrier, the deviation around it, the stereo pilot buried in the baseband, the multiplexed audio channels, and the RDS subcarrier with its own checksum, riding underneath all of it. The interesting part is never the box that prints a station name on the screen. It is the path from raw samples to that text, and what happens to that path when the signal is weak, the clock drifts, or a bit arrives wrong.

Bluetooth is the same problem in a different disguise. A BLE advertisement is a sequence of parts: channel, access code, sync word, header, payload, and a checksum over the whole thing. A connection is a run of events, each one depending on the last. Reading the packet is the easy half. Knowing whether the packet you decoded is the packet that was actually sent is the other half.

Both cases end the same way: every stage between the antenna and the text on the screen has to be understood and tested. Wherever a specification exists, the result also has to be checked against what it says should happen.

**I want to understand the process, not just obtain the result.**

The code is public and the project is evolving. You can read all of it on [GitHub](https://github.com/musithang/sdrtop).

## An instrument, not a black box

It is also, I suspect, the least obvious reason this project exists at all. Software development wasn't my original profession.

My working life began in industrial quality assurance and later expanded into automotive logistics, procurement, technical sales, and operations, with automotive components for manufacturers including Porsche, Bentley, Audi, Lamborghini, and Rolls-Royce. Specifications, quality measurements, process documentation, supplier problems, delivery schedules: none of it is the usual background for someone building signal-processing tools in Rust.

Most of it was process improvement, not just paperwork: automotive lean, the standards that come with the industry, and, in logistics as well, the work of finding where a process fails and then making it work.

In other words, I seem to have exchanged industrial processes for signal-processing code. The processes were probably easier to draw.

But I don't think the two worlds are as distant as they might seem. Both involve incomplete information, complicated dependencies, and unexpected failures. A measurement has to be defensible, whether it is a factory tolerance or a decoded packet.

The terminology changes. The underlying discipline doesn't.

Those years also taught me to pay attention to the difference between what a system claims and what is actually happening. That mindset carries over into measurement software.

A displayed number should mean something. A missing measurement shouldn't quietly become zero. A stale value shouldn't look like a live one. A hardware backend shouldn't be described as tested simply because it compiles.

The support list moves at the speed of my hobby budget.

I use synthetic signals and automated tests because they make experiments repeatable, and I test against real hardware because real receivers introduce constraints that a synthetic test cannot reproduce. Neither replaces the other.

For the core signal-processing work, I've kept the mathematical dependencies small, building much of the processing myself around an FFT implementation and a complex-number type. That isn't a claim that writing everything from scratch is inherently superior. It's a choice that lets me inspect the implementation, understand its limitations, and take responsibility for the results.

**I don't want the software to produce numbers that merely look convincing.**

I want to know where those numbers came from.

## Why Rust

Rust appeals to me because I enjoy systems programming, where performance, memory, timing, interfaces, and failure modes aren't incidental details but the actual problem. I like being able to follow a problem through the system rather than treating everything below a convenient API as someone else's concern.

I don't use Rust because I think every problem needs to be solved in Rust. I use it because it fits the kind of software I'm building. The goal is not to win an argument about programming languages.

A fair share of my evenings ends with a compile and no result yet. That is not a failure, that is just Rust, and I have made my peace with it.

I'm still learning, and I expect to be for a long time. There is always another protocol to understand, another performance bottleneck to find, or another assumption hiding somewhere in the code, and that is part of what keeps the work interesting.

## Outside the terminal

Radio is one of several ways I indulge my curiosity. I'm also interested in astronomy, Linux, security challenges, electronics, music, amateur radio, and the occasional brewing or cooking experiment.

What they have in common is probably the urge to understand how something works rather than settle for knowing which button to press. Sometimes that leads to a useful tool. Sometimes it leads to several evenings investigating a problem that would have been much cheaper to ignore.

I haven't found a reliable way to distinguish between those two situations in advance.

But curiosity has a way of turning up in places I did not plan for, and I have come to think of it as the thread running through all of this.

## The next generation of curiosity

I'm also a husband and a dad.

Sometimes, when I'm working on these projects, my daughter stands beside me and watches what I'm doing. She doesn't need to understand the code or know what a radio signal is. She's simply interested in what is happening in front of her.

I recognise that look.

As we grow up, we learn to be practical. We focus on what is useful, what is necessary, and what deserves our limited time. Those things matter, of course. But I don't think we need to lose the ability to be fascinated by something simply because we don't understand it yet.

I don't know what my daughter will become interested in as she grows up. It might be science, music, electronics, or something completely unrelated to anything I do. I don't need her interests to resemble mine.

I'd just like her to keep asking questions, looking a little closer, and discovering things for herself.

Perhaps that's one reason I still enjoy this work so much. It gives that childhood instinct somewhere to go.

## What comes next?

This is the first post on this blog, so it is also the place to say what the blog is for.

Mostly I want to write about the things I build and about the things that went wrong while I built them: project logs for sdrtop, technical essays on signal processing and measurement, and shorter notes when an idea is too small for an essay and too interesting to lose.

I'm continuing to develop sdrtop, expand its hardware support, investigate digital signals, and improve its measurement capabilities. There is plenty left to explore, and the project will keep evolving as I learn more and test new ideas against real hardware.

I'm interested in collaborating on Rust, systems programming, SDR tooling, signal processing, and measurement software. I'm also happy to talk with people who build radio hardware, work with interesting signals, or simply enjoy understanding how things work.

You can find my work here:

- **GitHub:** [github.com/musithang](https://github.com/musithang)
- **sdrtop:** [github.com/musithang/sdrtop](https://github.com/musithang/sdrtop)
- **crates.io:** [crates.io/crates/sdrtop](https://crates.io/crates/sdrtop)
- **Email:** [viktor.laszlo92@protonmail.com](mailto:viktor.laszlo92@protonmail.com)

---

I sometimes watch her standing beside my desk, looking at the things I work on. I wonder what she'll want to take apart when she's older.

Perhaps something with wires and circuit boards. Perhaps something I can't even imagine yet.

I hope she never loses the urge to find out.

I used to take my toys apart because I wanted to know what was inside. I suppose, in my own way, I'm still doing the same thing.

Only now, the interesting parts aren't always visible.
