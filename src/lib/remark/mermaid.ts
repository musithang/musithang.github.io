import type { Code, Root } from 'mdast';
import type { Parent } from 'unist';
import { visit } from 'unist-util-visit';

/**
 * Turns ```mermaid fences into `<pre class="mermaid">source</pre>`. Running before
 * Expressive Code means the block is never treated as source code. The diagram is
 * drawn in the browser by the post layout, and only on pages that contain one;
 * without JS the readable source stays visible.
 */
export function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index, parent: Parent | undefined) => {
      if (node.lang !== 'mermaid' || !parent || index === undefined) return;
      // A custom node type (not `code`) so mdast-util-to-hast emits exactly one <pre>,
      // instead of the usual <pre><code> where the data would land on the inner element.
      parent.children[index] = {
        type: 'mermaidDiagram',
        data: {
          hName: 'pre',
          hProperties: { className: ['mermaid'] },
          hChildren: [{ type: 'text', value: node.value }],
        },
      } as never;
    });
  };
}
