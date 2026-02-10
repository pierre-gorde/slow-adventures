import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const layout = readFileSync(
  resolve(__dirname, '../../src/layouts/BaseLayout.astro'),
  'utf-8'
);

describe('BaseLayout.astro', () => {
  describe('props interface', () => {
    it('defines title prop', () => {
      expect(layout).toMatch(/title:\s*string/);
    });

    it('defines description prop', () => {
      expect(layout).toMatch(/description:\s*string/);
    });

    it('defines optional ogImage prop', () => {
      expect(layout).toMatch(/ogImage\?:\s*string/);
    });
  });

  describe('head meta tags', () => {
    it('includes meta charset UTF-8', () => {
      expect(layout).toContain('charset="utf-8"');
    });

    it('includes meta viewport', () => {
      expect(layout).toContain('width=device-width');
    });

    it('includes meta generator', () => {
      expect(layout).toContain('Astro.generator');
    });

    it('includes dynamic title', () => {
      expect(layout).toMatch(/<title>.*{.*title.*}.*<\/title>/s);
    });

    it('includes meta description', () => {
      expect(layout).toContain('name="description"');
    });
  });

  describe('Google Fonts preconnect and stylesheet', () => {
    it('preconnects to fonts.googleapis.com', () => {
      expect(layout).toContain('href="https://fonts.googleapis.com"');
    });

    it('preconnects to fonts.gstatic.com with crossorigin', () => {
      expect(layout).toMatch(/fonts\.gstatic\.com.*crossorigin/s);
    });

    it('uses preload pattern for non-blocking font loading', () => {
      expect(layout).toContain('rel="preload"');
      expect(layout).toContain('as="style"');
      expect(layout).toContain("this.rel='stylesheet'");
    });

    it('includes noscript fallback for fonts', () => {
      expect(layout).toContain('<noscript>');
    });

    it('loads Google Fonts with Lora and Plus Jakarta Sans', () => {
      expect(layout).toContain('family=Lora:wght@600');
      expect(layout).toContain('family=Plus+Jakarta+Sans:wght@400;500;600');
      expect(layout).toContain('display=swap');
    });
  });

  describe('SEO meta tags', () => {
    it('includes canonical URL', () => {
      expect(layout).toContain('rel="canonical"');
    });
  });

  describe('Open Graph meta tags', () => {
    it('includes og:title', () => {
      expect(layout).toContain('property="og:title"');
    });

    it('includes og:description', () => {
      expect(layout).toContain('property="og:description"');
    });

    it('includes og:image', () => {
      expect(layout).toContain('property="og:image"');
    });

    it('includes og:type', () => {
      expect(layout).toContain('property="og:type"');
    });

    it('includes og:url', () => {
      expect(layout).toContain('property="og:url"');
    });

    it('includes og:locale for French content', () => {
      expect(layout).toContain('property="og:locale"');
      expect(layout).toContain('content="fr_FR"');
    });
  });

  describe('JSON-LD Schema.org', () => {
    it('includes type application/ld+json', () => {
      expect(layout).toContain('application/ld+json');
    });

    it('includes LocalBusiness and TravelAgency types', () => {
      expect(layout).toContain('LocalBusiness');
      expect(layout).toContain('TravelAgency');
    });
  });

  describe('body structure', () => {
    it('has html lang="fr"', () => {
      expect(layout).toContain('lang="fr"');
    });

    it('has body with base Tailwind classes', () => {
      expect(layout).toContain('bg-creme');
      expect(layout).toContain('text-warm-black');
      expect(layout).toContain('font-sans');
    });

    it('includes a slot for page content', () => {
      expect(layout).toContain('<slot />');
    });
  });

  describe('imports', () => {
    it('imports global.css', () => {
      expect(layout).toContain('global.css');
    });

    it('imports Footer component', () => {
      expect(layout).toContain(
        "import Footer from '../components/Footer.astro'"
      );
    });
  });

  describe('IntersectionObserver fallback script', () => {
    it('includes inline script with is:inline directive', () => {
      expect(layout).toContain('script is:inline');
    });

    it('uses IntersectionObserver for data-reveal elements', () => {
      expect(layout).toContain('IntersectionObserver');
      expect(layout).toContain('[data-reveal]');
    });

    it('adds revealed class on intersection', () => {
      expect(layout).toContain("classList.add('revealed')");
    });

    it('unobserves after revealing', () => {
      expect(layout).toContain('observer.unobserve');
    });

    it('provides fallback when IntersectionObserver unavailable', () => {
      expect(layout).toContain("'IntersectionObserver' in window");
    });

    it('exposes observer on window for GSAP coordination', () => {
      expect(layout).toContain('__revealObserver');
    });
  });

  describe('noscript fallbacks', () => {
    it('ensures [data-reveal] elements are visible without JavaScript', () => {
      expect(layout).toContain('opacity: 1 !important');
    });
  });

  describe('footer integration', () => {
    it('includes Footer component in body', () => {
      expect(layout).toContain('<Footer />');
    });

    it('places Footer after slot', () => {
      const slotIndex = layout.indexOf('<slot />');
      const footerIndex = layout.indexOf('<Footer />');
      expect(footerIndex).toBeGreaterThan(slotIndex);
    });
  });
});
