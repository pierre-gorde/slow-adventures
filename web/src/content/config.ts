import { defineCollection, z } from 'astro:content';

const destinations = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      country: z.string(),
      description: z.string(),
      image: image(),
      overlayColor: z.enum(['terracotta', 'sauge']),
      order: z.number(),
      title: z.string().optional(),
      metaDescription: z.string().max(160).optional(),
      keywords: z.array(z.string()).optional(),
    }),
});

export const collections = { destinations };
