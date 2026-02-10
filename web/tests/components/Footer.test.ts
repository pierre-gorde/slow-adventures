import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const footer = readFileSync(
  resolve(__dirname, '../../src/components/Footer.astro'),
  'utf-8'
);

describe('Footer.astro', () => {
  describe('semantic HTML', () => {
    it('uses a <footer> element', () => {
      expect(footer).toContain('<footer');
      expect(footer).toContain('</footer>');
    });

    it('has aria-label for accessibility', () => {
      expect(footer).toContain('aria-label="Pied de page"');
    });
  });

  describe('links', () => {
    it('has a link to mentions-legales', () => {
      expect(footer).toContain('href="/mentions-legales"');
      expect(footer).toContain('Mentions légales');
    });

    it('has a link to politique-confidentialite', () => {
      expect(footer).toContain('href="/politique-confidentialite"');
      expect(footer).toContain('Politique de confidentialité');
    });

    it('has a mailto link for contact', () => {
      expect(footer).toContain('href="mailto:contact@slowadventures.fr"');
      expect(footer).toContain('contact@slowadventures.fr');
    });

    it('uses <a> tags with descriptive text for all links', () => {
      const linkMatches = footer.match(/<a[^>]*>[^<]+<\/a/g);
      expect(linkMatches).not.toBeNull();
      expect((linkMatches ?? []).length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('copyright', () => {
    it('contains Slow Adventures copyright', () => {
      expect(footer).toContain('Slow Adventures');
    });

    it('uses dynamic year with getFullYear()', () => {
      expect(footer).toContain('new Date().getFullYear()');
    });
  });

  describe('design tokens', () => {
    it('uses bg-creme-dark background', () => {
      expect(footer).toContain('bg-creme-dark');
    });

    it('uses text-warm-gray for text color', () => {
      expect(footer).toContain('text-warm-gray');
    });

    it('uses text-sm for font size', () => {
      expect(footer).toContain('text-sm');
    });

    it('uses py-8 for vertical padding', () => {
      expect(footer).toContain('py-8');
    });

    it('uses max-w-[640px] mx-auto for centered width', () => {
      expect(footer).toContain('max-w-[640px]');
      expect(footer).toContain('mx-auto');
    });
  });

  describe('responsive layout', () => {
    it('stacks vertically by default (flex-col)', () => {
      expect(footer).toContain('flex-col');
    });

    it('switches to horizontal on desktop (lg:flex-row)', () => {
      expect(footer).toContain('lg:flex-row');
    });

    it('centers items', () => {
      expect(footer).toContain('items-center');
    });
  });

  describe('link interactions', () => {
    it('has hover underline on links', () => {
      expect(footer).toContain('hover:underline');
    });

    it('has transition on links', () => {
      expect(footer).toContain('transition-colors');
    });
  });

  describe('zero JavaScript', () => {
    it('does not contain script tags', () => {
      expect(footer).not.toContain('<script');
    });
  });
});
