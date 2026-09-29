import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * `![alt](./img.png "Caption")` on its own line becomes
 * `<figure><img><figcaption>Caption</figcaption></figure>`.
 */
export function rehypeFigure() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const kids = node.children.filter((c) => !(c.type === 'text' && c.value.trim() === ''));
      const img = kids[0];
      if (kids.length !== 1 || img.type !== 'element' || img.tagName !== 'img') return;

      const caption = img.properties?.title;
      if (typeof caption !== 'string' || caption === '') return;
      delete img.properties.title;

      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [
          img,
          {
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: caption }],
          },
        ],
      };
      parent.children[index] = figure;
    });
  };
}
