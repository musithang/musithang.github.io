// @ts-check
import { defineConfig } from 'astro/config';

// User site (musithang.github.io): served from the domain root, so no `base`.
export default defineConfig({
  site: 'https://musithang.github.io',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
});
