import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(__dirname, '../dist');

describe('build output validation', () => {
  beforeAll(() => {
    execSync('npm run build', {
      cwd: resolve(__dirname, '..'),
      stdio: 'pipe',
    });
  }, 30_000);

  describe('index.html rendered output', () => {
    let html: string;

    beforeAll(() => {
      html = readFileSync(resolve(distDir, 'index.html'), 'utf-8');
    });

    it('renders valid HTML with lang="fr"', () => {
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('lang="fr"');
    });

    it('renders dynamic title', () => {
      expect(html).toContain(
        '<title>Slow Adventures — Voyages immersifs aux Amériques</title>'
      );
    });

    it('renders meta description', () => {
      expect(html).toContain(
        'content="Création de voyages immersifs et sur-mesure aux Amériques. Discovery call gratuite de 20 minutes."'
      );
    });

    it('renders Open Graph meta tags with absolute URLs', () => {
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:description"');
      expect(html).toContain(
        'content="https://slowadventures.fr/og-image.jpg"'
      );
      expect(html).toContain('property="og:type"');
      expect(html).toContain('property="og:url"');
    });

    it('renders og:locale for French content', () => {
      expect(html).toContain('property="og:locale"');
      expect(html).toContain('content="fr_FR"');
    });

    it('renders canonical URL', () => {
      expect(html).toContain('rel="canonical"');
    });

    it('renders JSON-LD Schema.org with correct types', () => {
      expect(html).toContain('application/ld+json');
      expect(html).toContain('LocalBusiness');
      expect(html).toContain('TravelAgency');
      expect(html).toContain('https://slowadventures.fr/');
    });

    it('renders Google Fonts links', () => {
      expect(html).toContain('fonts.googleapis.com');
      expect(html).toContain('fonts.gstatic.com');
      expect(html).toContain('Lora');
      expect(html).toContain('Plus+Jakarta+Sans');
    });

    it('renders body with Tailwind base classes', () => {
      expect(html).toContain('bg-creme');
      expect(html).toContain('text-warm-black');
      expect(html).toContain('font-sans');
    });

    it('renders main element', () => {
      expect(html).toContain('<main id="main">');
    });
  });

  describe('SEO files', () => {
    it('generates sitemap-index.xml', () => {
      expect(existsSync(resolve(distDir, 'sitemap-index.xml'))).toBe(true);
      const sitemap = readFileSync(
        resolve(distDir, 'sitemap-index.xml'),
        'utf-8'
      );
      expect(sitemap).toContain('https://slowadventures.fr');
    });

    it('generates robots.txt with sitemap reference', () => {
      expect(existsSync(resolve(distDir, 'robots.txt'))).toBe(true);
      const robots = readFileSync(resolve(distDir, 'robots.txt'), 'utf-8');
      expect(robots).toContain('Sitemap:');
      expect(robots).toContain('sitemap-index.xml');
    });
  });
});
