# Story 3.1: CTAButton & section CTA final

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want cliquer sur un bouton d'appel à l'action chaleureux visible dans les sections du site et en fermeture émotionnelle,
So that je puisse réserver une discovery call facilement à tout moment de mon parcours.

## Acceptance Criteria

### AC1 — CTAButton : câblage Calendly URL (progressive enhancement)

1. **Given** le composant `CTAButton.astro` existe déjà (story 2-3, mis à jour en 2-6) **When** on vérifie son `href` **Then** tous les CTAButton du site pointent vers `import.meta.env.PUBLIC_CALENDLY_URL` (plus de `#contact` placeholder) **And** le lien `<a href>` fonctionne sans JS (progressive enhancement — FR15) **And** l'attribut `data-calendly-trigger` est déjà en place pour l'interception JS future (story 3-3)

### AC2 — CTAButton : subtext par défaut

2. **Given** le CTAButton dans la section CTA finale **When** il est rendu en variant `solid` size `default` **Then** le `subtext` par défaut est affiché : "30 min, gratuit, sans engagement" **And** le subtext est un `<span>` avec un style plus petit et discret sous le texte principal

### AC3 — Section CTA finale : fermeture émotionnelle

3. **Given** le visiteur a scrollé après la section tarifs **When** la section CTA finale entre dans le viewport **Then** une section de fermeture émotionnelle est affichée sur fond `bg-warm-black` (FR11) **And** un titre inclusif (non genré) en `font-serif text-white` et un CTAButton variant `solid` size `default` avec subtext sont centrés dans la section **And** le titre et le bouton apparaissent en `scale-in` via SectionReveal **And** cette section CTA est visible sur mobile ET desktop (PAS de `desktopOnly`)

### AC4 — Section CTA finale : structure sémantique

4. **Given** la section CTA finale est rendue **When** on inspecte le HTML **Then** la section a `id="cta-final"` et `aria-labelledby="heading-cta-final"` **And** le titre est un `<h2>` avec `id="heading-cta-final"` **And** la section utilise `sa-section-padding` pour le padding cohérent

### AC5 — Tous les CTAButton existants : mise à jour href

5. **Given** les CTAButton dans ElenaSection et la section témoignages **When** on vérifie leur `href` **Then** ils pointent vers `import.meta.env.PUBLIC_CALENDLY_URL` (remplacement de `#contact`) **And** ils conservent leurs variants, tailles et `desktopOnly` actuels

## Tasks / Subtasks

