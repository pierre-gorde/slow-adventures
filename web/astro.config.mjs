// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: process.env.SITE_URL || 'https://slowadventures.fr',
  integrations: [sitemap(), robotsTxt()],
  vite: { plugins: [tailwindcss()] },
});
