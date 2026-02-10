---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-02-10'
lastStep: 8
inputDocuments:
  - "docs/planning-artifacts/prd.md"
  - "docs/planning-artifacts/product-brief-slow-adventures-2026-02-03.md"
  - "docs/planning-artifacts/ux-design-specification.md"
  - "docs/brainstorming/brainstorming-session-2026-01-31.md"
  - "README.md"
workflowType: 'architecture'
project_name: 'slow-adventures'
user_name: 'Elena'
date: '2026-02-10'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (34 FR):**

7 catégories identifiées dans le PRD :

| Catégorie | FR | Implications architecturales |
|-----------|-----|------------------------------|
| Expérience Immersive & Storytelling | FR1-FR9 | Composants statiques Astro + GSAP ScrollTrigger pour animations scroll. Vidéo hero avec poster fallback, `prefers-reduced-motion` |
| Conversion & Prise de Contact | FR10-FR15 | Island `CalendlyModal` (iframe embed), `StickyMobileCTA` (IntersectionObserver), progressive enhancement `<a href>` fallback |
| Capture & Nurturing Email | FR16-FR19 | Island `EmailCapture` (fetch API vers Brevo), séquences automatiques configurées dans Brevo (pas de dev custom) |
| Engagement & Rétention | FR20-FR22 | Island `ReturnVisitorBanner` (localStorage), navigation clavier complète, sémantique ARIA |
| Tracking & Analytics | FR23-FR27 | Module analytics centralisé (utilitaire TypeScript encapsulant GA4) — événements custom : CTA clic, scroll depth, email capture, UTM, Calendly completion |
| SEO & Découvrabilité | FR28-FR30 | Meta tags, Schema.org (LocalBusiness + TravelAgency), sitemap XML Astro, Open Graph |
| Conformité & Légal | FR31-FR34 | Pages mentions légales/RGPD, bannière consentement cookies avec chargement conditionnel GA4, coordonnées footer |

**Non-Functional Requirements (20 NFR):**

| Catégorie | NFR | Contraintes architecturales |
|-----------|-----|----------------------------|
| Performance | NFR1-NFR5 | LCP < 2.5s, CLS < 0.1, images < 100kb WebP, budget JS ~20kb gzippé, vidéo hero optimisée |
| Accessibilité | NFR6-NFR9 | Lighthouse Accessibility 95+, 0 violations axe critical/serious, contrastes 4.5:1, `prefers-reduced-motion` |
| Sécurité & Confidentialité | NFR10-NFR12 | HTTPS, RGPD, aucune donnée perso sur Netlify — emails via Brevo API côté client avec clé publique à permissions restreintes (inscription uniquement) |
| Résilience Intégrations | NFR13-NFR16 | Fallback Calendly (lien direct), fallback Brevo (message erreur), site fonctionnel sans JS |
| Maintenabilité | NFR17-NFR20 | Contenu isolé dans fichiers dédiés via content collections Astro, TypeScript strict, build < 2min, tests sur composants interactifs |

**Scale & Complexity:**

- Domaine primaire : **frontend web statique (SSG)**
- Niveau de complexité : **basse**
- Composants architecturaux estimés : **13 composants Astro** (7 statiques + 6 islands) + 1 layout + 1 fichier tokens CSS + 1 module analytics + intégrations tierces

### Technical Constraints & Dependencies

| Contrainte | Source | Impact |
|-----------|--------|--------|
| Astro SSG imposé | PRD | Pas de SSR, pas d'API routes — tout est statique au build |
| TypeScript strict | PRD/NFR18 | Typage obligatoire sur tous les composants et scripts |
| Tailwind CSS | PRD/UX | Design tokens dans `tailwind.config`, pas de CSS custom sauf `tokens.css` pour GSAP |
| GSAP + ScrollTrigger | UX | Bibliothèque d'animation principale, ~24kb. Import path identique dans tous les islands pour garantir la déduplication Astro au build |
| Netlify hosting | PRD | CDN global, deploy automatique Git, headers cache configurables, build statique |
| Safari iOS 15+ critique | PRD | 80%+ trafic depuis Instagram Stories — vidéo `autoplay muted playsinline` obligatoire |
| Pas de backend | PRD | Emails via Brevo API côté client (clé publique restreinte), booking via Calendly embed, analytics via GA4 conditionnel |
| Content collections Astro | UX/Archi | Données destinations en content collections markdown — maintenabilité + préparation pages post-MVP |
| Ordre d'initialisation islands | UX/Perf | Priorité `client:load` : Hero > StickyMobileCTA > CalendlyModal > ReturnVisitorBanner. Éviter le blocage du thread principal pendant l'initialisation du hero |
| Dépendance Calendly embed | PRD | Risque de changement d'API embed ou pricing Calendly. Fallback lien direct toujours fonctionnel. L'iframe embed est isolé dans CalendlyModal — remplacement possible sans impact sur le reste du site |

### Cross-Cutting Concerns Identified

