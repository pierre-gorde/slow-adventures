import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/ElenaSection.astro'),
  'utf-8'
);

describe('ElenaSection.astro', () => {
  describe('component is static (0 JS)', () => {
    it('does NOT contain a <script> tag', () => {
      expect(component).not.toMatch(/<script[\s>]/);
    });
  });

  describe('Props interface', () => {
    it('defines imageSrc prop as ImageMetadata', () => {
      expect(component).toContain('imageSrc');
      expect(component).toContain('ImageMetadata');
    });

    it('defines imageAlt prop', () => {
      expect(component).toContain('imageAlt');
    });

    it('defines title prop', () => {
      expect(component).toContain('title');
    });

    it('defines description prop', () => {
      expect(component).toContain('description');
    });

    it('defines ctaHref prop', () => {
      expect(component).toContain('ctaHref');
    });
  });

  describe('imports', () => {
    it('imports Image from astro:assets', () => {
      expect(component).toContain("import { Image } from 'astro:assets'");
    });

    it('imports SectionReveal component', () => {
      expect(component).toContain('SectionReveal');
    });

    it('imports CTAButton component', () => {
      expect(component).toContain('CTAButton');
    });
  });

  describe('dark overlay background', () => {
    it('uses bg-warm-black for dark background', () => {
      expect(component).toContain('bg-warm-black');
    });
  });

  describe('photo styling', () => {
    it('uses rounded-full for circular photo', () => {
      expect(component).toContain('rounded-full');
    });

    it('has white border on photo', () => {
      expect(component).toContain('border-bleu');
    });

    it('has border-4 width', () => {
      expect(component).toContain('border-4');
    });
  });

  describe('SectionReveal animations', () => {
    it('wraps photo with scale-in animation', () => {
      expect(component).toContain('animation="scale-in"');
    });

    it('wraps text with fade-in animation and 200ms delay', () => {
      expect(component).toContain('animation="fade-in"');
      expect(component).toContain('delay={200}');
    });
  });

  describe('CTAButton integration', () => {
    it('uses CTAButton with solid variant', () => {
      expect(component).toContain('variant="solid"');
    });

    it('uses CTAButton with desktopOnly', () => {
      expect(component).toContain('desktopOnly');
    });
  });

  describe('semantic structure', () => {
    it('uses a <section> element', () => {
      expect(component).toMatch(/<section[\s>]/);
    });

    it('uses an <h2> heading', () => {
      expect(component).toMatch(/<h2[\s>]/);
    });
  });

  describe('accessibility — aria-labelledby', () => {
    it('has aria-labelledby="heading-elena" on the section', () => {
      expect(component).toContain('aria-labelledby="heading-elena"');
    });

    it('has id="heading-elena" on the h2', () => {
      expect(component).toContain('id="heading-elena"');
    });

    it('accepts optional id prop', () => {
      expect(component).toMatch(/id\?:\s*string/);
    });

    it('applies id prop to section element', () => {
      expect(component).toContain('id={id}');
    });
  });

  describe('Image component usage', () => {
    it('uses Astro Image component with loading lazy', () => {
      expect(component).toContain('loading="lazy"');
    });

    it('specifies responsive sizes', () => {
      expect(component).toContain('(min-width: 1024px) 400px, 250px');
    });
  });

  describe('responsive design', () => {
    it('has responsive image sizing across all breakpoints', () => {
      expect(component).toContain('w-[250px]');
      expect(component).toContain('md:w-[350px]');
      expect(component).toContain('lg:w-[400px]');
    });

    it('switches to horizontal layout on desktop', () => {
      expect(component).toContain('lg:flex-row');
      expect(component).toContain('lg:text-left');
    });
  });

  describe('section padding', () => {
    it('uses sa-section-padding utility', () => {
      expect(component).toContain('sa-section-padding');
    });
  });
});
