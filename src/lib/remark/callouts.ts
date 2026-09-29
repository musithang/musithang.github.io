import type { Blockquote, Paragraph, Root } from 'mdast';
import { visit } from 'unist-util-visit';

const KINDS = ['note', 'tip', 'important', 'warning', 'caution'] as const;
type Kind = (typeof KINDS)[number];

const MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*([^\n]*)\n?/i;

/**
 * GitHub-style alerts, so a post reads the same on GitHub and on the blog:
 *
 *   > [!WARNING]
 *   > Body text. An optional title may follow the marker: `> [!TIP] Custom title`.
 */
export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      const first = node.children[0];
      if (first?.type !== 'paragraph') return;
      const text = first.children[0];
      if (text?.type !== 'text') return;

      const match = MARKER.exec(text.value);
      if (!match) return;

      const kind = match[1].toLowerCase() as Kind;
      const title = match[2].trim() || kind[0].toUpperCase() + kind.slice(1);

      text.value = text.value.slice(match[0].length);
      if (text.value === '') first.children.shift();
      if (first.children.length === 0) node.children.shift();

      const titleNode: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: title }],
        data: { hProperties: { className: ['callout-title'] } },
      };
      node.children.unshift(titleNode);
      node.data = {
        hName: 'div',
        hProperties: { className: ['callout', `callout-${kind}`], role: 'note' },
      };
    });
  };
}
