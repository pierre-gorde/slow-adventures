import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/CTAButton.astro'),
  'utf-8'
);

describe('CTAButton.astro', () => {
  describe('component is static (0 JS)', () => {
    it('does NOT contain a <script> tag', () => {
      expect(component).not.toMatch(/<script[\s>]/);
    });
  });

  describe('Props interface', () => {
    it('defines text prop with default value', () => {
      expect(component).toContain('text');
      expect(component).toContain('Confiez-nous ton prochain rêve');
    });

    it('defines subtext as optional prop', () => {
      expect(component).toContain('subtext');
    });

    it('defines href prop', () => {
      expect(component).toContain('href');
    });

    it('defines size prop with default and small variants', () => {
      expect(component).toMatch(/size.*'default'\s*\|\s*'small'/);
    });

    it('defines variant prop with solid, outline, ghost', () => {
      expect(component).toMatch(
        /variant.*'solid'\s*\|\s*'outline'\s*\|\s*'ghost'/
      );
    });

    it('defines desktopOnly boolean prop', () => {
      expect(component).toContain('desktopOnly');
    });
  });

  describe('semantic HTML', () => {
    it('renders as an <a> tag (not <button>)', () => {
      expect(component).toMatch(/<a[\s\n]/);
    });

    it('includes data-calendly-trigger attribute for future JS interception', () => {
      expect(component).toContain('data-calendly-trigger');
    });
  });

  describe('variant: outline', () => {
    it('has transparent background for outline variant', () => {
      expect(component).toContain('bg-transparent');
    });

    it('has white border for outline variant', () => {
      expect(component).toContain('border-white');
    });

    it('has white text for outline variant', () => {
      expect(component).toContain('text-white');
    });
  });

  describe('variant: solid', () => {
    it('has terracotta background for solid variant', () => {
      expect(component).toContain('bg-terracotta');
    });

    it('uses active state (not hover) for terracotta-dark background', () => {
      expect(component).toContain('active:bg-terracotta-dark');
      expect(component).not.toContain('hover:bg-terracotta-dark');
    });
  });

  describe('variant: ghost', () => {
    it('has transparent background for ghost variant', () => {
      expect(component).toContain('bg-transparent');
    });

    it('has terracotta text for ghost variant', () => {
      expect(component).toContain('text-terracotta');
    });

    it('has transparent border for ghost variant', () => {
      expect(component).toContain('border-transparent');
    });
  });

  describe('desktopOnly behavior', () => {
    it('uses hidden lg:inline-block for desktopOnly', () => {
      expect(component).toContain('hidden');
      expect(component).toContain('lg:inline-block');
    });
  });

  describe('hover effects', () => {
    it('has hover box-shadow with terracotta color', () => {
      expect(component).toMatch(/hover:.*shadow/);
    });

    it('has hover scale transform', () => {
      expect(component).toContain('hover:scale-[1.02]');
    });
  });

  describe('focus accessibility', () => {
    it('has focus outline with terracotta color', () => {
      expect(component).toMatch(/focus.*outline/);
    });

    it('has focus outline offset', () => {
      expect(component).toContain('outline-offset');
    });
  });

  describe('transition', () => {
    it('has transition duration of 300ms', () => {
      expect(component).toContain('duration-300');
    });
  });
});
