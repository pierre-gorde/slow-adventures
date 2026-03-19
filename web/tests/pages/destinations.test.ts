import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const slugPagePath = resolve(
  __dirname,
  '../../src/pages/destinations/[slug].astro'
);

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

    it('mappe les entrées vers des params { slug: entry.slug }', () => {
      expect(page).toContain('params: { slug: entry.slug }');
    });

    it('les 4 slugs de destination existent dans le dossier content', () => {
      const destDir = resolve(__dirname, '../../src/content/destinations');
      const files = readdirSync(destDir).filter((f) => f.endsWith('.md'));
      const slugs = files.map((f) => f.replace('.md', ''));
      expect(slugs).toContain('costa-rica-pura-vida');
      expect(slugs).toContain('perou-sacre');
      expect(slugs).toContain('patagonie-sauvage');
      expect(slugs).toContain('west-coast-usa');
      expect(files).toHaveLength(4);
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

    it('utilise getImage() pour optimiser l\'image hero', () => {
      expect(page).toContain('getImage(');
      expect(page).toContain('optimizedHero');
    });

    it('passe heroPreloadImage avec URL optimisée à BaseLayout', () => {
      expect(page).toContain('heroPreloadImage={optimizedHero.src}');
    });

    it('passe ogImage destination-specific à BaseLayout', () => {
      expect(page).toContain('ogImage={optimizedHero.src}');
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

    it('contient un offers utilisant PUBLIC_CALENDLY_URL pour le Discovery Call', () => {
      expect(page).toContain('PUBLIC_CALENDLY_URL');
      expect(page).toContain('https://slowadventures.fr');
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

    it('contient un CTAButton "Réserver un Discovery Call"', () => {
      expect(page).toContain('<CTAButton');
      expect(page).toContain('Réserver un Discovery Call');
    });

    it('contient un lien retour vers /#destinations avec aria-label', () => {
      expect(page).toContain('href="/#destinations"');
      expect(page).toContain('Toutes les destinations');
      expect(page).toContain('aria-label=');
    });

    it('contient un main id="main" pour l\'accessibilité', () => {
      expect(page).toContain('<main id="main">');
    });
  });
});
