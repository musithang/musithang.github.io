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

When i was growing up, my toys never really lasted long.

I didn't mean to destroy them, but i was always curious about what made them tick.

How did they work? Whats inside making them do what they do? The only way to really know was to open them up and take a look.

It always took longer to put them back together, which i also enjoyed doing.

Especially since when i finally got them working again, it was like i had made a discovery.

It made me the go-to person for any electronics related issue in the family, and among my friends, i eventually became the guy that gets passed the laptop, phone, or whatever device has decided to malfunction.

My curiosity never really stopped, it just moved onto bigger things.

I've always been fascinated by physics, specifially the kinds of physics that you can't see.

I found myself reading into software defined radio, and the deeper i read the more interesting it became.

The room i was in was silent, but it wasn't really an empty room.

It was filled with signals, just waiting to be seen.

Years later, I bought a HackRF One.

I wanted to get into the RF world, and try my hand at listening.

I had gotten into demodulation, and the process of figuring out what a signal was saying. Digital demodulation was especially exciting, since there was so much to it.

But i wasn't really satisfied with finding a signal and identifying its type.

I wanted to know what it contained, what it said, and more importantly, how it got that way.

I had found a new passion, and a new thing to take apart.

## Discovering the invisible

With an SDR, radio waves are no longer some esoteric entity, but something you can see, hear, record, analyze and understand. Something you can reverse-engineer.

But seeing what happens is one thing - there is a big difference between using a tool that does it for you and understanding what goes on inside.

I became fascinated by the process, the math, the timing, the assumptions and the decisions that define a particular approach and transform an input stream of complex numbers into something that can be understood.

What calculations does a demodulator perform? Where does the timing information come from? How do you know that a particular decoding is correct? What happens if the signal is bad, or the clock is off, or an assumption made by the algorithm turns out to be wrong?

The further I delved into the process, the more I wanted to see for myself.

Eventually, I wanted to build it myself.

## Building sdrtop

