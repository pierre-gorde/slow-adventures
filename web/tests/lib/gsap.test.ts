import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const gsapModule = readFileSync(
  resolve(__dirname, '../../src/lib/gsap.ts'),
  'utf-8'
);

describe('src/lib/gsap.ts — unified GSAP module', () => {
  describe('imports', () => {
    it('imports gsap from gsap package', () => {
      expect(gsapModule).toContain("import { gsap } from 'gsap'");
    });

    it('imports ScrollTrigger from gsap/ScrollTrigger', () => {
      expect(gsapModule).toContain(
        "import { ScrollTrigger } from 'gsap/ScrollTrigger'"
      );
    });
  });

  describe('plugin registration', () => {
    it('registers ScrollTrigger plugin', () => {
      expect(gsapModule).toContain('gsap.registerPlugin(ScrollTrigger)');
    });
  });

  describe('named exports', () => {
    it('exports gsap and ScrollTrigger', () => {
      expect(gsapModule).toContain('export { gsap, ScrollTrigger }');
    });
  });
});
