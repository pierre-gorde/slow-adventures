import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/TestimonialCard.astro'),
  'utf-8'
);

describe('TestimonialCard.astro', () => {
  describe('component is static (0 JS)', () => {
    it('does NOT contain a <script> tag', () => {
      expect(component).not.toMatch(/<script[\s>]/);
    });
  });

  describe('Props interface', () => {
    it('defines quote prop', () => {
      expect(component).toContain('quote');
    });

    it('defines name prop', () => {
      expect(component).toContain('name');
    });

    it('defines tripContext prop', () => {
      expect(component).toContain('tripContext');
    });
  });

  describe('semantic HTML', () => {
    it('uses <blockquote> for the citation', () => {
      expect(component).toMatch(/<blockquote[\s>]/);
    });

    it('uses <cite> for the name attribution', () => {
      expect(component).toMatch(/<cite[\s>]/);
    });

    it('uses <footer> inside blockquote for attribution', () => {
      expect(component).toMatch(/<footer[\s>]/);
    });
  });

  describe('typography', () => {
    it('uses font-serif italic for quote text', () => {
      expect(component).toContain('font-serif');
      expect(component).toContain('italic');
    });

    it('uses text-white for quote', () => {
      expect(component).toContain('text-white');
    });

    it('uses font-semibold for name', () => {
      expect(component).toContain('font-semibold');
    });

    it('uses text-white/80 for trip context', () => {
      expect(component).toContain('text-white/80');
    });

    it('uses text-sm for trip context', () => {
      expect(component).toContain('text-sm');
    });
  });

  describe('French typographic guillemets', () => {
    it('wraps quote with opening guillemet «', () => {
      expect(component).toContain('&laquo;');
    });

    it('wraps quote with closing guillemet »', () => {
      expect(component).toContain('&raquo;');
    });
  });

  describe('content rendering', () => {
    it('renders quote text', () => {
      expect(component).toContain('{quote}');
    });

    it('renders name', () => {
      expect(component).toContain('{name}');
    });

    it('renders tripContext', () => {
      expect(component).toContain('{tripContext}');
    });
  });
});
