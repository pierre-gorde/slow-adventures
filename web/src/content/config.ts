import { defineCollection, z } from 'astro:content';

const destinations = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      country: z.string(),
      description: z.string(),
      image: z.union([image(), z.string()]),
      gallery: z.array(image()).optional(),
      overlayColor: z.enum(['terracotta', 'sauge']),
      order: z.number(),
      featured: z.boolean().default(false),
      region: z.enum([
        'amerique-du-nord',
        'amerique-centrale',
        'amerique-du-sud',
        'caraibes',
      ]),
      title: z.string().optional(),
      metaDescription: z.string().max(160).optional(),
      keywords: z.array(z.string()).optional(),
    }),
});

export const collections = { destinations };
