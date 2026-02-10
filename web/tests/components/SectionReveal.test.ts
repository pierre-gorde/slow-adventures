import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/SectionReveal.astro'),
  'utf-8'
);

describe('SectionReveal.astro', () => {
  describe('Props interface', () => {
    it('defines animation prop with union type', () => {
      expect(component).toContain(
        "animation?: 'fade-up' | 'fade-in' | 'stagger'"
      );
    });

    it('defines delay prop as number', () => {
      expect(component).toContain('delay?: number');
    });

    it('defines duration prop as number', () => {
      expect(component).toContain('duration?: number');
    });

    it('defaults animation to fade-up', () => {
      expect(component).toContain("animation = 'fade-up'");
    });

    it('defaults delay to 0', () => {
      expect(component).toContain('delay = 0');
    });

    it('defaults duration to 600', () => {
      expect(component).toContain('duration = 600');
    });
  });

  describe('HTML structure', () => {
    it('has data-reveal attribute on wrapper div', () => {
      expect(component).toContain('data-reveal');
    });

    it('passes animation as data-animation attribute', () => {
      expect(component).toContain('data-animation={animation}');
    });

    it('passes delay as data-delay attribute', () => {
      expect(component).toContain('data-delay={delay}');
    });

    it('passes duration as data-duration attribute', () => {
      expect(component).toContain('data-duration={duration}');
    });

    it('contains a slot for child content', () => {
      expect(component).toContain('<slot />');
    });
  });

  describe('GSAP import — unified module only', () => {
    it('imports gsap from ../lib/gsap (NOT from gsap package directly)', () => {
      expect(component).toContain("from '../lib/gsap'");
    });

    it('does NOT import directly from gsap package', () => {
      expect(component).not.toMatch(/from\s+['"]gsap['"]/);
    });
  });

  describe('ScrollTrigger configuration', () => {
    it('uses start: top 80% trigger point', () => {
      expect(component).toContain("start: 'top 80%'");
    });

    it('uses once: true for single-play animations', () => {
      expect(component).toContain('once: true');
    });
  });

  describe('animation types', () => {
    it('implements fade-up with y: 20 offset', () => {
      expect(component).toContain("anim === 'fade-up' ? 20 : 0");
    });

    it('implements stagger with 0.15 spacing', () => {
      expect(component).toContain('stagger: 0.15');
    });

    it('implements stagger using el.children', () => {
      expect(component).toContain('gsap.from(el.children');
    });
  });

  describe('prefers-reduced-motion support', () => {
    it('uses gsap.matchMedia() for motion preference', () => {
      expect(component).toContain('gsap.matchMedia()');
    });

    it('targets prefers-reduced-motion: no-preference', () => {
      expect(component).toContain('(prefers-reduced-motion: no-preference)');
    });
  });

  describe('cleanup', () => {
    it('filters ScrollTriggers to only kill SectionReveal triggers', () => {
      expect(component).toContain('ScrollTrigger.getAll()');
      expect(component).toContain("hasAttribute('data-reveal')");
      expect(component).toContain('.kill()');
    });
  });

  describe('IO fallback coordination', () => {
    it('reads __revealObserver from window for IO coordination', () => {
      expect(component).toContain('__revealObserver');
    });

    it('unobserves elements from IO fallback when GSAP takes over', () => {
      expect(component).toContain('io.unobserve(el)');
    });

    it('skips GSAP animation for elements already revealed by IO', () => {
      expect(component).toContain("el.classList.contains('revealed')");
    });
  });
});
