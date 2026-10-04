import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    section: z.enum(['writing', 'perspectives', 'toolkit']).default('writing'),
    order: z.number().default(0),
    placeholder: z.boolean().default(false),
  }),
});

// Private diary files intentionally excluded from content loading and build artifacts.
export const collections = { posts };
