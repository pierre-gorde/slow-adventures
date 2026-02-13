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
      expect(component).toContain('Confie-moi ton prochain rêve');
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

  describe('hover effects with motion-safe', () => {
    it('has motion-safe hover box-shadow with terracotta color', () => {
      expect(component).toContain(
        'motion-safe:hover:shadow-[0_8px_32px_rgba(192,96,62,0.15)]'
      );
    });

    it('has motion-safe hover scale transform', () => {
      expect(component).toContain('motion-safe:hover:scale-[1.02]');
    });
  });

  describe('focus accessibility — global focus-visible', () => {
    it('does NOT have inline focus outline classes (handled by global.css)', () => {
      expect(component).not.toContain('focus:outline-2');
      expect(component).not.toContain('focus:outline-terracotta');
      expect(component).not.toContain('focus:outline-offset-4');
    });
  });

  describe('transition with motion-safe', () => {
    it('has motion-safe:transition-all', () => {
      expect(component).toContain('motion-safe:transition-all');
    });

    it('has motion-safe:duration-300', () => {
      expect(component).toContain('motion-safe:duration-300');
    });
  });
});
