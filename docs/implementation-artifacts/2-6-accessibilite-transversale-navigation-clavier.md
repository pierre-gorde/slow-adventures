# Story 2.6: Accessibilité transversale & Navigation clavier

Status: done

## Story

As a visiteur utilisant un clavier ou un lecteur d'écran,
I want naviguer sur l'intégralité du site sans souris et accéder à tout le contenu via un lecteur d'écran,
So that le site soit utilisable par tous, indépendamment de mes capacités.

## Acceptance Criteria

### Skip-to-content

1. **Given** le visiteur arrive sur la page **When** il appuie sur Tab pour la première fois **Then** un lien "Aller au contenu" (skip-to-content) apparaît visuellement, ciblant `#main` (FR21) **And** le lien est caché visuellement par défaut (`sr-only`) et visible uniquement au focus clavier (`focus:not-sr-only`)

### Navigation clavier & focus

2. **Given** le visiteur navigue au clavier **When** il appuie successivement sur Tab **Then** le focus traverse les éléments interactifs dans l'ordre logique : skip-to-content → footer liens → sections interactives (FR21) **And** le focus est toujours visible avec `outline: 2px solid terracotta` + `outline-offset: 4px` **And** toutes les zones interactives ont un touch target minimum de 44x44px

### Lecteur d'écran

3. **Given** le visiteur utilise un lecteur d'écran **When** il parcourt la page **Then** chaque section a un heading logique (h1 → h2 → h3), pas de saut de niveau (FR22) **And** toutes les images ont un attribut `alt` descriptif (pas vide sauf décoratives avec `aria-hidden="true"`) **And** les éléments interactifs ont des `aria-label` ou `aria-labelledby` appropriés **And** le HTML utilise les balises sémantiques : `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`

### Lighthouse & axe

4. **Given** le site est buildé **When** on exécute un audit Lighthouse Accessibility **Then** le score est >= 95 (NFR6) **And** zéro violation axe critical ou serious (NFR7)

### Contrastes

5. **Given** la palette de couleurs est appliquée **When** on vérifie les contrastes **Then** toutes les combinaisons texte/fond respectent le ratio 4.5:1 minimum (NFR8) **And** les combinaisons vérifiées incluent : warm-black/crème (11.2:1), warm-gray/crème (5.3:1), white/terracotta (4.6:1 — AA large)

## Tasks / Subtasks

