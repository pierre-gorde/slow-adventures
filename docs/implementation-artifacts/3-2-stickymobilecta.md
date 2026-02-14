# Story 3.2: StickyMobileCTA

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur mobile,
I want accéder au CTA principal en permanence pendant mon scroll sans qu'il gêne l'immersion,
So that je puisse réserver à tout moment sans chercher le bouton.

## Acceptance Criteria

### AC1 — Apparition du sticky CTA après le hero

1. **Given** le visiteur est sur mobile (< lg breakpoint) **When** il scrolle au-delà du hero (scroll > 100vh) **Then** une barre sticky apparaît en bas de l'écran avec un bouton terracotta "Confie-moi ton prochain rêve" (FR10) **And** la barre a un fond `creme` semi-transparent + `backdrop-filter: blur` **And** le composant `StickyMobileCTA.astro` est un island interactif (`client:load`) **And** le touch target du bouton est >= 48px de hauteur **And** le bouton porte `data-calendly-trigger`

### AC2 — Masquage quand section CTA finale visible

2. **Given** le sticky CTA est visible **When** la section CTA finale (`id="cta-final"`, Story 3.1) entre dans le viewport **Then** le sticky CTA se masque pour éviter le doublon

### AC3 — Réapparition avec délai 300ms

3. **Given** le sticky CTA s'est masqué (car CTA finale visible) **When** la section CTA finale sort du viewport (scroll remonte ou continue) **Then** le sticky CTA réapparaît avec un délai de 300ms (évite le flash lors du scroll yoyo)

### AC4 — Invisible sur desktop

4. **Given** le visiteur est sur desktop (>= lg breakpoint) **When** la page est affichée **Then** le sticky CTA n'est pas rendu/visible (`hidden lg:hidden` — mobile only)

### AC5 — Accessibilité

5. **Given** le composant est rendu **When** on inspecte l'accessibilité **Then** le sticky CTA a `role="complementary"` et un `aria-label` descriptif

### AC6 — Masquage quand CalendlyModal ouverte

6. **Given** la modale Calendly est ouverte (Epic 3 Story 3.3 — futur) **When** le sticky CTA est visible **Then** le sticky CTA se masque pendant que la modale est ouverte (via CustomEvent `sa:modal-open` / `sa:modal-close`)

## Tasks / Subtasks

