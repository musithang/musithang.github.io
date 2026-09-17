import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

const isProduction = process.env.NODE_ENV === 'production';

const keystaticIntegration = isProduction ? null : (await import('@keystatic/astro')).default();

export default defineConfig({
  site: 'https://musithang.github.io',
  output: isProduction ? 'static' : 'server',
  ...(isProduction ? {} : { adapter: node({ mode: 'standalone' }) }),
  integrations: [
    react(),
    ...(keystaticIntegration ? [keystaticIntegration] : []),
  ],
});