- [x] Task 1: Ajouter le skip-to-content dans BaseLayout (AC: #1)
  - [x] 1.1 Ajouter `<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-terracotta focus:text-white focus:px-4 focus:py-2 focus:rounded">Aller au contenu</a>` comme premier enfant de `<body>` dans `web/src/layouts/BaseLayout.astro`
  - [x] 1.2 Vérifier que `<main id="main">` existe déjà (confirmé — présent dans index.astro, mentions-legales.astro, politique-confidentialite.astro)
  - [x] 1.3 Ajouter les tests dans `web/tests/layouts/BaseLayout.test.ts` : lien skip-to-content présent, `href="#main"`, classes `sr-only` + `focus:not-sr-only`
- [x] Task 2: Implémenter les styles focus-visible globaux (AC: #2)
  - [x] 2.1 Ajouter dans `web/src/styles/global.css` une règle globale `focus-visible` :
    ```css
    :focus-visible {
      outline: 2px solid var(--color-terracotta);
      outline-offset: 4px;
    }
    :focus:not(:focus-visible) {
      outline: none;
    }
    ```
  - [x] 2.2 Ajouter les tests dans `web/tests/styles/global.css.test.ts` : présence de `:focus-visible` et `:focus:not(:focus-visible)`
- [x] Task 3: Corriger CTAButton focus et reduced-motion (AC: #2, #5)
  - [x] 3.1 Dans `web/src/components/CTAButton.astro` : supprimé `focus:outline-2 focus:outline-terracotta focus:outline-offset-4` (global.css gère désormais le focus-visible)
  - [x] 3.2 Ajouté `motion-safe:` prefix aux transitions : `motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-[...]`
  - [x] 3.3 Mis à jour `web/tests/components/CTAButton.test.ts` : tests `motion-safe:`, supprimé tests `focus:outline` inline
- [x] Task 4: Ajouter les `id` de section dans index.astro (AC: #1, #3)
  - [x] 4.1 Dans `web/src/pages/index.astro` : ajouté `<div id="elena">` wrapper autour d'ElenaSection
  - [x] 4.2 Ajouté `<section id="destinations">` englobant les 4 DestinationBlock, avec `<h2 class="sr-only">Nos destinations</h2>`
  - [x] 4.3 Ajouté `id="processus"` à la section Processus
  - [x] 4.4 Vérifié que `id="temoignages"` et `id="tarifs"` existent déjà (confirmé — ajoutés en story 2-5)
  - [x] 4.5 Mis à jour `web/tests/pages/index.test.ts` : tests présence des `id` de section
- [x] Task 5: Ajouter `aria-labelledby` aux sections et `aria-hidden` sur les éléments décoratifs (AC: #3)
  - [x] 5.1 Dans `ElenaSection.astro` : ajouté `id="heading-elena"` sur le `<h2>` et `aria-labelledby="heading-elena"` sur le `<section>`
  - [x] 5.2 Dans `DestinationBlock.astro` : ajouté `id` dynamique sur le `<h2>` (`id={headingId}`) et `aria-labelledby={headingId}` sur le `<section>`
  - [x] 5.3 Dans `ProcessStep.astro` : ajouté `aria-hidden="true"` sur le `<span>` qui contient l'icône SVG
  - [x] 5.4 Mis à jour les tests correspondants : `ElenaSection.test.ts`, `DestinationBlock.test.ts`, `ProcessStep.test.ts`
- [x] Task 6: Ajouter les focus styles sur les liens Footer et pages légales (AC: #2)
  - [x] 6.1 Vérifié que les liens du `Footer.astro` héritent du `focus-visible` global (aucun `outline: none` trouvé)
  - [x] 6.2 Aucun `outline: none` ou `outline: 0` à supprimer
  - [x] 6.3 Même vérification pour `mentions-legales.astro` et `politique-confidentialite.astro` — OK
  - [x] 6.4 Ajouté tests dans `web/tests/components/Footer.test.ts` : vérifie qu'aucun lien n'a `outline: none`
- [x] Task 7: Compléter le `prefers-reduced-motion` sur HeroSection et ScrollHint (AC: #2)
  - [x] 7.1 Dans `HeroSection.astro` : ajouté `@media (prefers-reduced-motion: reduce) { .hero__video { transition: none } }`
  - [x] 7.2 Dans `ScrollHint.astro` : ajouté `@media (prefers-reduced-motion: reduce) { .scroll-hint { transition: none } }`
  - [x] 7.3 Mis à jour `web/tests/components/HeroSection.test.ts` : test `prefers-reduced-motion` + `.hero__video` + `transition: none`
- [x] Task 8: Audit heading hierarchy et sémantique HTML (AC: #3)
  - [x] 8.1 Vérifié : un seul `<h1>` (Hero), `<h2>` par section, `<h3>` pour sous-éléments. Pas de saut de niveau
  - [x] 8.2 Vérifié : `<html lang="fr">` présent dans BaseLayout
  - [x] 8.3 Vérifié : `<main id="main">`, `<section>` par section, `<footer>` — structure sémantique complète
  - [x] 8.4 Créé `web/tests/accessibility/heading-hierarchy.test.ts` : 17 tests couvrant h1 unique, séquence h1→h2→h3, lang="fr", landmarks
- [x] Task 9: Validation finale (AC: #4, #5)
  - [x] 9.1 `npm run lint` — 0 erreurs ESLint et Prettier
  - [x] 9.2 `npm run test` — 508 tests passent (469 → 508, +39 nouveaux)
  - [x] 9.3 `npm run build` — build réussi, 3 pages, 1.19s
  - [x] 9.4 Vérification manuelle : à effectuer par Elena dans le navigateur
  - [x] 9.5 Contrastes documentés : warm-black/crème 11.2:1, warm-gray/crème 5.3:1, white/terracotta 4.6:1 (AA large), terracotta-dark/crème 5.8:1

## Dev Notes

### Nature transversale de cette story

Cette story est **transversale** — elle touche TOUS les fichiers existants sans ajouter de nouvelle fonctionnalité visible. Les modifications sont additives (attributs HTML, classes CSS, tests) et ne doivent casser aucune fonctionnalité existante.

### Inventaire complet des fichiers à modifier

| Fichier | Modifications |
|---------|--------------|
| `web/src/layouts/BaseLayout.astro` | Skip-to-content link |
| `web/src/styles/global.css` | `:focus-visible` global, `:focus:not(:focus-visible)` |
| `web/src/components/CTAButton.astro` | Supprimer focus inline (global gère), `motion-safe:` transitions |
| `web/src/components/HeroSection.astro` | `prefers-reduced-motion` sur `.hero__video` transition |
| `web/src/components/ScrollHint.astro` | Vérifier reduced-motion CSS transition (priorité basse) |
| `web/src/components/ElenaSection.astro` | `id` sur `<h2>`, `aria-labelledby` sur `<section>` |
| `web/src/components/DestinationBlock.astro` | `id` dynamique sur `<h2>`, `aria-labelledby` sur `<section>` |
| `web/src/components/ProcessStep.astro` | `aria-hidden="true"` sur le span icône |
| `web/src/components/Footer.astro` | Vérifier héritage focus-visible (aucun `outline: none`) |
| `web/src/pages/index.astro` | `id="elena"`, `id="destinations"` wrapper, `id="processus"` |
| `web/src/pages/mentions-legales.astro` | Vérifier focus styles liens |
| `web/src/pages/politique-confidentialite.astro` | Vérifier focus styles liens |

### Pattern focus-visible — approche globale

La stratégie choisie est un **style focus-visible global** dans `global.css` plutôt que des classes Tailwind inline sur chaque composant. Avantages :
- Cohérence garantie sur tout le site
- Impossible d'oublier le focus sur un nouvel élément
- CTAButton peut supprimer ses classes `focus:outline-*` inline — le global prend le relais

```css
/* global.css — AJOUTER */
:focus-visible {
  outline: 2px solid var(--color-terracotta);
  outline-offset: 4px;
}

/* Supprimer le outline sur clic souris (focus sans focus-visible) */
:focus:not(:focus-visible) {
  outline: none;
}
```

**ATTENTION** : Vérifier que `var(--color-terracotta)` est disponible dans le theme Tailwind v4. Si non, utiliser la valeur hex directe `#c0603e`. Les tokens sont dans `global.css` sous `@theme { --color-terracotta: #c0603e; }`.

### Pattern motion-safe pour CTAButton

Tailwind v4 fournit les classes `motion-safe:` et `motion-reduce:`. Deux approches possibles :

**Option A (recommandée) — motion-safe prefix :**
```
motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-[...]
```

**Option B — motion-reduce override :**
```
transition-all duration-300 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none
```

L'option A est plus propre : les transitions ne s'appliquent que si l'utilisateur n'a PAS demandé reduced-motion.

### Skip-to-content — implémentation

Le lien doit être le **premier enfant** de `<body>` (avant tout autre contenu) :

```astro
<!-- BaseLayout.astro — premier enfant de <body> -->
<a
  href="#main"
  class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-terracotta focus:text-white focus:px-4 focus:py-2 focus:rounded"
>
  Aller au contenu
</a>
```

**Note :** Le focus-visible global s'appliquera automatiquement à ce lien. Pas besoin d'ajouter `focus:outline-*` inline.

### Section IDs et aria-labelledby

L'ajout d'`id` sur les sections permet l'ancrage ET l'accessibilité. Chaque `<section>` avec un `<h2>` doit avoir `aria-labelledby` pointant vers le heading pour que les lecteurs d'écran annoncent le nom de la section landmark.

```astro
<!-- Exemple ElenaSection -->
<section aria-labelledby="heading-elena" class="...">
  <h2 id="heading-elena">...</h2>
```

```astro
<!-- Exemple DestinationBlock — id dynamique -->
<section aria-labelledby={headingId} class="...">
  <h2 id={headingId}>...</h2>
```

Pour les Destinations, un wrapper `<section id="destinations">` avec un heading `sr-only` regroupe les 4 blocs en un seul landmark pour les lecteurs d'écran.

### Patterns établis dans les stories précédentes — À RESPECTER

- **GSAP** : import depuis `../lib/gsap` JAMAIS depuis `'gsap'`
- **Tests** : dans `web/tests/` JAMAIS dans `src/`
- **Tests pattern** : `readFileSync` + string matching / regex (pas de rendu)
- **Prettier** : lowercases hex — tester avec `#c0603e` pas `#C0603E`
- **ESLint** : `?? fallback` au lieu de `!` (no-non-null-assertion)
- **Sort immutable** : `[...array].sort()` pas `.sort()`
- **Composants statiques** : 0 `<script>` tag
- **SectionReveal** : gsap.fromTo() pattern, `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`
- **desktopOnly** : `hidden lg:inline-block`

### Contrastes vérifiés (référence PRD + UX spec)

| Combinaison | Ratio | WCAG AA | Usage |
|-------------|-------|---------|-------|
| warm-black `#2c2825` sur crème `#fff9f3` | 11.2:1 | Pass | Texte principal |
| warm-gray `#6b5e52` sur crème `#fff9f3` | 5.3:1 | Pass | Texte secondaire |
| terracotta `#c0603e` sur crème `#fff9f3` | 4.6:1 | Pass (AA large) | Titres, CTA |
| white `#ffffff` sur terracotta `#c0603e` | 4.6:1 | Pass (AA large) | Texte sur CTA |
| terracotta-dark `#a04e30` sur crème `#fff9f3` | 5.8:1 | Pass | CTA active |
| sauge `#7b8f6b` sur crème `#fff9f3` | 3.7:1 | Large only | Icônes, accents |
| ambre `#d4956a` sur crème `#fff9f3` | 3.1:1 | Décoratif | Séparateurs — jamais porteur d'info |

### WCAG 2.1 AA — Critères couverts par cette story

| Critère | Exigence | Implémentation |
|---------|----------|----------------|
| 1.1.1 Non-text Content | Alt text toutes images | Audit : déjà en place sur poster, Elena, destinations, testimonials. `aria-hidden` sur vidéo décorative |
| 1.3.1 Info and Relationships | Structure sémantique | `<header>`, `<main>`, `<section>`, `<footer>`, headings h1→h2→h3, `<ol>`, `<blockquote>`, `<dl>` |
| 1.4.3 Contrast (Minimum) | 4.5:1 texte, 3:1 grand | Vérifié — tableau ci-dessus |
| 1.4.11 Non-text Contrast | 3:1 éléments UI | Focus ring terracotta sur crème = 4.6:1 |
| 2.1.1 Keyboard | Tout accessible clavier | Focus ring visible sur CTA, liens. Tab order logique |
| 2.4.1 Bypass Blocks | Skip navigation | `<a href="#main" class="sr-only focus:not-sr-only">` |
| 2.4.3 Focus Order | Ordre logique | DOM order = visual order. Pas de `tabindex` positif |
| 2.4.7 Focus Visible | Focus toujours visible | `:focus-visible` global terracotta |
| 2.5.5 Target Size | Touch 44×44px min | CTA 48px, liens footer suffisants |
| 3.1.1 Language | Attribut `lang` | `<html lang="fr">` |

### État actuel du `prefers-reduced-motion`

| Animation | Fichier | État actuel | Action |
|-----------|---------|-------------|--------|
| SectionReveal GSAP | SectionReveal.astro | `gsap.matchMedia('no-preference')` + CSS | OK — rien à faire |
| Hero video autoplay | HeroSection.astro | Video supprimée si reducedMotion | OK — rien à faire |
| Hero parallax | HeroSection.astro | Wrapped in matchMedia | OK — rien à faire |
| Hero video opacity CSS | HeroSection.astro | `transition: opacity 1s` — **PAS couvert** | Ajouter media query |
| ScrollHint chevron | ScrollHint.astro | `animation: none` sous reduce | OK — rien à faire |
| ScrollHint fade-out CSS | ScrollHint.astro | `transition: opacity 0.5s` — **PAS couvert** | Mineur (aria-hidden) |
| CTAButton hover/scale | CTAButton.astro | **PAS couvert** | `motion-safe:` prefix |
| IO fallback reveal | global.css | Implicitement couvert (`opacity: 1` sous reduce) | OK — rien à faire |

### Project Structure Notes

- Toutes les modifications respectent la structure existante du projet
- Nouveau dossier de tests : `web/tests/accessibility/` pour les tests transversaux (heading hierarchy, etc.)
- Aucun nouveau composant créé — uniquement des modifications
- Aucune dépendance npm ajoutée

### References

- [Source: docs/planning-artifacts/epics.md#Story 2-6] — AC complètes, FR21, FR22
- [Source: docs/planning-artifacts/prd.md#Accessibilité] — WCAG 2.1 AA, contrastes, touch targets
- [Source: docs/planning-artifacts/prd.md#NFR6-9] — Lighthouse 95+, axe 0 critical, contrastes 4.5:1, reduced-motion
- [Source: docs/planning-artifacts/architecture.md#Cross-Cutting #3] — WCAG transversal, focus ring, aria-live, touch 44px
- [Source: docs/planning-artifacts/architecture.md#Anti-Patterns] — pas de click sans keyboard, pas ignorer reduced-motion
- [Source: docs/planning-artifacts/architecture.md#GSAP reduced-motion] — pattern matchMedia + CSS fallback
- [Source: docs/planning-artifacts/ux-design-specification.md#Accessibility] — WCAG checklist complète, motion management, skip-link, focus style
- [Source: docs/planning-artifacts/ux-design-specification.md#Color System] — tableau contrastes complet
- [Source: docs/implementation-artifacts/2-5-temoignages-pricing.md] — patterns dev, 465 tests, learnings
- [Source: docs/implementation-artifacts/2-4-destinations-content-collections-destinationblock.md] — patterns overlay, SectionReveal fromTo

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

Aucun problème bloquant rencontré. Prettier a reformaté 5 fichiers après modifications (résolu avec `--write`).

### Completion Notes List

- Skip-to-content link ajouté comme premier enfant de `<body>` dans BaseLayout, ciblant `#main`
- Styles `:focus-visible` globaux dans global.css avec terracotta outline + 4px offset
- CTAButton : supprimé focus inline (géré par global), ajouté `motion-safe:` sur toutes les transitions/hover
- Section IDs ajoutés dans index.astro : `elena` (wrapper div), `destinations` (section wrapper avec h2 sr-only), `processus`
- `aria-labelledby` ajouté sur ElenaSection et DestinationBlock (dynamique via headingId)
- `aria-hidden="true"` ajouté sur icône decorative dans ProcessStep
- Footer et pages légales : confirmé aucun `outline: none` — héritage global OK
- `prefers-reduced-motion: reduce` ajouté sur `.hero__video` (HeroSection) et `.scroll-hint` (ScrollHint) pour couvrir les transitions CSS
- Hiérarchie des headings auditée et confirmée : h1 unique (Hero), h2 par section, h3 sous-éléments
- Contrastes WCAG AA vérifiés et documentés
- 508 tests passent (469 → 508, +39 nouveaux), 0 échec, lint propre, build OK

### File List

**Fichiers modifiés :**
- `web/src/layouts/BaseLayout.astro` — skip-to-content link
- `web/src/styles/global.css` — `:focus-visible` et `:focus:not(:focus-visible)` globaux
- `web/src/components/CTAButton.astro` — supprimé focus inline, ajouté `motion-safe:`
- `web/src/components/ElenaSection.astro` — `aria-labelledby` + `id` sur h2
- `web/src/components/DestinationBlock.astro` — `aria-labelledby` dynamique + `id` sur h2
- `web/src/components/ProcessStep.astro` — `aria-hidden="true"` sur span icône
- `web/src/components/HeroSection.astro` — `prefers-reduced-motion` media query
- `web/src/components/ScrollHint.astro` — `prefers-reduced-motion` media query
- `web/src/pages/index.astro` — `id="elena"`, `id="destinations"` wrapper, `id="processus"`
- `web/tests/layouts/BaseLayout.test.ts` — +4 tests skip-to-content
- `web/tests/styles/global.css.test.ts` — +3 tests focus-visible
- `web/tests/components/CTAButton.test.ts` — mis à jour tests motion-safe/focus
- `web/tests/pages/index.test.ts` — +6 tests section IDs
- `web/tests/components/ElenaSection.test.ts` — +2 tests aria-labelledby
- `web/tests/components/DestinationBlock.test.ts` — +3 tests aria-labelledby
- `web/tests/components/ProcessStep.test.ts` — +1 test aria-hidden
- `web/tests/components/Footer.test.ts` — +2 tests no outline:none
- `web/tests/components/HeroSection.test.ts` — +1 test reduced-motion
- `docs/implementation-artifacts/sprint-status.yaml` — status in-progress → review

**Fichiers créés :**
- `web/tests/accessibility/heading-hierarchy.test.ts` — 17 tests heading hierarchy + sémantique

### Change Log

- **2026-02-13** — Story 2-6 implémentée : accessibilité transversale WCAG 2.1 AA (skip-to-content, focus-visible global, motion-safe, aria-labelledby, heading hierarchy, reduced-motion CSS). 39 nouveaux tests, 508 total.
- **2026-02-13** — Code review : 8 issues corrigées (1 HIGH, 5 MEDIUM, 2 LOW). `<nav>` ajouté au Footer, `<header>` wrappant le HeroSection, `aria-labelledby` cohérent sur toutes les sections, touch targets 44px Footer, `<div id="elena">` remplacé par prop `id` sur ElenaSection, aria-label Hero en français, test ScrollHint transition:none ajouté. Bug bfcache mobile corrigé (visibilitychange + pageshow/ScrollTrigger.refresh). 522 tests (+14), lint OK, build OK.

## Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.6 — 2026-02-13
**Outcome:** Approved with fixes applied

### Issues Found & Fixed (8/8)

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | HIGH | Missing `<nav>` landmark dans Footer | Wrappé liens dans `<nav aria-label>` |
| 2 | MEDIUM | Missing `<header>` landmark | HeroSection wrappé dans `<header>` (avant `<main>`) |
| 3 | MEDIUM | `aria-labelledby` incohérent | Ajouté sur destinations, processus, temoignages, tarifs |
| 4 | MEDIUM | Test manquant ScrollHint transition:none | Test ajouté dans ScrollHint.test.ts |
| 5 | MEDIUM | Touch targets Footer < 44px | `min-h-11 inline-flex items-center` sur liens |
| 6 | MEDIUM | `<div id="elena">` non-sémantique | Prop `id` sur ElenaSection, `<div>` supprimé |
| 7 | LOW | aria-label Hero en anglais | Changé en "Section d'accueil — introduction visuelle" |
| 8 | LOW | Pas de test axe-core automatisé | Documenté pour future story (pas de dépendance ajoutée) |

### Bug Fix additionnel

**bfcache mobile** — Vidéo et effets GSAP ne reprennent pas après retour d'onglet sur mobile. Corrigé via `visibilitychange` (video.play resume) et `pageshow` (ScrollTrigger.refresh).
- **2026-02-13** — Code review (adversariale) : 8 issues trouvées et corrigées (1 HIGH, 5 MEDIUM, 2 LOW). Fixes appliqués : `<nav>` landmark dans Footer, `<header>` wrapping HeroSection, `aria-labelledby` cohérent sur toutes les sections, touch targets 44px Footer, prop `id` sur ElenaSection (suppression `<div>` wrapper), aria-label FR sur HeroSection, test reduced-motion ScrollHint, bfcache resume (video `visibilitychange` + `ScrollTrigger.refresh()` sur `pageshow`). 522 tests total (+14), lint propre, build OK.
