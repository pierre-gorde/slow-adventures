// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: process.env.SITE_URL || 'https://slowadventures.fr',
  adapter: netlify(),
  // L'ancienne page « Destinations » devient « Circuits ».
  // Les pages /destinations/<pays>/ restent en ligne pour le référencement.
  redirects: {
    '/destinations': '/circuits/',
    // Circuits masqués (`masque: true` dans src/data/circuits.ts) :
    // leur ancienne adresse renvoie vers la liste. Retirer la ligne si on
    // réaffiche le circuit (vérifié par tests/pages/circuits.test.ts).
    '/circuits/rocheuses-canadiennes': '/circuits/',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/decouvrir') && !page.includes('/projet'),
    }),
    robotsTxt(),
  ],
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  vite: { plugins: [tailwindcss()] },
});
