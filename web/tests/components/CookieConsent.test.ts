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

  describe('chargement dynamique GA4 (AC2)', () => {
    it('contains googletagmanager.com/gtag/js URL', () => {
      expect(component).toContain('googletagmanager.com/gtag/js');
    });

    it('uses data-ga4-id attribute for measurement ID', () => {
      expect(component).toContain('data-ga4-id');
    });

    it('references PUBLIC_GA4_MEASUREMENT_ID in frontmatter', () => {
      expect(component).toContain('PUBLIC_GA4_MEASUREMENT_ID');
    });

    it('initializes dataLayer for gtag', () => {
      expect(component).toContain('dataLayer');
    });
  });

  describe('Google Consent Mode v2 (AC2)', () => {
    it('contains consent API call', () => {
      expect(component).toContain("'consent'");
    });

    it('contains analytics_storage parameter', () => {
      expect(component).toContain('analytics_storage');
    });

    it('sets analytics_storage to denied by default', () => {
      expect(component).toContain("analytics_storage: 'denied'");
    });

    it('updates analytics_storage to granted on consent', () => {
      expect(component).toContain("analytics_storage: 'granted'");
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
    it('has idempotency guard for GA4 loading (ga4Loaded flag)', () => {
      expect(component).toContain('ga4Loaded');
    });

    it('guards against empty measurement ID', () => {
      expect(component).toContain('!measurementId');
    });

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
