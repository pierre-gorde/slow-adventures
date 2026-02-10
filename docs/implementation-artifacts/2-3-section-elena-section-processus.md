# Story 2.3: Section Elena & section Processus

Status: done

## Story

As a visiteur,
I want découvrir qui est Elena et comprendre le processus de création de voyage,
So that je sois rassuré par son expertise terrain et la clarté de son accompagnement.

## Acceptance Criteria

### Section Elena (FR5)

1. **Given** le visiteur scrolle après le hero **When** la section Elena entre dans le viewport **Then** la section affiche un fond dark overlay avec la photo d'Elena en cercle (bordure blanche)
2. **And** la photo apparaît en scale-in depuis le centre, le texte de présentation en fade-in 200ms après (via SectionReveal)
3. **And** le composant `ElenaSection.astro` est statique (0 JS) et accepte les props `imageSrc`, `imageAlt`, `title`, `description`, `ctaHref`
4. **And** un CTAButton variant `outline` avec `desktopOnly: true` est intégré sous le texte (visible uniquement sur desktop lg:)
5. **Given** la section Elena est affichée **When** on inspecte l'accessibilité **Then** la photo a un alt text descriptif, la structure heading est logique (h2), le contraste texte clair sur fond dark respecte 4.5:1 (NFR8)

### Section Processus (FR7)

6. **Given** le visiteur continue de scroller **When** la section Processus entre dans le viewport **Then** la section "Du rêve à la réalité" affiche les étapes numérotées sur fond crème
7. **And** les étapes apparaissent une par une au scroll (stagger 150ms via SectionReveal `animation="stagger"`)
8. **And** chaque étape est un composant `ProcessStep.astro` statique (0 JS) avec les props `number`, `title`, `description`, `icon` (optionnel SVG stroke-only)
9. **And** les données proviennent de `src/data/processSteps.ts`
10. **Given** les étapes sont dans une liste **When** on inspecte le HTML **Then** les étapes sont dans une `<ol>` avec des `<li>` sémantiques, la numérotation est explicite

## Tasks / Subtasks