1. **Progressive Enhancement** — Chaque interaction a un fallback sans JS : CTA → lien Calendly, animations → CSS opacity, vidéo → poster statique. L'architecture garantit un site fonctionnel sans hydratation
2. **Performance vidéo/images** — Le hero vidéo est le risque technique n°1. Poster preloadé comme LCP, vidéo en streaming progressif, détection `Save-Data` et `prefers-reduced-motion`
3. **Accessibilité transversale** — WCAG 2.1 AA sur tous les composants : sémantique HTML, focus ring, `aria-live`, touch targets 44px, contrastes validés
4. **Résilience des intégrations** — Calendly, Brevo et GA4 peuvent être indisponibles. Le site fonctionne sans dégradation visible (sauf fonctionnalités spécifiques). Dépendance Calendly isolée dans un composant unique pour faciliter un remplacement futur
5. **Stratégie de cache CDN** — Assets hashés avec `Cache-Control: immutable`, HTML avec `max-age` court + revalidation. Netlify gère le CDN
6. **Consentement cookies / RGPD** — GA4 ne se charge qu'après consentement utilisateur. Chargement conditionnel du script GA4 via la bannière cookies (FR33). Le module analytics centralisé gère le buffer des événements pré-consentement ou les ignore. Impact direct sur l'ordre de chargement des scripts
7. **Module analytics centralisé** — Utilitaire TypeScript unique (`analytics.ts`) qui encapsule tous les appels GA4. Les composants n'appellent jamais `gtag()` directement — ils passent par le module. API propre : `trackCTAClick()`, `trackScrollDepth()`, `trackEmailCapture()`, `trackUTM()`. Facilite le remplacement de GA4 si nécessaire
8. **Brevo API côté client** — Clé publique à permissions restreintes (inscription newsletter uniquement). Pas de Netlify Function au MVP — simplicité d'abord. Documenté comme limitation acceptable pour le scope MVP

## Starter Template Evaluation

### Primary Technology Domain

**Frontend web statique (SSG)** — site one-page Astro avec islands architecture pour interactivité ciblée.

### Starter Options Considered

| Option | Starter | Verdict |
|--------|---------|---------|
| 1 | `create astro` minimal | **Sélectionné** — canvas vierge, zéro opinion, structure UX Spec implémentable directement |
| 2 | AstroWind | Rejeté — structure blog/portfolio imposée, thème à supprimer, inadapté au one-page custom |
| 3 | Astroplate | Rejeté — CMS Sitepins intégré, structure trop opinionated pour le projet |

### Selected Starter: `create astro` minimal

**Rationale :** Le projet a une architecture composants très précise (13 composants, 7 statiques + 6 islands) définie dans l'UX Spec. Aucun starter communautaire ne correspond. Le starter minimal donne un canvas vierge pour implémenter exactement ce qui est spécifié.

**Commande d'initialisation :**

```bash
npm create astro@latest slow-adventures -- --template minimal --typescript strict
cd slow-adventures
npx astro add tailwind
npm install gsap astro-robots-txt
npm install -D vitest @testing-library/dom
```

**Note :** L'initialisation du projet avec cette commande sera la première story d'implémentation.

### Architectural Decisions Provided by Starter

**Décision 1 — Astro 5 stable, pas Astro 6 beta :**
Astro 6 beta (janvier 2026) requiert Node 22+, breaking changes Zod 4, adaptateurs en cours de mise à jour. Le scope SSG du projet ne touche aucune feature v6 (Cloudflare Workers, nouveau dev server runtime). Migration v6 triviale quand stable — aucune feature v6 n'est nécessaire.

**Décision 2 — Tailwind v4 avec config CSS-based :**
L'ancien `@astrojs/tailwind` est deprecated. Tailwind v4 utilise le plugin Vite `@tailwindcss/vite`. La configuration passe de `tailwind.config.mjs` (JS, v3) à `@theme` dans CSS (v4). Les valeurs de design tokens de l'UX Spec restent la source de vérité — seule la syntaxe change.

**Décision 3 — Un seul fichier CSS `src/styles/global.css` :**
Fusionne le `tokens.css` (mentionné dans l'UX Spec) et la config Tailwind en un seul fichier. Les `@theme` tokens Tailwind et les custom properties GSAP cohabitent. Simplification par rapport aux deux fichiers séparés.

**Décision 4 — Structure `src/lib/` pour les utilitaires TypeScript :**
Le module analytics (`analytics.ts`) et le client Brevo (`brevo.ts`) vont dans `src/lib/`. Pattern standard Astro — importable par les composants et les islands.

**Décision 5 — Content collections Astro 5 pour les destinations :**
Chaque destination = un fichier markdown dans `src/content/destinations/`. Schema Zod validant les champs (country, description, image, overlayColor). Prêt pour les pages destination post-MVP. Système stable et bien documenté en Astro 5 (vs live content collections en v6 beta).

### Project Structure

```
src/
  components/        → 13 composants Astro (7 statiques + 6 islands)
  content/
    destinations/    → content collections markdown + Zod schema
  data/              → données statiques (pricing, process steps)
  layouts/
    BaseLayout.astro → meta, fonts, SEO, global.css
  lib/
    analytics.ts     → module GA4 centralisé
    brevo.ts         → client Brevo API
  pages/
    index.astro      → page principale one-page
    mentions-legales.astro
    politique-confidentialite.astro
  styles/
    global.css       → @theme tokens Tailwind v4 + custom properties GSAP
```

### Dependencies

**Production :**

| Package | Version | Usage |
|---------|---------|-------|
| `astro` | `^5.15` | Framework SSG |
| `tailwindcss` | `^4.1` | Tailwind CSS v4 |
| `@tailwindcss/vite` | `^4.1` | Plugin Vite Tailwind |
| `gsap` | `^3.14` | Animations + ScrollTrigger |

**Intégrations Astro :**

| Intégration | Usage |
|-------------|-------|
| `@astrojs/sitemap` | Sitemap XML auto (FR30) |
| `astro-robots-txt` | Génération robots.txt auto au build |
| `astro:assets` | Processing images WebP au build |

**Développement :**

| Package | Version | Usage |
|---------|---------|-------|
| `typescript` | `^5.9` | Typage strict |
| `vitest` | `^3.x` | Test runner (NFR20) |
| `@testing-library/dom` | latest | Tests composants islands |

### Tailwind v4 Token Translation

Les valeurs de l'UX Spec se traduisent de `tailwind.config` (v3) vers `@theme` CSS (v4) :

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Couleurs */
  --color-terracotta: #c0603e;
  --color-terracotta-light: #d4856a;
  --color-terracotta-dark: #a04e30;
  --color-terracotta-muted: #c9a08e;
  --color-bleu: #1696ff;
  --color-creme: #fff9f3;
  --color-creme-dark: #f5ede3;
  --color-sauge: #7B8F6B;
  --color-ambre: #D4956A;
  --color-warm-black: #2c2825;
  --color-warm-gray: #6b5e52;

  /* Typographie */
  --font-family-serif: 'Lora', 'Georgia', serif;
  --font-family-sans: 'Plus Jakarta Sans', 'system-ui', sans-serif;

  /* Border radius */
  --radius-soft: 8px;
  --radius-round: 24px;
  --radius-full: 9999px;
}

