import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/CalendlyModal.astro'),
  'utf-8'
);

describe('CalendlyModal.astro', () => {
  describe('Calendly popup widget assets (AC #1)', () => {
    it('preloads Calendly widget CSS', () => {
      expect(component).toContain(
        'https://assets.calendly.com/assets/external/widget.css'
      );
    });

    it('loads Calendly widget JS async', () => {
      expect(component).toContain(
        'https://assets.calendly.com/assets/external/widget.js'
      );
    });

    it('has <noscript> fallback for widget CSS', () => {
      expect(component).toContain('<noscript>');
    });
  });

  describe('Calendly URL configuration (AC #2)', () => {
    it('references PUBLIC_CALENDLY_URL env variable', () => {
      expect(component).toContain('PUBLIC_CALENDLY_URL');
    });

    it('uses a data attribute to pass URL to script', () => {
      expect(component).toContain('data-calendly-url');
    });
  });

  describe('Click interception (AC #1)', () => {
    it('queries all [data-calendly-trigger] elements', () => {
      expect(component).toContain("'[data-calendly-trigger]'");
    });

    it('calls preventDefault on trigger clicks', () => {
      expect(component).toContain('e.preventDefault()');
    });
  });

  describe('Calendly popup (AC #1)', () => {
    it('uses Calendly.initPopupWidget', () => {
      expect(component).toContain('initPopupWidget');
    });

    it('appends hide_gdpr_banner param to Calendly URL', () => {
      expect(component).toContain('hide_gdpr_banner=1');
    });

    it('has fallback to window.open if Calendly not ready', () => {
      expect(component).toContain('window.open(');
    });
  });

  describe('CustomEvents — StickyMobileCTA integration (AC #5)', () => {
    it('dispatches sa:modal-open event', () => {
      expect(component).toContain("'sa:modal-open'");
    });

    it('dispatches sa:modal-close event', () => {
      expect(component).toContain("'sa:modal-close'");
    });

    it('uses CustomEvent constructor', () => {
      expect(component).toContain('new CustomEvent(');
    });
  });

  describe('Calendly event tracking', () => {
    it('listens for window message events', () => {
      expect(component).toContain("window.addEventListener('message'");
    });

    it('handles calendly.event_scheduled', () => {
      expect(component).toContain('calendly.event_scheduled');
    });

    it('imports trackCalendlyComplete from analytics', () => {
      expect(component).toContain('trackCalendlyComplete');
    });
  });

  describe('Calendly readiness check', () => {
    it('has waitForCalendly helper function', () => {
      expect(component).toContain('waitForCalendly');
    });

    it('has timeout parameter for waiting', () => {
      expect(component).toContain('5000');
    });
  });
});
