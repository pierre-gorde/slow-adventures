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
