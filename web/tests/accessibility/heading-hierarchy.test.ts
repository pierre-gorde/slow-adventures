import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const layout = readFileSync(
  resolve(__dirname, '../../src/layouts/BaseLayout.astro'),
  'utf-8'
);

const heroSection = readFileSync(
  resolve(__dirname, '../../src/components/HeroSection.astro'),
  'utf-8'
);

const elenaSection = readFileSync(
  resolve(__dirname, '../../src/components/ElenaSection.astro'),
  'utf-8'
);

const destinationBlock = readFileSync(
  resolve(__dirname, '../../src/components/DestinationBlock.astro'),
  'utf-8'
);

const processStep = readFileSync(
  resolve(__dirname, '../../src/components/ProcessStep.astro'),
  'utf-8'
);

const indexPage = readFileSync(
  resolve(__dirname, '../../src/pages/index.astro'),
  'utf-8'
);

describe('Heading hierarchy & semantic HTML (WCAG 1.3.1, 3.1.1)', () => {
  describe('unique h1', () => {
    it('HeroSection contains the only h1 on the page', () => {
      expect(heroSection).toContain('<h1');
    });

    it('index.astro does NOT contain an h1 (h1 is inside HeroSection)', () => {
      expect(indexPage).not.toMatch(/<h1[\s>]/);
    });

    it('ElenaSection does NOT contain an h1', () => {
      expect(elenaSection).not.toMatch(/<h1[\s>]/);
    });

    it('DestinationBlock does NOT contain an h1', () => {
      expect(destinationBlock).not.toMatch(/<h1[\s>]/);
    });
  });

  describe('h2 sections — no level skipping', () => {
    it('ElenaSection uses h2 (not h3 or higher)', () => {
      expect(elenaSection).toMatch(/<h2[\s>]/);
      expect(elenaSection).not.toMatch(/<h3[\s>]/);
    });

    it('DestinationBlock uses h2 for country name', () => {
      expect(destinationBlock).toMatch(/<h2[\s>]/);
    });

    it('index.astro has h2 for "Du rêve à la réalité" (Processus)', () => {
      expect(indexPage).toContain('Du rêve à la réalité');
    });

    it('index.astro has h2 for "Ils ont vécu SlowAdventures" (Témoignages)', () => {
      expect(indexPage).toContain('Ils ont vécu SlowAdventures');
    });

    it('index.astro has h2 for "Ici, on est transparent" (Tarifs)', () => {
      expect(indexPage).toContain('Ici, on est transparent');
    });
  });

  describe('h3 sub-elements', () => {
    it('ProcessStep uses h3 (correct nesting under h2)', () => {
      expect(processStep).toMatch(/<h3[\s>]/);
      expect(processStep).not.toMatch(/<h4[\s>]/);
    });
  });

  describe('lang attribute', () => {
    it('BaseLayout has <html lang="fr">', () => {
      expect(layout).toContain('lang="fr"');
    });
  });

  describe('semantic landmark elements', () => {
    it('BaseLayout has <body> element', () => {
      expect(layout).toMatch(/<body[\s>]/);
    });

    it('index.astro wraps HeroSection in <header>', () => {
      expect(indexPage).toContain('<header>');
      expect(indexPage).toContain('</header>');
    });

    it('index.astro has <main id="main">', () => {
      expect(indexPage).toContain('<main id="main"');
    });

    it('BaseLayout includes <footer> via Footer component', () => {
      expect(layout).toContain('<Footer />');
    });

    it('HeroSection uses <section> element', () => {
      expect(heroSection).toMatch(/<section[\s>]/);
    });

    it('ElenaSection uses <section> element', () => {
      expect(elenaSection).toMatch(/<section[\s>]/);
    });

    it('DestinationBlock uses <section> element', () => {
      expect(destinationBlock).toMatch(/<section[\s>]/);
    });
  });
});
