import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/**
 * Published posts, newest first. Drafts show up in `astro dev`, and in a build
 * when SHOW_DRAFTS=1 is set (handy to preview one on a real build).
 */
export async function getPosts(): Promise<Post[]> {
  const showDrafts = import.meta.env.DEV || process.env.SHOW_DRAFTS === '1';
  const posts = await getCollection('posts', ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
