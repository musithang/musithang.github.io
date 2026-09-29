---
title: "Devlog 1: picking the stack"
description: "Why this blog runs on Astro and GitHub Pages, and what I ruled out."
date: 2026-09-29
kind: devlog
tags: [astro, meta, web]
project: blog
series: "Building this blog"
seriesOrder: 1
---

<!-- SAMPLE POST: a placeholder written with the blog. Replace it with your own writing, or delete this folder. -->

The brief was short: write in Markdown, publish to GitHub Pages, keep it fast and readable, and have math, diagrams and search available for technical posts.

## What I wanted

| Need                          | Why it matters                          |
| ----------------------------- | --------------------------------------- |
| Markdown in, static HTML out  | Posts stay portable and diffable        |
| Math and diagrams             | Technical writing needs both            |
| Little or no JavaScript       | Pages should read fine over a bad link  |
| Free hosting I already have   | GitHub Pages, no extra accounts         |

## What I picked

**Astro**, with plain Markdown files and a handful of small scripts. It ships zero JavaScript by default, and it has a content layer that validates frontmatter at build time, so a typo in a post fails the build instead of shipping.

## What I ruled out

- **Jekyll** is the native GitHub Pages option, but math, diagrams and search all turned into plugin wrangling.
- **Hugo** is fast, but the templating and the JavaScript story felt heavier than the job needed.

> [!NOTE]
> "Ruled out" is about this blog only. Both are fine tools, and the right pick depends on the job.

Next up: the Markdown pipeline.
