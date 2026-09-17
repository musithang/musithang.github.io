import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    section: z.string().default(''),
    status: z.enum(['draft', 'final', 'final(ish)']).default('final'),
    amended: z.date().optional(),
  }),
});

export const collections = { posts };
