# MusiThang

Personal technical archive built with Hugo.

## Local development

Use the Hugo Extended release defined in `.github/workflows/hugo.yml`, then run:

```sh
hugo server --disableFastRender --bind 0.0.0.0 --port 1313
```

Production build:

```sh
hugo --minify
```

The site deploys to GitHub Pages from the `main` branch through the workflow in `.github/workflows/hugo.yml`.