import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import { SITE } from '../config';
import { getPosts } from '../lib/posts';

// MathML is what readers can show for formulas; the TeX source and the visual HTML copy are dropped.
const MATHML = [
  'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'ms', 'mtext', 'mspace', 'msup', 'msub', 'msubsup',
  'mfrac', 'msqrt', 'mroot', 'munder', 'mover', 'munderover', 'mtable', 'mtr', 'mtd', 'mstyle',
  'menclose', 'mpadded', 'mphantom',
];

/**
 * Expressive Code emits a frame with one <div> per line, which is meaningless outside our CSS.
 * Flatten each block to a plain <pre><code>, keeping the file name as a bold line above it.
 */
function flattenCodeBlocks(html: string): string {
  return html.replace(/<div class="expressive-code">[\s\S]*?<\/figure><\/div>/g, (block) => {
    const title = /<figcaption class="header"><span class="title">([\s\S]*?)<\/span>/.exec(block)?.[1];
    const lines = [...block.matchAll(/<div class="ec-line[^"]*">([\s\S]*?)<\/div><\/div>/g)].map((m) =>
      m[1].replace(/<[^>]+>/g, ''),
    );
    return `${title ? `<p><strong>${title}</strong></p>` : ''}<pre><code>${lines.join('\n')}</code></pre>`;
  });
}

function clean(html: string, site: string): string {
  const safe = sanitizeHtml(flattenCodeBlocks(html), {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img', 'figure', 'figcaption', 'details', 'summary', 'h1', 'h2', 'sup', 'sub', 'kbd', 'mark', 'del',
      ...MATHML,
      'annotation', // allowed only so the filter below can drop it (otherwise its text would leak)
    ],
    allowedAttributes: {
      a: ['href', 'title'],
      img: ['src', 'alt', 'width', 'height'],
      math: ['xmlns', 'display'],
    },
    exclusiveFilter: (frame) =>
      /\bkatex-html\b/.test(frame.attribs.class ?? '') ||
      frame.tag === 'annotation' ||
      // heading permalinks are empty links here (the "#" is drawn by CSS)
      (frame.tag === 'a' && frame.text.trim() === ''),
  });
  // Feed readers resolve links against the feed URL, so make them absolute.
  return safe.replace(/\b(href|src)="\/(?!\/)/g, `$1="${site}/`);
}

export async function GET(context: APIContext) {
  const site = (context.site ?? new URL(SITE.url)).href.replace(/\/$/, '');
  const container = await AstroContainer.create();
  const posts = await getPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/posts/${post.id}/`,
        categories: post.data.tags,
        content: clean(html, site),
      };
    }),
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    trailingSlash: true,
    customData: `<language>${SITE.lang}</language>`,
  });
}