/* Custom properties GSAP */
:root {
  --gsap-duration-default: 300ms;
  --gsap-duration-slow: 600ms;
  --gsap-ease-default: ease-out;
  --gsap-ease-slow: ease-in-out;
}
```

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Bloquent l'implémentation) :**
- Variables d'environnement et gestion des clés API
- Pattern d'import GSAP unifié
- Stratégie de consentement cookies / chargement conditionnel GA4
- Pipeline d'optimisation images
- Configuration déploiement GitHub Actions → Netlify

**Important Decisions (Façonnent l'architecture) :**
- Headers de sécurité Netlify (CSP)
- Patterns d'intégration tierces (Calendly, Brevo, GA4)
- Stratégie de testing
- Standards de linting/formatting

**Deferred Decisions (Post-MVP) :**
- Lighthouse CI dans le pipeline
- Blog/CMS
- Pages destination multi-pages
- i18n

### Variables d'Environnement & Secrets

| Variable | Service | Sensibilité | Contexte |
|----------|---------|-------------|----------|
| `PUBLIC_BREVO_API_KEY` | Brevo | Clé publique restreinte — exposée côté client, permissions inscription uniquement | Client-side |
| `PUBLIC_CALENDLY_URL` | Calendly | URL publique — pas de secret | Client-side |
| `PUBLIC_GA4_MEASUREMENT_ID` | Google Analytics | ID publique — pas de secret | Client-side |
| `SITE_URL` | Astro/SEO | URL du site pour sitemap et canonical | Build-time |

**Stratégie :** Fichier `.env` local (gitignored) + variables d'environnement Netlify en production. Préfixe `PUBLIC_` Astro = accessible côté client. Aucun vrai secret côté serveur (pas de serveur).

### Sécurité & Conformité RGPD

**Bannière de consentement cookies — Composant custom léger :**
Island Astro `CookieConsent` qui gère le consentement via localStorage. ~2kb JS. GA4 ne se charge qu'après acceptation. Simple, pas de dépendance tierce. Suffisant pour un MVP avec un seul cookie analytique.

**Headers de sécurité Netlify (`netlify.toml`) :**

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com; frame-src https://calendly.com; connect-src https://api.brevo.com
```

**Pages légales :** `mentions-legales.astro` et `politique-confidentialite.astro` — pages statiques, même BaseLayout, contenu hardcodé.

### Patterns d'Intégration Tierces

| Intégration | Pattern | Fallback | Gestion d'erreur |
|-------------|---------|----------|-------------------|
| **Calendly** | Iframe dans modale `CalendlyModal` via script Calendly embed. Progressive enhancement : `<a href>` si JS désactivé | Lien direct vers calendly.com | Timeout iframe → message "Le service est temporairement indisponible" |
| **Brevo** | `fetch()` vers API Brevo depuis `EmailCapture` island. Clé publique dans les headers | Message d'erreur inline | `try/catch` → "Oups, quelque chose n'a pas marché. Réessaie ?" |
| **GA4** | Script conditionnel chargé après consentement cookies. Événements buffered dans `analytics.ts` jusqu'au chargement | Site fonctionne normalement sans GA4 | Silencieux — pas de message utilisateur si GA4 échoue |

**Principe commun :** Chaque intégration a un `try/catch` avec message utilisateur friendly (tutoiement). Pas de retry automatique — l'utilisateur peut réessayer manuellement.

### Frontend Architecture (détails)

**GSAP — Point d'entrée unique :**

```typescript
// src/lib/gsap.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
```

Tous les islands importent depuis `src/lib/gsap.ts`. Astro déduplique le bundle au build. Un seul fichier, un seul import path = zéro risque de double bundle.

**Images — Pipeline `astro:assets` :**
- Format : WebP qualité 80%
- 3 tailles : 768w, 1440w, 2880w via `<Image>` component Astro
- Processing automatique au build (sharp)
- Hero poster : preloadé en `<link rel="preload">` dans `BaseLayout`

**Hydration — Stratégie par composant :**

