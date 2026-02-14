import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/StickyMobileCTA.astro'),
  'utf-8'
);

describe('StickyMobileCTA.astro', () => {
  describe('Accessibility (AC #5)', () => {
    it('uses <aside> element with role="complementary"', () => {
      expect(component).toContain('<aside');
      expect(component).toContain('role="complementary"');
    });

    it('has aria-label for screen readers', () => {
      expect(component).toContain('aria-label="Réserver une discovery call"');
    });
  });

  describe('CTA link (AC #1)', () => {
    it('has data-calendly-trigger attribute on the link', () => {
      expect(component).toContain('data-calendly-trigger');
    });

    it('uses PUBLIC_CALENDLY_URL in href', () => {
      expect(component).toContain('href={import.meta.env.PUBLIC_CALENDLY_URL}');
    });

    it('displays the correct CTA text', () => {
      expect(component).toContain('Confie-moi ton prochain rêve');
    });

    it('has minimum 48px touch target height', () => {
      expect(component).toContain('min-h-[48px]');
    });
  });

  describe('Desktop hiding (AC #4)', () => {
    it('has lg:hidden class on the root container', () => {
      expect(component).toContain('lg:hidden');
    });
  });

  describe('Glass effect background', () => {
    it('has backdrop-blur for glass effect', () => {
      expect(component).toContain('backdrop-blur-md');
    });

    it('has semi-transparent creme background', () => {
      expect(component).toContain('bg-creme/80');
    });
  });

  describe('Initial hidden state', () => {
    it('starts with opacity 0', () => {
      expect(component).toContain('opacity: 0');
    });

    it('starts with pointer-events none', () => {
      expect(component).toContain('pointer-events: none');
    });

    it('starts translated down (off-screen)', () => {
      expect(component).toContain('translateY(100%)');
    });
  });

  describe('IntersectionObserver logic (AC #1, #2, #3)', () => {
    it('creates IntersectionObserver', () => {
      expect(component).toContain('new IntersectionObserver');
    });

    it('observes the header element for hero visibility', () => {
      expect(component).toContain("document.querySelector('header')");
    });

    it('observes #cta-final element', () => {
      expect(component).toContain("document.getElementById('cta-final')");
    });

    it('uses combined logic: hero AND cta-final AND modal', () => {
      expect(component).toContain(
        '!heroVisible && !ctaFinalVisible && !modalOpen'
      );
    });

    it('has 300ms delay only on reappearance after CTA finale', () => {
      expect(component).toContain('wasHiddenByCTAFinal ? 300 : 0');
      expect(component).toContain('setTimeout(');
    });

    it('has CSS transition for smooth animations', () => {
      expect(component).toContain(
        'opacity 300ms ease-out, transform 300ms ease-out'
      );
    });

    it('cleans up observer on pagehide (reliable on mobile)', () => {
      expect(component).toContain('observer.disconnect()');
      expect(component).toContain("'pagehide'");
    });

    it('checks for IntersectionObserver support before use', () => {
      expect(component).toContain("'IntersectionObserver' in window");
    });
  });

  describe('CalendlyModal integration (AC #6)', () => {
    it('listens for sa:modal-open event', () => {
      expect(component).toContain("'sa:modal-open'");
    });

    it('listens for sa:modal-close event', () => {
      expect(component).toContain("'sa:modal-close'");
    });
  });

  describe('Fixed positioning', () => {
    it('is fixed to the bottom of the viewport', () => {
      expect(component).toContain('fixed bottom-0 left-0 right-0');
    });

    it('has z-50 for stacking context', () => {
      expect(component).toContain('z-50');
    });
  });
});
