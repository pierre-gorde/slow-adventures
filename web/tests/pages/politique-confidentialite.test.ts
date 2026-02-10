import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const page = readFileSync(
  resolve(__dirname, '../../src/pages/politique-confidentialite.astro'),
  'utf-8'
);

describe('politique-confidentialite.astro', () => {
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
      expect(page).toMatch(/<h1[^>]*>.*Politique de confidentialité.*<\/h1>/s);
    });

    it('has h2 section headings for RGPD sections', () => {
      expect(page).toMatch(/<h2[^>]*>.*Responsable du traitement.*<\/h2>/s);
      expect(page).toMatch(/<h2[^>]*>.*Finalités du traitement.*<\/h2>/s);
      expect(page).toMatch(/<h2[^>]*>.*Base légale.*<\/h2>/s);
      expect(page).toMatch(/<h2[^>]*>.*Vos droits.*<\/h2>/s);
      expect(page).toMatch(/<h2[^>]*>.*Services tiers.*<\/h2>/s);
    });

    it('uses lists for structured content', () => {
      expect(page).toContain('<ul');
      expect(page).toContain('<li>');
    });

    it('uses max-w-3xl mx-auto for readable width', () => {
      expect(page).toContain('max-w-3xl');
      expect(page).toContain('mx-auto');
    });
  });

  describe('RGPD required content', () => {
    it('mentions data controller (Elena / Slow Adventures)', () => {
      expect(page).toContain('Elena');
      expect(page).toContain('Slow Adventures');
    });

    it('mentions legal basis (consentement RGPD)', () => {
      expect(page).toContain('consentement');
      expect(page).toContain('RGPD');
    });

    it('mentions user rights', () => {
      expect(page).toContain("Droit d'accès");
      expect(page).toContain('Droit de rectification');
      expect(page).toContain('Droit de suppression');
      expect(page).toContain('portabilité');
      expect(page).toContain("Droit d'opposition");
      expect(page).toContain('Droit à la limitation');
    });

    it('mentions data retention', () => {
      expect(page).toMatch(/<h2[^>]*>.*Durée de conservation.*<\/h2>/s);
    });
  });

  describe('third-party services', () => {
    it('mentions Brevo (ex-Sendinblue)', () => {
      expect(page).toContain('Brevo');
      expect(page).toContain('Sendinblue');
    });

    it('mentions Google Analytics 4', () => {
      expect(page).toContain('Google Analytics 4');
    });

    it('mentions Calendly', () => {
      expect(page).toContain('Calendly');
    });

    it('mentions Netlify', () => {
      expect(page).toContain('Netlify');
    });
  });

  describe('localStorage usage', () => {
    it('mentions localStorage', () => {
      expect(page).toContain('localStorage');
    });

    it('mentions cookie consent storage', () => {
      expect(page).toContain('consentement cookies');
    });

    it('mentions no third-party cookies without consent', () => {
      expect(page).toContain('cookie tiers');
      expect(page).toContain('consentement');
    });
  });

  describe('design tokens', () => {
    it('uses text-warm-black for headings', () => {
      expect(page).toContain('text-warm-black');
    });

    it('uses text-warm-gray for body text', () => {
      expect(page).toContain('text-warm-gray');
    });
  });

  describe('BaseLayout props', () => {
    it('passes title to BaseLayout', () => {
      expect(page).toContain(
        'title="Politique de confidentialité — Slow Adventures"'
      );
    });

    it('passes description to BaseLayout', () => {
      expect(page).toMatch(/description="[^"]+"/);
    });
  });
});
