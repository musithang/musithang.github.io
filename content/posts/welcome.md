---
title: "Welcome to the archive"
date: 2026-09-10T12:44:00Z
draft: false
weight: 1
tags: ["meta", "welcome"]
description: "You somehow found your way here, which says something about either your browsing habits or my SEO."
rewrites: 1
---

You somehow found your way here. Either you were looking for something else, or my SEO is better than I thought. Probably the former.

This is a personal technical archive. Not a blog in the traditional sense, because "blog" implies a certain regularity and a certain optimism about readership. This is more of a filing cabinet. Things get filed here when I'm tired of explaining them twice.

There's been a folder on my computer for years that was never really meant to become anything.

It held half-finished projects, notes I was sure I'd come back to, strange little experiments, screenshots, configuration files, snippets that solved a problem I no longer remembered having, and the occasional file named entirely after a date, because apparently past-me assumed future-me would be a clairvoyant.

It was not an archive in any meaningful sense. It was a pile. A digital landfill of good intentions and abandoned hyperfixations, and it looked roughly like this:

```
$ ls ~/projects/_unsorted
final_v2_REAL_FINAL.rs
notes_2024-03-11
why_does_this_even_work.md
DO_NOT_DELETE.zip
untitled-17
```

## The garbage is where the real story lives

There was something I actually liked about that pile, though.

Looking through it years later, the interesting part was rarely the finished, polished thing. The interesting part was always the mess around it:

- Why I started it in the first place.
- What I thought I was solving, versus what physics, hardware, or Rust actually handed back to me.
- The solution that seemed brilliant at 2 AM and turned out to be embarrassingly wrong by sunrise.
- The tiny, accidental discovery that changed the direction of the whole project.
- The cursed workaround that was supposed to be temporary and somehow became the load-bearing pillar of the final implementation.

None of that ever makes it into a clean repository.

## Scrubbing the crime scene

Normally we only keep the result. We scrub the scene before anyone can see how much blood, guesswork, and bad math went into it.

A repository gets its pristine `README.md`. A release gets its curated changelog:

> Fix minor bug.

Sure. Three days, two dead ends, and one `git reset --hard` I am still emotionally recovering from. A finished project gets one nice, cherry-picked screenshot. Everything that happened between the first stupid idea and the final tag quietly disappears.

We act like we walked a straight line, when really we stumbled through a dark room hitting our shins on every piece of furniture until we found the light switch.

I wanted somewhere to keep that part too: the bench tests that failed, the "radio signal" that turned out to be noise from my own cheap power supply, the architectural decisions that only made sense because I'd already broken a rule two steps earlier, the stuff that doesn't fit into a polite git commit.

So this is the Archive. No PR bullshit, no corporate hand-waving. Just the work, the bugs, the muddle, and the measurements.

## Why call it an archive, not a blog

The name came from the specific vibe I wanted this place to have, but it also stems from something much more practical.

An archive implies that whatever is being stored doesn't have to be immediately useful. It doesn't need an ROI, a call-to-action, or a step-by-step resolution.

It can simply be worth keeping.

That distinction matters a lot to me. Possibly more than it should.

I have never given a single shit about maintaining a traditional blog.

There is something inherently depressing about the idea that every thought, experiment, or random epiphany has to be packaged into "content" and fed to an algorithm. You publish a post, move on to the next shiny thing, and after a while the raw chronological feed buries the actual substance. Chronology becomes more important than the ideas themselves, as if the date you typed something matters more than whether it's actually true, interesting, or useful.

I don't want a feed. I want to build a collection.

## Unfinished roads and no conclusions

Not everything written here is going to be a clean, step-by-step tutorial. Not everything will end with a neat, satisfying conclusion.

Some entries will be nothing more than a raw account of how I tackled a specific problem. Others might be a half-baked idea that never actually materializes into a finished project at all.

And that is completely fine. Nobody is paying me by the resolved ticket.

There is real, unglamorous value in documenting the path, even when the final destination turns out to be utterly unimpressive.

## The real story is the mess

I already made this point once, about the old pile of files. It's just as true here, for entries that start clean instead of getting dug out of a folder years later: the path is almost always the only interesting part.

A project might eventually ship as a polished piece of software, but the actual story is rarely the clean binary. The real story is:

- The soul-crushing evening when nothing worked, every build threw errors, and every log output was pure garbage.
- The catastrophically wrong assumption that somehow survived inside the codebase for two whole weeks before anyone noticed.
- The random, 3 AM stroke of luck where an apparently unrelated idea suddenly made the whole broken mess click into place.

Those moments are usually lost forever, because they are a pain in the ass to document in real time.