| Directive | Composants | Raison |
|-----------|-----------|--------|
| `client:load` | Hero, StickyMobileCTA, CalendlyModal, ReturnVisitorBanner, CookieConsent | Nécessaires dès le chargement |
| `client:visible` | ScrollHint, SectionReveal, EmailCapture | Chargés au scroll |
| Statique (0 JS) | CTAButton, ElenaSection, DestinationBlock, ProcessStep, TestimonialCard, PricingRow | Aucune interactivité côté client |

### Infrastructure & Déploiement

**Déploiement : GitHub Actions → Netlify CLI**

Build et deploy contrôlés par GitHub Actions. Pas de build côté Netlify.

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npx netlify-cli deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Secrets GitHub requis :** `NETLIFY_AUTH_TOKEN` (Personal Access Token Netlify) + `NETLIFY_SITE_ID` (ID du site Netlify).

**Preview deploys :** Possible en ajoutant un trigger `pull_request` sans le flag `--prod`.

**Netlify config (`netlify.toml`) :**

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

### Standards de Développement

**Linting & Formatting :**

| Outil | Config | Usage |
|-------|--------|-------|
| ESLint | `@typescript-eslint` + plugin Astro | Qualité code TypeScript |
| Prettier | Config default + plugin Astro | Formatage automatique |

**Testing (Vitest) :**

| Quoi tester | Comment | Priorité |
|------------|---------|----------|
| `analytics.ts` | Unit tests — mock `gtag()` | Haute |
| `brevo.ts` | Unit tests — mock `fetch` | Haute |
| `EmailCapture` | DOM tests — validation, états loading/success/error | Haute |
| `CalendlyModal` | DOM tests — ouverture/fermeture, scroll lock | Moyenne |
| `ReturnVisitorBanner` | DOM tests — localStorage mock | Moyenne |
| `StickyMobileCTA` | DOM tests — IntersectionObserver mock | Moyenne |

**Pas de tests sur les composants statiques** — ils n'ont pas de logique côté client.

### Decision Impact Analysis

**Séquence d'implémentation recommandée :**

1. Initialisation projet (starter + deps + config Tailwind v4 + global.css)
2. BaseLayout + pages légales + netlify.toml + GitHub Actions
3. Composants statiques (CTAButton, ElenaSection, DestinationBlock, etc.)
4. Islands interactifs (Hero/GSAP, StickyMobileCTA, SectionReveal)
5. Intégrations tierces (CalendlyModal, EmailCapture/Brevo, CookieConsent/GA4)
6. ReturnVisitorBanner + finitions
7. Content collections destinations
8. Tests + QA

**Dépendances inter-composants :**
- `CalendlyModal` dépend de `CTAButton` (progressive enhancement `data-calendly-trigger`)
- `StickyMobileCTA` dépend de `CalendlyModal` (ouverture modale au clic)
- `analytics.ts` dépend de `CookieConsent` (chargement conditionnel GA4)
- Tous les `SectionReveal` dépendent de `src/lib/gsap.ts` (import unifié)

## Implementation Patterns & Consistency Rules

### Points de Conflit Identifiés

**12 zones** où des agents IA pourraient faire des choix différents, regroupées en 5 catégories : nommage, structure, code, Tailwind, processus.

### Naming Patterns

**Fichiers & Répertoires :**

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Composants Astro | PascalCase `.astro` | `HeroSection.astro`, `CalendlyModal.astro` |
| Fichiers TypeScript lib | camelCase `.ts` | `analytics.ts`, `brevo.ts`, `gsap.ts` |
| Fichiers de données | camelCase `.ts` | `destinations.ts`, `processSteps.ts` |
| Content collections | kebab-case `.md` | `perou-sacre.md`, `colombie-cafetera.md` |
| Tests | `[nom].test.ts` co-localisé | `analytics.test.ts` dans `src/lib/` |
| Pages | kebab-case `.astro` | `mentions-legales.astro` |
| Répertoires | kebab-case | `src/content/destinations/` |

**Variables & Fonctions TypeScript :**

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Variables | camelCase | `isModalOpen`, `scrollPosition` |
| Fonctions | camelCase verbe + nom | `trackCTAClick()`, `openCalendlyModal()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `BREVO_ENDPOINT` |
| Types/Interfaces | PascalCase | `DestinationData`, `AnalyticsEvent` |
| Props Astro | camelCase | `overlayColor`, `isVisible` |
| Événements custom | kebab-case préfixé `sa:` | `sa:modal-open`, `sa:consent-accepted` |

**CSS / Tailwind :**

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Custom properties | kebab-case | `--gsap-duration-default` |
| Tokens Tailwind `@theme` | `--color-*`, `--font-*`, `--radius-*` | `--color-terracotta`, `--font-family-serif` |
| Classes utilitaires custom | kebab-case avec préfixe `sa-` | `sa-section-padding`, `sa-glass-effect` |

### Structure Patterns

**Organisation des composants — structure plate :**

```
src/components/
  CTAButton.astro          → statique
  CalendlyModal.astro      → island client:load
  CookieConsent.astro      → island client:load
  DestinationBlock.astro   → statique
  ElenaSection.astro       → statique
  EmailCapture.astro       → island client:visible
  HeroSection.astro        → island client:load
  PricingRow.astro         → statique
  ProcessStep.astro        → statique
  ReturnVisitorBanner.astro → island client:load
  ScrollHint.astro         → island client:visible
  SectionReveal.astro      → island client:visible
  StickyMobileCTA.astro    → island client:load
  TestimonialCard.astro    → statique
