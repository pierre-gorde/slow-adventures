import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  sequentialMessages,
  rotatingMessages,
} from '../../src/data/returnVisitorMessages';

const component = readFileSync(
  resolve(__dirname, '../../src/components/ReturnVisitorBanner.astro'),
  'utf-8'
);

describe('ReturnVisitorBanner.astro', () => {
  describe('structure HTML (AC4)', () => {
    it('has role="status"', () => {
      expect(component).toContain('role="status"');
    });

    it('has aria-live="polite"', () => {
      expect(component).toContain('aria-live="polite"');
    });
  });

  describe('localStorage — détection visiteur (AC1, AC2)', () => {
    it('reads sa_visited from localStorage', () => {
      expect(component).toContain("localStorage.getItem('sa_visited')");
    });

    it('stores sa_visited in localStorage', () => {
      expect(component).toContain("localStorage.setItem('sa_visited'");
    });

    it('stores sa_visit_count in localStorage', () => {
      expect(component).toContain("localStorage.setItem('sa_visit_count'");
    });

    it('stores sa_first_visit_date in localStorage', () => {
      expect(component).toContain('sa_first_visit_date');
      expect(component).toMatch(/localStorage\.setItem\(\s*'sa_first_visit_date'/);
    });
  });

  describe('sessionStorage — dismiss flag (AC3)', () => {
    it('reads sa_banner_dismissed from sessionStorage', () => {
      expect(component).toContain(
        "sessionStorage.getItem('sa_banner_dismissed')"
      );
    });

    it('stores sa_banner_dismissed in sessionStorage', () => {
      expect(component).toContain(
        "sessionStorage.setItem('sa_banner_dismissed'"
      );
    });
  });

  describe('auto-dismiss (AC3)', () => {
    it('uses setTimeout for auto-dismiss', () => {
      expect(component).toContain('setTimeout');
    });

    it('auto-dismiss is set to 5000ms', () => {
      expect(component).toContain('5000');
    });
  });

  describe('scroll trigger (AC2)', () => {
    it('uses IntersectionObserver to detect hero scroll', () => {
      expect(component).toContain('IntersectionObserver');
    });
  });

  describe('accessibilité (AC4)', () => {
    it('respects prefers-reduced-motion', () => {
      expect(component).toContain('prefers-reduced-motion');
    });
  });

  describe('banner masqué par défaut (AC1)', () => {
    it('banner div has hidden attribute', () => {
      const bannerLine = component
        .split('\n')
        .find((l) => l.includes('id="return-visitor-banner"'));
      expect(bannerLine).toBeDefined();
      // Verify hidden is on the banner element itself (within 5 lines)
      const lines = component.split('\n');
      const bannerIdx = lines.findIndex((l) =>
        l.includes('id="return-visitor-banner"')
      );
      const bannerBlock = lines.slice(bannerIdx, bannerIdx + 5).join('\n');
      expect(bannerBlock).toContain('hidden');
    });
  });

  describe('import messages (AC6)', () => {
    it('imports sequentialMessages from returnVisitorMessages', () => {
      expect(component).toContain('sequentialMessages');
      expect(component).toContain('returnVisitorMessages');
    });

    it('imports rotatingMessages from returnVisitorMessages', () => {
      expect(component).toContain('rotatingMessages');
    });
  });

  describe('CSS transitions (AC2, AC3)', () => {
    it('has sa-banner-enter class with fade-in 400ms', () => {
      expect(component).toContain('sa-banner-enter');
      expect(component).toContain('400ms');
    });

    it('has sa-banner-visible class', () => {
      expect(component).toContain('sa-banner-visible');
    });

    it('has sa-banner-exit class with fade-out 300ms', () => {
      expect(component).toContain('sa-banner-exit');
      expect(component).toContain('300ms');
    });
  });

  describe('UX affordances (review fixes)', () => {
    it('has cursor-pointer for click-to-dismiss affordance', () => {
      expect(component).toContain('cursor-pointer');
    });

    it('supports Escape key to dismiss', () => {
      expect(component).toContain("e.key === 'Escape'");
    });
  });

  describe('component type', () => {
    it('is an .astro component with <script> tag (NOT client:load)', () => {
      expect(component).toContain('<script>');
      expect(component).not.toMatch(/client:visible\s*[=>{]/);
      expect(component).not.toMatch(/client:load\s*[=>{]/);
    });

    it('does NOT import GSAP', () => {
      expect(component).not.toContain('gsap');
      expect(component).not.toContain('GSAP');
    });
  });
});

describe('returnVisitorMessages.ts', () => {
  it('exports exactly 9 sequential messages (visits 2-10)', () => {
    expect(sequentialMessages).toHaveLength(9);
  });

  it('exports exactly 10 rotating messages (visits 11+)', () => {
    expect(rotatingMessages).toHaveLength(10);
  });

  it('all sequential messages are non-empty strings', () => {
    for (const msg of sequentialMessages) {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
    }
  });

  it('all rotating messages are non-empty strings', () => {
    for (const msg of rotatingMessages) {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
    }
  });

  it('has no duplicates between sequential and rotating messages', () => {
    const allMessages = [...sequentialMessages, ...rotatingMessages];
    const unique = new Set(allMessages);
    expect(unique.size).toBe(allMessages.length);
  });
});
