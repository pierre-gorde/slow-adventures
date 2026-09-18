import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...astroPlugin.configs.recommended,
  {
    ignores: ['dist/', '.astro/', '.netlify/', 'node_modules/'],
  },
  {
    files: ['*.config.mjs', '*.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['scripts/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: {
        ImageMetadata: 'readonly',
      },
    },
  },
  {
    // Les snippets Clarity et gtag.js exigent l'objet `arguments` : gtag.js
    // ignore les commandes poussées sous forme de tableau.
    files: [
      'src/components/AnalyticsScripts.astro',
      'src/components/AnalyticsScripts.astro/**',
    ],
    rules: {
      'prefer-rest-params': 'off',
    },
  }
);
