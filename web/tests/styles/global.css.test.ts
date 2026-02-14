import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(
  resolve(__dirname, '../../src/styles/global.css'),
  'utf-8'
);

describe('global.css design tokens', () => {
  describe('@theme color tokens', () => {
    const colors: Record<string, string> = {
      terracotta: '#c0603e',
      'terracotta-light': '#d4856a',
      'terracotta-dark': '#a04e30',
      'terracotta-muted': '#c9a08e',
      bleu: '#1696ff',
      creme: '#fff9f3',
      'creme-dark': '#f5ede3',
      sauge: '#7b8f6b',
      ambre: '#d4956a',
      'warm-black': '#2c2825',
      'warm-gray': '#6b5e52',
    };

    for (const [name, hex] of Object.entries(colors)) {
      it(`defines --color-${name}: ${hex}`, () => {
        expect(css).toContain(`--color-${name}: ${hex}`);
      });
    }
  });

  describe('@theme font families', () => {
    it('defines --font-family-serif with Stardos Stencil', () => {
      expect(css).toMatch(/--font-family-serif:.*Stardos Stencil/);
    });

    it('defines --font-family-sans with Bree Serif', () => {
      expect(css).toMatch(/--font-family-sans:.*Bree Serif/);
    });
  });

  describe('@theme border-radius', () => {
    it('defines --radius-soft: 8px', () => {
      expect(css).toContain('--radius-soft: 8px');
    });

    it('defines --radius-round: 24px', () => {
      expect(css).toContain('--radius-round: 24px');
    });

    it('defines --radius-full: 9999px', () => {
      expect(css).toContain('--radius-full: 9999px');
    });
  });

  describe(':root GSAP custom properties', () => {
    it('defines --gsap-duration-default: 300ms', () => {
      expect(css).toContain('--gsap-duration-default: 300ms');
    });

    it('defines --gsap-duration-slow: 600ms', () => {
      expect(css).toContain('--gsap-duration-slow: 600ms');
    });

    it('defines --gsap-ease-default: ease-out', () => {
      expect(css).toContain('--gsap-ease-default: ease-out');
    });

    it('defines --gsap-ease-slow: ease-in-out', () => {
      expect(css).toContain('--gsap-ease-slow: ease-in-out');
    });
  });

  describe('[data-reveal] rules', () => {
    it('defines [data-reveal] with opacity: 0 (initial hidden state)', () => {
      const rule = css.match(/\[data-reveal\]\s*\{([^}]+)\}/);
      expect(rule).not.toBeNull();
      expect(rule?.[1] ?? '').toContain('opacity: 0');
    });

    it('defines [data-reveal].revealed with opacity: 1 and transition in same rule', () => {
      const rule = css.match(/\[data-reveal\]\.revealed\s*\{([^}]+)\}/);
      expect(rule).not.toBeNull();
      const rules = rule?.[1] ?? '';
      expect(rules).toContain('opacity: 1');
      expect(rules).toContain('transition: opacity 200ms ease-in');
    });

    it('defines prefers-reduced-motion: reduce with [data-reveal] opacity: 1', () => {
      expect(css).toMatch(
        /prefers-reduced-motion:\s*reduce[\s\S]*?\[data-reveal\][\s\S]*?opacity:\s*1/
      );
    });
  });

  describe(':focus-visible global accessibility styles', () => {
    it('defines :focus-visible with terracotta outline', () => {
      expect(css).toContain(':focus-visible');
      expect(css).toContain('outline: 2px solid var(--color-terracotta)');
    });

    it('defines :focus-visible with outline-offset: 4px', () => {
      expect(css).toContain('outline-offset: 4px');
    });

    it('removes outline on mouse focus via :focus:not(:focus-visible)', () => {
      expect(css).toContain(':focus:not(:focus-visible)');
      expect(css).toMatch(
        /:focus:not\(:focus-visible\)\s*\{[^}]*outline:\s*none/
      );
    });
  });

  describe('.sa-section-padding utility class', () => {
    it('defines .sa-section-padding', () => {
      expect(css).toContain('.sa-section-padding');
    });
  });
});
