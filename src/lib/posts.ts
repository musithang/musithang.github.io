import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../config';

export type Post = CollectionEntry<'posts'>;
export type Project = CollectionEntry<'projects'>;

/**
 * Published posts, newest first. Drafts show up in `astro dev`, and in a build
 * when SHOW_DRAFTS=1 is set (handy to preview one on a real build).
 */
export async function getPosts(): Promise<Post[]> {
  const showDrafts = import.meta.env.DEV || process.env.SHOW_DRAFTS === '1';
  const posts = await getCollection('posts', ({ data }) => showDrafts || !data.draft);
  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title),
  );
}

export const getProjects = async (): Promise<Project[]> =>
  (await getCollection('projects')).sort((a, b) => a.data.name.localeCompare(b.data.name));

/** ISO calendar day, e.g. 2026-09-29. Dates are stored at UTC midnight. */
export const day = (d: Date): string => d.toISOString().slice(0, 10);

export const slugify = (text: string): string =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const KIND_LABELS = { essay: 'Essay', devlog: 'Devlog', note: 'Note' } as const;
export const KIND_PLURALS = { essay: 'Essays', devlog: 'Devlogs', note: 'Notes' } as const;

export function tagCounts(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function groupByYear(posts: Post[]): { year: number; posts: Post[] }[] {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.date.getUTCFullYear();
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups].map(([year, posts]) => ({ year, posts })).sort((a, b) => b.year - a.year);
}

/** Series parts in reading order, keyed by series slug. */
export function seriesMap(posts: Post[]): Map<string, { name: string; parts: Post[] }> {
  const map = new Map<string, { name: string; parts: Post[] }>();
  for (const post of posts) {
    const name = post.data.series;
    if (!name) continue;
    const slug = slugify(name);
    const entry = map.get(slug) ?? { name, parts: [] };
    entry.parts.push(post);
    map.set(slug, entry);
  }
  for (const entry of map.values()) entry.parts.sort((a, b) => a.data.seriesOrder! - b.data.seriesOrder!);
  return map;
}

/** Whole months between two dates. */
export function monthsBetween(from: Date, to: Date): number {
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  const daysInToMonth = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth() + 1, 0)).getUTCDate();
  if (to.getUTCDate() < Math.min(from.getUTCDate(), daysInToMonth)) months--;
  return months;
}

/** Age in months of the newest of `date` / `updated`, or null when the post should not be flagged. */
export function staleMonths(post: Post, now = new Date()): number | null {
  if (post.data.evergreen) return null;
  const months = monthsBetween(post.data.updated ?? post.data.date, now);
  return months >= SITE.staleAfterMonths ? months : null;
}

/** Up to `limit` related posts, scored by tag overlap plus a bonus for the same series or project. */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const tags = new Set(post.data.tags);
  const scored = all
    .filter((other) => other.id !== post.id)
    .map((other) => {
      const shared = other.data.tags.filter((t) => tags.has(t)).length;
      const union = new Set([...tags, ...other.data.tags]).size;
      let score = union ? shared / union : 0;
      if (post.data.series && other.data.series === post.data.series) score += 0.5;
      if (post.data.project && other.data.project?.id === post.data.project.id) score += 0.3;
      return { other, score };
    })
    .filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score || b.other.data.date.valueOf() - a.other.data.date.valueOf());
  return scored.slice(0, limit).map((s) => s.other);
}

/** Previous/next post: within the series in order, otherwise chronologically (older = previous). */
export function neighbours(post: Post, all: Post[]): { prev?: Post; next?: Post } {
  const list = post.data.series
    ? all.filter((p) => p.data.series === post.data.series).sort((a, b) => a.data.seriesOrder! - b.data.seriesOrder!)
    : [...all].reverse();
  const i = list.findIndex((p) => p.id === post.id);
  return { prev: list[i - 1], next: list[i + 1] };
}

export function paginate<T>(items: T[], page: number, size: number) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  return { items: items.slice((page - 1) * size, page * size), page, pages };
}