- [x] Task 1: Mettre à jour le `href` des CTAButton existants vers `PUBLIC_CALENDLY_URL` (AC: #1, #5)
  - [x] 1.1 Dans `web/src/pages/index.astro` : remplacer tous les `href="#contact"` par `href={import.meta.env.PUBLIC_CALENDLY_URL}` (ElenaSection `ctaHref` + CTAButton de la section témoignages)
  - [x] 1.2 Dans `web/src/components/ElenaSection.astro` : vérifier que `ctaHref` est bien passé au CTAButton
  - [x] 1.3 Mettre à jour `web/tests/pages/index.test.ts` : remplacer le test `ctaHref="#contact"` par un test qui vérifie `PUBLIC_CALENDLY_URL`
  - [x] 1.4 Mettre à jour `web/tests/pages/index.test.ts` : vérifier que la section témoignages n'a plus `href="#contact"`

- [x] Task 2: Ajouter la section CTA finale dans `index.astro` (AC: #3, #4)
  - [x] 2.1 Ajouter la section CTA finale après `</section>` de tarifs et avant `</main>` dans `web/src/pages/index.astro`
  - [x] 2.2 La section doit avoir : `id="cta-final"`, `aria-labelledby="heading-cta-final"`, `class="bg-warm-black sa-section-padding"`
  - [x] 2.3 Contenu centré dans un `<div class="max-w-3xl mx-auto text-center">`
  - [x] 2.4 Titre `<h2>` avec `id="heading-cta-final"` et classes `font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-8`
  - [x] 2.5 Texte du titre : proposer un titre inclusif non genré et chaleureux (ex: "Ton prochain voyage commence ici")
  - [x] 2.6 `SectionReveal animation="scale-in"` wrappant le contenu (titre + bouton)
  - [x] 2.7 `CTAButton` avec `href={import.meta.env.PUBLIC_CALENDLY_URL}`, `variant="solid"`, `size="default"`, `subtext="30 min, gratuit, sans engagement"` — PAS de `desktopOnly`

- [x] Task 3: Ajouter les tests pour la section CTA finale (AC: #3, #4)
  - [x] 3.1 Dans `web/tests/pages/index.test.ts` : ajouter un describe `'Section CTA finale integration'` avec les tests :
    - Présence de `id="cta-final"`
    - Présence de `aria-labelledby="heading-cta-final"` et `id="heading-cta-final"`
    - Utilisation de `bg-warm-black`
    - Utilisation de `SectionReveal animation="scale-in"`
    - CTAButton avec `variant="solid"` (déjà testé globalement)
    - Subtext "30 min, gratuit, sans engagement"
    - PAS de `desktopOnly` sur ce CTAButton
  - [x] 3.2 Dans `web/tests/accessibility/heading-hierarchy.test.ts` : ajouter un test vérifiant la présence du heading CTA final
  - [x] 3.3 Mettre à jour le test `section rendering order` pour inclure la section CTA finale APRÈS tarifs

- [x] Task 4: Validation finale (AC: all)
  - [x] 4.1 `npm run lint` — 0 erreurs ESLint et Prettier
  - [x] 4.2 `npm run test` — tous les tests passent (536/536)
  - [x] 4.3 `npm run build` — build réussi (3 pages)
  - [x] 4.4 Vérification visuelle : section CTA finale visible mobile + desktop (pas de `desktopOnly`, pas de `hidden`)

## Dev Notes

### IMPORTANT : Ce qui est DÉJÀ fait vs ce qui est NOUVEAU

**DÉJÀ IMPLÉMENTÉ (NE PAS RECRÉER) :**
- `CTAButton.astro` — composant complet avec props `text`, `subtext`, `href`, `size`, `variant`, `desktopOnly` (story 2-3)
- `data-calendly-trigger` attribut sur le `<a>` (story 2-3)
- Variants solid/outline/ghost avec styles complets (story 2-3)
- `motion-safe:` transitions et focus-visible global (story 2-6)
- `SectionReveal` avec animations scale-in, fade-in, fade-up, stagger (story 2-1)

**NOUVEAU À IMPLÉMENTER :**
- Section CTA finale dans `index.astro` (après tarifs)
- Câblage `import.meta.env.PUBLIC_CALENDLY_URL` sur tous les CTAButton
- Tests associés

### Variable d'environnement PUBLIC_CALENDLY_URL

La variable est DÉJÀ configurée :
- `.env.example` : `PUBLIC_CALENDLY_URL=https://calendly.com/slow-adventures/discovery-call`
- `.env` : `PUBLIC_CALENDLY_URL=https://calendly.com/slow-adventures/discovery-call`

En Astro 5, utiliser `import.meta.env.PUBLIC_CALENDLY_URL` dans le frontmatter des composants `.astro`. Le préfixe `PUBLIC_` permet l'accès côté client.

**ATTENTION** : `astro.config.mjs` utilise `process.env.SITE_URL` (pas `import.meta.env`). Pour les composants `.astro`, utiliser toujours `import.meta.env.PUBLIC_*`.

### Structure de la section CTA finale

```astro
<!-- Section CTA finale — APRÈS tarifs, AVANT </main> -->
<section
  id="cta-final"
  aria-labelledby="heading-cta-final"
  class="bg-warm-black sa-section-padding"
>
  <div class="max-w-3xl mx-auto text-center">
    <SectionReveal animation="scale-in">
      <h2
        id="heading-cta-final"
        class="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-8"
      >
        Ton prochain voyage commence ici
      </h2>
      <CTAButton
        href={import.meta.env.PUBLIC_CALENDLY_URL}
        variant="solid"
        size="default"
        subtext="30 min, gratuit, sans engagement"
      />
    </SectionReveal>
  </div>
</section>
```

### Ordre des sections dans index.astro (après modification)

1. `<header>` → HeroSection
2. `<main id="main">`
   1. ElenaSection (`id="elena"`)
   2. Destinations (`id="destinations"`)
   3. Processus (`id="processus"`)
   4. Témoignages (`id="temoignages"`)
   5. Tarifs (`id="tarifs"`)
   6. **CTA Final (`id="cta-final"`)** ← NOUVEAU
3. `</main>`

### Modifications sur les `href` existants

| Fichier | Emplacement | Avant | Après |
|---------|-------------|-------|-------|
| `index.astro` | ElenaSection `ctaHref` | `#contact` | `{import.meta.env.PUBLIC_CALENDLY_URL}` |
| `index.astro` | CTAButton témoignages `href` | `#contact` | `{import.meta.env.PUBLIC_CALENDLY_URL}` |
| `index.astro` | CTAButton CTA finale `href` | N/A (nouveau) | `{import.meta.env.PUBLIC_CALENDLY_URL}` |

### Wording mis à jour (cohérence avec les modifications récentes)

- CTA text par défaut : "Confie-moi ton prochain rêve" (mis à jour plus tôt dans cette session)
- Discovery call : **30 minutes** (plus 20 minutes)
- Subtext CTA finale : "30 min, gratuit, sans engagement"
- Tout le site tutoie le visiteur

### Patterns établis dans les stories précédentes — À RESPECTER

- **Tests** : dans `web/tests/` JAMAIS dans `src/`
- **Tests pattern** : `readFileSync` + string matching / regex (pas de rendu)
- **Prettier** : lowercases hex — tester avec `#c0603e` pas `#C0603E`
- **ESLint** : `?? fallback` au lieu de `!` (no-non-null-assertion)
- **Sort immutable** : `[...array].sort()` pas `.sort()`
- **Composants statiques** : 0 `<script>` tag — la section CTA finale est statique
- **SectionReveal** : utiliser `animation="scale-in"` pour l'effet d'apparition
- **GSAP** : import depuis `../lib/gsap` JAMAIS depuis `'gsap'`
- **Tailwind v4** : pas de `tailwind.config.mjs`, tokens dans `@theme` de `global.css`
- **Accessibilité** : `aria-labelledby` + `id` sur heading pour chaque section
- **Focus-visible** : géré globalement dans `global.css` (pas de classes inline)
- **CTAButton** : `<a>` sémantique (pas `<button>`), `data-calendly-trigger` pour interception JS future

### Section CTA finale — Design intent (architecture + PRD)

La section CTA finale est une **fermeture émotionnelle** du parcours one-page. Elle apparaît après le pricing pour capter le visiteur "chaud" qui a lu tout le contenu. Contrairement aux CTAs dans ElenaSection et Témoignages (qui sont `desktopOnly`), cette section CTA est **visible sur tous les écrans** — c'est le point de conversion principal sur mobile avant l'arrivée du StickyMobileCTA (story 3-2).

### Project Structure Notes

- Aucun nouveau composant créé — la section CTA finale utilise les composants existants (`SectionReveal`, `CTAButton`)
- Aucune dépendance npm ajoutée
- Fichiers modifiés : `index.astro`, tests `index.test.ts`, `heading-hierarchy.test.ts`
- Le `.env` et `.env.example` sont déjà configurés avec `PUBLIC_CALENDLY_URL`

### References

- [Source: docs/planning-artifacts/epics.md#Story 3.1] — AC complètes, FR10, FR11, FR15
- [Source: docs/planning-artifacts/prd.md#FR10-FR15] — Conversion & Prise de Contact
- [Source: docs/planning-artifacts/prd.md#Journey 1 Camille] — Moment critique CTA sticky
- [Source: docs/planning-artifacts/prd.md#Journey 4 Post-CTA] — Modale Calendly, confirmation
- [Source: docs/planning-artifacts/architecture.md#Progressive Enhancement] — `<a href>` fallback, `data-calendly-trigger`
- [Source: docs/planning-artifacts/architecture.md#Variables d'Environnement] — `PUBLIC_CALENDLY_URL`
- [Source: docs/planning-artifacts/architecture.md#Boundaries] — CTAButton → CalendlyModal flow
- [Source: docs/planning-artifacts/architecture.md#Island Structure] — CTAButton est statique (0 JS)
- [Source: docs/implementation-artifacts/2-6-accessibilite-transversale-navigation-clavier.md] — Patterns focus-visible, motion-safe, aria-labelledby
- [Source: docs/implementation-artifacts/2-5-temoignages-pricing.md] — Patterns CTAButton dans sections
- [Source: docs/implementation-artifacts/2-3-section-elena-section-processus.md] — Création initiale CTAButton

## Change Log

- 2026-02-14: Story 3-1 implemented — câblage PUBLIC_CALENDLY_URL sur tous les CTAButton + ajout section CTA finale de fermeture émotionnelle + 14 nouveaux tests
- 2026-02-14: Code review — 5 issues corrigées (M1: pricing.ts ajouté au File List, M2: décompte tests 12→14, M3: assertion heading-hierarchy renforcée, L1: défaut subtext CTAButton aligné avec architecture, L2: documenté)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

Aucun problème rencontré. Implémentation directe en cycle RED-GREEN-REFACTOR.

### Completion Notes List

- ✅ Task 1: Remplacé `#contact` par `import.meta.env.PUBLIC_CALENDLY_URL` sur ElenaSection `ctaHref` et CTAButton témoignages. Vérifié que ElenaSection passe bien `ctaHref` au CTAButton. Tests mis à jour pour vérifier PUBLIC_CALENDLY_URL et l'absence de `#contact`.
- ✅ Task 2: Ajouté section CTA finale après tarifs dans `index.astro` avec `id="cta-final"`, `aria-labelledby="heading-cta-final"`, `bg-warm-black`, `sa-section-padding`, `SectionReveal animation="scale-in"`, titre inclusif "Ton prochain voyage commence ici", CTAButton solid/default avec subtext "30 min, gratuit, sans engagement", pas de `desktopOnly`.
- ✅ Task 3: Ajouté 10 tests dans describe `Section CTA finale integration`, 1 test heading hierarchy, mis à jour section rendering order (7 sections). Total : 89 tests index + 19 tests heading = 108 tests.
- ✅ Task 4: lint (0 erreurs), test (536/536 passent, 0 regressions), build (3 pages, succès).

### File List

- `web/src/pages/index.astro` — modifié (ctaHref, href témoignages → PUBLIC_CALENDLY_URL + section CTA finale ajoutée + subtext="" sur CTA secondaire témoignages)
- `web/src/components/CTAButton.astro` — modifié (ajout défaut subtext "30 min, gratuit, sans engagement" — alignement architecture)
- `web/src/components/ElenaSection.astro` — modifié (ajout subtext="" pour supprimer subtext par défaut sur CTA secondaire)
- `web/src/data/pricing.ts` — reformaté par Prettier (cosmétique uniquement)
- `web/tests/pages/index.test.ts` — modifié (tests PUBLIC_CALENDLY_URL + 10 tests section CTA finale + section ID + aria-labelledby + rendering order)
- `web/tests/accessibility/heading-hierarchy.test.ts` — modifié (+1 test h2 CTA finale + assertion regex renforcée)
- `docs/implementation-artifacts/sprint-status.yaml` — modifié (3-1: ready-for-dev → in-progress → review → done)
- `docs/implementation-artifacts/3-1-ctabutton-section-cta-final.md` — modifié (status, tasks, Dev Agent Record, File List, Change Log, Senior Developer Review)

## Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.6 — 2026-02-14
**Verdict:** Approve (after fixes applied)

### Issues Found & Resolved

| # | Sev | Description | Fix |
|---|-----|-------------|-----|
| M1 | MEDIUM | `web/src/data/pricing.ts` modifié (Prettier) mais absent du File List | Ajouté au File List |
| M2 | MEDIUM | Change Log dit "12 nouveaux tests" — réellement 14 | Corrigé à 14 |
| M3 | MEDIUM | Test heading-hierarchy CTA finale ne vérifie pas le tag `<h2>` | Ajout regex `/<h2[\s\S]*?Ton prochain voyage/` |
| L1 | LOW | CTAButton n'a pas de défaut `subtext` (discordance architecture) | Ajouté défaut + `subtext=""` sur CTA secondaires |
| L2 | LOW | Tests source-level fragiles au refactoring | Documenté — trade-off accepté du projet |

### AC Validation Summary

Tous les 5 Acceptance Criteria sont **IMPLEMENTED** et vérifiés contre le code et les tests.

### Verification

- `npm run lint` : 0 erreurs
- `npm run test` : 536/536 passent
- `npm run build` : 3 pages, succès
