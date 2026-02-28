import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const page = readFileSync(
  resolve(__dirname, '../../src/pages/mentions-legales.astro'),
  'utf-8'
);

describe('mentions-legales.astro', () => {
  describe('imports', () => {
    it('imports BaseLayout', () => {
      expect(page).toContain(
        "import BaseLayout from '../layouts/BaseLayout.astro'"
      );
    });
  });

  describe('semantic HTML structure', () => {
    it('has a main element with id="main"', () => {
      expect(page).toContain('<main id="main"');
    });

    it('has an h1 heading', () => {
      expect(page).toMatch(/<h1[^>]*>.*Mentions légales.*<\/h1>/s);
    });

    it('has h2 section headings', () => {
      expect(page).toMatch(/<h2[^>]*>.*Identité.*<\/h2>/s);
      expect(page).toMatch(/<h2[^>]*>.*Siège social.*<\/h2>/s);
      expect(page).toMatch(/<h2[^>]*>.*Hébergeur.*<\/h2>/s);
      expect(page).toMatch(/<h2[^>]*>.*Contact.*<\/h2>/s);
      expect(page).toMatch(/<h2[^>]*>.*Directeur de publication.*<\/h2>/s);
    });

    it('uses max-w-3xl mx-auto for readable width', () => {
      expect(page).toContain('max-w-3xl');
      expect(page).toContain('mx-auto');
    });
  });

  describe('required legal content', () => {
    it('contains business identity (Slow Adventures)', () => {
      expect(page).toContain('Slow Adventures');
    });

    it('contains Elena as identity', () => {
      expect(page).toContain('Elena');
    });

    it('contains hosting provider (Netlify)', () => {
      expect(page).toContain('Netlify, Inc.');
      expect(page).toContain('44 Montgomery Street');
      expect(page).toContain('San Francisco');
    });

    it('contains contact email', () => {
      expect(page).toContain('mailto:');
      expect(page).toContain('elena.ld83@gmail.com');
    });

    it('contains publication director', () => {
      expect(page).toContain('Directeur de publication');
    });
  });

  describe('design tokens', () => {
    it('uses text-warm-black for headings', () => {
      expect(page).toContain('text-warm-black');
    });

    it('uses text-warm-gray for body text', () => {
      expect(page).toContain('text-warm-gray');
    });

    it('uses font-serif for h1', () => {
      expect(page).toContain('font-serif');
    });
  });

  describe('BaseLayout props', () => {
    it('passes title to BaseLayout', () => {
      expect(page).toContain('title="Mentions légales — Slow Adventures"');
    });

    it('passes description to BaseLayout', () => {
      expect(page).toMatch(/description="[^"]+"/);
    });
  });
});
