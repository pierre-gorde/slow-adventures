# Story 1.1: Initialisation projet & pipeline de déploiement

Status: done

## Story

As a développeur,
I want initialiser le projet Astro dans `web/` avec toutes les dépendances, configs et le pipeline de déploiement,
So that le projet build, lint et se déploie automatiquement sur Netlify à chaque push sur main.

## Acceptance Criteria

1. **Given** le dossier `web/` n'existe pas encore **When** le projet est initialisé avec `create astro` minimal + TypeScript strict **Then** le dossier `web/` contient un projet Astro 5 fonctionnel avec TypeScript strict **And** les dépendances sont installées : `tailwindcss`, `@tailwindcss/vite`, `gsap`, `@astrojs/sitemap`, `astro-robots-txt` **And** les devDependencies sont installées : `vitest`, `@testing-library/dom`, `typescript`, `eslint`, `prettier` avec plugins Astro

2. **Given** le projet est initialisé **When** on exécute `npm run build` dans `web/` **Then** le build se complète sans erreur en moins de 2 minutes (NFR19) **And** le dossier `web/dist/` est généré

3. **Given** le projet est initialisé **When** on exécute `npm run lint` dans `web/` **Then** ESLint (`@typescript-eslint` + plugin Astro) et Prettier (+ plugin Astro) passent sans erreur ni warning (NFR18)

4. **Given** le build est réussi **When** un push est fait sur la branche `main` **Then** GitHub Actions exécute le workflow `deploy.yml` qui build et déploie sur Netlify via `netlify-cli` **And** le site est accessible en HTTPS sur le domaine Netlify (NFR10)

5. **Given** le projet est initialisé **When** on inspecte la structure `web/src/` **Then** les dossiers suivants existent : `components/`, `content/destinations/`, `data/`, `layouts/`, `lib/`, `pages/`, `styles/`, `types/` **And** `web/.env.example` documente les variables : `PUBLIC_BREVO_API_KEY`, `PUBLIC_CALENDLY_URL`, `PUBLIC_GA4_MEASUREMENT_ID`, `SITE_URL` **And** `web/netlify.toml` contient les headers de sécurité (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) et les headers cache **And** `web/vitest.config.ts` est configuré pour inclure `src/**/*.test.ts` **And** `web/astro.config.mjs` configure sitemap, robots-txt et le plugin Vite Tailwind

## Tasks / Subtasks

