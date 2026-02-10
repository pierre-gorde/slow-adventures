# Story 1.2: Design tokens, BaseLayout & SEO

Status: done

## Story

As a visiteur,
I want que le site ait une identité visuelle cohérente et soit découvrable par les moteurs de recherche,
So that je perçoive immédiatement l'univers Slow Adventures et que le site apparaisse dans les résultats de recherche.

## Acceptance Criteria

1. **Given** le projet est initialisé (Story 1.1) **When** on ouvre `web/src/styles/global.css` **Then** le fichier contient `@import "tailwindcss"` et un bloc `@theme` avec tous les tokens de couleur (terracotta, terracotta-light, terracotta-dark, terracotta-muted, bleu, creme, creme-dark, sauge, ambre, warm-black, warm-gray), les familles de polices (serif: Lora, sans: Plus Jakarta Sans), et les border-radius (soft, round, full) **And** les custom properties GSAP sont définies dans `:root` (--gsap-duration-default, --gsap-duration-slow, --gsap-ease-default, --gsap-ease-slow)

2. **Given** le fichier `global.css` est configuré **When** on ouvre `web/src/layouts/BaseLayout.astro` **Then** le composant accepte les props `title`, `description`, `ogImage` **And** le `<head>` contient : meta charset, viewport, title, description, les liens preconnect/preload Google Fonts (Lora 600, Plus Jakarta Sans 400/500/600) avec `font-display: swap` **And** le `<head>` contient les meta Open Graph (og:title, og:description, og:image, og:type, og:url) (FR29) **And** le `<head>` contient un script JSON-LD Schema.org de type LocalBusiness + TravelAgency (FR28) **And** le `<body>` contient un `<slot />` pour le contenu de page

3. **Given** BaseLayout est créé **When** on ouvre `web/src/pages/index.astro` **Then** la page utilise BaseLayout avec un titre et une description appropriés **And** la page contient un `<main>` vide (squelette pour les futures sections)

4. **Given** le site est buildé et déployé **When** un moteur de recherche accède au site **Then** un sitemap XML est généré automatiquement à `/sitemap-index.xml` (FR30) **And** un fichier `robots.txt` est généré automatiquement

5. **Given** le site est déployé **When** on partage le lien du site sur un réseau social **Then** un aperçu riche est affiché avec le titre, la description et l'image OG (FR29)

6. **Given** le projet est initialisé **When** on ouvre `web/src/types/index.ts` **Then** le fichier exporte les types partagés du projet (DestinationData, AnalyticsEvent, etc.)

## Tasks / Subtasks

