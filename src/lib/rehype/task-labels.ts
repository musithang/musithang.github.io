import type { Element, Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

/**
 * GFM task list checkboxes have no accessible name. Label each one with the text of its list
 * item (ignoring nested lists), so a screen reader hears "Write the pipeline, checkbox, checked".
 */
export function rehypeTaskLabels() {
  return (tree: Root) => {
    visit(tree, 'element', (li: Element) => {
      if (li.tagName !== 'li') return;
      const input = li.children.find(
        (c): c is Element => c.type === 'element' && c.tagName === 'input' && c.properties?.type === 'checkbox',
      );
      if (!input) return;
      const text = li.children
        .filter((c) => !(c.type === 'element' && (c.tagName === 'ul' || c.tagName === 'ol')))
        .map((c) => (c.type === 'element' || c.type === 'text' ? toString(c) : ''))
        .join('')
        .trim();
      if (text) input.properties.ariaLabel = text;
    });
  };
}