```

Pas de sous-dossiers — 14 composants, structure plate lisible. Chaque composant = 1 fichier `.astro`.

**Tests co-localisés :**

```
src/lib/
  analytics.ts
  analytics.test.ts        → test co-localisé
  brevo.ts
  brevo.test.ts            → test co-localisé
  gsap.ts
```

**Ordre d'import dans les fichiers TypeScript :**

```typescript
// 1. Imports externes (npm packages)
import { gsap } from 'gsap';

// 2. Imports internes (src/)
import { trackCTAClick } from '../lib/analytics';

// 3. Imports de types
import type { DestinationData } from '../types';
```

### Code Patterns

**Structure d'un composant Astro statique :**

```astro
---
// Props interface
interface Props {
  title: string;
  description: string;
}

// Destructuration des props
const { title, description } = Astro.props;
---

<section class="sa-section-padding">
  <h2 class="font-serif text-3xl text-warm-black">{title}</h2>
  <p class="font-sans text-warm-gray">{description}</p>
</section>
```

**Structure d'un island interactif :**

```astro
---
// Props interface
interface Props {
  triggerSelector?: string;
}

const { triggerSelector = '[data-calendly-trigger]' } = Astro.props;
---

<!-- Fallback sans JS (progressive enhancement) -->
<a href={import.meta.env.PUBLIC_CALENDLY_URL} class="...">
  Réserver un appel
</a>

<!-- Island markup -->
<div id="calendly-modal" class="hidden" data-trigger={triggerSelector}>
  <!-- Contenu de la modale -->
</div>

<script>
  // Toute la logique côté client ici
  // Import depuis src/lib/ si nécessaire
  const modal = document.getElementById('calendly-modal');
  // ...
</script>
```

**Communication inter-islands — CustomEvents :**

```typescript
// Émission (CookieConsent)
document.dispatchEvent(new CustomEvent('sa:consent-accepted', {
  detail: { analytics: true }
}));

// Écoute (analytics.ts)
document.addEventListener('sa:consent-accepted', (e: CustomEvent) => {
  if (e.detail.analytics) {
    loadGA4Script();
  }
});
```

Préfixe `sa:` (slow-adventures) pour éviter les collisions avec des événements tiers.

**Pattern GSAP — import unifié obligatoire :**

```typescript
// ✅ CORRECT — toujours importer depuis src/lib/gsap.ts
import { gsap, ScrollTrigger } from '../lib/gsap';

// ❌ INTERDIT — import direct = double bundle
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
```

**Pattern GSAP — respect de `prefers-reduced-motion` :**

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Afficher le contenu sans animation
  element.style.opacity = '1';
} else {
  gsap.from(element, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    scrollTrigger: { trigger: element, start: 'top 80%' }
  });
}
```

### Tailwind Usage Rules

**Règles obligatoires :**

1. **Utiliser les tokens `@theme`** — jamais de valeurs hardcodées pour les couleurs, fonts, radius
2. **Utility-first** — pas de CSS custom sauf pour les animations GSAP et les cas impossibles en utilitaires
3. **Responsive mobile-first** — `class="text-base md:text-lg lg:text-xl"` (mobile par défaut)
4. **Pas de `@apply`** sauf dans `global.css` pour les classes utilitaires custom (`sa-*`)
5. **Dark mode** — non prévu au MVP, ne pas ajouter de variantes `dark:`

**Classes utilitaires custom autorisées dans `global.css` :**

```css
/* Section padding cohérent */
.sa-section-padding {
  @apply px-6 py-16 md:px-12 md:py-24 lg:px-24 lg:py-32;
}

/* Effet glassmorphism si nécessaire */
.sa-glass-effect {
  @apply bg-white/80 backdrop-blur-md;
}
```

### Process Patterns

**Gestion d'erreurs — intégrations tierces :**

```typescript
// Pattern standard pour Brevo/Calendly
try {
  const response = await fetch(BREVO_ENDPOINT, { /* ... */ });
  if (!response.ok) throw new Error(`Brevo: ${response.status}`);
  // Succès
} catch (error) {
  console.error('[slow-adventures]', error);
  // Message utilisateur friendly (tutoiement)
  showError('Oups, quelque chose n\'a pas marché. Réessaie ?');
}
```

**Logging — préfixe `[slow-adventures]` :**

- `console.error('[slow-adventures]', ...)` pour les erreurs
- `console.warn('[slow-adventures]', ...)` pour les dégradations gracieuses
- Pas de `console.log` en production sauf debug temporaire

**Accessibilité — checklist par composant :**

Chaque composant interactif (island) DOIT avoir :
- Focus management (`focus()`, `tabindex`, focus trap pour les modales)
- `aria-label` ou `aria-labelledby` sur les éléments interactifs
- `aria-live="polite"` pour les messages dynamiques (erreurs, confirmations)
- Touch targets minimum 44x44px
- Contrastes validés 4.5:1 (texte) / 3:1 (éléments graphiques)

**Progressive enhancement — fallback obligatoire :**

| Composant | Fallback sans JS |
|-----------|------------------|
| `CalendlyModal` | Lien direct `<a href>` vers Calendly |
| `EmailCapture` | Formulaire ne fait rien mais pas d'erreur visible |
| `HeroSection` | Image poster statique, pas de vidéo |
| `SectionReveal` | Contenu visible par défaut (`opacity: 1`) |
| `StickyMobileCTA` | CTA toujours visible en bas (CSS `position: fixed`) |
| `CookieConsent` | Pas de bannière, GA4 ne charge pas (privacy by default) |

