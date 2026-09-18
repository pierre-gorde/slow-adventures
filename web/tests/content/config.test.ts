import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const config = readFileSync(
  resolve(__dirname, '../../src/content/config.ts'),
  'utf-8'
);

const META_DESCRIPTION_MAX_LENGTH = 160;
const MIN_BODY_WORDS = 400;
const REGIONS = [
  'amerique-du-nord',
  'amerique-centrale',
  'amerique-du-sud',
  'caraibes',
];
const IMAGE_SOURCE =
  /^image:\s*['"]?(\.\.\/\.\.\/assets\/images\/destinations\/|https:\/\/)/m;

describe('content/config.ts', () => {
  describe('collection definition', () => {
    it('imports defineCollection and z from astro:content', () => {
      expect(config).toContain(
        "import { defineCollection, z } from 'astro:content'"
      );
    });

    it('defines destinations collection', () => {
      expect(config).toContain('defineCollection');
      expect(config).toContain("type: 'content'");
    });

    it('exports collections with destinations', () => {
      expect(config).toContain('export const collections');
      expect(config).toContain('destinations');
    });
  });

  describe('schema fields', () => {
    it('defines draft as z.boolean().default(false)', () => {
      expect(config).toContain('draft: z.boolean().default(false)');
    });

    it('defines country as z.string()', () => {
      expect(config).toContain('country: z.string()');
    });

    it('defines description as z.string()', () => {
      expect(config).toContain('description: z.string()');
    });

    it('accepts image() helper or remote URL for image field (NOT plain z.string)', () => {
      expect(config).toContain('image: z.union([image(), z.string()])');
      expect(config).not.toContain('image: z.string()');
    });

    it('defines optional gallery as z.array(image()).optional()', () => {
      expect(config).toContain('gallery: z.array(image()).optional()');
    });

    it('defines overlayColor as enum with terracotta and sauge', () => {
      expect(config).toContain("z.enum(['terracotta', 'sauge'])");
    });

    it('defines order as z.number()', () => {
      expect(config).toContain('order: z.number()');
    });

    it('defines featured as z.boolean().default(false)', () => {
      expect(config).toContain('featured: z.boolean().default(false)');
    });

    it('defines region as enum of the 4 Americas regions', () => {
      expect(config).toContain('region: z.enum([');
      REGIONS.forEach((region) => expect(config).toContain(`'${region}'`));
    });

    it('defines optional title as z.string().optional()', () => {
      expect(config).toContain('title: z.string().optional()');
    });

    it('defines optional metaDescription as z.string().max(160).optional()', () => {
      expect(config).toContain(
        'metaDescription: z.string().max(160).optional()'
      );
    });

    it('defines optional keywords as z.array(z.string()).optional()', () => {
      expect(config).toContain('keywords: z.array(z.string()).optional()');
    });
  });

  describe('schema uses Astro image helper', () => {
    it('receives image from schema callback parameter', () => {
      expect(config).toMatch(/schema:\s*\(\s*\{\s*image\s*\}\s*\)/);
    });
  });
});

describe('destinations content files', () => {
  const destDir = resolve(__dirname, '../../src/content/destinations');
  const originalFiles = [
    'west-coast-usa.md',
    'perou-sacre.md',
    'costa-rica-pura-vida.md',
    'patagonie-sauvage.md',
  ];
  const files = readdirSync(destDir).filter((f) => f.endsWith('.md'));

  it('contains at least one destination markdown file', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('still contains the original destinations', () => {
    originalFiles.forEach((filename) => expect(files).toContain(filename));
  });

  files.forEach((filename) => {
    describe(filename, () => {
      const content = readFileSync(resolve(destDir, filename), 'utf-8');

      it('has frontmatter with country field', () => {
        expect(content).toMatch(/^---[\s\S]*country:.*[\s\S]*---/);
      });

      it('has frontmatter with description field', () => {
        expect(content).toMatch(/^---[\s\S]*description:.*[\s\S]*---/);
      });

      it('has frontmatter with image field (local asset or https URL)', () => {
        expect(content).toMatch(IMAGE_SOURCE);
      });

      it('has frontmatter with overlayColor (terracotta or sauge)', () => {
        expect(content).toMatch(/overlayColor:\s*['"]?(terracotta|sauge)/);
      });

      it('has frontmatter with order number', () => {
        expect(content).toMatch(/order:\s*\d+/);
      });

      it('has frontmatter with a known region', () => {
        const regionMatch = content.match(/^region:\s*['"]?([a-z-]+)/m);
        expect(regionMatch).not.toBeNull();
        expect(REGIONS).toContain(regionMatch?.[1]);
      });

      it('has markdown body content', () => {
        const body = content.replace(/^---[\s\S]*?\n---\n?/, '').trim();
        expect(body.length).toBeGreaterThan(10);
      });

      it('has frontmatter with title field for SEO', () => {
        expect(content).toMatch(/^---[\s\S]*title:[\s\S]*---/);
      });

      it('has frontmatter with metaDescription field (max 160 chars)', () => {
        expect(content).toMatch(/^---[\s\S]*metaDescription:[\s\S]*---/);
        const metaMatch = content.match(/metaDescription:\s*['"]([^'"]+)['"]/);
        if (metaMatch) {
          expect(metaMatch[1].length).toBeLessThanOrEqual(
            META_DESCRIPTION_MAX_LENGTH
          );
        }
      });

      it('has frontmatter with keywords array', () => {
        expect(content).toMatch(/^---[\s\S]*keywords:[\s\S]*---/);
      });

      it('has at least 400 words in body content', () => {
        const body = content.replace(/^---[\s\S]*?\n---\n?/, '').trim();
        const wordCount = body.split(/\s+/).filter((w) => w.length > 0).length;
        expect(wordCount).toBeGreaterThanOrEqual(MIN_BODY_WORDS);
      });
    });
  });
});