That curiosity became [sdrtop](https://github.com/musithang/sdrtop), an open-source SDR instrument written in Rust.

I wanted something a bit more practical for poking around with radio signals and radio measurements, something that I could just drop into a terminal and use, without any of the overhead of desktop sessions or X11 or tmux or whatever else comes along with a more involved development environment.

So that's what I did. It's a growing collection of tools for a terminal-based SDR bench, with spectrum and waterfall displays, hardware backends, IQ inspection and RF measurements, timing analysis and a collection of demodulators. The terminal isn't a restriction, it's a happy place for me to work; I've been using keyboard-driven desktop environments for most of the last decade and have accumulated a sizable set of tools that do interesting things without getting in the way. I'm a fan of inspecting and poking things that are expressive enough to expose their internals, and the tools I tend to gravitate towards are ones that can be made to do useful things on a system that's more field laptop than workstation.

It's also a great way for me to learn about the protocols and physical layers of the things I'm trying to decode, without having to treat them as a black box.

An FM broadcast isn't a single signal, it's a whole collection of signals layered on top of each other: the carrier, the deviation around the mean, the stereo pilot hidden in the baseband, the multiplexed audio channels, the RDS subcarrier with its own checksum buried inside the whole thing. It becomes a fun exercise to trace from the physics of the signal all the way to the text on the screen, and to see what happens when the signal gets weaker, or the clock slips, or an occasional bit gets nulled out by the receiver.

Bluetooth is a similar challenge, but with more moving parts and less obvious ways to look at the data, perhaps. A BLE advertisement is a collection of things: the channel, the access code, the sync word, the header, the payload and a checksum that covers all of the preceding. A connection is a stream of packets, each of which contains pointers to the next, and so on. Reading the packet is one thing, determining if the thing you've just parsed was actually the packet that was sent is another.

In both cases, the real fun starts once you get past the point of curiosity and start caring about how well you can actually decode these things. It means that every step along the way from the antenna to the final text on the screen is fair game for investigation and testing, and for comparing against the specification if such a thing exists.

The code is public and the project is evolving. You can read all of it on [GitHub](https://github.com/musithang/sdrtop).

## An instrument, not a black box

It is also, I suspect, the least obvious reason this project exists at all. Software development wasn't my original profession.

My working life began in industrial quality assurance, spread out later into automotive logistics and procurement (technical sales, operations), and automotive components for manufacturers including Porsche, Bentley, Audi, Lamborghini, and Rolls-Royce. Specifications, quality measurements, process documentation, supplier problems, delivery schedules---none of the usual background for someone building signal processing tools in Rust.

Most of it was process improvement, not just paperwork: automotive lean and the standards that come with that, and in logistics the same kind of thing, finding where a process fails and fixing it.

In other words, I have somehow switched from industrial processes to signal processing code. The processes may have been simpler to model.

But I think the two domains aren't as different as they seem. Both involve working with incomplete information, with messy dependencies, with surprising failure modes. In both domains, a measurement has to be justifiable. Whether it's a factory specification or a decoded packet, the justification is part of the result.

The terminology changes; the underlying discipline does not.

The same years taught me to focus on the discrepancy between what a system says it does and what it actually does. This mindset translates directly to measurement software.

A number displayed to the user has to mean something; a missing measurement can't quietly turn into zero, a stale value shouldn't pretend to be live, a hardware backend can't pretend to be tested simply because it has been compiled.

The support list moves at the speed of my hobby budget.

I use synthetic signals and automated tests because they make experiments repeatable, but I test against real hardware, since a real receiver adds constraints a synthetic test can't model. Not that either one is in any way optional.

For the core signal processing, I've kept mathematical dependencies light, implementing much of it myself around an FFT implementation and a complex number type. Not that there's anything wrong with writing it all from scratch, but I prefer to keep the implementation visible, to understand its limitations, and accept responsibility for the results.

**I don't want the software to produce numbers that merely look convincing.**

I want to know where those numbers came from.

## Why Rust

Rust appeals to me because I like systems programming; the performance, memory, timing, interfaces, and failure modes are not an afterthought, but the point. I like being able to walk through the problem domain without having to abstract away anything below a convenient API as someone else's problem.

I don't use Rust because I think every problem should be solved in Rust, but because it is the right tool for the job, whatever that may be. I want to focus on the problem at hand, not win some theoretical argument about programming languages.

A non-trivial fraction of my evenings are concluded by a compile that produces nothing of value. This is not a failure, this is Rust, and I have accepted that.

I am still learning, and I expect to be for a long time. There is always another protocol to grok, another performance problem to solve, and another assumption lurking in the code that needs to be refactored out, and that is a large part of the fun.

## Outside the terminal

Radio is one of several ways in which I indulge my curiosity. I am also interested in astronomy, Linux, security challenges, electronics, music, amateur radio and the occasional brewing or cooking experiment.

What these have in common is probably the desire to understand how something works rather than merely learning how to get something to work. This often results in a useful tool. It may also result in several evenings spent investigating something that would have been much cheaper to leave well enough alone.

I have not yet found a reliable method of distinguishing these two scenarios in advance.

But curiosity has a way of turning up in places I did not set out to find it and I have come to think of it as the thread which runs through all these things.

## The next generation of curiosity

I'm also a husband and a dad.

Sometimes when I'm doing this stuff, my daughter will come over and watch what I'm doing. It doesn't particularly matter to her what I'm doing, she's just fascinated by the process.

I know that look.

As we get older, we get conditioned to be pragmatic. We learn to value the useful, the necessary, and the stuff that we have time for. And there's nothing wrong with any of those things, but I think we can still value the sense of wonder without losing the sense of what's important.

I have no idea what my daughter is going to be interested in when she gets older. It might not be anything like what I do now. It could be science or music or computers or something I can't imagine at all. It doesn't matter to me what she does, as long as she's always willing to look and learn and find out how things work.

Maybe that's what I like about this, in part. It's a way to satisfy that part of me, the part that was always interested in things.

## What comes next?

This is the first post on this blog, so it goes without saying this is where I say what this blog is for. I mostly intend to write about the things I've made and the things that went wrong while making them: project logs for sdrtop, technical essays on signal processing and measurement, and smaller notes when an idea is too small for an essay but still worth writing about.

I'm continuing to work on expanding sdrtop's hardware support, exploring digital signals, and expanding its measurement capabilities. There's a lot still to be discovered, and the project will surely evolve as I learn and do more experiments with real hardware.

I'm open to working with others on Rust, systems programming, SDR tooling, signal processing, and measurement software. I'm also open to talking with people who make radio hardware, work with interesting signals, or just want to understand how things work.

You can find my work here:

- **GitHub:** [github.com/musithang](https://github.com/musithang)
- **sdrtop:** [github.com/musithang/sdrtop](https://github.com/musithang/sdrtop)
- **crates.io:** [crates.io/crates/sdrtop](https://crates.io/crates/sdrtop)
- **Email:** [viktor.laszlo92@protonmail.com](mailto:viktor.laszlo92@protonmail.com)

---

I sometimes watch her perched at my desk, observing what I do. Wonders what it will be that she'll pull apart when she grows up.

Something with wires, maybe. Or maybe something that uses circuits, or even something I've never seen before.

I hope she never loses the need to find out.

I used to take my toys apart to see how they worked. I guess, in my own way, I'm still taking things apart. Only now it isn't always easy to see what makes them work.