import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://musithang.github.io',
  output: 'static',
  integrations: process.env.NODE_ENV !== 'production'
    ? [keystatic()]
    : [],
});
