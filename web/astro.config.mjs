// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: process.env.SITE_URL || 'https://slowadventures.fr',
  adapter: netlify(),
  integrations: [sitemap(), robotsTxt()],
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  vite: { plugins: [tailwindcss()] },
});
