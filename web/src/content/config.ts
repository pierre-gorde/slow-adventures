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
    }),
});

export const collections = { destinations };