### Enforcement Guidelines

**Tous les agents IA DOIVENT :**

1. Importer GSAP **uniquement** depuis `src/lib/gsap.ts`
2. Utiliser les tokens `@theme` Tailwind — jamais de couleurs/fonts hardcodées
3. Préfixer les événements custom avec `sa:`
4. Fournir un fallback sans JS pour chaque island
5. Respecter `prefers-reduced-motion` dans toute animation GSAP
6. Logger avec le préfixe `[slow-adventures]`
7. Tutoyer l'utilisateur dans tous les messages d'erreur/succès
8. Suivre l'ordre d'import : externes → internes → types

**Vérification des patterns :**
- Review de code par agent QA avant merge
- Vitest vérifie les patterns critiques (import GSAP, analytics module)
- Lighthouse CI (post-MVP) vérifie accessibilité et performance

### Anti-Patterns

| Anti-Pattern | Pourquoi c'est un problème |
|-------------|---------------------------|
| `import { gsap } from 'gsap'` directement | Double bundle GSAP (~48kb au lieu de ~24kb) |
| `style="color: #c0603e"` ou `class="text-[#c0603e]"` | Contourne les tokens, incohérence si changement de palette |
| `console.log('debug')` en production | Bruit dans la console utilisateur |
| `addEventListener('click', ...)` sans `keyboard` | Inaccessible au clavier |
| Ignorer `prefers-reduced-motion` | Violation WCAG, inconfort utilisateurs sensibles |
| `document.querySelector` sans null check | Runtime error si le composant n'est pas monté |

## Project Structure & Boundaries

### Mapping Requirements → Structure

| Catégorie FR | Composants / Fichiers | Répertoire |
|---|---|---|
| **Immersive & Storytelling** (FR1-9) | `HeroSection`, `SectionReveal`, `ScrollHint`, `DestinationBlock`, `ElenaSection` | `src/components/` + `src/lib/gsap.ts` |
| **Conversion & Contact** (FR10-15) | `CalendlyModal`, `StickyMobileCTA`, `CTAButton` | `src/components/` |
| **Email Capture** (FR16-19) | `EmailCapture` | `src/components/` + `src/lib/brevo.ts` |
| **Engagement** (FR20-22) | `ReturnVisitorBanner` | `src/components/` |
| **Analytics** (FR23-27) | Module centralisé | `src/lib/analytics.ts` |
| **SEO** (FR28-30) | `BaseLayout` (meta, Schema.org), sitemap, robots.txt | `src/layouts/` + intégrations Astro |
| **Conformité** (FR31-34) | `CookieConsent`, pages légales | `src/components/` + `src/pages/` |

### Arborescence Complète du Projet

```
slow-adventures/
├── .github/
│   └── workflows/
│       └── deploy.yml                → GitHub Actions → Netlify CLI
├── .env.example                      → Template variables d'environnement
├── .eslintrc.cjs                     → ESLint + @typescript-eslint + plugin Astro
├── .gitignore
├── .prettierrc                       → Prettier config default + plugin Astro
├── astro.config.mjs                  → Config Astro (sitemap, robots-txt, vite plugin tailwind)
├── netlify.toml                      → Headers sécurité + cache
├── package.json
├── tsconfig.json                     → TypeScript strict
├── vitest.config.ts                  → Config Vitest (include: src/**/*.test.ts)
├── README.md
│
├── public/                           → Fichiers statiques copiés tels quels (PAS de processing)
│   ├── favicon.svg
│   ├── og-image.jpg                  → Open Graph image (FR29)
│   └── videos/
│       └── hero.mp4                  → Vidéo hero (streaming progressif)
│
└── src/
    ├── assets/                       → Assets traités par le build (astro:assets)
    │   └── images/
    │       ├── hero-poster.jpg       → Poster hero, preload LCP
    │       ├── elena-portrait.jpg    → Section fondatrice (FR7)
    │       └── destinations/         → Photos destinations (WebP processing)
    │           ├── perou.jpg
    │           ├── colombie.jpg
    │           ├── costa-rica.jpg
    │           └── patagonie.jpg
    │
    ├── components/
    │   ├── CTAButton.astro           → Statique — bouton CTA réutilisable
    │   ├── CalendlyModal.astro       → Island client:load — modale Calendly (FR10-12)
    │   ├── CalendlyModal.test.ts     → Test DOM — ouverture/fermeture, scroll lock
    │   ├── CookieConsent.astro       → Island client:load — bannière RGPD (FR33)
    │   ├── DestinationBlock.astro    → Statique — carte destination (FR5-6)
    │   ├── ElenaSection.astro        → Statique — section fondatrice (FR7)
    │   ├── EmailCapture.astro        → Island client:visible — formulaire Brevo (FR16-18)
    │   ├── EmailCapture.test.ts      → Test DOM — validation, états loading/success/error
    │   ├── HeroSection.astro         → Island client:load — hero vidéo + GSAP (FR1-3)
    │   ├── PricingRow.astro          → Statique — ligne tarif (FR8)
    │   ├── ProcessStep.astro         → Statique — étape processus (FR9)
    │   ├── ReturnVisitorBanner.astro → Island client:load — visiteur retour (FR20)
    │   ├── ReturnVisitorBanner.test.ts → Test DOM — localStorage mock
    │   ├── ScrollHint.astro          → Island client:visible — indicateur scroll (FR4)
    │   ├── SectionReveal.astro       → Island client:visible — animation section (FR3)
    │   ├── StickyMobileCTA.astro     → Island client:load — CTA fixe mobile (FR13)
    │   ├── StickyMobileCTA.test.ts   → Test DOM — IntersectionObserver mock
    │   └── TestimonialCard.astro     → Statique — carte témoignage (FR8)
    │
    ├── content/
    │   ├── config.ts                 → Schema Zod content collections (Astro 5)
    │   └── destinations/
    │       ├── perou-sacre.md         → Destination Pérou (FR5)
    │       ├── colombie-cafetera.md   → Destination Colombie
    │       ├── costa-rica-pura-vida.md → Destination Costa Rica
    │       └── patagonie-sauvage.md   → Destination Patagonie
    │
    ├── data/
    │   ├── processSteps.ts           → Données étapes processus (FR9)
    │   ├── testimonials.ts           → Données témoignages (FR8)
    │   └── pricing.ts                → Données tarification (FR8)
    │
    ├── env.d.ts                      → Typage import.meta.env.PUBLIC_* (Astro 5)
    │
    ├── layouts/
    │   └── BaseLayout.astro          → Meta, fonts, SEO, Schema.org, global.css (FR28-30)
    │
    ├── lib/
    │   ├── analytics.ts              → Module GA4 centralisé (FR23-27)
    │   ├── analytics.test.ts         → Tests analytics — mock gtag()
    │   ├── brevo.ts                  → Client Brevo API (FR16-18)
    │   ├── brevo.test.ts             → Tests Brevo — mock fetch
    │   └── gsap.ts                   → Import GSAP unifié + registerPlugin
    │
    ├── pages/
    │   ├── index.astro               → Page principale one-page
    │   ├── mentions-legales.astro    → Page mentions légales (FR31)
    │   └── politique-confidentialite.astro → Page RGPD (FR32)
    │
    ├── styles/
    │   └── global.css                → @theme tokens Tailwind v4 + GSAP custom properties
    │
    └── types/
        └── index.ts                  → Types partagés (DestinationData, AnalyticsEvent, etc.)
```

