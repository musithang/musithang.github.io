import type { Root } from 'mdast';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';

const WORDS_PER_MINUTE = 220;
// Non-prose content is read differently from prose, so it is weighted in seconds.
const SECONDS_PER_CODE_LINE = 2.5;
const SECONDS_PER_IMAGE = 12;
const SECONDS_PER_MATH_BLOCK = 10;
const SECONDS_PER_DIAGRAM = 15;

/**
 * Computes reading time and feature flags while the markdown is parsed, and hands
 * them to the page via `remarkPluginFrontmatter` (see `render()` in Astro).
 * Must run after remark-math and before the mermaid plugin.
 */
export function remarkPostMeta() {
  return (tree: Root, file: VFile) => {
    let words = 0;
    let seconds = 0;
    let hasMath = false;
    let hasMermaid = false;

    visit(tree, (node) => {
      switch (node.type) {
        case 'text':
          words += node.value.split(/\s+/).filter(Boolean).length;
          break;
        case 'inlineCode':
          words += 1;
          break;
        case 'inlineMath':
          hasMath = true;
          words += 1;
          break;
        case 'math':
          hasMath = true;
          seconds += SECONDS_PER_MATH_BLOCK;
          break;
        case 'image':
          seconds += SECONDS_PER_IMAGE;
          break;
        case 'code':
          if (node.lang === 'mermaid') {
            hasMermaid = true;
            seconds += SECONDS_PER_DIAGRAM;
          } else {
            seconds += node.value.split('\n').length * SECONDS_PER_CODE_LINE;
          }
          break;
      }
    });

    seconds += (words / WORDS_PER_MINUTE) * 60;

    const astro = (file.data as { astro?: { frontmatter?: Record<string, unknown> } }).astro;
    if (astro?.frontmatter) {
      Object.assign(astro.frontmatter, {
        words,
        readingMinutes: Math.max(1, Math.round(seconds / 60)),
        hasMath,
        hasMermaid,
      });
    }
  };
}
