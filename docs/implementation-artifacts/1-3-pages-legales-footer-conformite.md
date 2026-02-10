# Story 1.3: Pages légales, footer & conformité

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want accéder aux mentions légales, à la politique de confidentialité et aux coordonnées d'Elena,
so that je puisse vérifier la conformité légale et contacter Elena directement.

## Acceptance Criteria

1. **Given** BaseLayout existe (Story 1.2) **When** on navigue vers `/mentions-legales` **Then** la page affiche le contenu des mentions légales avec le BaseLayout (FR31) **And** la page est accessible au clavier et aux lecteurs d'écran

2. **Given** BaseLayout existe (Story 1.2) **When** on navigue vers `/politique-confidentialite` **Then** la page affiche la politique de confidentialité RGPD avec le BaseLayout (FR32) **And** la page mentionne l'utilisation de Brevo pour les emails et de Google Analytics pour le tracking

3. **Given** les pages légales existent **When** on navigue sur n'importe quelle page du site **Then** un footer est visible en bas de page avec les coordonnées de contact d'Elena (FR34) **And** le footer contient des liens vers `/mentions-legales` et `/politique-confidentialite` **And** le footer utilise les design tokens (warm-black, warm-gray, creme) et la police Plus Jakarta Sans **And** le footer est sémantiquement balisé avec `<footer>` et les liens sont des `<a>` avec texte descriptif

## Tasks / Subtasks

