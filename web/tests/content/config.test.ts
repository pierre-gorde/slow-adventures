import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const config = readFileSync(
  resolve(__dirname, '../../src/content/config.ts'),
  'utf-8'
);

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
    it('defines country as z.string()', () => {
      expect(config).toContain('country: z.string()');
    });

    it('defines description as z.string()', () => {
      expect(config).toContain('description: z.string()');
    });

    it('uses image() helper for image field (NOT z.string)', () => {
      expect(config).toContain('image: image()');
      expect(config).not.toContain('image: z.string()');
    });

    it('defines overlayColor as enum with terracotta and sauge', () => {
      expect(config).toContain("z.enum(['terracotta', 'sauge'])");
    });

    it('defines order as z.number()', () => {
      expect(config).toContain('order: z.number()');
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
  const expectedFiles = [
    'west-coast-usa.md',
    'perou-sacre.md',
    'costa-rica-pura-vida.md',
    'patagonie-sauvage.md',
  ];

  it('contains exactly 4 destination markdown files', () => {
    const files = readdirSync(destDir).filter((f) => f.endsWith('.md'));
    expect(files).toHaveLength(4);
  });

  expectedFiles.forEach((filename) => {
    describe(filename, () => {
      const content = readFileSync(resolve(destDir, filename), 'utf-8');

      it('has frontmatter with country field', () => {
        expect(content).toMatch(/^---[\s\S]*country:.*[\s\S]*---/);
      });

      it('has frontmatter with description field', () => {
        expect(content).toMatch(/^---[\s\S]*description:.*[\s\S]*---/);
      });

      it('has frontmatter with image field pointing to assets', () => {
        expect(content).toContain('image:');
        expect(content).toContain('assets/images/destinations/');
      });

      it('has frontmatter with overlayColor (terracotta or sauge)', () => {
        expect(content).toMatch(/overlayColor:\s*['"]?(terracotta|sauge)/);
      });

      it('has frontmatter with order number', () => {
        expect(content).toMatch(/order:\s*\d+/);
      });

      it('has markdown body content', () => {
        const body = content.split('---')[2]?.trim() ?? '';
        expect(body.length).toBeGreaterThan(10);
      });
    });
  });
});