The Archive is my attempt to make them inconvenient as fuck to lose instead.

## Rabbit holes, broken code, and the small stuff

Some entries here will be about things I am actively building, tweaking, or tearing apart on my desk. Not in that clean, sanitized PR-launch way, more in the way you'd describe it to a coworker after the third coffee, once the professional filter has worn off.

I don't care about just showing off what the finished project does. I care about what actually happened while I was making it:

- The architectural decisions that actually turned out to matter, and the ones that blew up in my face.
- The parts that flat-out failed, and the cursed workarounds required to fix them.
- The deep technical rabbit holes that swallowed three days of my life for a single edge case.
- The tiny discoveries: obscure hardware quirks, terminal tricks, register-level weirdness. Too trivial for formal documentation, too interesting to let fade into oblivion.

## Systems, rules, and glorious failures

Other entries will have fuck-all to do with software.

I have a persistent, almost unhealthy obsession with systems in general. Technical systems, human systems, the absurd rules we invent to govern them, and the even stranger, more spectacular ways those rules inevitably fail under real-world pressure.

Expect writing about technology, philosophy, hardware, signal processing, human bureaucracy, random experiments, and whatever else hijacks my attention span long enough to demand a write-up.

## Zero editorial strategy

There is no content calendar here. No editorial board. No SEO-optimized bullshit designed to capture clicks or maintain "brand consistency."

That is completely intentional. Mostly because a content calendar implies a level of planning I have never once demonstrated in my life.

I want this place to have enough structural scaffolding to feel like a proper, permanent archive, without forcing me to decide in advance what is "worthy" of being archived. If it's interesting, if it broke, or if it occupied my brain long enough to be worth logging, it gets written down.

## The rules

- Ship before it's perfect.
- If it builds without errors, ship it.
- Regret is a tomorrow problem.

## The visual language

The aesthetic here is completely intentional.

The Y2K and retro-futuristic elements are not here because I think the early 2000s had superior web design.

They absolutely, unequivocally did not. It was a chaotic mess of broken table layouts, bad frames, and eye-searing neon.

I just love the raw energy of interfaces from that period. They were strangely, unapologetically confident about the future. Everything had a glowing CRT edge, a blinking status indicator, three layers of unnecessary metadata, and probably a heavy gradient slapped on top for good measure.

The brutalist side of it serves a more practical purpose: I like interfaces that show their fucking bones.

I fucking hate modern publishing platforms too. Bloated JavaScript frameworks, tracking pixels, infinite scrolls, cookie banners that take up half the screen. I wanted to open a web page and see something that looks less like a slick corporate blog and more like a classified document pulled from the depths of some forgotten digital filing system, machinery fully exposed instead of hidden behind a hyper-sanitized corporate UI.

So every article here is treated as a catalogue entry.

Does a personal site actually require an inventory system?

Of course it doesn't. That would be absurd.

Is it a little theatrical? Fuck yes, it is. And that's completely fine. The internet used to be weird and theatrical before every website got flattened into the same soulless SaaS landing page. It's allowed to be theatrical again. Nobody signed a treaty.

But once you decide that an article is a record rather than just an ephemeral "blog post," a few things happen:

- The catalogue number becomes the entry's public identity, even though the sort order underneath is, honestly, still just the publish date. Chronology has to live somewhere.
- Metadata becomes a visible part of the page, the entry number, the barcode, the spec sheet, instead of disappearing into `<meta>` tags nobody reads.
- Calling something a record instead of a "post" makes it fine for it to sit unfinished, or never resolve. Records don't need a narrative arc.

A record header, stripped down to what actually ships, looks something like this:

```
┌───────────────────────────────────────┐
│ ARCHIVE RECORD                        │
├───────────────────────────────────────┤
│ ENTRY          MT-001                 │
│ TITLE          Welcome to the archive │
│ FILED UNDER    META, WELCOME          │
│ PUBLISHED      2026-09-10             │
│ STATUS         SHIPPED                │
└───────────────────────────────────────┘
```

Nothing about the number is automatic. There's no script incrementing a counter somewhere; I open the file and type the next one in by hand, because building an auto-increment system for an audience of my own browser tabs felt like solving a problem I didn't have.

The barcode underneath it is real too, generated from the catalogue number and the title. It's genuine Code 39, meaning the bars actually encode that string instead of just looking like they do. If you're bored enough to scan a blog post header, it will, in fact, resolve to the right text. I'm not entirely sure what that says about either of us.

The catalogue number isn't meant to imply that there are thousands of important classified documents waiting in a vault somewhere. At the moment, there's just a handful. It's mostly pure administrative optimism.

