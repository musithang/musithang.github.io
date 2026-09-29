import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, day, KIND_LABELS } from '../../lib/posts';
import { renderCard, type CardInput } from '../../lib/og';

// One social card per post, plus `_default.png` for every other page.
export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const cards: { params: { slug: string }; props: CardInput }[] = posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      eyebrow: `${day(post.data.date)} · ${KIND_LABELS[post.data.kind]}`,
      tags: post.data.tags,
    },
  }));
  cards.push({
    params: { slug: '_default' },
    props: { title: 'Notes from the bench', eyebrow: 'Project logs · Technical writing', tags: ['rust', 'sdr', 'homelab'] },
  });
  return cards;
}) satisfies GetStaticPaths;

export const GET: APIRoute<CardInput> = async ({ props }) => {
  const png = await renderCard(props);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};

