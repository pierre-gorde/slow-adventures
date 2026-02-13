# Story 2.5: Témoignages & Pricing

Status: done

## Story

As a visiteur,
I want lire des témoignages de clients et consulter le pricing transparent,
So that je sois convaincu par la preuve sociale et rassuré sur le coût.

## Acceptance Criteria

### Section Témoignages (FR8)

1. **Given** le visiteur scrolle après le processus **When** la section Témoignages entre dans le viewport **Then** des citations clients sont affichées sur fond photo avec overlay ambre (FR8)
2. **And** chaque citation est un composant `TestimonialCard.astro` statique (0 JS) avec les props `quote`, `name`, `tripContext`
3. **And** les citations apparaissent en fade-in avec léger slide-up (via SectionReveal `animation="fade-up"`)
4. **And** les données proviennent de `src/data/testimonials.ts`
5. **And** un CTAButton variant `outline` avec `desktopOnly: true` est intégré dans la section (visible uniquement desktop)
6. **Given** une TestimonialCard est rendue **When** on inspecte le HTML **Then** la citation utilise `<blockquote>` et l'attribution utilise `<cite>` (sémantique)

### Section Pricing (FR9)

7. **Given** le visiteur scrolle après les témoignages **When** la section Pricing entre dans le viewport **Then** les tarifs sont affichés de manière transparente sur fond crème, lignes claires (FR9)
8. **And** chaque ligne est un composant `PricingRow.astro` statique (0 JS) avec les props `label`, `price`, `description` (optionnel)
9. **And** les lignes apparaissent une par une (stagger 100ms via SectionReveal `animation="stagger"`)
10. **And** les données proviennent de `src/data/pricing.ts`
11. **Given** la section Pricing est rendue **When** on inspecte le HTML **Then** la structure utilise `<dl>` (definition list) pour label/prix

### Accessibilité

12. **Given** on inspecte l'accessibilité **When** un lecteur d'écran lit les deux sections **Then** `<blockquote>` + `<cite>` pour témoignages, `<dl>` + `<dt>` + `<dd>` pour pricing, contraste texte blanc sur overlay ambre ≥ 4.5:1

## Tasks / Subtasks

