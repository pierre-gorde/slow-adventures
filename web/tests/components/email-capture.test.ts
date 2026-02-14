import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/EmailCapture.astro'),
  'utf-8'
);

describe('EmailCapture.astro', () => {
  describe('form structure (AC2)', () => {
    it('contains a <form> element', () => {
      expect(component).toContain('<form');
    });

    it('has a <label> with sr-only class and "Ton adresse email"', () => {
      expect(component).toContain('class="sr-only"');
      expect(component).toContain('Ton adresse email');
    });

    it('has an input with type="email"', () => {
      expect(component).toContain('type="email"');
    });

    it('has placeholder="ton@email.com"', () => {
      expect(component).toContain('placeholder="ton@email.com"');
    });

    it('has autocomplete="email" for mobile UX', () => {
      expect(component).toContain('autocomplete="email"');
    });

    it('has required attribute on input', () => {
      expect(component).toContain('required');
    });

    it('has novalidate attribute to disable browser validation', () => {
      expect(component).toContain('novalidate');
    });
  });

  describe('accessibility (AC2, AC3)', () => {
    it('has aria-live="polite" for error messages', () => {
      expect(component).toContain('aria-live="polite"');
    });

    it('has role="alert" for error messages', () => {
      expect(component).toContain('role="alert"');
    });

    it('has aria-labelledby on the section', () => {
      expect(component).toContain('aria-labelledby="heading-email-capture"');
    });

    it('has id on the heading matching aria-labelledby', () => {
      expect(component).toContain('id="heading-email-capture"');
    });

    it('has aria-hidden="true" on the spinner SVG', () => {
      expect(component).toContain('aria-hidden="true"');
    });

    it('has aria-describedby="email-error" on the input', () => {
      expect(component).toContain('aria-describedby="email-error"');
    });

    it('has sr-only live region for loading status announcements', () => {
      expect(component).toContain('id="email-status"');
      expect(component).toContain('aria-live="assertive"');
    });
  });

  describe('RGPD text (AC2)', () => {
    it('contains "inspirations voyage"', () => {
      expect(component).toContain('inspirations voyage');
    });

    it('contains "Désabonnement"', () => {
      expect(component).toMatch(/[Dd]ésabonnement/);
    });

    it('contains the full RGPD text', () => {
      expect(component).toContain("En t'inscrivant, tu recevras nos");
      expect(component).toContain('inspirations voyage');
      expect(component).toContain('clic.');
    });
  });

  describe('success message (AC5)', () => {
    it('contains "Bienvenue dans l\'aventure"', () => {
      expect(component).toContain("Bienvenue dans l'aventure");
    });

    it('contains "Regarde ta boîte mail"', () => {
      expect(component).toContain('Regarde ta boîte mail');
    });

    it('has success message with sauge color', () => {
      expect(component).toContain('text-sauge');
    });
  });

  describe('error message (AC3, AC6)', () => {
    it('contains validation error message', () => {
      expect(component).toContain('Hmm, cette adresse ne semble pas valide');
    });

    it('contains API error message with "Oups"', () => {
      expect(component).toContain('Oups');
    });

    it('contains "Réessaie" in error message', () => {
      expect(component).toContain('Réessaie');
    });
  });

  describe('Brevo integration (AC4)', () => {
    it('imports subscribeToNewsletter from brevo.ts', () => {
      expect(component).toContain("from '../lib/brevo'");
    });

    it('calls subscribeToNewsletter', () => {
      expect(component).toContain('subscribeToNewsletter(');
    });
  });

  describe('error logging (AC6)', () => {
    it('delegates error logging to brevo.ts (no console.error in component script)', () => {
      // EmailCapture delegates error logging to brevo.ts
      // The component script only handles UI state
      const scriptSection = component.slice(component.indexOf('<script>'));
      expect(scriptSection).not.toContain('console.error');
      expect(scriptSection).toContain("from '../lib/brevo'");
    });
  });

  describe('section structure (AC1)', () => {
    it('has section with id="email-capture"', () => {
      expect(component).toContain('id="email-capture"');
    });

    it('has positive title text (not negative)', () => {
      expect(component).toContain("Reste connecté(e) à l'aventure");
      expect(component).not.toContain('pas encore');
    });

    it('uses tutoiement throughout', () => {
      expect(component).toContain("t'inscrivant");
      expect(component).toContain('ton@email.com');
    });

    it('uses bg-warm-black for dark background', () => {
      expect(component).toContain('bg-warm-black');
    });

    it('has data-reveal attribute for SectionReveal animation', () => {
      expect(component).toContain('data-reveal');
    });
  });

  describe('touch targets (AC2)', () => {
    it('submit button has min-h-[44px] for touch target', () => {
      expect(component).toContain('min-h-[44px]');
    });
  });

  describe('spinner (AC4)', () => {
    it('has a spinner SVG element', () => {
      expect(component).toContain('id="email-spinner"');
    });

    it('spinner uses animate-spin', () => {
      expect(component).toContain('animate-spin');
    });

    it('spinner uses terracotta color', () => {
      expect(component).toContain('text-terracotta');
    });

    it('spinner is initially hidden', () => {
      // After Prettier, attributes may span multiple lines
      // Check that the spinner div has both id and hidden class
      const spinnerIdx = component.indexOf('email-spinner');
      const spinnerContext = component.slice(
        Math.max(0, spinnerIdx - 100),
        spinnerIdx + 100
      );
      expect(spinnerContext).toContain('hidden');
    });
  });

  describe('client-side validation (AC3)', () => {
    it('uses email regex for validation', () => {
      expect(component).toContain('EMAIL_REGEX');
      expect(component).toContain('@');
    });

    it('adds border-terracotta class on invalid email', () => {
      expect(component).toContain("classList.add('border-terracotta')");
    });

    it('removes border-terracotta on input event', () => {
      expect(component).toContain("classList.remove('border-terracotta')");
    });
  });

  describe('component type (AC1)', () => {
    it('is an .astro component with <script> tag (NOT client:visible)', () => {
      expect(component).toContain('<script>');
      // Verify no hydration directives are used as attributes on the component
      // (comments mentioning them are OK)
      expect(component).not.toMatch(/client:visible\s*[=>{]/);
      expect(component).not.toMatch(/client:load\s*[=>{]/);
    });
  });

  describe('animation (AC8)', () => {
    it('does NOT import GSAP (animations handled by SectionReveal parent)', () => {
      expect(component).not.toContain('gsap');
      expect(component).not.toContain('GSAP');
    });
  });
});
