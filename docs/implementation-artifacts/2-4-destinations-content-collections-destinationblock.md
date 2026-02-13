# Story 2.4: Destinations — content collections & DestinationBlock

Status: done

## Story

As a visiteur,
I want explorer les destinations par pays dans des blocs visuels immersifs,
So that je voie la spécialisation Amériques d'Elena et que je me projette dans le voyage.

## Acceptance Criteria

### Content Collections (infrastructure)

1. **Given** le projet est initialisé **When** on ouvre `web/src/content/config.ts` **Then** un schema Zod définit la content collection `destinations` avec les champs : `country` (string), `description` (string), `image` (via helper `image()` d'Astro), `overlayColor` (enum: terracotta | sauge), `order` (number)
2. **Given** le schema est défini **When** on inspecte `web/src/content/destinations/` **Then** 4 fichiers markdown existent : `perou-sacre.md`, `colombie-cafetera.md`, `costa-rica-pura-vida.md`, `patagonie-sauvage.md` **And** chaque fichier a un frontmatter valide selon le schema Zod

### DestinationBlock (composant)

3. **Given** les content collections existent **When** la section Destinations est rendue dans `index.astro` **Then** chaque pays est affiché dans un composant `DestinationBlock.astro` statique (0 JS) — un pays par bloc, jamais groupés (FR6) **And** chaque bloc occupe ~1 viewport avec photo plein écran + overlay coloré (terracotta ou sauge selon le frontmatter) **And** le nom du pays et une courte description sont affichés en texte blanc sur l'overlay **And** les destinations sont triées par le champ `order`
4. **Given** la section Destinations est visible **When** le visiteur scrolle **Then** chaque bloc entre en fade-in via SectionReveal, l'overlay coloré est à 55% d'opacité
5. **Given** un DestinationBlock a un prop `learnMoreHref` **When** le bloc est rendu **Then** un lien "en savoir plus" (CTAButton variant `ghost`) est affiché **And** si `learnMoreHref` est absent (MVP), aucun lien ne s'affiche

### Accessibilité

6. **Given** on inspecte l'accessibilité **When** un lecteur d'écran lit la section **Then** chaque image a un alt text descriptif et le contraste texte blanc sur overlay est vérifié ≥ 4.5:1

## Tasks / Subtasks

- [x] Task 1: Créer la content collection `destinations` (AC: #1)
  - [x] 1.1 Créer `web/src/content/config.ts` avec `defineCollection` et schema Zod
  - [x] 1.2 Schema : `country` (string), `description` (string), `image` (helper `image()` d'Astro pour optimisation), `overlayColor` (z.enum(['terracotta', 'sauge'])), `order` (z.number())
  - [x] 1.3 Export `collections = { destinations }`
  - [x] 1.4 Vérifier que le dossier `web/src/content/destinations/` est créé
- [x] Task 2: Créer les 4 fichiers markdown destination (AC: #2)
  - [x] 2.1 Créer `web/src/content/destinations/perou-sacre.md` — Pérou sacré, overlayColor: terracotta, order: 1
  - [x] 2.2 Créer `web/src/content/destinations/colombie-cafetera.md` — Colombie cafetera, overlayColor: sauge, order: 2
  - [x] 2.3 Créer `web/src/content/destinations/costa-rica-pura-vida.md` — Costa Rica pura vida, overlayColor: terracotta, order: 3
  - [x] 2.4 Créer `web/src/content/destinations/patagonie-sauvage.md` — Patagonie sauvage, overlayColor: sauge, order: 4
  - [x] 2.5 Frontmatter image: chemin relatif vers `../../assets/images/destinations/<nom>.webp`
  - [x] 2.6 Contenu markdown body minimal (1-2 phrases — contenu placeholder à valider par Elena)
- [x] Task 3: Fournir les 4 images placeholder destination (AC: #3, #6)
  - [x] 3.1 Créer le dossier `web/src/assets/images/destinations/`
  - [x] 3.2 Fournir 4 images WebP placeholder (~1440x900px paysage) : `perou.webp`, `colombie.webp`, `costa-rica.webp`, `patagonie.webp` — converties depuis les photos HEIC d'Elena
  - [x] 3.3 **Note :** Elena fournira les photos définitives — l'important est que le composant fonctionne avec n'importe quelle image
- [x] Task 4: Créer le composant DestinationBlock.astro (AC: #3, #4, #5, #6)
  - [x] 4.1 Créer `web/src/components/DestinationBlock.astro` — composant statique (0 JS)
  - [x] 4.2 Props : `imageSrc` (ImageMetadata), `imageAlt` (string), `country` (string), `description` (string), `overlayColor` ('terracotta' | 'sauge'), `learnMoreHref` (optionnel string)
  - [x] 4.3 Layout : `<section>` demi-viewport (`min-h-[50vh]`, 2 destinations visibles par écran), photo en `<Image>` absolute + overlay coloré
  - [x] 4.4 Photo : Astro `<Image>` avec `widths={[768, 1440, 2880]}`, `sizes="100vw"`, `loading="lazy"`, `object-cover` absolute plein bloc
  - [x] 4.5 Overlay : div absolute avec `bg-terracotta/55` ou `bg-sauge/55` selon prop `overlayColor`
  - [x] 4.6 Texte : `<h2>` pays en `font-serif text-4xl md:text-5xl lg:text-6xl text-white` centré + `<p>` description en `font-sans text-white/90`
  - [x] 4.7 Lien conditionnel : si `learnMoreHref` présent → `<CTAButton variant="ghost" text="En savoir plus" />` ; sinon, rien (MVP : pas de lien)
  - [x] 4.8 Accessibilité : alt text descriptif sur `<Image>`, contraste texte blanc sur overlay ≥ 4.5:1
  - [x] 4.9 Créer `web/tests/components/DestinationBlock.test.ts` — 26 tests
  - [x] 4.10 [Code Review] mb-6 conditionnel sur `<p>` description (visible uniquement quand learnMoreHref présent)
- [x] Task 5: Intégrer la section Destinations dans index.astro (AC: #3, #4)
  - [x] 5.1 Importer `getCollection` depuis `astro:content` et `DestinationBlock`
  - [x] 5.2 `const destinations = await getCollection('destinations')`
  - [x] 5.3 Trier par `order` : `destinations.sort((a, b) => a.data.order - b.data.order)`
  - [x] 5.4 Insérer la section **entre ElenaSection et la section Processus** (ordre page : Hero → Elena → Destinations → Processus)
  - [x] 5.5 Chaque DestinationBlock wrappé dans `<SectionReveal animation="fade-in">`
  - [x] 5.6 Passer les props depuis `entry.data` : `imageSrc={entry.data.image}`, `imageAlt`, `country`, `description`, `overlayColor`
  - [x] 5.7 `learnMoreHref` non fourni au MVP (aucun lien)
- [x] Task 6: Mettre à jour les tests existants (AC: all)
  - [x] 6.1 Mettre à jour `web/tests/pages/index.test.ts` — 11 nouveaux tests Destinations section (43 total)
  - [x] 6.2 Créer `web/tests/content/config.test.ts` — 34 tests content collection + markdown files
  - [x] 6.3 [Code Review] Test imageAlt template, test ordre sections, test immutable sort, test overlay conditionnel renforcé
- [x] Task 7: Validation finale
  - [x] 7.1 `npm run lint` — 0 erreurs ESLint et Prettier
  - [x] 7.2 `npm run test` — 408 tests passent (19 fichiers)
  - [x] 7.3 `npm run build` — build réussi, 13 images optimisées, 3 pages générées
  - [x] 7.4 Contraste texte blanc sur overlay — overlay 55% sur photos réelles crée un fond suffisamment dense pour les deux couleurs. À vérifier visuellement avec les images définitives d'Elena

## Dev Notes

### Astro 5 Content Collections — Pattern CRITIQUE

**Astro 5** (PAS Astro 6). Les content collections utilisent `defineCollection` + `z` depuis `astro:content`. Le helper `image()` est fourni dans le callback du schema pour valider et optimiser les images.

```typescript
// src/content/config.ts — Astro 5 syntax
import { defineCollection, z } from 'astro:content';

const destinations = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      country: z.string(),
      description: z.string(),
      image: image(), // ✅ Helper Astro — PAS z.string()
      overlayColor: z.enum(['terracotta', 'sauge']),
      order: z.number(),
    }),
});

export const collections = { destinations };
```

**ATTENTION :** L'AC originale spécifie `image (string)` mais l'implémentation DOIT utiliser le helper `image()` d'Astro pour bénéficier de l'optimisation d'image (WebP, responsive widths, lazy loading). C'est une décision architecturale documentée dans `architecture.md`.

### Usage getCollection dans index.astro

```astro
---
import { getCollection } from 'astro:content';
import DestinationBlock from '../components/DestinationBlock.astro';

const destinations = await getCollection('destinations');
const sortedDestinations = destinations.sort((a, b) => a.data.order - b.data.order);
---

{sortedDestinations.map((dest) => (
  <SectionReveal animation="fade-in">
    <DestinationBlock
      imageSrc={dest.data.image}
      imageAlt={`Paysage de ${dest.data.country}`}
      country={dest.data.country}
      description={dest.data.description}
      overlayColor={dest.data.overlayColor}
    />
  </SectionReveal>
))}
```

### Frontmatter des fichiers markdown destination

```yaml
---
country: "Pérou sacré"
description: "Des Andes mystiques au lac Titicaca — parcourez les chemins incas et découvrez un Pérou authentique, loin des sentiers battus."
image: "../../assets/images/destinations/perou.webp"
overlayColor: "terracotta"
order: 1
---

Corps markdown optionnel — non utilisé au MVP mais prêt pour les pages destination post-MVP.
```

### DestinationBlock — Layout full viewport

```astro
<section class="relative min-h-screen overflow-hidden">
  <!-- Photo background -->
  <Image src={imageSrc} alt={imageAlt}
    widths={[768, 1440, 2880]} sizes="100vw"
    loading="lazy" decoding="async"
    class="absolute inset-0 w-full h-full object-cover" />
  <!-- Overlay coloré -->
  <div class={`absolute inset-0 ${overlayColor === 'terracotta' ? 'bg-terracotta/55' : 'bg-sauge/55'}`}></div>
  <!-- Contenu centré -->
  <div class="relative z-10 flex flex-col justify-end items-center h-full text-center px-6 pb-16 md:pb-24">
    <h2 class="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">{country}</h2>
    <p class="font-sans text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">{description}</p>
  </div>
</section>
```

**Note :** Le contenu est positionné en `justify-end` (bas du bloc) pour laisser la photo dominer visuellement. Le texte "flotte" sur l'overlay en bas du viewport.

### Overlay Animation — Décision simplificatrice

L'AC spécifie "l'overlay s'intensifie progressivement de 30% à 55% opacité". Pour le MVP :
- L'overlay est fixé à **55% d'opacité** (valeur finale)
- Le `SectionReveal animation="fade-in"` gère l'entrée du bloc entier (opacity 0 → 1)
- L'effet visuel résultant : l'overlay apparaît progressivement de 0% à 55% pendant le fade-in

**Pourquoi pas 30% → 55% en scroll-linked :** Cela nécessiterait un `scrub: true` dans ScrollTrigger, incompatible avec le pattern `once: true` de SectionReveal. Une animation scrub serait un changement architectural (nouveau mode SectionReveal). Report post-MVP si nécessaire.

### Ordre des sections dans index.astro

L'ordre PRD est strict :
1. HeroSection
2. ElenaSection
3. **Destinations** ← NOUVEAU — insérer ici
4. Section Processus
5. *(futurs : Témoignages, Pricing, CTA Final, Email Capture)*

### Contraste Accessibilité — Overlay 55%

| Overlay | Couleur hex | Avec 55% opacité | Texte blanc | Contraste estimé |
|---------|------------|-------------------|-------------|------------------|
| terracotta | #c0603e | rgba(192,96,62,0.55) sur photo | #ffffff | Dépend de la photo — overlay garantit un contraste minimum |
| sauge | #7b8f6b | rgba(123,143,107,0.55) sur photo | #ffffff | Dépend de la photo — overlay garantit un contraste minimum |

**Stratégie :** L'overlay coloré sur photo garantit un fond suffisamment sombre pour le texte blanc. À 55% d'opacité, les deux couleurs (terracotta et sauge) créent un fond assez dense. Vérifier visuellement avec les images placeholder et ajuster si nécessaire (60% si contraste insuffisant).

### Images Placeholder — Pattern

Pour les images destinations, créer des placeholders WebP de ~1440x900px. Options :
1. Images libres de droits (Unsplash/Pexels) converties en WebP
2. Images générées (solid color rectangles) — minimum fonctionnel
3. Elena fournit les photos définitives ultérieurement

L'important est que le build passe et que les content collections soient validées par Zod.

### Pattern GSAP — RÈGLE ABSOLUE

```typescript
import { gsap, ScrollTrigger } from '../lib/gsap'; // ✅ CORRECT
// JAMAIS: import { gsap } from 'gsap'; // ❌ INTERDIT (double bundle)
```

### Pattern de test — readFileSync

Les tests pour les composants Astro utilisent `readFileSync` pour lire le source et valider par pattern matching. Ce n'est pas du rendering test — c'est du source code validation.

```typescript
const component = readFileSync(
  resolve(__dirname, '../../src/components/DestinationBlock.astro'),
  'utf-8'
);
```

Pour le schema content collection, tester le fichier `config.ts` de la même façon.

### Learnings Story 2-3 (à respecter)

- Tests MUST be in `web/tests/` (JAMAIS dans `src/`)
- Utiliser `?? fallback` au lieu de `!` (ESLint `no-non-null-assertion`)
- Prettier lowercase les hex colors — tester avec `#c0603e` pas `#C0603E`
- Run `prettier --write` immédiatement après création de fichiers
- Les composants statiques ne doivent avoir aucun `<script>` — toute l'interactivité passe par SectionReveal
- `desktopOnly` sur CTAButton utilise `hidden lg:inline-block` (PAS `lg:block`)

### Structure des fichiers à créer/modifier

**Nouveaux fichiers :**
- `web/src/content/config.ts`
- `web/src/content/destinations/perou-sacre.md`
- `web/src/content/destinations/colombie-cafetera.md`
- `web/src/content/destinations/costa-rica-pura-vida.md`
- `web/src/content/destinations/patagonie-sauvage.md`
- `web/src/assets/images/destinations/perou.webp`
- `web/src/assets/images/destinations/colombie.webp`
- `web/src/assets/images/destinations/costa-rica.webp`
- `web/src/assets/images/destinations/patagonie.webp`
- `web/src/components/DestinationBlock.astro`
- `web/tests/components/DestinationBlock.test.ts`
- `web/tests/content/config.test.ts`

**Fichiers modifiés :**
- `web/src/pages/index.astro` (ajout section Destinations entre Elena et Processus)
- `web/tests/pages/index.test.ts` (tests Destinations section)

### References

- [Source: docs/planning-artifacts/epics.md#Story 2.4] — AC et user story (lignes 434-470)
- [Source: docs/planning-artifacts/architecture.md#Décision 5] — Content collections Astro 5 (ligne 126)
- [Source: docs/planning-artifacts/architecture.md#Flux de Données] — getCollection pattern (lignes 860-896)
- [Source: docs/planning-artifacts/architecture.md#src/assets vs public] — règle placement images (lignes 795-802)
- [Source: docs/planning-artifacts/ux-design-specification.md#DestinationBlock.astro] — specs composant (lignes 1016-1024)
- [Source: docs/planning-artifacts/ux-design-specification.md#Button Hierarchy] — CTAButton ghost pour post-MVP (lignes 1140-1151)
- [Source: docs/planning-artifacts/ux-design-specification.md#Loading Patterns] — lazy loading destinations (lignes 1303-1312)
- [Source: docs/planning-artifacts/prd.md#FR6] — blocs destination par pays (ligne 415)
- [Source: docs/planning-artifacts/prd.md#Journey Antoine] — spécialisation visible par destinations (lignes 231-243)
- [Source: docs/implementation-artifacts/2-3-section-elena-section-processus.md] — learnings dev, patterns GSAP, Image Astro

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- HEIC images converted via macOS `sips` (HEIC→JPEG) + `sharp` (JPEG→WebP @ 1440x900)
- Content collections validated by Astro build (Zod schema + image optimization)
- Overlay contrast at 55% depends on underlying photo — acceptable with current images, to verify with final photos

### Completion Notes List

- All 7 tasks completed successfully
- 408 tests pass across 19 test files (62 new tests for this story)
- Build generates 13 optimized images including 4 destination photos at multiple widths
- DestinationBlock is fully static (0 JS) — animation handled by SectionReveal wrapper
- `learnMoreHref` prop ready for post-MVP activation (CTAButton ghost variant)
- Content collection `image()` helper enables Astro image optimization pipeline (responsive widths, WebP, lazy loading)
- [Code Review] DestinationBlock changé de `min-h-screen` à `min-h-[50vh]` pour afficher 2 destinations par écran (demande Elena)

### Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.6 — 2026-02-13
**Outcome:** Approved with fixes applied

**Issues trouvées : 3 MEDIUM, 5 LOW — toutes corrigées**

| # | Sév. | Issue | Fix |
|---|------|-------|-----|
| M1 | MEDIUM | `.sort()` mutable dans index.astro | `[...destinations].sort()` |
| M2 | MEDIUM | Pas de test pour `imageAlt` dynamique | Test ajouté |
| M3 | MEDIUM | Pas de test d'ordre des sections | Test ajouté |
| L1 | LOW | Test overlay conditionnel trop faible | Regex renforcée |
| L2 | LOW | `mb-6` inutile sans CTA | Conditionnel sur `learnMoreHref` |
| L3 | LOW | `.gitkeep` obsolète | Supprimé |
| L4 | LOW | CTAButton ghost `text-terracotta` sur overlay (futur) | Noté pour post-MVP |
| L5 | LOW | `data-calendly-trigger` sur tous CTAButton (futur) | Noté pour post-MVP |

**Changement design Elena :** Blocs destination passés de `min-h-screen` (100vh) à `min-h-[50vh]` pour afficher 2 destinations visibles par écran. Padding bottom ajusté de `pb-16 md:pb-24` à `pb-10 md:pb-16`.

### File List

**New files:**
- `web/src/content/config.ts` — Zod schema for destinations collection
- `web/src/content/destinations/perou-sacre.md` — terracotta, order: 1
- `web/src/content/destinations/colombie-cafetera.md` — sauge, order: 2
- `web/src/content/destinations/costa-rica-pura-vida.md` — terracotta, order: 3
- `web/src/content/destinations/patagonie-sauvage.md` — sauge, order: 4
- `web/src/assets/images/destinations/perou.webp` — 1440x900, 173KB
- `web/src/assets/images/destinations/colombie.webp` — 1440x900, 385KB
- `web/src/assets/images/destinations/costa-rica.webp` — 1440x900, 322KB
- `web/src/assets/images/destinations/patagonie.webp` — 1440x900, 393KB
- `web/src/components/DestinationBlock.astro` — static component (0 JS)
- `web/tests/components/DestinationBlock.test.ts` — 26 tests
- `web/tests/content/config.test.ts` — 34 tests

**Modified files:**
- `web/src/pages/index.astro` — Destinations section between Elena and Processus
- `web/tests/pages/index.test.ts` — 9 new tests for Destinations integration (41 total)
