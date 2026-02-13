import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const component = readFileSync(
  resolve(__dirname, '../../src/components/DestinationBlock.astro'),
  'utf-8'
);

describe('DestinationBlock.astro', () => {
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

    it('defines country prop', () => {
      expect(component).toContain('country');
    });

    it('defines description prop', () => {
      expect(component).toContain('description');
    });

    it('defines overlayColor prop with terracotta and sauge', () => {
      expect(component).toMatch(/overlayColor.*'terracotta'\s*\|\s*'sauge'/);
    });

    it('defines learnMoreHref as optional prop', () => {
      expect(component).toMatch(/learnMoreHref\?/);
    });
  });

  describe('imports', () => {
    it('imports Image from astro:assets', () => {
      expect(component).toContain("import { Image } from 'astro:assets'");
    });

    it('imports CTAButton component', () => {
      expect(component).toContain('CTAButton');
    });
  });

  describe('layout — full viewport', () => {
    it('uses min-h-[50vh] for half viewport height (2 destinations per screen)', () => {
      expect(component).toContain('min-h-[50vh]');
    });

    it('uses relative positioning on section', () => {
      expect(component).toContain('relative');
    });

    it('uses a <section> element', () => {
      expect(component).toMatch(/<section[\s>]/);
    });
  });

  describe('background image', () => {
    it('uses Astro Image component', () => {
      expect(component).toContain('<Image');
    });

    it('uses absolute positioning for image', () => {
      expect(component).toContain('absolute');
    });

    it('uses object-cover for image', () => {
      expect(component).toContain('object-cover');
    });

    it('uses lazy loading', () => {
      expect(component).toContain('loading="lazy"');
    });

    it('specifies widths for responsive images', () => {
      expect(component).toContain('widths=');
    });

    it('specifies sizes="100vw"', () => {
      expect(component).toContain('sizes="100vw"');
    });
  });

  describe('overlay', () => {
    it('supports terracotta overlay at 55% opacity', () => {
      expect(component).toContain('bg-terracotta/55');
    });

    it('supports sauge overlay at 55% opacity', () => {
      expect(component).toContain('bg-sauge/55');
    });

    it('conditionally applies overlay based on overlayColor prop', () => {
      expect(component).toMatch(/overlayColor\s*===\s*'terracotta'/);
    });
  });

  describe('text content', () => {
    it('renders country in an h2', () => {
      expect(component).toMatch(/<h2[\s>]/);
    });

    it('uses font-serif for country heading', () => {
      expect(component).toContain('font-serif');
    });

    it('uses text-white for country heading', () => {
      expect(component).toContain('text-white');
    });

    it('renders description', () => {
      expect(component).toContain('{description}');
    });
  });

  describe('conditional learn more link', () => {
    it('conditionally renders CTAButton with ghost variant', () => {
      expect(component).toContain('learnMoreHref');
      expect(component).toContain('variant="ghost"');
    });
  });
});
