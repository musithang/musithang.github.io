---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
weight: 
tags: []
description: ""
rewrites: 1
image: ""
---

<!--
  BUILDING BLOCKS. Delete this whole block before publishing.

  weight    the catalogue number, typed in by hand, next free one
  image     optional thumbnail override; if the post contains an image,
            the first one is used automatically and this can stay empty

  ── Margin note ────────────────────────────────────────────────
  Sits in the gutter next to the paragraph that FOLLOWS it, so write it
  just above the paragraph it belongs to. Folds into the text on narrow
  screens. side is "left" (default) or "right".

  {{ "{{</* note side=\"right\" */>}}A short aside.{{</* /note */>}}" }}

  ── Figure ─────────────────────────────────────────────────────
  Images live in static/images/ and are referenced from /images/.
  width is "text" (default), "wide" or "full". Captions are numbered
  automatically, so do not write "Fig. 01" yourself.

  {{ "{{</* figure src=\"/images/name.jpg\" alt=\"what it shows\" width=\"wide\" caption=\"What is going on here.\" */>}}" }}

  ── Document plate ─────────────────────────────────────────────
  A framed in world document. Everything except the body is optional.
  tone="alert" turns the frame orange. Takes any markdown inside.

  {{ "{{</* plate label=\"Field note\" ref=\"MT-000-A\" stamp=\"Unfiled\" footer=\"Status · unverified\" */>}}" }}
  Body text, lists, code, whatever belongs on the document.
  {{ "{{</* /plate */>}}" }}

  ── Split view ─────────────────────────────────────────────────
  Two or three columns of anything, side by side, stacking on mobile.
  Panes can contain other blocks, including plates and figures.

  {{ "{{</* split cols=\"2\" caption=\"Optional caption.\" */>}}" }}
  {{ "{{</* pane label=\"Left\" */>}}First column.{{</* /pane */>}}" }}
  {{ "{{</* pane label=\"Right\" tone=\"accent\" */>}}Second column.{{</* /pane */>}}" }}
  {{ "{{</* /split */>}}" }}

  ── Signature ──────────────────────────────────────────────────
  A real, scannable Code 39 barcode. With no text it encodes this
  entry's own signature. legend="false" hides the explanation rows.

  {{ "{{</* signature text=\"MT-014-9C2A\" legend=\"false\" caption=\"Optional.\" */>}}" }}
-->

Write the entry here.
