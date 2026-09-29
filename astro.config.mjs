// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { toString } from 'hast-util-to-string';

import { remarkPostMeta } from './src/lib/remark/post-meta.ts';
import { remarkCallouts } from './src/lib/remark/callouts.ts';
import { remarkMermaid } from './src/lib/remark/mermaid.ts';
import { rehypeFigure } from './src/lib/rehype/figure.ts';

// User site (musithang.github.io): served from the domain root, so no `base`.
export default defineConfig({
  site: 'https://musithang.github.io',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  vite: {
    // Mermaid's diagram chunks are big but lazy: they only load on pages with a diagram.
    build: { chunkSizeWarningLimit: 1600 },
  },
  integrations: [
    // Must come before anything that processes markdown.
    expressiveCode({
      themes: ['gruvbox-light-soft', 'gruvbox-dark-soft'],
      // Our theme switch sets <html data-theme="light|dark">; with none set, the OS preference wins.
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      useDarkModeMediaQuery: true,
      plugins: [pluginLineNumbers()],
      defaultProps: { showLineNumbers: false },
      styleOverrides: {
        // Match the blog palette instead of the Shiki theme's own background. Tuple order is [dark, light].
        codeBackground: ['#171c23', '#efe9db'],
        borderColor: ['#2a313b', '#d9d1bd'],
        frames: {
          editorBackground: ['#171c23', '#efe9db'],
          editorActiveTabBackground: ['#171c23', '#efe9db'],
          editorTabBarBackground: ['#1d242c', '#e6dfcd'],
          editorTabBarBorderBottomColor: ['#2a313b', '#d9d1bd'],
          editorActiveTabIndicatorTopColor: 'transparent',
          editorActiveTabIndicatorBottomColor: ['#f5a524', '#a8480a'],
          terminalBackground: ['#171c23', '#efe9db'],
          terminalTitlebarBackground: ['#1d242c', '#e6dfcd'],
          terminalTitlebarBorderBottomColor: ['#2a313b', '#d9d1bd'],
          terminalTitlebarDotsForeground: ['#5a6472', '#a89e84'],
          frameBoxShadowCssValue: 'none',
        },
        borderRadius: '6px',
        codeFontFamily: 'var(--font-mono)',
        codeFontSize: '0.86rem',
        uiFontFamily: 'var(--font-mono)',
        uiFontSize: '0.78rem',
      },
    }),
  ],
  markdown: {
    // Astro 7 defaults to Sätteri; the remark/rehype ecosystem (math, callouts) needs the unified processor.
    processor: unified({
      remarkPlugins: [remarkMath, remarkPostMeta, remarkCallouts, remarkMermaid],
      rehypePlugins: [
        // A typo in a formula should fail the build, not publish red text.
        [rehypeKatex, { throwOnError: true }],
        rehypeFigure,
        rehypeSlug,
        [rehypeExternalLinks, { rel: ['noopener'], properties: { className: ['external'] } }],
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            // The visually hidden "Footnotes" label does not need a permalink.
            test: (/** @type {import('hast').Element} */ el) =>
              !(
                Array.isArray(el.properties?.className) &&
                el.properties.className.includes('sr-only')
              ),
            properties: (/** @type {import('hast').Element} */ heading) => ({
              className: ['anchor'],
              'aria-label': `Link to section: ${toString(heading)}`,
            }),
            // Empty on purpose: the "#" is drawn by CSS so it never leaks into heading text (TOC, search).
            content: [],
          },
        ],
      ],
    }),
  },
});