### Distinction `src/assets/` vs `public/`

| Dossier | Processing | Usage | Exemples |
|---------|-----------|-------|----------|
| `src/assets/images/` | Oui — `astro:assets` optimise en WebP, génère les tailles responsive (768w, 1440w, 2880w) | Images affichées via `<Image>` d'Astro | Hero poster, portraits, photos destinations |
| `public/` | Non — copié tel quel dans `dist/` | Fichiers statiques référencés par URL directe | `favicon.svg`, `og-image.jpg`, `videos/hero.mp4` |

**Règle pour les agents IA :** Si une image est affichée via le composant `<Image>` d'Astro → `src/assets/images/`. Si référencée par URL directe (meta tags, Open Graph) → `public/`.

### Astro Config Reference

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: import.meta.env.SITE_URL,
  integrations: [sitemap(), robotsTxt()],
  vite: { plugins: [tailwindcss()] },
});
```

### Boundaries Architecturales

**Boundaries des composants :**

```
┌─────────────────────────────────────────┐
│  BaseLayout.astro                       │
│  ├── global.css (@theme tokens)         │
│  ├── <link preload> hero poster         │
│  ├── Schema.org JSON-LD                 │
│  └── Meta / Open Graph                  │
├─────────────────────────────────────────┤
│  index.astro (page compositeur)         │
│  │                                      │
│  ├── HeroSection ←→ gsap.ts            │
│  ├── ScrollHint ←→ gsap.ts             │
│  ├── SectionReveal ←→ gsap.ts          │
│  │   ├── DestinationBlock (×4)          │
│  │   ├── ElenaSection                   │
│  │   ├── ProcessStep (×N)              │
│  │   ├── TestimonialCard (×N)          │
│  │   └── PricingRow (×N)              │
│  ├── EmailCapture ←→ brevo.ts          │
│  ├── CTAButton ──→ CalendlyModal       │
│  ├── StickyMobileCTA ──→ CalendlyModal │
│  ├── CalendlyModal                      │
│  ├── ReturnVisitorBanner                │
│  └── CookieConsent ──→ analytics.ts    │
└─────────────────────────────────────────┘
```

**Boundary des intégrations externes :**

| Service | Point d'entrée | Fichier frontière | Direction |
|---------|---------------|-------------------|-----------|
| Calendly | Iframe embed script | `CalendlyModal.astro` | Sortant |
| Brevo API | `fetch()` POST | `src/lib/brevo.ts` | Sortant |
| Google Analytics | `gtag()` conditionnel | `src/lib/analytics.ts` | Sortant |
| Google Fonts | `<link preconnect>` | `BaseLayout.astro` | Sortant |

**Boundary des données :**

| Source | Format | Accès | Fichier |
|--------|--------|-------|---------|
| Destinations | Markdown + frontmatter Zod | `getCollection('destinations')` | `src/content/destinations/*.md` |
| Process steps | TypeScript array | Import direct | `src/data/processSteps.ts` |
| Témoignages | TypeScript array | Import direct | `src/data/testimonials.ts` |
| Pricing | TypeScript array | Import direct | `src/data/pricing.ts` |
| Env variables | `.env` / Netlify | `import.meta.env.PUBLIC_*` | `.env.example` + `src/env.d.ts` |

### Flux de Données

```
[Content Collections]     [Static Data]        [Environment]
  destinations/*.md        processSteps.ts      .env / Netlify
        │                  testimonials.ts       PUBLIC_*
        │                  pricing.ts                │
        ▼                      ▼                     ▼
   ┌─────────────────────────────────────────────────────┐
   │              index.astro (build-time)                │
   │    getCollection() + imports + import.meta.env       │
   └──────────────────────┬──────────────────────────────┘
                          │ Props
                          ▼
   ┌─────────────────────────────────────────────────────┐
   │         Composants Astro (statiques + islands)       │
   └──────────────────────┬──────────────────────────────┘
                          │ Runtime (client-side)
                          ▼
   ┌───────────┐  ┌──────────┐  ┌──────────────┐
   │ brevo.ts  │  │analytics │  │ CustomEvents │
   │ fetch()   │  │ gtag()   │  │ sa:*         │
   └─────┬─────┘  └────┬─────┘  └──────┬───────┘
         │              │               │
         ▼              ▼               ▼
   Brevo API      Google Analytics   Inter-island
```

## Architecture Validation Results

### Coherence Validation

**Compatibilité des décisions :** Pas de conflit détecté.
- Astro 5 + Tailwind v4 (`@tailwindcss/vite`) + GSAP 3.14 + TypeScript strict = compatible
- `astro-robots-txt` + `@astrojs/sitemap` = complémentaires, pas de conflit
- Islands architecture + GSAP import unifié = cohérent avec la déduplication bundle Astro

**Consistance des patterns :**
- Naming patterns alignés sur les conventions Astro (PascalCase composants, camelCase TS)
- Tests co-localisés cohérents entre `src/lib/` et `src/components/`
- Préfixe `sa:` appliqué uniformément aux événements custom
- Ordre d'import standardisé : externes → internes → types

**Alignement structure :**
- L'arborescence supporte toutes les décisions prises
- `src/assets/` vs `public/` clairement défini avec règle pour agents IA
- Boundaries d'intégration isolées dans des fichiers dédiés (brevo.ts, analytics.ts, CalendlyModal)

### Requirements Coverage

**Functional Requirements (34/34 couverts) :**

| FR | Couverture architecturale | Status |
|---|---|---|
| FR1-9 (Immersive & Storytelling) | HeroSection + SectionReveal + GSAP + content collections | Couvert |
| FR10-15 (Conversion & Contact) | CalendlyModal + StickyMobileCTA + CTAButton | Couvert |
| FR16-19 (Email Capture) | EmailCapture + brevo.ts | Couvert |
| FR20-22 (Engagement) | ReturnVisitorBanner (localStorage) | Couvert |
| FR23-27 (Analytics) | analytics.ts + CookieConsent (conditionnel) | Couvert |
| FR28-30 (SEO) | BaseLayout + sitemap + astro-robots-txt + Schema.org | Couvert |
| FR31-34 (Conformité) | CookieConsent + pages légales + CSP headers | Couvert |

**Non-Functional Requirements (20/20 couverts) :**

| NFR | Couverture | Status |
|---|---|---|
| NFR1-5 (Performance) | SSG, astro:assets WebP, budget JS ~20kb, vidéo optimisée | Couvert |
| NFR6-9 (Accessibilité) | Checklist composant, ARIA, contrastes, reduced-motion | Couvert |
| NFR10-12 (Sécurité) | CSP headers, clé publique Brevo restreinte, RGPD | Couvert |
| NFR13-16 (Résilience) | Fallbacks par composant, progressive enhancement | Couvert |
| NFR17-20 (Maintenabilité) | Content collections, TypeScript strict, Vitest, co-located tests | Couvert |

### Implementation Readiness

**Complétude des décisions :** Toutes les décisions critiques documentées avec versions vérifiées.
**Complétude de la structure :** Arborescence complète avec tous les fichiers, annotations FR, et tests.
**Complétude des patterns :** 12 zones de conflit identifiées, 8 règles d'enforcement, anti-patterns documentés.

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Contexte projet analysé en profondeur
- [x] Échelle et complexité évaluées
- [x] Contraintes techniques identifiées
- [x] Concerns transversaux mappés (8 concerns)

**Architectural Decisions**
- [x] Décisions critiques documentées avec versions
- [x] Stack technologique entièrement spécifié
- [x] Patterns d'intégration définis (Calendly, Brevo, GA4)
- [x] Considérations de performance adressées

**Implementation Patterns**
- [x] Conventions de nommage établies (fichiers, variables, CSS)
- [x] Patterns de structure définis (composants plats, tests co-localisés)
- [x] Patterns de communication spécifiés (CustomEvents sa:*)
- [x] Patterns de processus documentés (erreurs, accessibilité, progressive enhancement)

**Project Structure**
- [x] Structure répertoire complète définie
- [x] Boundaries composants établies
- [x] Points d'intégration mappés
- [x] Mapping requirements → structure complet (34 FR → fichiers spécifiques)

### Architecture Readiness Assessment

**Status global : PRÊT POUR L'IMPLÉMENTATION**

**Niveau de confiance : Élevé**

**Forces clés :**
- Architecture simple et cohérente (SSG, pas de backend)
- Chaque composant = 1 fichier, structure plate facile à naviguer
- Progressive enhancement systématique sur tous les islands
- Patterns de code avec exemples concrets (Astro statique, island, GSAP, CustomEvents)
- 8 règles d'enforcement claires pour les agents IA
- 100% des FR et NFR couverts architecturalement

**Améliorations futures (post-MVP) :**
- Lighthouse CI dans GitHub Actions
- Pages destination multi-pages
- Blog/CMS
- i18n
