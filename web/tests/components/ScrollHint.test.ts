import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/ScrollHint.astro'),
  'utf-8'
);

describe('ScrollHint.astro', () => {
  describe('HTML structure (AC4)', () => {
    it('contains "scroll to explore" text', () => {
      expect(component).toContain('scroll to explore');
    });

    it('has a chevron SVG element', () => {
      expect(component).toContain('<svg');
      expect(component).toContain('scroll-hint__chevron');
    });

    it('has aria-hidden="true" on the component wrapper', () => {
      expect(component).toMatch(
        /class="scroll-hint"[\s\S]*?aria-hidden="true"/
      );
    });
  });

  describe('Positioning (AC4)', () => {
    it('uses position: absolute for bottom placement', () => {
      expect(component).toContain('position: absolute');
    });

    it('positions at bottom of hero', () => {
      expect(component).toContain('bottom: 2rem');
    });

    it('centers horizontally with left: 50% and translateX', () => {
      expect(component).toContain('left: 50%');
      expect(component).toContain('translateX(-50%)');
    });
  });

  describe('Pulse animation (AC4)', () => {
    it('has a pulse CSS keyframe animation', () => {
      expect(component).toContain('@keyframes pulse');
    });

    it('applies pulse animation to chevron', () => {
      expect(component).toContain('animation: pulse');
    });

    it('runs animation infinitely', () => {
      expect(component).toContain('infinite');
    });
  });

  describe('Scroll detection script (AC4)', () => {
    it('adds scroll event listener', () => {
      expect(component).toContain("addEventListener('scroll'");
    });

    it('checks for scrollY > 50 threshold', () => {
      expect(component).toContain('window.scrollY > 50');
    });

    it('adds is-hidden class on scroll', () => {
      expect(component).toContain("classList.add('is-hidden')");
    });

    it('removes scroll listener after hiding', () => {
      expect(component).toContain("removeEventListener('scroll'");
    });

    it('uses passive scroll listener for performance', () => {
      expect(component).toContain('passive: true');
    });
  });

  describe('Fade-out styles', () => {
    it('has transition on opacity for smooth fade-out', () => {
      expect(component).toContain('transition: opacity');
    });

    it('sets opacity: 0 when hidden', () => {
      expect(component).toContain('.scroll-hint.is-hidden');
      expect(component).toContain('opacity: 0');
    });

    it('disables pointer events when hidden', () => {
      expect(component).toContain('pointer-events: none');
    });
  });

  describe('prefers-reduced-motion (AC3)', () => {
    it('disables pulse animation on reduced-motion', () => {
      expect(component).toContain('prefers-reduced-motion: reduce');
      expect(component).toContain('animation: none');
    });
  });
});
