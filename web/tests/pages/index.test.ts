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

  describe('ElenaSection integration', () => {
    it('imports ElenaSection component', () => {
      expect(page).toContain(
        "import ElenaSection from '../components/ElenaSection.astro'"
      );
    });

    it('renders ElenaSection after HeroSection', () => {
      expect(page).toContain('<ElenaSection');
    });

    it('imports elena photo from assets', () => {
      expect(page).toContain("from '../assets/images/elena.webp'");
    });

    it('passes imageSrc prop', () => {
      expect(page).toContain('imageSrc={elenaPhoto}');
    });

    it('passes imageAlt prop with descriptive text', () => {
      expect(page).toContain('imageAlt=');
    });

    it('passes title and description props', () => {
      expect(page).toContain('title="Rencontrez Elena"');
    });

    it('passes ctaHref prop', () => {
      expect(page).toContain('ctaHref=');
    });
  });

  describe('Processus section integration', () => {
    it('imports SectionReveal component', () => {
      expect(page).toContain(
        "import SectionReveal from '../components/SectionReveal.astro'"
      );
    });

    it('imports ProcessStep component', () => {
      expect(page).toContain(
        "import ProcessStep from '../components/ProcessStep.astro'"
      );
    });

    it('imports processSteps data', () => {
      expect(page).toContain("from '../data/processSteps'");
    });

    it('has a section with bg-creme background', () => {
      expect(page).toContain('bg-creme');
    });

    it('uses sa-section-padding', () => {
      expect(page).toContain('sa-section-padding');
    });

    it('has h2 title "Du rêve à la réalité"', () => {
      expect(page).toContain('Du rêve à la réalité');
    });

    it('uses SectionReveal with stagger animation', () => {
      expect(page).toContain('animation="stagger"');
    });

    it('uses an ordered list for process steps', () => {
      expect(page).toMatch(/<ol[\s>]/);
    });

    it('iterates processSteps with .map()', () => {
      expect(page).toContain('processSteps.map(');
    });

    it('renders ProcessStep component', () => {
      expect(page).toContain('<ProcessStep');
    });
  });
});
