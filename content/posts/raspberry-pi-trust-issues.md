---
title: "Why my Raspberry Pi has trust issues"
date: 2026-09-07T14:00:00Z
draft: false
weight: 4
tags: ["rust", "hardware", "sdr"]
description: "It runs fine for weeks, then dies the exact moment I need it."
rewrites: 2
---

It runs fine for weeks, then dies the exact moment I need it. We have a diagnosis now, and it is not flattering to either of us.

## The setup

A Raspberry Pi 4, tucked behind my monitor, running a self-hosted dashboard that I check approximately never.

## The root cause

Power supply. It's always the power supply. The official charger works fine until it doesn't.

```bash
$ vcgencmd get_throttled
throttled=0x50005
# "You're undervolted and have been throttled"
```

## What I learned

Hardware problems present as software bugs. Always check the physical layer first.
