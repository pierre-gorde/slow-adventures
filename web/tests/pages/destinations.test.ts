import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const slugPagePath = resolve(
  __dirname,
  '../../src/pages/destinations/[slug].astro'
);

const ORIGINAL_SLUGS = [
  'costa-rica-pura-vida',
  'perou-sacre',
  'patagonie-sauvage',
  'west-coast-usa',
];

const KEBAB_CASE_MD = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;

describe('[slug].astro — page dynamique destinations', () => {
  it('le fichier [slug].astro existe', () => {
    expect(existsSync(slugPagePath)).toBe(true);
  });

  const page = readFileSync(slugPagePath, 'utf-8');

  describe('getStaticPaths', () => {
    it('définit une fonction getStaticPaths exportée', () => {
      expect(page).toContain('export async function getStaticPaths()');
    });

    it('utilise getCollection("destinations")', () => {
      expect(page).toContain("getCollection('destinations')");
    });

    it('exclut les destinations en draft', () => {
      expect(page).toContain('!d.data.draft');
    });

    it('mappe les entrées vers des params { slug: entry.slug }', () => {
      expect(page).toContain('params: { slug: entry.slug }');
    });

    it('le dossier content ne contient que des fichiers markdown en kebab-case', () => {
      const destDir = resolve(__dirname, '../../src/content/destinations');
      const files = readdirSync(destDir).filter((f) => f.endsWith('.md'));
      expect(files.length).toBeGreaterThan(0);
      files.forEach((f) => expect(f).toMatch(KEBAB_CASE_MD));
    });

    it("les slugs des destinations d'origine existent toujours", () => {
      const destDir = resolve(__dirname, '../../src/content/destinations');
      const slugs = readdirSync(destDir).map((f) => f.replace('.md', ''));
      ORIGINAL_SLUGS.forEach((slug) => expect(slugs).toContain(slug));
    });
  });

  describe('imports', () => {
    it('importe getCollection depuis astro:content', () => {
      expect(page).toContain("import { getCollection } from 'astro:content'");
    });

    it('importe CollectionEntry depuis astro:content', () => {
      expect(page).toContain(
        "import type { CollectionEntry } from 'astro:content'"
      );
    });

    it('importe Image et getImage depuis astro:assets', () => {
      expect(page).toContain("import { Image, getImage } from 'astro:assets'");
    });

    it('importe BaseLayout', () => {
      expect(page).toContain(
        "import BaseLayout from '../../layouts/BaseLayout.astro'"
      );
    });

    it('importe CTAButton', () => {
      expect(page).toContain(
        "import CTAButton from '../../components/CTAButton.astro'"
      );
    });
  });

  describe('frontmatter et métadonnées', () => {
    it('utilise entry.data.title avec fallback sur country', () => {
      expect(page).toContain('entry.data.title');
      expect(page).toContain('entry.data.country');
    });

    it('utilise entry.data.metaDescription avec fallback sur description', () => {
      expect(page).toContain('entry.data.metaDescription');
      expect(page).toContain('entry.data.description');
    });

    it('passe title à BaseLayout', () => {
      expect(page).toContain('title={pageTitle}');
    });

    it('passe description à BaseLayout', () => {
      expect(page).toContain('description={pageDescription}');
    });

    it("utilise getImage() pour optimiser l'image hero locale", () => {
      expect(page).toContain('getImage(');
      expect(page).toContain('optimizedHero');
    });

    it("dérive heroSrc de optimizedHero ou de l'URL distante", () => {
      expect(page).toContain('optimizedHero?.src');
      expect(page).toContain('const heroSrc = isUrlImage');
    });

    it('passe heroPreloadImage={heroSrc} à BaseLayout', () => {
      expect(page).toContain('heroPreloadImage={heroSrc}');
    });

    it('passe ogImage destination-specific à BaseLayout', () => {
      expect(page).toContain('ogImage={heroSrc}');
    });
  });

  describe('schema JSON-LD TouristDestination', () => {
    it('déclare un objet touristDestinationLd', () => {
      expect(page).toContain('touristDestinationLd');
    });

    it('type @type est TouristDestination', () => {
      expect(page).toContain("'@type': 'TouristDestination'");
    });

    it('@context pointe vers schema.org', () => {
      expect(page).toContain("'@context': 'https://schema.org'");
    });

    it('contient un champ name (pays)', () => {
      expect(page).toContain('name: entry.data.country');
    });

    it('contient un champ description', () => {
      expect(page).toContain('description: pageDescription');
    });

    it('contient un touristType Audience', () => {
      expect(page).toContain("'@type': 'Audience'");
    });

    it('contient un offers utilisant le lien Calendly partagé', () => {
      expect(page).toContain('url: CALENDLY_URL');
    });

    it('passe extraLd={touristDestinationLd} à BaseLayout', () => {
      expect(page).toContain('extraLd={touristDestinationLd}');
    });
  });

  describe('contenu de la page', () => {
    it('parse le markdown en sections via marked', () => {
      expect(page).toContain("import { marked } from 'marked'");
      expect(page).toContain('entry.body');
    });

    it("utilise <Image> avec loading='eager' pour le hero", () => {
      expect(page).toContain('<Image');
      expect(page).toContain('loading="eager"');
    });

    it('contient un h1 avec le nom du pays', () => {
      expect(page).toContain('{entry.data.country}');
    });

    it('contient les sections de contenu avec destination-content', () => {
      expect(page).toContain('destination-content');
      expect(page).toContain('dest-section__header');
    });

    it('contient un CTAButton "Découvre les circuits"', () => {
      expect(page).toContain('<CTAButton');
      expect(page).toContain('Découvre les circuits');
    });

    it('contient un lien retour vers les circuits avec aria-label', () => {
      expect(page).toContain('href={CIRCUITS_URL}');
      expect(page).toContain('Tous les circuits');
      expect(page).toContain('aria-label="Voir tous les circuits"');
    });

    it('contient un main id="main" pour l\'accessibilité', () => {
      expect(page).toContain('<main id="main">');
    });
  });
});
