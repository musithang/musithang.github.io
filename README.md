# musithang.github.io

Personal blog: project logs and technical writing. Built with [Astro](https://astro.build) and published on GitHub Pages at <https://musithang.github.io>.

**Writing a post?** Read [docs/writing.md](docs/writing.md). It covers the frontmatter, every Markdown feature with examples, and the publishing flow.

## What it does

- Posts are plain Markdown, one folder per post, validated at build time.
- Math (KaTeX), Mermaid diagrams, GitHub-style callouts, highlighted code with titles and diffs, captioned images.
- Tags, series, projects with their own devlog, related posts, reading time, reading progress bar, table of contents.
- Full-text search (`/` or Ctrl/Cmd+K), RSS with full content, sitemap, social cards, light and dark theme.
- An age-based `[STALE]` banner on old technical posts.
- No trackers, no cookie banner, no comments. Pages read fine without JavaScript.

## Develop

Needs Node 22.12+ (`.nvmrc` pins 24).

```bash
npm install
npm run dev          # http://localhost:4321 (drafts visible)
npm run build        # static site into dist/, then the search index (Pagefind)
npm run preview      # serve the built site
npm run verify       # type check, build, link check, contrast check: run before pushing
```

Other scripts: `npm run check` (types), `npm run check:links` (internal links and anchors in `dist/`), `npm run check:contrast` (WCAG AA on the colour tokens), `npm run build:site` (build without the search index).

## Deploy

Every push to `main` builds and deploys through `.github/workflows/deploy.yml`, and a weekly scheduled run rebuilds the site so age-based banners stay current.
One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## How it is put together

| Path | What lives there |
| --- | --- |
| `src/content/posts/<slug>/index.md` | The posts. Images go next to the `index.md`. |
| `src/data/projects.yaml` | Projects that posts can belong to. |
| `src/content.config.ts` | The frontmatter schema (Zod). |
| `src/config.ts` | Site title, author, links, nav, the `[STALE]` threshold. |
| `src/styles/tokens.css` | Colours, type scale, spacing. The single source for the design. |
| `src/lib/remark`, `src/lib/rehype` | Small Markdown plugins: callouts, Mermaid, reading time, figures, task labels. |
| `src/scripts/` | Browser scripts: search, Mermaid, lightbox. |
| `astro.config.mjs` | Markdown pipeline, code-block themes, sitemap, dev search index. |
| `pagefind.yml` | What the search index includes and excludes. |
| `scripts/` | Contrast checker, link checker, icon generator. |

Design system in one line: warm paper by day, blue-black by night, one amber accent, Source Serif 4 for reading and JetBrains Mono for labels, with a faint scope graticule behind it all.

## Feed, SEO and social cards

- `/rss.xml` carries the full post content (sanitised; code blocks flattened, formulas as MathML). `sitemap-index.xml` and `robots.txt` are generated at build.
- Every page gets a canonical URL, Open Graph and Twitter tags. Posts add `BlogPosting` JSON-LD.
- Each post gets a generated 1200x630 social card at `/og/<slug>.png` (satori + sharp). Other pages share `/og/_default.png`.
- Icons in `public/` come from `public/favicon.svg`. After a logo change run `node scripts/make-icons.mjs`.

## Search

Search is [Pagefind](https://pagefind.app). The index is built after `astro build` (that is what `npm run build` does) and lives in `dist/pagefind/`. Only article bodies are indexed (`data-pagefind-body` in the post page), and tags and kind are filters.

`npm run dev` serves the index from the **last build**, so run `npm run build` once first, and again to refresh it. Drafts are in the index only if you built with `SHOW_DRAFTS=1`.

## Gotchas

- After changing a remark/rehype plugin or the Expressive Code config, delete `.astro/` and restart `npm run dev`. Rendered Markdown is cached by content, so stale output (and a stale code-block stylesheet URL) can linger.
- In hand-written `.astro` files, put `{' '}` before an inline element that starts a new line, or the space before it is dropped. Markdown posts are not affected.
- Astro 7 uses a Rust Markdown processor by default. This site opts into the `unified` processor (`@astrojs/markdown-remark`) because the math and callout plugins need it.
