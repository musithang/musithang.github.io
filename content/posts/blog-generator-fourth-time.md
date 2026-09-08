---
title: "I rewrote my blog generator for the fourth time"
date: 2026-09-07T10:00:00Z
draft: false
weight: 3
tags: ["hugo", "meta", "procrastination"]
description: "Every static site generator is the same generator wearing a different hat."
---

Every blog engine I build starts the same way: full of hope, minimal dependencies, and a smug little README claiming it'll be the last one. It never is. This is number four.

## The fourth rewrite

This time the goal was embarrassingly simple: publish something before the heat death of the universe. Hugo won by default, mostly because it was already half-configured and yelling at me from a terminal tab I'd left open since March.

It worked on the first try, which immediately made me suspicious. It's been three days and nothing has caught fire yet.

```bash
$ hugo new posts/why-am-i-like-this.md
Content "posts/why-am-i-like-this.md" created
$ hugo server -D
# fourth time writing this generator. it is fine.
Web Server is available at http://localhost:1313/
```

> If it builds without errors, ship it. Regret is a tomorrow problem.

## Lessons, sort of

Static site generators are all the same generator wearing a different hat. Pick one, stop shopping, and go write something a person might actually read. I'll take my own advice in version five.