## The frame is fiction, the writing is not

This is probably the single most important distinction on this entire site.

The Archive has a distinct visual identity, but I do not want the writing itself to turn into roleplay. The catalogue numbers, labels, status bars, and metadata grids you just read about are part of the site's fiction. The stuff sitting inside that frame is 100% real:

- The projects are real.
- The experiments are real.
- The catastrophic, embarrassing mistakes are real.
- The opinions are entirely mine.

If something is uncertain or broken, I would rather flatly state that it's uncertain or broken than wrap it in enough dense technobabble that it starts accidentally looking authoritative. The barcode is real. The confidence is not always earned.

I also refuse to let these articles read like documentation generated by a corporate committee or a marketing department.

There will be deep technical details, but there will also be raw stories. There will be opinions. There will probably be a completely disproportionate number of parentheses (like this one).

And there will occasionally be a completely unnecessary joke hiding quietly inside a paragraph that otherwise looks like serious technical documentation.

That is probably unavoidable.

It is also a huge part of the reason I am writing this in the first place.

## The machine behind the screen

The Archive might look like a terminal interface from 1998, but underneath, it's considerably less mysterious, and blissfully free of over-engineered bullshit.

It's a static site built with Hugo and served directly through GitHub Pages. The entire source lives in a Git repository, the posts are plain text Markdown files, and Hugo compiles the whole thing into static HTML in a fraction of a millisecond. Faster, notably, than I am at fixing whatever I just broke.

No database waiting to corrupt itself at 4 AM. No dynamic CMS quietly tracking users or breaking after a PHP update. The Git repository is the single source of truth.

In its rawest form, the pipeline is dead simple:

```
   Markdown
       │
       ▼
     Hugo
       │
       ├── templates
       ├── content
       ├── taxonomy
       └── static assets
       │
       ▼
   HTML / CSS
       │
       ▼
  GitHub Pages
```

Creating a new catalogue entry doesn't require clicking around a bloated admin dashboard. It's just a Markdown file with a frontmatter header, more or less identical to the one sitting at the top of this exact post:

```yaml
---
title: "Welcome to the archive"
date: 2026-09-10T12:44:00Z
draft: false
weight: 1
tags: ["meta", "welcome"]
description: "You somehow found your way here."
rewrites: 1
---
```

The rest is handled by static site compilation.

This is the main reason I wanted the Archive to be entirely static. There is immense satisfaction in knowing that the whole system can be understood just by looking at the raw repository. The content is there. The templates are there. The CSS is there. Git remembers every single change ever made.

There is no hidden machine behind the machine.

At least, not one that I am responsible for.

## Preserving the why

I think the single most useful thing this Archive can do is preserve context.

Code tells you what a system does. Documentation can tell you how to use it. Neither tells you why the fuck it became that way.

That why is usually the first thing to evaporate, and it's almost impossible to reconstruct after the fact. So I want to write it down while it's still fresh.

Not every thought deserves to be preserved, most probably shouldn't be. But some of them absolutely do.

## An imperfect record

The Archive will change.

The design will evolve. The catalogue system will almost certainly become far more over-engineered than it ever needed to be. Some categories will appear and later turn out to have been a terrible idea. There will be articles here that I am genuinely proud of, and others that will make me wonder what the hell I was thinking when I hit publish.

That is part of having an honest record.

An archive does not become more valuable by pretending its contents were always perfect, polished, and visionary from day one. It becomes valuable because it preserves what actually happened.

So this is not intended to be a curated showcase of achievements. It is a raw record of things I am curious enough to investigate.

Sometimes I will know exactly where an investigation is going.

Sometimes I won't have a fucking clue.

Sometimes it will result in a clean, useful piece of software.

Sometimes it will result in a page of messy notes and a slightly better understanding of a problem.

And sometimes it will result in the painful realization that I just spent an entire evening solving the completely wrong problem.

Those are all 100% valid catalogue entries.

## Welcome to the archive

I don't really know what this place will become yet.

That is probably the only right way to start it.

For now, it is a home for the things that usually disappear into the void between the first commit and the finished release: the experiments that never got a tag, the ideas that mutated into something else, the technical brick walls that taught me more than the solutions, the things I build, the things I tear apart, and occasionally the things I think about for no particularly productive reason. My therapist would probably have opinions.

The interface may look like it came from a terminal designed twenty years ago to operate a computer that will exist twenty years in the future.

The writing will be much simpler.

It will just be mine.

And if everything works as intended, the Archive will slowly become a map of what I was curious about at different points in time.

Not a portfolio.

Not a product catalogue.

Not a collection of perfectly finished answers.

Just a growing record.

The first record starts here.