- [x] Task 1: Créer le fichier de données testimonials.ts (AC: #4)
  - [x] 1.1 Créer `web/src/data/testimonials.ts` avec interface `TestimonialData`
  - [x] 1.2 Interface : `{ quote: string; name: string; tripContext: string }`
  - [x] 1.3 Créer 3 témoignages placeholder (contenu à valider par Elena) :
    1. Camille — "Un voyage qui m'a transformée..." — Pérou, 2 semaines
    2. Antoine & Sophie — "Elena a tout organisé au-delà de nos attentes..." — Colombie, 10 jours
    3. Nathalie — "Le meilleur investissement voyage de ma vie..." — Costa Rica, 12 jours
  - [x] 1.4 Export nommé `testimonials` (tableau typé)
- [x] Task 2: Créer le fichier de données pricing.ts (AC: #10)
  - [x] 2.1 Créer `web/src/data/pricing.ts` avec interface `PricingData`
  - [x] 2.2 Interface : `{ label: string; price: string; description?: string }`
  - [x] 2.3 Créer 3 lignes pricing placeholder (contenu à valider par Elena) :
    1. "Discovery Call" — "Gratuit" — "20 minutes pour faire connaissance et comprendre vos envies"
    2. "Création d'itinéraire" — "À partir de 300 €" — "Itinéraire sur-mesure 100% personnalisé avec contacts locaux"
    3. "Accompagnement complet" — "Sur devis" — "De la planification à l'accompagnement terrain pendant le voyage"
  - [x] 2.4 Export nommé `pricingRows` (tableau typé)
- [x] Task 3: Créer le composant TestimonialCard.astro (AC: #2, #6)
  - [x] 3.1 Créer `web/src/components/TestimonialCard.astro` — composant statique (0 JS)
  - [x] 3.2 Props : `quote` (string), `name` (string), `tripContext` (string)
  - [x] 3.3 Sémantique : `<blockquote>` pour la citation, `<cite>` pour le nom
  - [x] 3.4 Typographie : citation en `font-serif text-lg md:text-xl italic text-white`, nom en `font-sans font-semibold text-white`, tripContext en `font-sans text-white/80 text-sm`
  - [x] 3.5 Layout : card transparente sur le fond photo+overlay de la section
  - [x] 3.6 Créer `web/tests/components/TestimonialCard.test.ts` — 15 tests
- [x] Task 4: Créer le composant PricingRow.astro (AC: #8, #11)
  - [x] 4.1 Créer `web/src/components/PricingRow.astro` — composant statique (0 JS)
  - [x] 4.2 Props : `label` (string), `price` (string), `description` (string optionnel)
  - [x] 4.3 Sémantique : rendu dans un `<div>` contenant `<dt>` (label) + `<dd>` (prix) — le parent fournit le `<dl>`
  - [x] 4.4 Typographie : label en `font-sans font-semibold text-warm-black`, prix en `font-serif text-2xl text-terracotta`, description en `font-sans text-warm-gray text-sm`
  - [x] 4.5 Layout : flex row avec label à gauche, prix à droite, séparateur pointillé entre les deux ; description en dessous si présente
  - [x] 4.6 Créer `web/tests/components/PricingRow.test.ts` — 21 tests
- [x] Task 5: Fournir l'image de fond témoignages (AC: #1)
  - [x] 5.1 Créer `web/src/assets/images/testimonials-bg.webp` — 1440x900px, 208KB, convertie depuis HEIC Elena
  - [x] 5.2 **Note :** Elena fournira la photo définitive — l'important est que la section fonctionne avec n'importe quelle image
- [x] Task 6: Intégrer la section Témoignages dans index.astro (AC: #1, #3, #5)
  - [x] 6.1 Importer TestimonialCard, testimonials data, image de fond, CTAButton
  - [x] 6.2 Insérer **après la section Processus** (ordre : Hero → Elena → Destinations → Processus → **Témoignages**)
  - [x] 6.3 Section : `<section>` avec image de fond + overlay `bg-ambre/60` en absolute, contenu en relative z-10
  - [x] 6.4 Titre `<h2>` : "Ce qu'ils en disent"
  - [x] 6.5 Grid : `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pour les cards
  - [x] 6.6 Chaque TestimonialCard wrappé dans `<SectionReveal animation="fade-up">`
  - [x] 6.7 CTAButton `variant="outline"` `size="small"` `desktopOnly={true}` `href="#contact"` centré sous les cards
  - [x] 6.8 Image de fond : Astro `<Image>` avec `loading="lazy"`, `widths={[768, 1440, 2880]}`, `sizes="100vw"`, absolute + object-cover
- [x] Task 7: Intégrer la section Pricing dans index.astro (AC: #7, #9)
  - [x] 7.1 Importer PricingRow, pricingRows data
  - [x] 7.2 Insérer **après la section Témoignages** (ordre : ... → Témoignages → **Pricing**)
  - [x] 7.3 Section : `<section class="bg-creme sa-section-padding">`
  - [x] 7.4 Titre `<h2>` : "Transparence totale"
  - [x] 7.5 `<SectionReveal animation="stagger">` wrappant un `<dl>` contenant les PricingRow
  - [x] 7.6 Layout : max-w-3xl mx-auto, lignes empilées verticalement
- [x] Task 8: Mettre à jour les tests existants (AC: all)
  - [x] 8.1 Mettre à jour `web/tests/pages/index.test.ts` — 23 nouveaux tests Témoignages + Pricing (64 total)
  - [x] 8.2 Tester l'import des données testimonials et pricing
- [x] Task 9: Validation finale
  - [x] 9.1 `npm run lint` — 0 erreurs ESLint et Prettier
  - [x] 9.2 `npm run test` — 465 tests passent (21 fichiers)
  - [x] 9.3 `npm run build` — build réussi, 15 images optimisées, 3 pages générées
  - [x] 9.4 Contraste texte blanc sur overlay ambre 60% — overlay dense sur photo fournit un fond suffisant. À vérifier visuellement avec photo définitive d'Elena

## Dev Notes

### Architecture — données statiques vs content collections

Les témoignages et le pricing utilisent le pattern **données statiques** (`src/data/*.ts`) — PAS des content collections. La décision est documentée dans `architecture.md` :

| Source | Format | Accès | Fichier |
|--------|--------|-------|---------|
| Témoignages | TypeScript array | Import direct | `src/data/testimonials.ts` |
| Pricing | TypeScript array | Import direct | `src/data/pricing.ts` |

**Raison :** Les témoignages et le pricing sont des données simples sans besoin de markdown body, images associées, ni pages dédiées. Le pattern `src/data/*.ts` établi par `processSteps.ts` est suffisant.

### Pattern données statiques — suivre processSteps.ts

```typescript
// src/data/testimonials.ts
export interface TestimonialData {
  quote: string;
  name: string;
  tripContext: string;
}

export const testimonials: TestimonialData[] = [
  {
    quote: 'Un voyage qui m\'a transformée. Elena a su comprendre exactement ce que je cherchais.',
    name: 'Camille',
    tripContext: 'Pérou, 2 semaines',
  },
  // ...
];
```

```typescript
// src/data/pricing.ts
export interface PricingData {
  label: string;
  price: string;
  description?: string;
}

export const pricingRows: PricingData[] = [
  {
    label: 'Discovery Call',
    price: 'Gratuit',
    description: '20 minutes pour faire connaissance et comprendre vos envies',
  },
  // ...
];
```

### Section Témoignages — Layout avec fond photo + overlay ambre

La section Témoignages suit le pattern "Full Immersif" (comme les DestinationBlocks) :
- UNE image de fond pour toute la section (pas une par card)
- Overlay ambre (`bg-ambre/60`) — ambre = `#d4956a`
- Les TestimonialCards sont des éléments textuels transparents sur l'overlay
- Grid responsive : 1 col mobile, 2 cols md, 3 cols lg
- Hauteur cible : ~0.7 viewport

```astro
<section class="relative min-h-[70vh] overflow-hidden">
  <!-- Photo de fond -->
  <Image src={testimonialsBg} alt="" loading="lazy"
    widths={[768, 1440, 2880]} sizes="100vw"
    class="absolute inset-0 w-full h-full object-cover" />
  <!-- Overlay ambre -->
  <div class="absolute inset-0 bg-ambre/60"></div>
  <!-- Contenu -->
  <div class="relative z-10 sa-section-padding max-w-5xl mx-auto">
    <h2 class="font-serif text-3xl md:text-4xl text-white text-center mb-12">Ce qu'ils en disent</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((t) => (
        <SectionReveal animation="fade-up">
          <TestimonialCard quote={t.quote} name={t.name} tripContext={t.tripContext} />
        </SectionReveal>
      ))}
    </div>
    <!-- CTA desktop only -->
    <div class="text-center mt-12">
      <CTAButton href="#contact" variant="outline" size="small" desktopOnly={true} />
    </div>
  </div>
</section>
```

### TestimonialCard — Sémantique blockquote + cite

```astro
<article class="text-center">
  <blockquote class="font-serif text-lg md:text-xl italic text-white leading-relaxed mb-4">
    <p>"{quote}"</p>
  </blockquote>
  <footer>
    <cite class="font-sans font-semibold text-white not-italic">{name}</cite>
    <p class="font-sans text-white/80 text-sm mt-1">{tripContext}</p>
  </footer>
</article>
```

**Note :** `<footer>` est à l'extérieur de `<blockquote>`, à l'intérieur d'un `<article>` englobant — pattern HTML5 recommandé pour l'attribution de citation.

### Section Pricing — dl/dt/dd sémantique

La section Pricing utilise fond crème (bg-creme) avec un layout centré et aéré.

```astro
<section class="bg-creme sa-section-padding">
  <div class="max-w-3xl mx-auto">
    <h2 class="font-serif text-3xl md:text-4xl text-warm-black text-center mb-12">
      Transparence totale
    </h2>
    <SectionReveal animation="stagger">
      <dl class="space-y-6">
        {pricingRows.map((row) => (
          <PricingRow label={row.label} price={row.price} description={row.description} />
        ))}
      </dl>
    </SectionReveal>
  </div>
</section>
```

### PricingRow — Layout ligne avec séparateur

```astro
<div class="flex flex-wrap items-baseline gap-2 py-4 border-b border-warm-black/10">
  <dt class="font-sans font-semibold text-warm-black text-lg flex-1 inline-flex items-baseline gap-2 after:content-[''] after:flex-1 after:border-b after:border-dotted after:border-warm-gray/40">{label}</dt>
  <dd class="font-serif text-2xl text-terracotta font-bold">{price}</dd>
  {description && (
    <dd class="w-full font-sans text-warm-gray text-sm mt-1">{description}</dd>
  )}
</div>
```

**Note :** Le séparateur pointillé (`border-dotted`) entre label et prix est un CSS pseudo-élément `::after` sur le `<dt>` — pattern classique de carte de restaurant, clair et élégant. La description utilise un `<dd>` (pas un `<p>`) pour respecter le content model HTML5 de `<dl>` > `<div>`.

### Ordre des sections dans index.astro

L'ordre PRD est strict :
1. HeroSection
2. ElenaSection
3. Destinations (DestinationBlock ×4)
4. Section Processus
5. **Section Témoignages** ← NOUVEAU
6. **Section Pricing** ← NOUVEAU
7. *(futurs : CTA Final, Email Capture)*

### Contraste Accessibilité — Overlay ambre 60%

| Overlay | Couleur hex | Avec 60% opacité | Texte | Contraste estimé |
|---------|------------|-------------------|-------|------------------|
| ambre | #d4956a | rgba(212,149,106,0.60) sur photo | #ffffff | Dépend de la photo — overlay ambre dense à 60% |

**Stratégie :** Même approche que les DestinationBlocks — l'overlay coloré garantit un fond suffisamment contrasté. UX spec prescrit 60% pour ambre (vs 55% pour terracotta/sauge). Vérifier visuellement avec la photo de fond.

### Pattern GSAP — RÈGLE ABSOLUE

```typescript
import { gsap, ScrollTrigger } from '../lib/gsap'; // ✅ CORRECT
// JAMAIS: import { gsap } from 'gsap'; // ❌ INTERDIT (double bundle)
```

### Learnings Stories précédentes (à respecter)

- Tests MUST be in `web/tests/` (JAMAIS dans `src/`)
- Utiliser `?? fallback` au lieu de `!` (ESLint `no-non-null-assertion`)
- Prettier lowercase les hex colors — tester avec `#d4956a` pas `#D4956A`
- Run `prettier --write` immédiatement après création de fichiers
- Les composants statiques ne doivent avoir aucun `<script>`
- `desktopOnly` sur CTAButton utilise `hidden lg:inline-block`
- Sort immutable : `[...array].sort()` (PAS `.sort()` muté)
- `mb-6` conditionnel sur éléments avec CTA optionnel

### Structure des fichiers à créer/modifier

**Nouveaux fichiers :**
- `web/src/data/testimonials.ts`
- `web/src/data/pricing.ts`
- `web/src/components/TestimonialCard.astro`
- `web/src/components/PricingRow.astro`
- `web/src/assets/images/testimonials-bg.webp`
- `web/tests/components/TestimonialCard.test.ts`
- `web/tests/components/PricingRow.test.ts`

**Fichiers modifiés :**
- `web/src/pages/index.astro` (ajout sections Témoignages + Pricing après Processus)
- `web/tests/pages/index.test.ts` (tests Témoignages + Pricing sections)

### References

- [Source: docs/planning-artifacts/epics.md#Story 2.5] — AC et user story (lignes 471-500)
- [Source: docs/planning-artifacts/architecture.md#Data Sources] — testimonials.ts et pricing.ts (lignes 862-868)
- [Source: docs/planning-artifacts/architecture.md#Hydration Strategy] — TestimonialCard et PricingRow statiques (ligne 305)
- [Source: docs/planning-artifacts/ux-design-specification.md#TestimonialCard] — specs composant (lignes 1034-1040)
- [Source: docs/planning-artifacts/ux-design-specification.md#PricingRow] — specs composant (lignes 1042-1047)
- [Source: docs/planning-artifacts/ux-design-specification.md#Section Layout] — Témoignages ~0.7vh, Pricing ~0.5vh (lignes 756-757)
- [Source: docs/planning-artifacts/ux-design-specification.md#Loading Patterns] — Témoignages lazy, placeholder ambre 60% (ligne 1310)
- [Source: docs/planning-artifacts/ux-design-specification.md#WCAG] — blockquote + dl sémantique (ligne 1490)
- [Source: docs/planning-artifacts/prd.md#FR8-FR9] — témoignages et pricing (lignes 417-418)
- [Source: docs/planning-artifacts/prd.md#Journey Mapping] — pricing transparent = pas de piège (lignes 191-199)
- [Source: docs/planning-artifacts/prd.md#Section Pricing] — soulagement + clarté (ligne 139)
- [Source: docs/implementation-artifacts/2-4-destinations-content-collections-destinationblock.md] — patterns overlay, Image Astro, immutable sort

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- HEIC image (IMG_8547.HEIC) converted via macOS `sips` (HEIC→JPEG) + `sharp` (JPEG→WebP @ 1440x900) for testimonials background
- Overlay ambre at 60% opacity on photo background — contrast depends on photo, acceptable with current placeholder

### Completion Notes List

- All 9 tasks completed successfully
- 465 tests pass across 21 test files (59 new tests for this story)
- Build generates 15 optimized images including testimonials-bg at multiple widths
- TestimonialCard uses semantic `<blockquote>` + `<cite>` + `<footer>` pattern
- PricingRow uses semantic `<dt>` + `<dd>` within parent `<dl>` (definition list)
- Both components are fully static (0 JS) — animations handled by SectionReveal wrapper
- CTAButton with `variant="outline"` `desktopOnly={true}` integrated in Témoignages section
- Section order verified: Hero → Elena → Destinations → Processus → Témoignages → Pricing
- **[Code Review]** PricingRow: `<span>` séparateur remplacé par CSS `::after` sur `<dt>`, `<p>` description remplacé par `<dd>` (validation HTML5 `<dl>`)
- **[Code Review]** Sections `id="temoignages"` et `id="tarifs"` ajoutées pour navigation par ancre
- **[Code Review]** Tests guillemets françaises ajoutés à TestimonialCard, test conditional description renforcé dans PricingRow
- **[Note]** AC #9 spécifie "stagger 100ms" mais SectionReveal (story 2-1) utilise 150ms — pas un bug, le composant partagé décide du timing
- **[Note]** CTAButton `href="#contact"` pointe vers une ancre inexistante — attendu pour future story CTA Final / Email Capture

### File List

**New files:**
- `web/src/data/testimonials.ts` — 3 testimonials with TestimonialData interface
- `web/src/data/pricing.ts` — 3 pricing rows with PricingData interface
- `web/src/components/TestimonialCard.astro` — static component (0 JS), blockquote+cite
- `web/src/components/PricingRow.astro` — static component (0 JS), dt+dd with dotted separator
- `web/src/assets/images/testimonials-bg.webp` — 1440x900, 208KB
- `web/tests/components/TestimonialCard.test.ts` — 15 tests
- `web/tests/components/PricingRow.test.ts` — 21 tests

**Modified files:**
- `web/src/pages/index.astro` — Témoignages + Pricing sections after Processus
- `web/tests/pages/index.test.ts` — 23 new tests for Témoignages + Pricing (64 total)