- [x] Task 1: Créer la page `mentions-legales.astro` (AC: #1)
  - [x] 1.1 Créer `web/src/pages/mentions-legales.astro` avec import BaseLayout
  - [x] 1.2 Ajouter le contenu des mentions légales hardcodé : identité de l'entreprise (Elena — Slow Adventures), adresse, email de contact, hébergeur (Netlify), directeur de publication
  - [x] 1.3 Structurer avec des headings sémantiques (`<h1>` pour le titre, `<h2>` pour les sections)
  - [x] 1.4 Utiliser les classes Tailwind des design tokens : `text-warm-black`, `text-warm-gray`, `font-sans`, `bg-creme`
  - [x] 1.5 Envelopper le contenu dans un `<main id="main">` avec une largeur max lisible (`max-w-3xl mx-auto`)
  - [x] 1.6 Passer titre "Mentions légales — Slow Adventures" et description appropriée à BaseLayout
- [x] Task 2: Créer la page `politique-confidentialite.astro` (AC: #2)
  - [x] 2.1 Créer `web/src/pages/politique-confidentialite.astro` avec import BaseLayout
  - [x] 2.2 Ajouter le contenu RGPD hardcodé : responsable du traitement, finalités, base légale (consentement), destinataires, durée de conservation, droits des utilisateurs (accès, rectification, suppression, portabilité)
  - [x] 2.3 Mentionner explicitement les services tiers : Brevo (emails/newsletter), Google Analytics (tracking conditionnel après consentement), Calendly (réservation), Netlify (hébergement)
  - [x] 2.4 Mentionner l'utilisation de localStorage (consentement cookies, détection visiteur retour) — pas de cookies tiers sans consentement
  - [x] 2.5 Structurer avec des headings sémantiques (`<h1>`, `<h2>`) et des listes (`<ul>`)
  - [x] 2.6 Utiliser les mêmes classes Tailwind et le même layout que mentions-legales (`max-w-3xl mx-auto`)
  - [x] 2.7 Passer titre "Politique de confidentialité — Slow Adventures" et description appropriée à BaseLayout
- [x] Task 3: Créer le composant Footer et l'intégrer dans BaseLayout (AC: #3)
  - [x] 3.1 Créer `web/src/components/Footer.astro` — composant statique (0 JS)
  - [x] 3.2 Utiliser la balise sémantique `<footer>` avec fond `bg-creme-dark`
  - [x] 3.3 Contenu du footer : lien "Mentions légales" (`/mentions-legales`), lien "Politique de confidentialité" (`/politique-confidentialite`), email de contact Elena, copyright "Slow Adventures" + année dynamique
  - [x] 3.4 Appliquer les styles UX : texte `text-warm-gray text-sm`, padding réduit (`py-8`), max-width 640px centré (`max-w-[640px] mx-auto`)
  - [x] 3.5 Responsive : mobile/tablet = liens empilés verticalement centré, desktop (lg:) = liens en ligne horizontale centré
  - [x] 3.6 Liens `<a>` avec texte descriptif, underline au hover, transition de couleur
  - [x] 3.7 Importer et ajouter `<Footer />` dans BaseLayout.astro juste avant `</body>`, après le `<slot />`
- [x] Task 4: Écrire les tests (AC: #1-3)
  - [x] 4.1 Créer `web/tests/pages/mentions-legales.test.ts` — vérifier : structure HTML sémantique (h1, h2, main), contenu obligatoire (identité, hébergeur, contact), import BaseLayout
  - [x] 4.2 Créer `web/tests/pages/politique-confidentialite.test.ts` — vérifier : sections RGPD requises (finalités, droits, services tiers), mentions Brevo/GA4/Calendly, structure sémantique
  - [x] 4.3 Créer `web/tests/components/Footer.test.ts` — vérifier : balise `<footer>`, liens vers pages légales, email contact, copyright, classes design tokens
  - [x] 4.4 Mettre à jour `web/tests/layouts/BaseLayout.test.ts` — vérifier que BaseLayout inclut le composant Footer
  - [x] 4.5 Mettre à jour `web/tests/build-output.test.ts` — vérifier que `/mentions-legales/index.html` et `/politique-confidentialite/index.html` sont générés au build
- [x] Task 5: Validation build + lint + tests (AC: #1-3)
  - [x] 5.1 Exécuter `npm run build` — vérifier succès
  - [x] 5.2 Exécuter `npm run lint` — vérifier 0 erreurs et 0 warnings
  - [x] 5.3 Exécuter `npm run test` — vérifier que TOUS les tests passent (anciens + nouveaux)
  - [x] 5.4 Exécuter `prettier --write` sur tous les fichiers créés/modifiés

## Dev Notes

### Contexte Architecture Critique

**Structure monorepo :** Tous les fichiers sont dans `web/`. Chemins relatifs à `web/` sauf mention contraire.

**Dépendance Story 1.2 :** Le BaseLayout existe déjà et est fonctionnel. Les fichiers suivants existent et sont à modifier ou compléter :
- `src/layouts/BaseLayout.astro` — layout complet avec head SEO, OG, JSON-LD, Google Fonts (à modifier pour ajouter Footer)
- `src/pages/index.astro` — page avec `<main id="main">` vide utilisant BaseLayout
- `src/styles/global.css` — design tokens complets (couleurs, fonts, radius, GSAP vars)
- `src/types/index.ts` — types partagés (5 types exportés)
- `src/components/` — dossier existant avec `.gitkeep` uniquement (aucun composant encore)

**Note Story 1.2 :** "Ne PAS ajouter de `<header>` ni `<footer>` dans BaseLayout — le footer sera ajouté en Story 1.3." C'est CETTE story.

### Footer — Spécifications UX Complètes

Le footer est un **bloc utilitaire minimal et discret** — PAS une section storytelling. Il sert uniquement les obligations légales.

**Contenu :**
1. Lien "Mentions légales" → `/mentions-legales`
2. Lien "Politique de confidentialité" → `/politique-confidentialite`
3. Contact Elena (adresse email)
4. Copyright "Slow Adventures" + année

**Design (Source: UX Spec) :**
- Fond : `creme-dark` (#f5ede3)
- Texte : `warm-gray` (#6b5e52), taille `small` (14px → `text-sm`)
- Padding : réduit — 32px vertical (`py-8`)
- Max-width : 640px, centré horizontalement
- Aucun lien social (Instagram est le canal d'entrée, pas de sortie)
- Ton : utilitaire, discret — pas de ton émotionnel

**Responsive :**
| Breakpoint | Layout |
|---|---|
| Mobile (< lg) | Empilé verticalement, centré |
| Tablet (< lg) | Empilé verticalement, centré |
| Desktop (≥ lg / 1024px+) | En ligne horizontale, centré |

### Pages Légales — Contenu Requis

**mentions-legales.astro :**
- Identité : "Slow Adventures" — Elena (nom complet à fournir par Elena)
- Statut : Micro-entreprise / Entreprise individuelle
- Siège social : Adresse (à fournir par Elena — utiliser placeholder si nécessaire)
- Email : adresse email de contact (à fournir par Elena)
- Hébergeur : Netlify, Inc. — 44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA
- Directeur de publication : Elena
- Structure HTML : `<main id="main">` > `<h1>` > sections `<h2>` > contenu `<p>`

**politique-confidentialite.astro :**
- Responsable du traitement : Elena / Slow Adventures
- Finalités du traitement : newsletter (Brevo), analytics (GA4 conditionnel), réservation (Calendly)
- Base légale : consentement (RGPD Art. 6.1.a)
- Données collectées : email (newsletter), données de navigation anonymisées (GA4 après consentement)
- Services tiers avec liens :
  - **Brevo** (ex-Sendinblue) — API emails, clé publique restreinte côté client
  - **Google Analytics 4** — chargé uniquement après consentement cookies
  - **Calendly** — iframe intégrée pour réservation, pas de stockage côté SA
  - **Netlify** — hébergement, aucune donnée personnelle stockée
- Stockage local : `localStorage` pour consentement cookies et détection visiteur retour — pas de cookies tiers sans consentement
- Durée de conservation : données Brevo selon politique Brevo, pas de stockage serveur côté SA
- Droits : accès, rectification, suppression, portabilité, opposition — contact email
- Mise à jour : date de dernière mise à jour

### Versions des Dépendances (Confirmées Story 1.2)

| Package | Version | Notes |
|---|---|---|
| `astro` | 5.17.1 | Rester sur v5 stable |
| `tailwindcss` | 4.1.18 | Config CSS-based `@theme` |
| `@tailwindcss/vite` | 4.1.18 | Plugin Vite dans astro.config.mjs |
| `vitest` | 3.2.4 | Tests dans `tests/` |

### Design Tokens Disponibles (Rappel)

| Token | Hex | Usage pour cette story |
|---|---|---|
| `creme` | #fff9f3 | Background pages légales |
| `creme-dark` | #f5ede3 | Background footer |
| `warm-black` | #2c2825 | Titres et texte principal pages légales |
| `warm-gray` | #6b5e52 | Texte secondaire, texte footer, sous-titres |
| `terracotta` | #c0603e | Hover liens éventuel |

### Patterns de Code à Suivre

**Pattern composant statique (Footer) — depuis l'architecture :**
```astro
---
interface Props {
  // props si nécessaire
}
---

<footer class="bg-creme-dark py-8">
  <!-- contenu sémantique -->
</footer>
```

**Pattern page légale — depuis BaseLayout existant :**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="..." description="...">
  <main id="main" class="sa-section-padding max-w-3xl mx-auto">
    <h1 class="font-serif text-3xl text-warm-black mb-8">...</h1>
    <!-- sections -->
  </main>
</BaseLayout>
```

**IMPORTANT — Tests dans `tests/` UNIQUEMENT :**
Les tests DOIVENT être dans le dossier `tests/` (PAS dans `src/`). Astro/Vite traite les `.test.ts` dans `src/` au build et provoque des erreurs vitest internal state.

**Pattern de test existant (depuis Story 1.2) :**
Les tests existants lisent le contenu des fichiers et valident avec des regex/string matching. Exemple :
```typescript
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const fileContent = fs.readFileSync(
  path.resolve(__dirname, '../../src/pages/mentions-legales.astro'),
  'utf-8'
);
```

### Alertes Techniques

1. **Footer dans BaseLayout :** Le footer est ajouté dans `BaseLayout.astro`, pas dans chaque page individuellement. Cela garantit sa présence sur TOUTES les pages (index, mentions-legales, politique-confidentialite).

2. **Pas de header :** Ne PAS ajouter de `<header>` — cela viendra dans une story ultérieure (Epic 2).

3. **Pas de skip-to-content :** Sera ajouté en Story 2.6 (accessibilité transversale). Ne pas anticiper.

4. **Contenu placeholder :** Si les informations exactes d'Elena (nom complet, adresse, email) ne sont pas disponibles, utiliser des placeholders clairement marqués avec `<!-- TODO: Remplacer par les vraies données -->` pour faciliter la mise à jour.

5. **Année dynamique dans le copyright :** Utiliser `new Date().getFullYear()` dans le frontmatter Astro pour éviter de hardcoder l'année.

6. **Prettier obligatoire :** Exécuter `prettier --write` sur chaque fichier créé immédiatement — Prettier reformate au premier run.

7. **Pas de `@apply` excessif :** Utiliser les classes Tailwind directement sur les éléments HTML. `@apply` uniquement dans `global.css` pour les classes utilitaires custom `sa-*`.

8. **Accessibilité des liens du footer :** Les liens doivent avoir un texte descriptif visible (pas de "cliquez ici"). L'email doit être un `<a href="mailto:...">`.

### Learnings from Story 1.2

- Prettier lowercases les hex colors — les valeurs dans les tests doivent utiliser les valeurs lowercase (#7b8f6b, pas #7B8F6B)
- Tests dans `tests/` — JAMAIS dans `src/` (erreur vitest internal state)
- `.gitkeep` dans les dossiers vides — supprimer le `.gitkeep` de `src/components/` quand le premier vrai composant est créé (Footer.astro)
- `Astro.site` peut être `undefined` — utiliser `Astro.site ?? new URL('https://slowadventures.fr')` (pattern établi dans BaseLayout)
- Google Fonts : preload non-blocking pattern déjà en place dans BaseLayout

### Project Structure Notes

Fichiers à créer/modifier dans cette story :

```
web/
├── src/
│   ├── components/
│   │   └── Footer.astro           ← CRÉER (premier composant, remplace .gitkeep)
│   ├── layouts/
│   │   └── BaseLayout.astro       ← MODIFIER (ajouter import + <Footer /> avant </body>)
│   ├── pages/
│   │   ├── index.astro            → PAS DE MODIFICATION (footer vient de BaseLayout)
│   │   ├── mentions-legales.astro ← CRÉER
│   │   └── politique-confidentialite.astro ← CRÉER
├── tests/
│   ├── components/
│   │   └── Footer.test.ts         ← CRÉER
│   ├── layouts/
│   │   └── BaseLayout.test.ts     ← MODIFIER (ajouter test Footer inclus)
│   ├── pages/
│   │   ├── index.test.ts          → PAS DE MODIFICATION
│   │   ├── mentions-legales.test.ts ← CRÉER
│   │   └── politique-confidentialite.test.ts ← CRÉER
│   └── build-output.test.ts       ← MODIFIER (ajouter vérification pages légales)
```

Alignement vérifié avec l'arborescence définie dans l'architecture :
- `src/pages/mentions-legales.astro` ✓ (listé dans l'architecture)
- `src/pages/politique-confidentialite.astro` ✓ (listé dans l'architecture)
- `src/components/Footer.astro` — N'est PAS dans la liste des 14 composants de l'architecture (qui couvre les composants de contenu). Le footer est un composant de layout/utilitaire. C'est cohérent avec la description UX "bloc utilitaire, pas un composant storytelling".

### References

- [Source: docs/planning-artifacts/epics.md#Story 1.3] — Acceptance criteria complets avec BDD
- [Source: docs/planning-artifacts/architecture.md#Sécurité & Conformité RGPD] — "Pages légales : mentions-legales.astro et politique-confidentialite.astro — pages statiques, même BaseLayout, contenu hardcodé"
- [Source: docs/planning-artifacts/architecture.md#Arborescence Complète du Projet] — Chemins fichiers pages légales
- [Source: docs/planning-artifacts/architecture.md#Implementation Patterns] — Patterns composant statique Astro
- [Source: docs/planning-artifacts/architecture.md#Naming Patterns] — kebab-case pour pages .astro
- [Source: docs/planning-artifacts/ux-design-specification.md#Footer] — Specs visuelles footer (creme-dark, warm-gray, text-sm, 640px max, responsive)
- [Source: docs/planning-artifacts/ux-design-specification.md#Microcopy] — Ton utilitaire discret pour le footer
- [Source: docs/planning-artifacts/prd.md#FR31-FR34] — Requirements conformité & légal
- [Source: docs/implementation-artifacts/1-2-design-tokens-baselayout-seo.md] — Learnings story précédente (tests dans tests/, prettier lowercase, .gitkeep)
- [Source: docs/implementation-artifacts/1-2-design-tokens-baselayout-seo.md#Alertes Techniques] — "Ne PAS ajouter de footer dans BaseLayout — le footer sera ajouté en Story 1.3"

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- ESLint `no-non-null-assertion` corrigé dans Footer.test.ts (remplacé `!` par `?? []`)

### Completion Notes List

- Page mentions-legales.astro créée avec contenu légal complet (identité, hébergeur Netlify, contact, directeur de publication), structure sémantique h1/h2, design tokens appliqués, placeholders TODO pour données réelles d'Elena
- Page politique-confidentialite.astro créée avec toutes les sections RGPD requises (responsable, finalités, base légale, données collectées, services tiers Brevo/GA4/Calendly/Netlify, localStorage, durée conservation, droits utilisateurs, mise à jour)
- Composant Footer.astro créé — bloc utilitaire statique (0 JS), sémantique `<footer>`, bg-creme-dark, text-warm-gray text-sm, max-w-[640px], responsive flex-col/lg:flex-row, liens descriptifs avec hover:underline + transition-colors, copyright avec année dynamique
- Footer intégré dans BaseLayout.astro après `<slot />` — présent sur toutes les pages
- `.gitkeep` supprimé de `src/components/` (remplacé par Footer.astro)
- 133 tests passent (116 unitaires + 17 build-output), 0 régressions, lint 0 erreurs
- **[Code Review]** 6 issues corrigées : droit RGPD limitation ajouté, sprint-status dans File List, tests build-output renforcés (footer content), test h2 Siège social ajouté, `<code>` stylé design tokens, `aria-label` footer. Vouvoiement maintenu sur pages juridiques (décision Elena). 137 tests passent.

### Change Log

- 2026-02-10: Story 1.3 implémentée — pages légales (mentions-legales, politique-confidentialite), composant Footer intégré dans BaseLayout, tests complets ajoutés
- 2026-02-10: Code review — 6 fixes appliqués (RGPD limitation, tests renforcés, aria-label footer, `<code>` styling, couverture h2, File List complétée). Status → done

### File List

- `web/src/pages/mentions-legales.astro` (CRÉÉ)
- `web/src/pages/politique-confidentialite.astro` (CRÉÉ)
- `web/src/components/Footer.astro` (CRÉÉ)
- `web/src/layouts/BaseLayout.astro` (MODIFIÉ — ajout import Footer + `<Footer />`)
- `web/src/components/.gitkeep` (SUPPRIMÉ)
- `web/tests/pages/mentions-legales.test.ts` (CRÉÉ)
- `web/tests/pages/politique-confidentialite.test.ts` (CRÉÉ)
- `web/tests/components/Footer.test.ts` (CRÉÉ)
- `web/tests/layouts/BaseLayout.test.ts` (MODIFIÉ — ajout tests Footer integration)
- `web/tests/build-output.test.ts` (MODIFIÉ — ajout tests pages légales + footer)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — story passée en review)