- [x] Task 1: Créer le composant CTAButton.astro minimal (AC: #4)
  - [x] 1.1 Créer `web/src/components/CTAButton.astro` — composant statique (0 JS)
  - [x] 1.2 Props : `text` (default: "Confiez-nous ton prochain rêve"), `subtext` (optionnel), `href`, `size` (default | small), `variant` (solid | outline | ghost), `desktopOnly` (boolean)
  - [x] 1.3 Le bouton est un `<a>` sémantique avec `data-calendly-trigger` pour interception JS future
  - [x] 1.4 Variant `outline` : fond transparent, bordure blanche, texte blanc sur fond dark
  - [x] 1.5 Variant `solid` : fond terracotta, texte blanc (preview pour Story 3.1)
  - [x] 1.6 `desktopOnly: true` → `hidden lg:inline-block`
  - [x] 1.7 Hover: `box-shadow: 0 8px 32px rgba(192,96,62,0.15)` + `transform: scale(1.02)` — transition 300ms
  - [x] 1.8 Focus: `outline: 2px solid terracotta` + `outline-offset: 4px`
  - [x] 1.9 Créer `web/tests/components/CTAButton.test.ts`
- [x] Task 2: Étendre SectionReveal avec animation `scale-in` (AC: #2)
  - [x] 2.1 Ajouter `'scale-in'` au type union de `animation` prop dans `SectionReveal.astro`
  - [x] 2.2 Implémenter GSAP `gsap.from(el, { opacity: 0, scale: 0.85, duration, delay, scrollTrigger })` pour `scale-in`
  - [x] 2.3 Mettre à jour `web/tests/components/SectionReveal.test.ts` avec les cas `scale-in`
- [x] Task 3: Créer le composant ElenaSection.astro (AC: #1, #3, #4, #5)
  - [x] 3.1 Créer `web/src/components/ElenaSection.astro` — composant statique (0 JS)
  - [x] 3.2 Props : `imageSrc` (ImageMetadata), `imageAlt`, `title`, `description`, `ctaHref`
  - [x] 3.3 Layout : fond `bg-warm-black` avec overlay, photo en cercle (bordure blanche `border-4 border-white rounded-full`), texte clair centré
  - [x] 3.4 Photo wrappée dans `<SectionReveal animation="scale-in">`, texte dans `<SectionReveal animation="fade-in" delay={200}>`
  - [x] 3.5 Intégrer CTAButton `variant="outline"` `size="small"` `desktopOnly={true}` sous le texte
  - [x] 3.6 Utiliser Astro `<Image>` pour la photo avec `loading="lazy"` et srcset responsive
  - [x] 3.7 Image sizes: `(min-width: 1024px) 400px, 250px` — cercle 250px mobile, 400px desktop
  - [x] 3.8 Structure sémantique : `<section>` avec `<h2>` pour le titre
  - [x] 3.9 Responsive : mobile (photo + texte empilés), md (cercle plus grand), lg (layout horizontal possible)
  - [x] 3.10 Créer `web/tests/components/ElenaSection.test.ts`
- [x] Task 4: Créer le fichier de données processSteps.ts (AC: #9)
  - [x] 4.1 Créer `web/src/data/processSteps.ts` avec le type `ProcessStepData`
  - [x] 4.2 Type : `{ number: number; title: string; description: string; icon?: string }`
  - [x] 4.3 Définir 5 étapes placeholder (contenu à valider par Elena) :
    1. "Échangeons" — Discovery call 20 min gratuite
    2. "Rêvons ensemble" — Compréhension de vos envies
    3. "On crée ton voyage" — Itinéraire sur-mesure
    4. "Tout est carré" — Planification détaillée jour par jour
    5. "Vis ton aventure" — Accompagnement pendant le voyage
  - [x] 4.4 Export nommé `processSteps` (tableau typé)
- [x] Task 5: Créer le composant ProcessStep.astro (AC: #8, #10)
  - [x] 5.1 Créer `web/src/components/ProcessStep.astro` — composant statique (0 JS)
  - [x] 5.2 Props : `number`, `title`, `description`, `icon` (optionnel, SVG string stroke-only)
  - [x] 5.3 Rendu dans un `<li>` sémantique (le parent fournit le `<ol>`)
  - [x] 5.4 Numérotation explicite visible (pas seulement via CSS counter)
  - [x] 5.5 Style : numéro en terracotta, titre en `font-serif` (Lora), description en `font-sans`
  - [x] 5.6 Si `icon` fourni, rendre le SVG stroke-only avant ou à côté du numéro
  - [x] 5.7 Créer `web/tests/components/ProcessStep.test.ts`
- [x] Task 6: Créer la section Processus dans index.astro (AC: #6, #7, #10)
  - [x] 6.1 Ajouter une `<section>` Processus après ElenaSection dans `index.astro`
  - [x] 6.2 Fond `bg-creme` avec padding section standard (`sa-section-padding`)
  - [x] 6.3 Titre `<h2>` : "Du rêve à la réalité" (PAS "Comment ça marche")
  - [x] 6.4 Wrapper `<SectionReveal animation="stagger">` autour du `<ol>` contenant les ProcessStep
  - [x] 6.5 Importer et itérer sur `processSteps` depuis `src/data/processSteps.ts`
  - [x] 6.6 Responsive : mobile (empilé vertical), md (2 colonnes), lg (3-4 colonnes)
- [x] Task 7: Intégrer ElenaSection dans index.astro (AC: #1)
  - [x] 7.1 Importer ElenaSection dans `index.astro`
  - [x] 7.2 Ajouter la section après HeroSection, avant la section Processus
  - [x] 7.3 Fournir une image placeholder (créer `web/src/assets/images/elena.webp` — image placeholder)
  - [x] 7.4 Props : titre, description (contenu placeholder à valider par Elena), lien CTA
- [x] Task 8: Mettre à jour les tests existants (AC: all)
  - [x] 8.1 Mettre à jour `web/tests/pages/index.test.ts` — vérifier ElenaSection et ProcessusSection présentes
  - [x] 8.2 Mettre à jour `web/tests/layouts/BaseLayout.test.ts` si nécessaire
- [x] Task 9: Validation finale
  - [x] 9.1 `npm run lint` — 0 erreurs ESLint et Prettier
  - [x] 9.2 `npm run test` — tous les tests passent
  - [x] 9.3 `npm run build` — build réussi sans erreurs
  - [x] 9.4 Vérifier le contraste texte blanc sur fond dark ≥ 4.5:1 (NFR8)

## Dev Notes

### Dépendance CTAButton — créé en avance sur Story 3.1

L'AC #4 requiert un CTAButton `outline` dans la section Elena. Le composant CTAButton complet est planifié en Story 3.1 mais cette story le nécessite déjà. **Créer un CTAButton fonctionnel avec tous les variants** (solid, outline, ghost) + les props `size` et `desktopOnly` dès cette story. Story 3.1 se concentrera alors sur la section CTA finale et le StickyMobileCTA, sans recréer CTAButton.

### Extension SectionReveal — animation `scale-in`

L'AC spécifie "scale-in depuis le centre" pour la photo d'Elena. Ce type d'animation n'existe pas encore dans SectionReveal (qui supporte `fade-up`, `fade-in`, `stagger`). **Ajouter `scale-in` comme 4ème variant** : `gsap.from(el, { opacity: 0, scale: 0.85 })`. ElenaSection reste statique (0 JS) — c'est SectionReveal qui gère l'animation.

### Pattern GSAP — RÈGLE ABSOLUE

```typescript
import { gsap, ScrollTrigger } from '../lib/gsap'; // ✅ CORRECT
// JAMAIS: import { gsap } from 'gsap'; // ❌ INTERDIT (double bundle)
```

### Pattern prefers-reduced-motion

Déjà géré par SectionReveal via `gsap.matchMedia()`. Les composants statiques n'ont rien à faire — si `prefers-reduced-motion: reduce`, le CSS dans `global.css` force `[data-reveal] { opacity: 1; }`.

### Pattern de données statiques

```typescript
// src/data/processSteps.ts
export interface ProcessStepData {
  number: number;
  title: string;
  description: string;
  icon?: string; // SVG string, stroke-only
}

export const processSteps: ProcessStepData[] = [
  { number: 1, title: "Échangeons", description: "..." },
  // ...
];
```

### Pattern d'image Astro — ElenaSection

```astro
---
import { Image } from 'astro:assets';
// Props: imageSrc est de type ImageMetadata (import statique)
---
<Image
  src={imageSrc}
  alt={imageAlt}
  widths={[250, 400, 800]}
  sizes="(min-width: 1024px) 400px, 250px"
  loading="lazy"
  decoding="async"
  class="rounded-full border-4 border-white w-[250px] md:w-[350px] lg:w-[400px] aspect-square object-cover"
/>
```

### Tokens CSS à utiliser

| Token | Valeur | Usage |
|-------|--------|-------|
| `bg-warm-black` | `#2c2825` | Fond section Elena |
| `bg-creme` | `#fff9f3` | Fond section Processus |
| `text-terracotta` | `#c0603e` | Numéros process steps, CTA outline border |
| `text-white` | blanc | Texte sur fond dark |
| `font-serif` | Lora | Titres h2, titres steps |
| `font-sans` | Plus Jakarta Sans | Descriptions, body text |
| `border-white` | blanc | Bordure cercle photo Elena |

### Responsive Breakpoints

| Section | Mobile (default) | md (768px+) | lg (1024px+) |
|---------|-----------------|-------------|--------------|
| Elena | Photo + texte empilés, centré | Cercle plus grand | Photo à gauche, texte à droite possible |
| Processus | Steps empilés verticalement | 2 colonnes (2×2 ou 3+1) | 3-4 colonnes horizontales |
| CTAButton | Masqué (desktopOnly) | Masqué (desktopOnly) | Visible (`lg:inline-block`) |

### Section Padding Standard

Utiliser la classe utilitaire existante `sa-section-padding` définie dans `global.css` :
```css
.sa-section-padding {
  @apply px-6 py-16 md:px-12 md:py-24 lg:px-24 lg:py-32;
}
```

### Structure des fichiers à créer/modifier

**Nouveaux fichiers :**
- `web/src/components/CTAButton.astro`
- `web/src/components/ElenaSection.astro`
- `web/src/components/ProcessStep.astro`
- `web/src/data/processSteps.ts`
- `web/tests/components/CTAButton.test.ts`
- `web/tests/components/ElenaSection.test.ts`
- `web/tests/components/ProcessStep.test.ts`

**Fichiers modifiés :**
- `web/src/components/SectionReveal.astro` — ajouter animation `scale-in`
- `web/src/pages/index.astro` — intégrer ElenaSection + section Processus
- `web/tests/components/SectionReveal.test.ts` — tests `scale-in`
- `web/tests/pages/index.test.ts` — tests des nouvelles sections

### Image placeholder Elena

Créer/fournir `web/src/assets/images/elena.webp`. Si l'image n'est pas disponible, utiliser un placeholder carré de ~400x400px en WebP. **Elena fournira la photo définitive ultérieurement.** L'important est que le composant fonctionne avec n'importe quelle image.

### Learnings Story 2-2 (à respecter)

- Tests MUST be in `web/tests/` (JAMAIS dans `src/`)
- Utiliser `?? fallback` au lieu de `!` (ESLint `no-non-null-assertion`)
- Prettier lowercase les hex colors — tester avec `#c0603e` pas `#C0603E`
- Run `prettier --write` immédiatement après création de fichiers
- Les composants statiques ne doivent avoir aucun `<script>` — toute l'interactivité passe par SectionReveal

### Project Structure Notes

- Structure plate dans `components/` — pas de sous-dossiers
- `src/data/` nouveau dossier pour les données statiques (processSteps, futurs testimonials, pricing)
- Alignement total avec l'architecture : ElenaSection et ProcessStep sont statiques, SectionReveal gère l'animation
- CTAButton anticipe Story 3.1 — lien `<a>` avec `data-calendly-trigger` pour progressive enhancement future

### References

- [Source: docs/planning-artifacts/epics.md#Story 2.3] — AC et user story
- [Source: docs/planning-artifacts/architecture.md#Structure Patterns] — composants plats, data files
- [Source: docs/planning-artifacts/architecture.md#Boundary des données] — processSteps.ts pattern
- [Source: docs/planning-artifacts/ux-design-specification.md#Chosen Direction] — Elena = Cinématique (Dir. 1), Processus = Full Immersif (Dir. 6)
- [Source: docs/planning-artifacts/ux-design-specification.md#ElenaSection.astro] — specs composant
- [Source: docs/planning-artifacts/ux-design-specification.md#ProcessStep.astro] — specs composant
- [Source: docs/planning-artifacts/ux-design-specification.md#Button Hierarchy] — CTAButton variants et sizing
- [Source: docs/planning-artifacts/ux-design-specification.md#Responsive Behavior] — breakpoints Elena et Processus
- [Source: docs/implementation-artifacts/2-2-herosection-video-immersive-scrollhint.md] — learnings dev, patterns GSAP

## Change Log

- 2026-02-10: Implémentation complète Story 2-3 — Section Elena, Section Processus, CTAButton, extension SectionReveal scale-in
- 2026-02-10: Code review — fix CTAButton `desktopOnly` display (`lg:inline-block`), fix solid variant active state, ajout tests ghost variant + responsive ElenaSection. 336 tests.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Photo Elena convertie depuis HEIC source (assets/Elena section/) via sips+sharp vers WebP 800x800
- Contraste vérifié : blanc sur #2c2825 = 14.6:1 (> 4.5:1 NFR8 ✓)
- BaseLayout.test.ts ne nécessite pas de modification (aucun changement au layout)

### Completion Notes List

- CTAButton.astro : composant réutilisable avec 3 variants (solid/outline/ghost), 2 tailles, desktopOnly (`lg:inline-block`), active state `terracotta-dark` sur solid, data-calendly-trigger pour progressive enhancement future. 23 tests.
- SectionReveal.astro : ajout animation `scale-in` (opacity:0 + scale:0.85) comme 4ème variant. 25 tests (+2 nouveaux).
- ElenaSection.astro : section statique (0 JS) avec photo circulaire en scale-in, texte en fade-in 200ms, CTAButton outline desktopOnly. Utilise Astro Image avec responsive widths. 24 tests.
- processSteps.ts : données typées (ProcessStepData) avec 5 étapes du processus de voyage. Export nommé.
- ProcessStep.astro : composant statique dans `<li>` sémantique, numérotation explicite en terracotta, icon SVG optionnel via set:html. 12 tests.
- index.astro : intégration ElenaSection après HeroSection + section Processus sur fond crème avec `<ol>` stagger animation. Photo Elena réelle convertie depuis assets source. 32 tests (+17 nouveaux).
- Total : 336 tests passent, 0 régression. ESLint + Prettier = 0 erreur. Build OK.

### File List

**Nouveaux fichiers :**
- web/src/components/CTAButton.astro
- web/src/components/ElenaSection.astro
- web/src/components/ProcessStep.astro
- web/src/data/processSteps.ts
- web/src/assets/images/elena.webp
- web/tests/components/CTAButton.test.ts
- web/tests/components/ElenaSection.test.ts
- web/tests/components/ProcessStep.test.ts

**Fichiers modifiés :**
- web/src/components/SectionReveal.astro (ajout scale-in animation)
- web/src/pages/index.astro (intégration ElenaSection + section Processus)
- web/tests/components/SectionReveal.test.ts (tests scale-in)
- web/tests/pages/index.test.ts (tests ElenaSection + Processus)