- [x] Task 1: Scaffolding projet Astro (AC: #1)
  - [x] 1.1 Exécuter `npm create astro@latest` avec template minimal + TypeScript strict dans `web/`
  - [x] 1.2 Installer les dépendances production : `tailwindcss@^4`, `@tailwindcss/vite@^4`, `gsap@^3`, `@astrojs/sitemap`, `astro-robots-txt`
  - [x] 1.3 Installer les devDependencies : `vitest@^3`, `@testing-library/dom`, `eslint@^9`, `prettier`, `eslint-plugin-astro`, `prettier-plugin-astro`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `typescript-eslint`
  - [x] 1.4 Vérifier que le `package.json` contient tous les scripts : `dev`, `build`, `preview`, `lint`, `format`, `test`
- [x] Task 2: Structure des répertoires (AC: #5)
  - [x] 2.1 Créer `src/components/` (vide)
  - [x] 2.2 Créer `src/content/destinations/` (vide)
  - [x] 2.3 Créer `src/data/` (vide)
  - [x] 2.4 Créer `src/layouts/` (vide)
  - [x] 2.5 Créer `src/lib/` (vide)
  - [x] 2.6 Créer `src/pages/` (existe déjà via scaffolding)
  - [x] 2.7 Créer `src/styles/` (vide)
  - [x] 2.8 Créer `src/types/` (vide)
  - [x] 2.9 Créer `src/assets/images/` et `src/assets/images/destinations/` (vide)
  - [x] 2.10 Créer `public/videos/` (vide, pour le hero.mp4 futur)
  - [x] 2.11 Ajouter un `.gitkeep` dans chaque dossier vide pour le tracking Git
- [x] Task 3: Configuration Tailwind v4 CSS-based (AC: #1, #5)
  - [x] 3.1 Créer `src/styles/global.css` avec `@import "tailwindcss"` et bloc `@theme` vide (placeholder pour tokens Story 1.2)
  - [x] 3.2 Configurer `@tailwindcss/vite` dans `astro.config.mjs` via `vite.plugins`
  - [x] 3.3 Importer `global.css` dans le layout de base (ou directement dans `pages/index.astro` temporairement)
- [x] Task 4: Configuration Astro (AC: #5)
  - [x] 4.1 Configurer `astro.config.mjs` : `site` (depuis `SITE_URL`), intégrations `sitemap()` + `robotsTxt()`, plugin Vite Tailwind
  - [x] 4.2 Configurer `tsconfig.json` : TypeScript strict mode, paths aliases si nécessaire
  - [x] 4.3 Créer `src/env.d.ts` pour le typage `import.meta.env.PUBLIC_*`
- [x] Task 5: Configuration ESLint + Prettier (AC: #3)
  - [x] 5.1 Créer `eslint.config.mjs` (flat config ESLint 9+) avec `@typescript-eslint` + `eslint-plugin-astro`
  - [x] 5.2 Créer `.prettierrc` avec config par défaut + `prettier-plugin-astro`
  - [x] 5.3 Créer `.prettierignore` (dist, node_modules, .astro)
  - [x] 5.4 Ajouter scripts `lint` et `format` dans `package.json`
  - [x] 5.5 Vérifier que `npm run lint` passe sans erreur
- [x] Task 6: Configuration Vitest (AC: #5)
  - [x] 6.1 Créer `vitest.config.ts` avec `include: ['src/**/*.test.ts']`
  - [x] 6.2 Ajouter script `test` dans `package.json`
  - [x] 6.3 Créer un test placeholder `src/lib/placeholder.test.ts` qui passe (vérification setup)
- [x] Task 7: Variables d'environnement (AC: #5)
  - [x] 7.1 Créer `.env.example` documentant : `PUBLIC_BREVO_API_KEY`, `PUBLIC_CALENDLY_URL`, `PUBLIC_GA4_MEASUREMENT_ID`, `SITE_URL`
  - [x] 7.2 Créer `.env` local avec des valeurs placeholder
  - [x] 7.3 Vérifier que `.env` est dans `.gitignore`
- [x] Task 8: Configuration Netlify (AC: #4, #5)
  - [x] 8.1 Créer `netlify.toml` avec headers de sécurité (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  - [x] 8.2 Ajouter headers cache : `immutable` pour `/assets/*`, `must-revalidate` pour `/*.html`
  - [x] 8.3 Configurer `[build]` section (command + publish)
- [x] Task 9: Pipeline GitHub Actions (AC: #4)
  - [x] 9.1 Créer `.github/workflows/deploy.yml` avec trigger `push: branches: [main]`
  - [x] 9.2 Configurer les steps : checkout, setup-node (v20, cache npm), `npm ci`, `npm run build`, `npx netlify-cli deploy --prod --dir=dist`
  - [x] 9.3 Référencer les secrets : `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
  - [x] 9.4 Documenter les secrets GitHub requis dans un commentaire ou dans le `.env.example`
- [x] Task 10: Validation build + lint (AC: #2, #3)
  - [x] 10.1 Exécuter `npm run build` — vérifier succès et génération de `dist/`
  - [x] 10.2 Exécuter `npm run lint` — vérifier 0 erreurs et 0 warnings
  - [x] 10.3 Exécuter `npm run test` — vérifier que le test placeholder passe

## Dev Notes

### Contexte Architecture Critique

**Structure monorepo :** Le projet slow-adventures est un monorepo avec `api/` et `web/`. Cette story initialise le dossier `web/`. Tous les fichiers sont relatifs à `web/`.

**Commande d'initialisation exacte :**
```bash
cd web/
npm create astro@latest . -- --template minimal --typescript strict
```
Note : le `.` indique de scaffolder dans le répertoire courant `web/` (déjà existant mais vide).

**Astro 5 stable — PAS Astro 6 beta.** Astro 6 (janvier 2026) requiert Node 22+, breaking changes Zod 4. Le scope SSG ne nécessite aucune feature v6. Utiliser `astro@^5` explicitement.

### Versions des Dépendances (Vérifiées février 2026)

| Package | Version cible | Dernière disponible | Contrainte |
|---------|--------------|--------------------| ---------- |
| `astro` | `^5.15` | 5.17.1 | Rester sur v5 stable |
| `tailwindcss` | `^4.1` | 4.1.18 | Config CSS-based `@theme` |
| `@tailwindcss/vite` | `^4.1` | 4.1.18 | Remplace `@astrojs/tailwind` (deprecated) |
| `gsap` | `^3.14` | 3.14.2 | ScrollTrigger inclus |
| `@astrojs/sitemap` | `^3` | 3.7.0 | Intégration Astro |
| `astro-robots-txt` | `^1` | 1.0.0 | Génération robots.txt |
| `vitest` | `^3` | 3.2.4 | **NE PAS installer v4** (breaking changes, arch spec v3) |
| `@testing-library/dom` | latest | 10.4.1 | Tests DOM islands |
| `typescript` | `^5.9` | 5.9.3 | Strict mode obligatoire |
| `eslint` | `^9` | 9.39.2 | **NE PAS installer v10** (flat config stable en v9) |
| `prettier` | `^3` | 3.8.1 | + plugin Astro |
| `eslint-plugin-astro` | `^1` | 1.5.0 | Lint composants .astro |
| `prettier-plugin-astro` | latest | 0.14.1 | Format composants .astro |
| `@typescript-eslint/eslint-plugin` | `^8` | 8.55.0 | Lint TypeScript |
| `@typescript-eslint/parser` | `^8` | 8.55.0 | Parser TypeScript |

### Alertes Techniques Critiques

1. **`@astrojs/tailwind` est DEPRECATED.** Utiliser `@tailwindcss/vite` comme plugin Vite dans `astro.config.mjs`. NE PAS installer `@astrojs/tailwind`.

2. **ESLint 9+ utilise la flat config (`eslint.config.mjs`)**, pas `.eslintrc.cjs`. Le document d'architecture mentionne `.eslintrc.cjs` mais c'est obsolète. Créer `eslint.config.mjs` avec `typescript-eslint` et `eslint-plugin-astro`.

3. **Tailwind v4 — config CSS-based.** Plus de `tailwind.config.mjs`. Les tokens se définissent dans `@theme` dans `global.css`. Les tokens seront ajoutés en Story 1.2, mais le fichier doit être structuré correctement dès maintenant.

4. **`astro.config.mjs` — `site` doit être une string, pas `import.meta.env.SITE_URL`.** Astro ne résout pas les env vars dans le config. Utiliser une valeur par défaut ou `process.env.SITE_URL` (disponible au build-time). [Source: docs/planning-artifacts/architecture.md#Astro Config Reference]

5. **Node.js 20 obligatoire** dans GitHub Actions (Astro 5 requiert Node 18+, mais l'architecture spécifie Node 20).

### Configuration ESLint Flat Config (Pattern)

```javascript
// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...astroPlugin.configs.recommended,
  {
    ignores: ['dist/', '.astro/', 'node_modules/']
  }
);
```

### Configuration `astro.config.mjs` (Pattern)

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: process.env.SITE_URL || 'https://slow-adventures.com',
  integrations: [sitemap(), robotsTxt()],
  vite: { plugins: [tailwindcss()] },
});
```

### Configuration `netlify.toml` (Pattern)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

**CSP header** (ajouté séparément pour lisibilité) :
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; frame-src https://calendly.com; connect-src https://api.brevo.com https://www.google-analytics.com; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com
```
Note : `'unsafe-inline'` est nécessaire pour les scripts Astro (islands hydration) et les styles inline Tailwind. Ajuster si Astro supporte les nonces dans le futur.

### Configuration GitHub Actions (Pattern)

```yaml
name: Deploy
on:
  push:
    branches: [main]
    paths:
      - 'web/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: web
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: web/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npx netlify-cli deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```
Note : `paths: ['web/**']` évite de trigger le deploy quand seul le code `api/` change. `working-directory: web` car c'est un monorepo.

### Configuration `vitest.config.ts` (Pattern)

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
  },
});
```

### Fichier `.env.example` (Pattern)

```
# Brevo — Clé API publique (permissions restreintes : inscription newsletter uniquement)
PUBLIC_BREVO_API_KEY=xkeysib-XXXXXXXX

# Calendly — URL publique de la page de booking
PUBLIC_CALENDLY_URL=https://calendly.com/slow-adventures/discovery-call

# Google Analytics 4 — Measurement ID
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# URL du site (pour sitemap, canonical, OG)
SITE_URL=https://slow-adventures.com
```

### Project Structure Notes

La structure cible pour cette story (tous les chemins relatifs à `web/`) :

```
web/
├── .github/workflows/deploy.yml
├── .env.example
├── .env (gitignored)
├── .gitignore
├── .prettierrc
├── .prettierignore
├── astro.config.mjs
├── eslint.config.mjs
├── netlify.toml
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── public/
│   └── videos/            (.gitkeep)
├── src/
│   ├── assets/images/
│   │   └── destinations/  (.gitkeep)
│   ├── components/        (.gitkeep)
│   ├── content/
│   │   └── destinations/  (.gitkeep)
│   ├── data/              (.gitkeep)
│   ├── env.d.ts
│   ├── layouts/           (.gitkeep)
│   ├── lib/
│   │   └── placeholder.test.ts  (test de vérification setup)
│   ├── pages/
│   │   └── index.astro    (page squelette)
│   ├── styles/
│   │   └── global.css     (import Tailwind + @theme placeholder)
│   └── types/             (.gitkeep)
```

Alignement vérifié avec l'arborescence complète définie dans l'architecture. [Source: docs/planning-artifacts/architecture.md#Arborescence Complète du Projet]

### Conflits et Variances Détectés

1. **ESLint config format** — L'architecture mentionne `.eslintrc.cjs` mais ESLint 9+ utilise la flat config `eslint.config.mjs`. **Variance acceptée** : utiliser le format moderne (flat config). La fonctionnalité est identique.

2. **`astro.config.mjs` `site` property** — L'architecture utilise `import.meta.env.SITE_URL` mais Astro config ne résout pas les env vars Vite. **Correction** : utiliser `process.env.SITE_URL` (disponible au build-time Node.js).

3. **CSP header** — L'architecture ne mentionne pas `'unsafe-inline'` pour script-src mais Astro islands nécessitent des scripts inline pour l'hydration. **Ajout nécessaire** : `'unsafe-inline'` dans script-src et style-src.

4. **GitHub Actions `paths` filter** — Non mentionné dans l'architecture mais nécessaire car monorepo. **Ajout** : `paths: ['web/**']` pour éviter les déploiements inutiles.

5. **GitHub Actions `working-directory`** — Non mentionné dans l'architecture mais nécessaire car monorepo. **Ajout** : `defaults.run.working-directory: web`.

### References

- [Source: docs/planning-artifacts/architecture.md#Starter Template Evaluation] — Commande d'initialisation, décisions de versions
- [Source: docs/planning-artifacts/architecture.md#Dependencies] — Versions des dépendances
- [Source: docs/planning-artifacts/architecture.md#Infrastructure & Déploiement] — GitHub Actions et Netlify config
- [Source: docs/planning-artifacts/architecture.md#Standards de Développement] — ESLint, Prettier, Vitest
- [Source: docs/planning-artifacts/architecture.md#Tailwind v4 Token Translation] — Config CSS-based global.css
- [Source: docs/planning-artifacts/architecture.md#Astro Config Reference] — astro.config.mjs
- [Source: docs/planning-artifacts/architecture.md#Project Structure] — Arborescence complète
- [Source: docs/planning-artifacts/architecture.md#Sécurité & Conformité RGPD] — Headers netlify.toml
- [Source: docs/planning-artifacts/epics.md#Story 1.1] — Acceptance criteria complets
- [Source: docs/planning-artifacts/epics.md#Additional Requirements] — Contraintes additionnelles depuis l'architecture et l'UX

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- ESLint `no-undef` error on `process` in `astro.config.mjs` — Fixed by adding `globals.node` for config files in `eslint.config.mjs`
- Prettier formatting issues on `index.astro` and `global.css` after creation — Fixed with `prettier --write`
- `jsdom` not included as transitive dependency of Vitest — Installed explicitly as devDependency

### Completion Notes List

- Astro 5.17.1 scaffolded via `create-astro@4.13.2` with minimal template and TypeScript strict
- All production deps installed: tailwindcss@4.1.18, @tailwindcss/vite@4.1.18, gsap@3.14.2, @astrojs/sitemap@3.7.0, astro-robots-txt@1.0.0
- All devDependencies installed: vitest@3.2.4, @testing-library/dom@10.4.1, eslint@9.39.2, prettier@3.8.1, typescript@5.9.3, etc.
- Tailwind v4 CSS-based config with `@import "tailwindcss"` and empty `@theme` block in `global.css`
- ESLint flat config (`eslint.config.mjs`) with typescript-eslint strict + eslint-plugin-astro + Node.js globals for config files
- Prettier configured with `prettier-plugin-astro`
- Vitest configured with jsdom environment, placeholder test passes
- `.env.example` documents all 4 required env vars, `.env` local created with placeholders
- `netlify.toml` with full security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) + cache headers
- GitHub Actions `deploy.yml` at repo root with `paths: ['web/**']` filter and `working-directory: web` for monorepo support
- All validation passed: `npm run build` (542ms), `npm run lint` (0 errors, 0 warnings), `npm run test` (1/1 pass)
- `.github/workflows/deploy.yml` placed at repo root (not inside `web/`) since GitHub Actions requires it at root

### Change Log

- 2026-02-10: Story 1.1 implementation complete — Full project scaffolding, configuration, and CI/CD pipeline
- 2026-02-10: Code review fixes — 1 High, 5 Medium, 3 Low issues addressed (see Senior Developer Review below)

### File List

**New files (relative to repo root):**
- `web/package.json` — Project manifest with all dependencies and scripts
- `web/package-lock.json` — Lockfile
- `web/astro.config.mjs` — Astro configuration with sitemap, robots-txt, Tailwind Vite plugin
- `web/tsconfig.json` — TypeScript strict config extending Astro preset
- `web/vitest.config.ts` — Vitest configuration with jsdom environment
- `web/eslint.config.mjs` — ESLint 9 flat config with TypeScript + Astro support
- `web/.prettierrc` — Prettier configuration with Astro plugin
- `web/.prettierignore` — Prettier ignore patterns
- `web/.gitignore` — Git ignore (from create-astro, updated with .vscode/)
- `web/.env.example` — Environment variables documentation
- `web/.env` — Local environment file (gitignored)
- `web/netlify.toml` — Netlify config with security headers and cache rules
- `web/README.md` — Project-specific README with links to root docs
- `web/src/pages/index.astro` — Minimal index page (lang="fr"), importing global.css
- `web/src/styles/global.css` — Tailwind v4 CSS entry with @theme placeholder
- `web/src/env.d.ts` — TypeScript env variable declarations
- `web/src/lib/placeholder.test.ts` — Vitest setup verification test
- `web/public/favicon.ico` — Favicon (from create-astro)
- `web/public/favicon.svg` — SVG Favicon (from create-astro)
- `web/src/components/.gitkeep`
- `web/src/content/destinations/.gitkeep`
- `web/src/data/.gitkeep`
- `web/src/layouts/.gitkeep`
- `web/src/lib/.gitkeep`
- `web/src/styles/.gitkeep`
- `web/src/types/.gitkeep`
- `web/src/assets/images/destinations/.gitkeep`
- `web/public/videos/.gitkeep`
- `.github/workflows/deploy.yml` — GitHub Actions CI/CD pipeline (lint + test + build + deploy)
- `README.md` — Updated with monorepo structure and Epic 1 status

## Senior Developer Review (AI)

**Review Date:** 2026-02-10
**Review Outcome:** Approve (after fixes applied)
**Reviewer Model:** Claude Opus 4.6

### Action Items

- [x] [HIGH] `<html lang="en">` → `lang="fr"` — site francophone (index.astro:5)
- [x] [MED] `deploy.yml` missing `npm run test` — tests not run in CI
- [x] [MED] `@eslint/js` and `globals` not in explicit devDependencies
- [x] [MED] `.vscode/` committed to repo — added to .gitignore, removed from tracking
- [x] [MED] Story File List missing 5 scaffolding files (favicon, README, .vscode)
- [x] [MED] `netlify.toml` build section undocumented for monorepo context
- [x] [LOW] Page title "Astro" → "Slow Adventures"
- [x] [LOW] `web/README.md` replaced with project-specific README + interconnected links
- [x] [LOW] CSP `'unsafe-inline'` acknowledged as tech debt (documented in Dev Notes)
