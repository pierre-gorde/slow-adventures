import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/CookieConsent.astro'),
  'utf-8'
);

describe('CookieConsent.astro', () => {
  describe('structure HTML — accessibilité (AC1)', () => {
    it('has role="dialog"', () => {
      expect(component).toContain('role="dialog"');
    });

    it('has aria-label for cookie consent banner', () => {
      expect(component).toContain('aria-label="Bannière de consentement cookies"');
    });

    it('has aria-describedby pointing to text', () => {
      expect(component).toContain('aria-describedby=');
    });

    it('has aria-modal="false" for non-modal dialog', () => {
      expect(component).toContain('aria-modal="false"');
    });

    it('has "Accepter" button', () => {
      expect(component).toContain('Accepter');
    });

    it('has "Refuser" button', () => {
      expect(component).toContain('Refuser');
    });
  });

  describe('bannière masquée par défaut — privacy by default (AC5)', () => {
    it('banner div has hidden attribute', () => {
      const lines = component.split('\n');
      const bannerIdx = lines.findIndex((l) =>
        l.includes('id="cookie-consent"')
      );
      const bannerBlock = lines.slice(bannerIdx, bannerIdx + 8).join('\n');
      expect(bannerBlock).toContain('hidden');
    });
  });

  describe('localStorage — consentement (AC2, AC3, AC4)', () => {
    it('reads sa_consent from localStorage', () => {
      expect(component).toContain("localStorage.getItem('sa_consent')");
    });

    it('stores sa_consent in localStorage', () => {
      expect(component).toContain("localStorage.setItem(");
      expect(component).toContain('sa_consent');
    });
  });

  describe('CustomEvent dispatch (AC2)', () => {
    it('dispatches sa:consent-accepted CustomEvent', () => {
      expect(component).toContain('sa:consent-accepted');
    });

    it('CustomEvent includes analytics: true in detail', () => {
      expect(component).toContain('analytics: true');
    });
  });

  describe('GA4 delegation to analytics.ts (Story 5.2)', () => {
    it('does NOT contain inline GA4 loading code', () => {
      expect(component).not.toContain('googletagmanager.com/gtag/js');
      expect(component).not.toContain('dataLayer');
    });

    it('does NOT contain data-ga4-id attribute (removed in 5.2)', () => {
      expect(component).not.toContain('data-ga4-id');
    });

    it('does NOT reference PUBLIC_GA4_MEASUREMENT_ID (delegated to analytics.ts)', () => {
      expect(component).not.toContain('PUBLIC_GA4_MEASUREMENT_ID');
    });

    it('documents delegation to analytics.ts in comment', () => {
      expect(component).toContain('analytics.ts');
    });
  });

  describe('accessibilité animations (AC6)', () => {
    it('respects prefers-reduced-motion', () => {
      expect(component).toContain('prefers-reduced-motion');
    });
  });

  describe('lien politique confidentialité (AC1)', () => {
    it('contains link to /politique-confidentialite', () => {
      expect(component).toContain('/politique-confidentialite');
    });
  });

  describe('CSS transitions', () => {
    it('has sa-consent class with 400ms transition', () => {
      expect(component).toContain('sa-consent');
      expect(component).toContain('400ms');
    });

    it('has sa-consent-visible class', () => {
      expect(component).toContain('sa-consent-visible');
    });

    it('has sa-consent-exit class with 300ms transition', () => {
      expect(component).toContain('sa-consent-exit');
      expect(component).toContain('300ms');
    });
  });

  describe('robustesse — gardes de sécurité (review fixes)', () => {
    it('handles corrupted localStorage by removing sa_consent', () => {
      expect(component).toContain("localStorage.removeItem('sa_consent')");
    });

    it('syncs setTimeout with prefers-reduced-motion preference', () => {
      expect(component).toContain('prefersReducedMotion ? 0 : 300');
    });
  });

  describe('component type', () => {
    it('is an .astro component with <script> tag (NOT client:load)', () => {
      expect(component).toContain('<script>');
      // Vérifie qu'aucune directive client:load n'est utilisée sur un élément
      expect(component).not.toMatch(/client:load\s*[=>{]/);
    });

    it('does NOT import GSAP', () => {
      expect(component).not.toContain('gsap');
      expect(component).not.toContain('GSAP');
    });
  });
});
