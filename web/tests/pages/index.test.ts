import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const page = readFileSync(
  resolve(__dirname, '../../src/pages/index.astro'),
  'utf-8'
);

describe('index.astro', () => {
  it('imports BaseLayout', () => {
    expect(page).toContain('BaseLayout');
  });

  it('uses BaseLayout with title prop', () => {
    expect(page).toContain('Slow Adventures');
  });

  it('uses BaseLayout with description prop', () => {
    expect(page).toContain('Création de voyages immersifs');
  });

  it('contains a main element with id', () => {
    expect(page).toContain('<main id="main"');
  });

  it('does NOT import global.css directly', () => {
    expect(page).not.toContain("import '../styles/global.css'");
    expect(page).not.toContain('import "../styles/global.css"');
  });

  describe('HeroSection integration', () => {
    it('imports HeroSection component', () => {
      expect(page).toContain(
        "import HeroSection from '../components/HeroSection.astro'"
      );
    });

    it('renders HeroSection inside main', () => {
      expect(page).toContain('<HeroSection');
    });

    it('passes poster image as posterSrc', () => {
      expect(page).toContain('posterSrc={heroPoster}');
    });

    it('passes video path', () => {
      expect(page).toContain('videoSrc="/videos/hero.mp4"');
    });

    it('passes title "Slow Adventures"', () => {
      expect(page).toContain('title="Slow Adventures"');
    });

    it('passes subtitle', () => {
      expect(page).toContain('subtitle="Voyages immersifs aux Amériques"');
    });

    it('imports hero poster from assets', () => {
      expect(page).toContain("from '../assets/images/hero-poster.webp'");
    });

    it('uses getImage for poster preload optimization', () => {
      expect(page).toContain("import { getImage } from 'astro:assets'");
      expect(page).toContain('getImage(');
    });

    it('passes heroPreloadImage to BaseLayout', () => {
      expect(page).toContain('heroPreloadImage={optimizedPoster.src}');
    });

    it('has h1 only inside HeroSection (unique on page)', () => {
      expect(page).not.toMatch(/<h1/);
    });
  });
});
