# musithang.github.io

Personal blog: project logs and technical writing. Built with [Astro](https://astro.build), published on GitHub Pages at <https://musithang.github.io>.

## Develop

Needs Node 22.12+ (`.nvmrc` pins 24).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site into dist/
npm run preview   # serve the built site
npm run check     # type-check .astro and .ts files
```

## Deploy

Every push to `main` builds and deploys through `.github/workflows/deploy.yml`.
One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Writing posts

Each post is a folder with an `index.md` (and its images next to it): `src/content/posts/<slug>/index.md`.
The frontmatter is validated at build time, so a typo fails the build instead of shipping.
A full feature tour lives in `src/content/posts/kitchen-sink/` (a draft, so it only shows in dev).

- Drafts (`draft: true`) show in `npm run dev`. To see them in a build: `SHOW_DRAFTS=1 npm run build`.
- A table of contents appears when a post has three or more `##`/`###` headings. Set `toc: false` in the frontmatter to hide it.
- Wide images (shown smaller than their real size) open in a lightbox on click.
- Math, callouts (`> [!NOTE]`), code frames, and Mermaid diagrams are plain Markdown, see the kitchen-sink post.

## Gotchas

- After changing a remark/rehype plugin or the Expressive Code config, delete `.astro/` and restart `npm run dev`.
  Rendered Markdown is cached by content, so stale output (and a stale code-block stylesheet URL) can linger.
- In hand-written `.astro` files, put `{' '}` before an inline element that starts a new line, or the space before it is dropped.
  Markdown posts are not affected.
