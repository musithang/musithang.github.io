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
