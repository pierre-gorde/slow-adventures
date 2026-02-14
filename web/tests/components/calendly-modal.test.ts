import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/CalendlyModal.astro'),
  'utf-8'
);

describe('CalendlyModal.astro', () => {
  describe('Accessibility — role, aria attributes (AC #4)', () => {
    it('has role="dialog" on the modal container', () => {
      expect(component).toContain('role="dialog"');
    });

    it('has aria-modal="true"', () => {
      expect(component).toContain('aria-modal="true"');
    });

    it('has aria-label on the modal', () => {
      expect(component).toContain('aria-label="Réserver une discovery call"');
    });
  });

  describe('Iframe Calendly (AC #1, #2)', () => {
    it('has an <iframe with title attribute', () => {
      expect(component).toContain('<iframe');
      expect(component).toContain(
        'title="Calendly - Réserver une discovery call"'
      );
    });

    it('references PUBLIC_CALENDLY_URL for the iframe src', () => {
      expect(component).toContain('PUBLIC_CALENDLY_URL');
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

  describe('Escape key handling (AC #3)', () => {
    it('listens for keydown events', () => {
      expect(component).toContain("'keydown'");
    });

    it('checks for Escape key', () => {
      expect(component).toContain("'Escape'");
    });
  });

  describe('Scroll lock (AC #1, #3)', () => {
    it('locks body overflow on open', () => {
      expect(component).toContain("document.body.style.overflow = 'hidden'");
    });

    it('restores body overflow on close', () => {
      expect(component).toContain("document.body.style.overflow = ''");
    });

    it('uses iOS-safe fixed position pattern', () => {
      expect(component).toContain("document.body.style.position = 'fixed'");
      expect(component).toContain('document.body.style.top =');
    });

    it('saves and restores scroll position', () => {
      expect(component).toContain('savedScrollY = window.scrollY');
      expect(component).toContain('window.scrollTo(0, savedScrollY)');
    });
  });

  describe('Focus trap (AC #4)', () => {
    it('queries focusable elements inside modal', () => {
      expect(component).toContain(
        'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
      );
    });

    it('handles Tab key for focus cycling', () => {
      expect(component).toContain("e.key !== 'Tab'");
    });

    it('handles Shift+Tab for reverse focus cycling', () => {
      expect(component).toContain('e.shiftKey');
    });
  });

  describe('Close button (AC #3)', () => {
    it('has a close button with aria-label="Fermer"', () => {
      expect(component).toContain('id="calendly-close"');
      expect(component).toContain('aria-label="Fermer"');
    });

    it('close button has minimum 44x44px touch target', () => {
      expect(component).toContain('w-11 h-11');
    });
  });

  describe('z-index stacking (AC #5)', () => {
    it('has z-[60] on overlay (above StickyMobileCTA z-50)', () => {
      expect(component).toContain('z-[60]');
    });
  });

  describe('Error handling — timeout (AC #7)', () => {
    it('has role="alert" on error div for screen reader announcement', () => {
      expect(component).toContain('role="alert"');
    });

    it('has error message for unavailable service', () => {
      expect(component).toContain('Le service est temporairement indisponible');
    });

    it('has fallback link to Calendly', () => {
      expect(component).toContain('Réserver directement sur Calendly');
    });

    it('logs error with [slow-adventures] prefix', () => {
      expect(component).toContain("console.error('[slow-adventures]'");
    });

    it('has iframe load timeout logic', () => {
      expect(component).toContain('Calendly iframe load timeout');
      expect(component).toContain('10_000');
    });
  });

  describe('Backdrop overlay (AC #1)', () => {
    it('has backdrop-blur on the overlay', () => {
      expect(component).toContain('backdrop-blur-sm');
    });

    it('has dark overlay with warm-black/70', () => {
      expect(component).toContain('bg-warm-black/70');
    });
  });

  describe('prefers-reduced-motion (AC #1, #3)', () => {
    it('checks prefers-reduced-motion media query', () => {
      expect(component).toContain('prefers-reduced-motion: reduce');
    });

    it('conditionally applies animations based on motion preference', () => {
      expect(component).toContain('prefersReducedMotion');
    });
  });

  describe('Initial hidden state', () => {
    it('overlay starts with hidden class', () => {
      expect(component).toContain('class="fixed inset-0 z-[60] hidden"');
    });

    it('overlay starts with aria-hidden="true"', () => {
      expect(component).toContain('aria-hidden="true"');
    });

    it('error div starts hidden', () => {
      expect(component).toContain('id="calendly-error"');
      const errorSection = component.slice(
        component.indexOf('id="calendly-error"')
      );
      expect(errorSection).toContain('hidden');
    });
  });

  describe('Open/close animation (AC #1, #3)', () => {
    it('has slide-up animation with 400ms ease-out', () => {
      expect(component).toContain('transform 400ms ease-out');
    });

    it('has fade-out animation with 300ms', () => {
      expect(component).toContain('opacity 300ms ease-out');
    });

    it('uses requestAnimationFrame for slide-up', () => {
      expect(component).toContain('requestAnimationFrame');
    });
  });

  describe('Responsive design (AC #5)', () => {
    it('has full-screen mobile with inset-0', () => {
      expect(component).toContain('absolute inset-0');
    });

    it('has desktop centered with max-w-2xl', () => {
      expect(component).toContain('lg:max-w-2xl');
    });

    it('has desktop rounded corners', () => {
      expect(component).toContain('lg:rounded-soft');
    });

    it('has desktop shadow', () => {
      expect(component).toContain('lg:shadow-xl');
    });

    it('has desktop height constraint', () => {
      expect(component).toContain('lg:h-[85vh]');
    });
  });

  describe('Re-entrancy guards (robustness)', () => {
    it('has isOpen guard in openModal to prevent double-open', () => {
      expect(component).toContain('isOpen) return');
    });

    it('has isClosing guard in closeModal to prevent double-close', () => {
      expect(component).toContain('isClosing');
    });

    it('resets isOpen and isClosing in finish callback', () => {
      expect(component).toContain('isOpen = false');
      expect(component).toContain('isClosing = false');
    });
  });

  describe('Click interception (AC #1)', () => {
    it('queries all [data-calendly-trigger] elements', () => {
      expect(component).toContain("'[data-calendly-trigger]'");
    });

    it('calls preventDefault on trigger clicks', () => {
      expect(component).toContain('e.preventDefault()');
    });

    it('stores trigger element for focus restore', () => {
      expect(component).toContain('triggerElement = trigger');
      expect(component).toContain('triggerElement?.focus()');
    });
  });

  describe('Iframe cleanup', () => {
    it('clears iframe src on close with about:blank', () => {
      expect(component).toContain("iframe.src = 'about:blank'");
    });

    it('listens for iframe onload to cancel timeout', () => {
      expect(component).toContain('iframe.onload');
      expect(component).toContain('clearTimeout(loadTimeout)');
    });
  });

  describe('Overlay close (AC #3)', () => {
    it('has data-overlay-bg for click detection', () => {
      expect(component).toContain('data-overlay-bg');
    });

    it('adds click listener on overlay background', () => {
      expect(component).toContain(
        "overlayBg?.addEventListener('click', closeModal)"
      );
    });
  });
});
