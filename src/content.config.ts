import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    section: z.enum(['writing', 'perspectives', 'toolkit']).default('writing'),
    order: z.number().default(0),
    placeholder: z.boolean().default(false),
    featured: z.boolean().default(false),
    topic: z.enum(['times', 'agents', 'graduate', 'leadership', 'undergraduate', 'notes']).optional(),
    topicConfirmed: z.boolean().default(false),
    toolkit: z.literal('codex').optional(),
  }).superRefine((post, ctx) => {
    if (post.placeholder) {
      for (const field of ['date', 'description', 'descriptionEn'] as const) {
        if (post[field] !== undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: 'Planned articles have no publication date or summary.' });
      }
    } else if (!post.date || !post.description || !post.descriptionEn) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Published articles require a date and bilingual descriptions.' });
    }
  }),
});

// Private diary files intentionally excluded from content loading and build artifacts.
export const collections = { posts };
