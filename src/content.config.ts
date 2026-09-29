import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  // One folder per post: src/content/posts/<slug>/index.md, images next to it.
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        kind: z.enum(['essay', 'devlog', 'note']).default('essay'),
        tags: z
          .array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'tags are lowercase-kebab-case'))
          .default([]),
        project: reference('projects').optional(),
        series: z.string().optional(),
        seriesOrder: z.number().int().positive().optional(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        draft: z.boolean().default(false),
        evergreen: z.boolean().default(false),
        toc: z.boolean().default(true),
      })
      .refine((p) => !p.cover || p.coverAlt, {
        message: '`coverAlt` is required when `cover` is set',
        path: ['coverAlt'],
      })
      .refine((p) => !p.series || p.seriesOrder !== undefined, {
        message: '`seriesOrder` is required when `series` is set',
        path: ['seriesOrder'],
      })
      .refine((p) => !p.updated || p.updated >= p.date, {
        message: '`updated` must not be earlier than `date`',
        path: ['updated'],
      }),
});

const projects = defineCollection({
  loader: file('./src/data/projects.yaml'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    repo: z.url(),
  }),
});

export const collections = { posts, projects };