- [x] Task 1: Peupler les design tokens dans global.css (AC: #1)
  - [x] 1.1 Ajouter tous les tokens de couleur dans le bloc `@theme` : terracotta (#c0603e), terracotta-light (#d4856a), terracotta-dark (#a04e30), terracotta-muted (#c9a08e), bleu (#1696ff), creme (#fff9f3), creme-dark (#f5ede3), sauge (#7B8F6B), ambre (#D4956A), warm-black (#2c2825), warm-gray (#6b5e52)
  - [x] 1.2 Ajouter les familles de polices dans `@theme` : `--font-family-serif: 'Lora', 'Georgia', serif` et `--font-family-sans: 'Plus Jakarta Sans', 'system-ui', sans-serif`
  - [x] 1.3 Ajouter les border-radius dans `@theme` : `--radius-soft: 8px`, `--radius-round: 24px`, `--radius-full: 9999px`
  - [x] 1.4 Ajouter les custom properties GSAP dans `:root` : `--gsap-duration-default: 300ms`, `--gsap-duration-slow: 600ms`, `--gsap-ease-default: ease-out`, `--gsap-ease-slow: ease-in-out`
  - [x] 1.5 Ajouter la classe utilitaire `.sa-section-padding` avec `@apply px-6 py-16 md:px-12 md:py-24 lg:px-24 lg:py-32`
- [x] Task 2: Créer les types partagés dans types/index.ts (AC: #6)
  - [x] 2.1 Exporter le type `DestinationData` avec les champs : country (string), description (string), image (string), overlayColor ('terracotta' | 'sauge'), order (number)
  - [x] 2.2 Exporter le type `AnalyticsEvent` avec les champs : name (string), params (Record<string, string | number>)
  - [x] 2.3 Exporter le type `ProcessStepData` avec les champs : number (number), title (string), description (string), icon? (string)
  - [x] 2.4 Exporter le type `TestimonialData` avec les champs : imageSrc (string), quote (string), name (string), tripContext (string)
  - [x] 2.5 Exporter le type `PricingData` avec les champs : label (string), price (string), description? (string)
- [x] Task 3: Créer BaseLayout.astro (AC: #2)
  - [x] 3.1 Créer `src/layouts/BaseLayout.astro` avec interface Props : `title` (string), `description` (string), `ogImage` (string, optionnel, défaut: '/og-image.jpg')
  - [x] 3.2 Ajouter `<!DOCTYPE html>`, `<html lang="fr">`, meta charset UTF-8, meta viewport `width=device-width`, meta generator Astro
  - [x] 3.3 Ajouter les liens preconnect Google Fonts : `<link rel="preconnect" href="https://fonts.googleapis.com">` et `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
  - [x] 3.4 Ajouter le lien stylesheet Google Fonts : `https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap`
  - [x] 3.5 Ajouter les meta Open Graph : og:title, og:description, og:image (URL absolue avec Astro.site), og:type (website), og:url
  - [x] 3.6 Ajouter le script JSON-LD Schema.org avec `@type: ["LocalBusiness", "TravelAgency"]` — inclure : name, description, url, image, founder (Elena), areaServed (Amériques)
  - [x] 3.7 Ajouter le `<title>` dynamique et la `<meta name="description">`
  - [x] 3.8 Importer `../styles/global.css` dans le frontmatter
  - [x] 3.9 Ajouter `<body class="bg-creme text-warm-black font-sans">` avec `<slot />` pour le contenu
- [x] Task 4: Mettre à jour index.astro pour utiliser BaseLayout (AC: #3)
  - [x] 4.1 Importer et utiliser BaseLayout avec titre "Slow Adventures — Voyages immersifs aux Amériques" et description "Création de voyages immersifs et sur-mesure aux Amériques. Discovery call gratuite de 20 minutes."
  - [x] 4.2 Remplacer le contenu par un `<main id="main">` vide (squelette pour les futures sections)
  - [x] 4.3 Supprimer l'import direct de global.css (maintenant dans BaseLayout)
- [x] Task 5: Vérifier sitemap et robots.txt (AC: #4)
  - [x] 5.1 Exécuter `npm run build` et vérifier que `dist/sitemap-index.xml` est généré
  - [x] 5.2 Vérifier que `dist/robots.txt` est généré
  - [x] 5.3 Vérifier que le sitemap contient l'URL du site correcte
- [x] Task 6: Validation build + lint (AC: #1-6)
  - [x] 6.1 Exécuter `npm run build` — vérifier succès et que `dist/` est généré
  - [x] 6.2 Exécuter `npm run lint` — vérifier 0 erreurs et 0 warnings
  - [x] 6.3 Exécuter `npm run test` — vérifier que tous les tests passent

## Dev Notes

### Contexte Architecture Critique

**Structure monorepo :** Tous les fichiers sont dans `web/`. Chemins relatifs à `web/` sauf mention contraire.

**Dépendance Story 1.1 :** Le projet est déjà scaffoldé. Les fichiers suivants existent déjà et sont à modifier ou compléter :
- `src/styles/global.css` — a déjà `@import "tailwindcss"` et un bloc `@theme` vide (placeholder)
- `src/pages/index.astro` — page squelette avec `<html lang="fr">` et import global.css
- `src/layouts/` — dossier existant (vide, .gitkeep)
- `src/types/` — dossier existant (vide, .gitkeep)
- `astro.config.mjs` — configuré avec sitemap, robots-txt, plugin Tailwind Vite
- `src/env.d.ts` — types `PUBLIC_*` et `SITE_URL` déjà définis

### Versions des Dépendances (Confirmées Story 1.1)

| Package | Version installée | Notes |
|---------|------------------|-------|
| `astro` | 5.17.1 | Rester sur v5 stable |
| `tailwindcss` | 4.1.18 | Config CSS-based `@theme` |
| `@tailwindcss/vite` | 4.1.18 | Plugin Vite dans astro.config.mjs |
| `@astrojs/sitemap` | 3.7.0 | Génère sitemap-index.xml |
| `astro-robots-txt` | 1.0.0 | Génère robots.txt |

### Design Tokens — Valeurs Exactes

**Palette de couleurs complète (Source: UX Spec étape 6) :**

| Token | Hex | Usage |
|-------|-----|-------|
| `terracotta` | #c0603e | Primary — CTA, accents, énergie |
| `terracotta-light` | #d4856a | Hover states |
| `terracotta-dark` | #a04e30 | Active states |
| `terracotta-muted` | #c9a08e | Disabled / muted |
| `bleu` | #1696ff | Secondary — liens, accents froids |
| `creme` | #fff9f3 | Background principal |
| `creme-dark` | #f5ede3 | Sections alternées |
| `sauge` | #7B8F6B | Réassurance, succès |
| `ambre` | #D4956A | Accents luxe, séparateurs |
| `warm-black` | #2c2825 | Texte principal (jamais noir pur) |
| `warm-gray` | #6b5e52 | Texte secondaire |

**Contrastes WCAG AA vérifiés :**
- warm-black/creme : 11.2:1 (Pass)
- warm-black/creme-dark : 9.1:1 (Pass)
- warm-gray/creme : 5.3:1 (Pass)
- terracotta/creme : 4.6:1 (Pass AA large — titres, CTA)
- white/terracotta : 4.6:1 (Pass AA large — texte sur boutons CTA)
- terracotta-dark/creme : 5.8:1 (Pass)

**Typographie (Google Fonts) :**
- Titres : Lora semi-bold 600
- Body : Plus Jakarta Sans regular 400 / medium 500 / semi-bold 600
- `font-display: swap` obligatoire (performance)
- URL Google Fonts : `https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap`

**Border-radius :**
- soft: 8px (boutons, cards)
- round: 24px (chips, tags, CTA)
- full: 9999px (avatars, badges)

**Shadows chaudes (à noter pour les futures stories) :**
- Cards : `0 4px 24px rgba(192, 96, 62, 0.08)`
- CTA hover : `0 8px 32px rgba(192, 96, 62, 0.15)`

### Tailwind v4 @theme — Pattern Exact

Le fichier `global.css` utilise la syntaxe Tailwind v4 CSS-based. Les tokens dans `@theme` deviennent automatiquement des classes Tailwind :
- `--color-terracotta: #c0603e` → `bg-terracotta`, `text-terracotta`, `border-terracotta`
- `--font-family-serif: 'Lora'...` → `font-serif`
- `--radius-soft: 8px` → `rounded-soft`

**IMPORTANT :** Pas de `tailwind.config.mjs` — tout est dans `global.css` via `@theme`. C'est la décision architecturale Tailwind v4.

### BaseLayout — Spécifications Détaillées

**Props :**
```typescript
interface Props {
  title: string;
  description: string;
  ogImage?: string;
}
```

**Structure `<head>` :**
1. Meta charset UTF-8 + viewport
2. `<title>` dynamique
3. `<meta name="description">` dynamique
4. Preconnect Google Fonts (2 liens)
5. Stylesheet Google Fonts (1 lien)
6. Meta Open Graph (5 meta tags)
7. JSON-LD Schema.org (script inline)
8. `<meta name="generator" content={Astro.generator}>`

**Schema.org JSON-LD :**
```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TravelAgency"],
  "name": "Slow Adventures",
  "description": "Création de voyages immersifs aux Amériques",
  "url": "<SITE_URL dynamique>",
  "image": "<SITE_URL>/og-image.jpg",
  "founder": {
    "@type": "Person",
    "name": "Elena"
  },
  "areaServed": {
    "@type": "Place",
    "name": "Amériques"
  }
}
```
Note : Utiliser `Astro.site` pour l'URL du site (résolu à partir de `site` dans `astro.config.mjs`). Ne PAS hardcoder l'URL.

**Open Graph :**
- `og:title` = props.title
- `og:description` = props.description
- `og:image` = URL absolue construite avec `new URL(ogImage, Astro.site)`
- `og:type` = "website"
- `og:url` = `Astro.url`

### Alertes Techniques

1. **`Astro.site` peut être `undefined`** si `site` n'est pas configuré dans `astro.config.mjs`. Dans notre cas, `site` est défini via `process.env.SITE_URL || 'https://slow-adventures.com'` — donc `Astro.site` sera toujours défini au build. Utiliser `new URL(path, Astro.site)` pour construire des URLs absolues.

2. **OG image** : Mettre un placeholder `public/og-image.jpg` si l'image n'existe pas encore. L'image OG sera ajoutée plus tard. Le composant doit accepter un prop optionnel `ogImage` avec défaut `'/og-image.jpg'`.

3. **Ne PAS ajouter de skip-to-content dans BaseLayout** — cela sera fait dans Story 2.6 (accessibilité transversale). BaseLayout reste simple pour cette story.

4. **Ne PAS ajouter de `<header>` ni `<footer>`** dans BaseLayout — le footer sera ajouté en Story 1.3. Le `<slot />` suffit.

5. **Le `<body>` doit avoir les classes Tailwind de base** : `bg-creme text-warm-black font-sans` — cela applique les tokens par défaut à toute la page.

### Learnings from Story 1.1

- `jsdom` doit être installé explicitement pour Vitest (pas une dépendance transitive) — déjà fait en 1.1
- Prettier reformate au premier run — exécuter `prettier --write` après chaque création de fichier
- ESLint flat config : `globals.node` déjà configuré pour les fichiers de config
- `.gitkeep` dans les dossiers vides — supprimer le .gitkeep de `src/layouts/` et `src/types/` quand les vrais fichiers sont créés

### Project Structure Notes

Fichiers à créer/modifier dans cette story :

```
web/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro    ← CRÉER (remplace .gitkeep)
│   ├── pages/
│   │   └── index.astro         ← MODIFIER (utiliser BaseLayout)
│   ├── styles/
│   │   └── global.css          ← MODIFIER (ajouter tokens)
│   └── types/
│       └── index.ts            ← CRÉER (remplace .gitkeep)
```

Alignement vérifié avec l'arborescence définie dans l'architecture. [Source: docs/planning-artifacts/architecture.md#Arborescence Complète du Projet]

### References

- [Source: docs/planning-artifacts/architecture.md#Tailwind v4 Token Translation] — Syntaxe exacte des tokens @theme
- [Source: docs/planning-artifacts/architecture.md#Astro Config Reference] — Config Astro avec sitemap, robots-txt
- [Source: docs/planning-artifacts/architecture.md#Sécurité & Conformité RGPD] — Structure BaseLayout
- [Source: docs/planning-artifacts/architecture.md#Implementation Patterns] — Patterns de code Astro
- [Source: docs/planning-artifacts/ux-design-specification.md#Customization Strategy] — Palette complète, fonts, radius, shadows
- [Source: docs/planning-artifacts/ux-design-specification.md#Color System] — Contrastes WCAG vérifiés
- [Source: docs/planning-artifacts/ux-design-specification.md#Typography System] — Échelle typographique complète
- [Source: docs/planning-artifacts/ux-design-specification.md#BaseLayout.astro] — Spécifications composant BaseLayout
- [Source: docs/planning-artifacts/epics.md#Story 1.2] — Acceptance criteria complets
- [Source: docs/implementation-artifacts/1-1-initialisation-projet-pipeline-de-deploiement.md] — Learnings story précédente

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Prettier a normalisé les hex #7B8F6B → #7b8f6b et #D4956A → #d4956a (lowercase) — tests ajustés
- Tests déplacés de `src/` vers `tests/` car Astro/Vite processait les `.test.ts` dans `src/` au build (erreur vitest internal state)
- Placeholder test de Story 1.1 (`src/lib/placeholder.test.ts`) aussi déplacé vers `tests/`

### Completion Notes List

- ✅ 11 tokens de couleur implémentés dans `@theme` avec classes Tailwind auto-générées (bg-terracotta, text-warm-black, etc.)
- ✅ Familles de polices serif (Lora) et sans (Plus Jakarta Sans) configurées
- ✅ Border-radius soft/round/full définis
- ✅ Variables GSAP dans `:root` pour animations futures
- ✅ Classe utilitaire `.sa-section-padding` avec responsive padding
- ✅ 5 types TypeScript partagés exportés (DestinationData, AnalyticsEvent, ProcessStepData, TestimonialData, PricingData)
- ✅ BaseLayout.astro avec props title/description/ogImage, Google Fonts preconnect, OG meta tags, JSON-LD Schema.org
- ✅ index.astro simplifié pour utiliser BaseLayout avec main vide
- ✅ Sitemap XML et robots.txt générés au build avec URL correcte
- ✅ vitest config mis à jour pour `tests/` directory (hors src/)
- ✅ .gitkeep supprimés de layouts/ et types/
- ✅ 71 tests passent, 0 erreurs lint, build réussi

### Change Log

- 2026-02-10: Implémentation complète Story 1.2 — design tokens, BaseLayout, types partagés, SEO (OG + JSON-LD + sitemap + robots.txt)
- 2026-02-10: Code review fixes — og-image placeholder, canonical URL, og:locale, Google Fonts preload non-blocking, Astro.site gestion cohérente, tests runtime types, test intégration build output

### File List

- web/src/styles/global.css (modifié — design tokens, couleurs, fonts, radius, GSAP vars, section padding)
- web/src/types/index.ts (créé — types DestinationData, AnalyticsEvent, ProcessStepData, TestimonialData, PricingData)
- web/src/layouts/BaseLayout.astro (créé — layout avec head SEO, OG, og:locale, canonical, JSON-LD, Google Fonts preload)
- web/src/pages/index.astro (modifié — utilise BaseLayout, main vide)
- web/src/types/.gitkeep (supprimé)
- web/src/layouts/.gitkeep (supprimé)
- web/vitest.config.ts (modifié — include tests/ au lieu de src/)
- web/src/lib/placeholder.test.ts → web/tests/placeholder.test.ts (déplacé)
- web/public/og-image.jpg (créé — placeholder OG image converti depuis logo)
- web/public/favicon.ico (modifié — copié depuis assets/)
- web/public/favicon.svg (modifié — copié depuis assets/)
- web/tests/styles/global.css.test.ts (créé — 21 tests design tokens)
- web/tests/types/index.test.ts (créé — 6 tests type shapes + runtime validation)
- web/tests/layouts/BaseLayout.test.ts (créé — 26 tests structure BaseLayout)
- web/tests/pages/index.test.ts (créé — 5 tests index.astro)
- web/tests/build-output.test.ts (créé — 12 tests intégration build output)