- [x] Task 1: Créer le composant `StickyMobileCTA.astro` (AC: #1, #4, #5)
  - [x] 1.1 Créer `web/src/components/StickyMobileCTA.astro` — island interactif avec `<script>` tag
  - [x] 1.2 Markup HTML : `<aside>` avec `role="complementary"`, `aria-label="Réserver une discovery call"`, classes `fixed bottom-0 left-0 right-0 z-50`
  - [x] 1.3 Fond : `bg-creme/80 backdrop-blur-md` (Tailwind v4 + `-webkit-backdrop-filter` pour Safari)
  - [x] 1.4 Bouton interne : `<a>` avec `href={import.meta.env.PUBLIC_CALENDLY_URL}`, `data-calendly-trigger`, texte "Confie-moi ton prochain rêve", hauteur minimum 48px
  - [x] 1.5 Masquage desktop : `class="lg:hidden"` sur le conteneur racine
  - [x] 1.6 État initial : masqué (`opacity: 0`, `pointer-events: none`, `translate-y-full`) — le `<script>` gère l'apparition

- [x] Task 2: Logique IntersectionObserver — apparition/masquage (AC: #1, #2, #3)
  - [x] 2.1 Dans le `<script>` : observer le `<header>` (hero) — si visible, masquer le sticky CTA ; si invisible (scroll > 100vh), afficher
  - [x] 2.2 Observer `#cta-final` — si visible, masquer le sticky CTA
  - [x] 2.3 Logique combinée : sticky visible SEULEMENT si hero invisible ET cta-final invisible
  - [x] 2.4 Délai 300ms via `setTimeout` sur la réapparition uniquement (pas sur le masquage — masquage immédiat)
  - [x] 2.5 Transition CSS smooth : `transition: opacity 300ms ease-out, transform 300ms ease-out`
  - [x] 2.6 Cleanup : `observer.disconnect()` dans un `beforeunload` listener

- [x] Task 3: Listener CalendlyModal (AC: #6)
  - [x] 3.1 Écouter `sa:modal-open` → masquer le sticky CTA immédiatement
  - [x] 3.2 Écouter `sa:modal-close` → réafficher le sticky CTA (si les conditions IO sont remplies)

- [x] Task 4: Intégrer StickyMobileCTA dans `index.astro` (AC: #1)
  - [x] 4.1 Importer `StickyMobileCTA` dans `web/src/pages/index.astro`
  - [x] 4.2 Ajouter `<StickyMobileCTA />` juste avant `</BaseLayout>` (après `</main>`, en dehors de `<main>`) — Note: `client:load` retiré car non supporté sur composants `.astro` (le `<script>` tag gère l'interactivité nativement)

- [x] Task 5: Tests (AC: all)
  - [x] 5.1 Créer `web/tests/components/sticky-mobile-cta.test.ts` — tests source-level sur le composant `.astro`
  - [x] 5.2 Test : présence de `role="complementary"` et `aria-label`
  - [x] 5.3 Test : présence de `data-calendly-trigger` sur le lien
  - [x] 5.4 Test : présence de `PUBLIC_CALENDLY_URL` dans le href
  - [x] 5.5 Test : présence de `lg:hidden` pour le masquage desktop
  - [x] 5.6 Test : présence de `backdrop-blur` ou `backdrop-filter` pour l'effet glass
  - [x] 5.7 Test : présence de `StickyMobileCTA` dans `index.astro` avec placement correct (après `</main>`, avant `</BaseLayout>`)
  - [x] 5.8 Mettre à jour `web/tests/pages/index.test.ts` — ajouter un test vérifiant l'import et l'utilisation de `StickyMobileCTA`

- [x] Task 6: Validation finale (AC: all)
  - [x] 6.1 `npm run lint` — 0 erreurs ESLint et Prettier
  - [x] 6.2 `npm run test` — 563 tests passent (0 regressions)
  - [x] 6.3 `npm run build` — build réussi (0 warnings)
  - [x] 6.4 Vérification visuelle : sticky CTA visible uniquement sur mobile, masqué desktop, apparition/disparition smooth

## Dev Notes

### IMPORTANT : Ce qui est DEJA fait vs ce qui est NOUVEAU

**DEJA IMPLEMENTE (NE PAS RECREER) :**
- `CTAButton.astro` — composant complet avec props `text`, `subtext`, `href`, `size`, `variant`, `desktopOnly`, `data-calendly-trigger` (story 2-3, mis à jour 3-1)
- `SectionReveal.astro` — island d'animation avec GSAP ScrollTrigger (story 2-1)
- Section CTA finale dans `index.astro` avec `id="cta-final"` (story 3-1)
- `import.meta.env.PUBLIC_CALENDLY_URL` — variable configurée dans `.env` et `.env.example` (story 3-1)
- Design tokens dans `global.css` — terracotta, creme, warm-black, etc. (story 1-2)
- Focus-visible global et `motion-safe:` transitions (story 2-6)
- `sa-section-padding` utility class (story 1-2)

**NOUVEAU A IMPLEMENTER :**
- `StickyMobileCTA.astro` — nouveau composant island (le fichier n'existe pas encore)
- Import et placement dans `index.astro` (`client:load`)
- Tests pour le nouveau composant

### Architecture du composant StickyMobileCTA

**Type :** Island interactif (`client:load`) — hydratation immédiate pour détecter le scroll dès le chargement.

**Pourquoi `client:load` et pas `client:visible` :** Le sticky CTA est positionné en `fixed` en bas de l'écran. Il n'est jamais "dans le viewport" au sens IntersectionObserver tant que le JS ne le rend pas visible. Il doit être prêt immédiatement pour apparaitre dès que le hero sort du viewport.

**Structure HTML recommandée :**

```astro
---
// StickyMobileCTA.astro — Island client:load
---

<aside
  id="sticky-mobile-cta"
  role="complementary"
  aria-label="Réserver une discovery call"
  class="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
  style="opacity: 0; pointer-events: none; transform: translateY(100%);"
>
  <div class="bg-creme/80 backdrop-blur-md px-4 py-3 shadow-[0_-2px_16px_rgba(44,40,37,0.08)]">
    <a
      href={import.meta.env.PUBLIC_CALENDLY_URL}
      data-calendly-trigger
      class="block w-full text-center bg-terracotta text-white font-sans font-semibold rounded-full py-3 min-h-[48px] leading-[48px] motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-[0_8px_32px_rgba(192,96,62,0.15)] active:bg-terracotta-dark"
    >
      Confie-moi ton prochain rêve
    </a>
  </div>
</aside>

<script>
  // ... IntersectionObserver logic
</script>
```

**NE PAS utiliser le composant CTAButton ici** — le sticky CTA est un design spécifique (bouton pleine largeur, sans subtext, sans variantes). Utiliser directement un `<a>` stylisé pour eviter la complexité inutile.

### Logique IntersectionObserver — Diagramme d'état

```
[Page load] → sticky MASQUE (hero visible)
     |
     v
[Scroll > 100vh — hero sort du viewport]
     |
     v
sticky VISIBLE ←──────────────────┐
     |                             |
     v                             |
[CTA finale entre viewport]        |
     |                             |
     v                             |
sticky MASQUE (immédiat)           |
     |                             |
     v                             |
[CTA finale sort viewport]         |
     |                             |
     v                             |
setTimeout(300ms) ─────────────────┘

[sa:modal-open] → sticky MASQUE (immédiat)
[sa:modal-close] → retour état normal IO
```

**Logique combinée (pseudo-code) :**

```typescript
const heroVisible: boolean;      // IO callback
const ctaFinalVisible: boolean;  // IO callback
const modalOpen: boolean;        // CustomEvent listener

const shouldShow = !heroVisible && !ctaFinalVisible && !modalOpen;
```

### Safari iOS — Considerations `position: fixed`

- `backdrop-filter: blur()` est supporté sur Safari iOS 15+ (93%+ support global en 2026)
- Inclure `-webkit-backdrop-filter` pour compatibilité Safari < 18 via la classe Tailwind `backdrop-blur-md` (automatique)
- `position: fixed` en bottom fonctionne correctement sur Safari iOS 15+ pour les barres CTA (pas d'input/clavier impliqué ici)
- Pas besoin de `interactive-widget` meta tag car le sticky CTA ne contient pas de champ de saisie

### Variable d'environnement PUBLIC_CALENDLY_URL

Deja configurée (story 3-1) :
- `.env` : `PUBLIC_CALENDLY_URL=https://calendly.com/slow-adventures/discovery-call`
- `.env.example` : meme valeur
- Utiliser `import.meta.env.PUBLIC_CALENDLY_URL` dans le frontmatter Astro

### CustomEvents — Communication inter-islands

Prefixe `sa:` (slow-adventures) pour eviter les collisions. Le StickyMobileCTA écoute :
- `sa:modal-open` — dispatché par CalendlyModal (story 3-3, futur) quand la modale s'ouvre
- `sa:modal-close` — dispatché par CalendlyModal quand la modale se ferme

**IMPORTANT :** La story 3-3 n'est pas encore implémentée. Le listener `sa:modal-open` / `sa:modal-close` doit être en place dans le `<script>` mais ne sera actif qu'une fois CalendlyModal implémentée. Cela n'empêche pas le bon fonctionnement actuel.

### Patterns établis dans les stories précédentes — A RESPECTER

- **Tests** : dans `web/tests/` JAMAIS dans `src/` — Astro/Vite traite les `.test.ts` dans `src/` au build causant des erreurs vitest
- **Tests pattern** : `readFileSync` + string matching / regex (pas de rendu DOM)
- **Prettier** : lowercases hex — tester avec `#c0603e` pas `#C0603E`
- **ESLint** : `?? fallback` au lieu de `!` (no-non-null-assertion)
- **Sort immutable** : `[...array].sort()` pas `.sort()` mutable
- **GSAP** : import depuis `../lib/gsap` JAMAIS depuis `'gsap'` — mais ce composant n'utilise PAS GSAP (IntersectionObserver natif uniquement)
- **Tailwind v4** : pas de `tailwind.config.mjs`, tokens dans `@theme` de `global.css`
- **Accessibilité** : `role`, `aria-label` sur le composant interactif
- **Focus-visible** : géré globalement dans `global.css` (pas de classes inline)
- **Composants island** : `<script>` tag dans le `.astro` pour la logique client-side
- **Logging** : `console.error('[slow-adventures]', ...)` pour les erreurs, `console.warn` pour les warnings
- **Progressive enhancement** : le `<a href>` fonctionne sans JS — le lien pointe vers Calendly directement

### Placement dans index.astro

Le StickyMobileCTA doit être placé **en dehors de `<main>`** car c'est un élément UI fixe, pas du contenu de section. Placement recommandé : après `</main>`, avant `</BaseLayout>`.

```astro
  </main>
  <StickyMobileCTA client:load />
</BaseLayout>
```

**Ordre des imports** (ajouter aux imports existants) :
```astro
import StickyMobileCTA from '../components/StickyMobileCTA.astro';
```

### Budget JS estimé

~1-2kb minifié. Le composant utilise uniquement :
- `IntersectionObserver` (API native, 0kb)
- `setTimeout` (API native, 0kb)
- `document.addEventListener` pour CustomEvents (API native, 0kb)
- Aucune dépendance npm additionnelle
- Pas de GSAP (les animations sont purement CSS transitions)

### Project Structure Notes

- **Nouveau fichier** : `web/src/components/StickyMobileCTA.astro`
- **Nouveau fichier test** : `web/tests/components/sticky-mobile-cta.test.ts`
- **Fichier modifié** : `web/src/pages/index.astro` (import + placement)
- **Fichier modifié** : `web/tests/pages/index.test.ts` (test import StickyMobileCTA)
- Aucune dépendance npm ajoutée
- Aucune modification de `global.css` nécessaire (les classes Tailwind suffisent)

### References

- [Source: docs/planning-artifacts/epics.md#Story 3.2] — AC complètes, FR10
- [Source: docs/planning-artifacts/prd.md#FR10] — CTA sticky mobile accessible en permanence
- [Source: docs/planning-artifacts/prd.md#FR15] — Fallback sans JavaScript (lien direct Calendly)
- [Source: docs/planning-artifacts/architecture.md#Hydration Strategy] — StickyMobileCTA: `client:load`
- [Source: docs/planning-artifacts/architecture.md#Island Structure] — StickyMobileCTA: island client:load, ~1kb
- [Source: docs/planning-artifacts/architecture.md#Progressive Enhancement] — Fallback CTA toujours visible en CSS fixed
- [Source: docs/planning-artifacts/architecture.md#Communication inter-islands] — CustomEvents `sa:modal-open`, `sa:modal-close`
- [Source: docs/planning-artifacts/architecture.md#Testing] — StickyMobileCTA: DOM tests, IntersectionObserver mock, priorité moyenne
- [Source: docs/planning-artifacts/ux-design-specification.md#StickyMobileCTA] — Design: fond creme semi-transparent, backdrop-filter blur, bouton terracotta, 48px touch target
- [Source: docs/planning-artifacts/ux-design-specification.md#Stratégie CTA responsive] — Desktop = CTA intégrés sections ; Mobile = sticky CTA remplace les intégrés
- [Source: docs/implementation-artifacts/3-1-ctabutton-section-cta-final.md] — Section CTA finale id="cta-final", CTAButton patterns, PUBLIC_CALENDLY_URL câblé

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Build warning `client:load` sur composant `.astro` — Astro 5 ne supporte pas les directives d'hydratation sur les composants `.astro` (seulement les composants framework React/Svelte/Vue). Résolu en retirant `client:load` ; le `<script>` tag natif gère l'interactivité côté client de manière identique.

### Completion Notes List

- ✅ Composant `StickyMobileCTA.astro` créé avec markup `<aside>`, `role="complementary"`, `aria-label`, `data-calendly-trigger`, `min-h-[48px]`, fond glass `bg-creme/80 backdrop-blur-md`
- ✅ Logique IntersectionObserver complète : observe `<header>` et `#cta-final`, logique combinée `!heroVisible && !ctaFinalVisible && !modalOpen`
- ✅ Délai 300ms sur réapparition (pas sur masquage), transitions CSS 300ms ease-out
- ✅ Listeners `sa:modal-open` / `sa:modal-close` en place pour intégration future CalendlyModal (story 3-3)
- ✅ Cleanup `observer.disconnect()` sur `beforeunload`
- ✅ Masquage desktop via `lg:hidden`
- ✅ Progressive enhancement : le lien `<a href>` fonctionne sans JS
- ✅ 23 tests source-level pour le composant + 4 tests d'intégration dans index.test.ts
- ✅ 563 tests passent, 0 régressions, build propre, lint propre

### Change Log

- 2026-02-14: Story 3-2 implémentée — StickyMobileCTA composant island avec IntersectionObserver, listeners CalendlyModal, 27 nouveaux tests
- 2026-02-14: Code review — 4 MEDIUM + 4 LOW issues corrigés: M1 beforeunload→pagehide (mobile reliability), M2+M3 délai 300ms conditionnel CTA finale only (wasHiddenByCTAFinal), M4 test <aside> renforcé, L1 architecture divergence notée, L2 IO feature detection, L3 shadow token notée, L4 hover superflus retirés. 564 tests, lint+build OK

### File List

- `web/src/components/StickyMobileCTA.astro` (nouveau)
- `web/tests/components/sticky-mobile-cta.test.ts` (nouveau)
- `web/src/pages/index.astro` (modifié — import + placement StickyMobileCTA)
- `web/tests/pages/index.test.ts` (modifié — tests intégration StickyMobileCTA)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié — story status)
