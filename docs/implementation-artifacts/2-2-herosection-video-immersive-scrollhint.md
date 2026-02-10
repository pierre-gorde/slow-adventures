# Story 2.2: HeroSection vidéo immersive & ScrollHint

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want être immergé dès l'arrivée sur le site par une vidéo plein écran et une invitation au scroll,
so that je ressente immédiatement l'univers Slow Adventures en continuité avec Instagram.

## Acceptance Criteria (BDD)

### AC1 — Poster image & chargement initial (FR2)

```gherkin
Given un visiteur arrive sur la page d'accueil
When la page commence à charger
Then une image poster WebP haute qualité s'affiche immédiatement en plein écran
And le titre "Slow Adventures" apparaît centré en Lora XL (clamp(2.5rem, 5vw, 4.5rem))
And le sous-titre "Voyages immersifs aux Amériques" apparaît en dessous en Plus Jakarta Sans
And le poster est préchargé via <link rel="preload"> dans BaseLayout (candidat LCP)
```

### AC2 — Vidéo : chargement & remplacement du poster (FR1)

```gherkin
Given le poster est affiché
When la vidéo hero finit de charger
Then la vidéo remplace le poster en fade-in
And la vidéo boucle avec les attributs autoplay muted loop playsinline
And la vidéo a aria-hidden="true" (purement décorative)
And les formats vidéo sont MP4 H.264 (mobile: 720p ~2MB, desktop: 1080p ~4MB)
```

### AC3 — Support prefers-reduced-motion & Save-Data (FR4)

```gherkin
Given un visiteur a activé prefers-reduced-motion: reduce OU Save-Data: on
When la page se charge
Then seul le poster statique s'affiche
And aucune vidéo ne se lance
And aucune animation GSAP ne se déclenche
```

### AC4 — ScrollHint component

```gherkin
Given la section hero est visible et l'utilisateur n'a pas encore scrollé
When le hero est dans le viewport
Then un composant ScrollHint affiche "scroll to explore" avec un chevron pulsant en bas
And ScrollHint a aria-hidden="true" (purement décoratif)
When le visiteur scrolle de plus de 50px
Then le ScrollHint disparaît en fade-out
```

### AC5 — Pas de CTA dans le hero

```gherkin
Given la section hero est rendue
When on inspecte le HTML
Then AUCUN bouton CTA n'est présent dans le hero
And le hero est conçu pour inspirer, pas pour vendre
```

### AC6 — Effet parallaxe sur le titre

```gherkin
Given le hero est visible
And GSAP est importé depuis src/lib/gsap.ts
When le visiteur scrolle
Then le titre a un effet parallaxe subtil au scroll
And l'effet utilise GSAP ScrollTrigger
And l'animation respecte prefers-reduced-motion
```

### AC7 — Responsive & mobile-first

```gherkin
Given le visiteur est sur mobile (<768px)
When la page se charge
Then la vidéo mobile (720p) est servie via <source media="(min-width: 768px)">
And le layout est plein écran (100vh) avec contenu centré
And aucun débordement horizontal à 320px
Given le visiteur est sur desktop (≥1024px)
Then la vidéo desktop (1080p) est servie
And l'effet parallaxe est actif
```

## Tasks / Subtasks

- [x] Task 1 — Créer le composant HeroSection.astro (AC: #1, #2, #5, #7)
  - [x] 1.1 Créer `web/src/components/HeroSection.astro` avec structure sémantique `<section>`
  - [x] 1.2 Implémenter le poster image avec `<Image>` d'Astro (responsive srcset 768w, 1440w, 2880w)
  - [x] 1.3 Ajouter `<link rel="preload">` pour le poster dans BaseLayout.astro
  - [x] 1.4 Implémenter la `<video>` avec `<source>` unique (même vidéo toutes tailles, object-fit cover center)
  - [x] 1.5 Structurer titre h1 "Slow Adventures" + sous-titre avec tokens Tailwind
  - [x] 1.6 Ajouter overlay sombre (warm-black) pour contraste texte/vidéo
  - [x] 1.7 Responsive : plein écran 100vh, centrage vertical, pas de scroll horizontal à 320px

- [x] Task 2 — Implémenter le fade-in vidéo et détection réduite (AC: #2, #3)
  - [x] 2.1 Script client pour détecter `prefers-reduced-motion` et `Save-Data` (via `navigator.connection`)
  - [x] 2.2 Si motion OK : charger la vidéo, écouter `canplay`/`loadeddata`, fade-in CSS du poster vers vidéo
  - [x] 2.3 Si reduced-motion OU Save-Data : ne PAS charger la vidéo, afficher poster uniquement
  - [x] 2.4 Attributs vidéo obligatoires : `autoplay muted loop playsinline aria-hidden="true"`

- [x] Task 3 — Créer le composant ScrollHint.astro (AC: #4)
  - [x] 3.1 Créer `web/src/components/ScrollHint.astro` en island `client:visible`
  - [x] 3.2 Texte "scroll to explore" + chevron SVG animé (pulse CSS keyframe)
  - [x] 3.3 Positionner en bas du hero (absolute bottom)
  - [x] 3.4 Script client : détecter scroll > 50px, fade-out le composant
  - [x] 3.5 `aria-hidden="true"` sur le composant entier

- [x] Task 4 — Implémenter l'effet parallaxe GSAP (AC: #6)
  - [x] 4.1 Importer GSAP UNIQUEMENT depuis `src/lib/gsap.ts`
  - [x] 4.2 Wrapper dans `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`
  - [x] 4.3 Parallaxe subtil sur le titre : `gsap.to(title, { y: -50, scrollTrigger: { scrub: 1 } })`
  - [x] 4.4 Cleanup function : `ScrollTrigger.getAll().forEach(st => st.kill())`
  - [x] 4.5 N/A — parallaxe scrub utilise `ease: 'none'` (standard pour scroll-linked, tokens duration/ease non applicables)

- [x] Task 5 — Intégrer dans la page d'accueil (AC: #1, #7)
  - [x] 5.1 Importer HeroSection dans `web/src/pages/index.astro`
  - [x] 5.2 Passer les props : posterSrc, videoSrc, title, subtitle
  - [x] 5.3 S'assurer que le `<h1>` est unique sur la page

- [x] Task 6 — Préparer les assets vidéo/poster (AC: #1, #2)
  - [x] 6.1 Convertir RPReplay_Final1738945890.mov en MP4 H.264 unique (upscalé 1920w via lanczos) via FFmpeg
  - [x] 6.2 Supprimer la piste audio des vidéos (réduction taille)
  - [x] 6.3 Placer la vidéo unique dans `public/videos/hero.mp4`
  - [x] 6.4 Créer/optimiser poster WebP < 100kb dans `src/assets/images/`
  - [x] 6.5 Vérifier que la boucle vidéo est fluide (pas de saut visible)

- [x] Task 7 — Tests (AC: tous)
  - [x] 7.1 Créer `web/tests/components/HeroSection.test.ts`
    - Structure HTML sémantique (`<section>`, `<h1>`, `<video>`)
    - Attributs vidéo (`autoplay`, `muted`, `loop`, `playsinline`, `aria-hidden`)
    - Poster image avec attributs responsive
    - Absence de CTA dans le hero
    - Overlay sombre pour contraste
    - Classes responsive (mobile-first)
  - [x] 7.2 Créer `web/tests/components/ScrollHint.test.ts`
    - Texte "scroll to explore" présent
    - Chevron SVG présent
    - `aria-hidden="true"` sur le composant
    - Positionnement bottom
  - [x] 7.3 Tester la détection `prefers-reduced-motion` dans HeroSection
  - [x] 7.4 Tester l'import GSAP depuis `src/lib/gsap.ts` (pas d'import direct)
  - [x] 7.5 `npm run lint` — 0 erreurs
  - [x] 7.6 `npm run test` — tous les tests passent (0 régressions)
  - [x] 7.7 `npm run build` — build réussi

- [ ] Task 8 — Vérification visuelle (manuelle)
  - [ ] 8.1 Poster s'affiche immédiatement au chargement
  - [ ] 8.2 Vidéo remplace le poster en fondu
  - [ ] 8.3 ScrollHint visible puis disparaît au scroll
  - [ ] 8.4 Parallaxe titre subtil au scroll
  - [ ] 8.5 Test avec `prefers-reduced-motion: reduce` (poster seul, pas d'animations)
  - [ ] 8.6 Test sur mobile (responsive, pas de scroll horizontal)
  - [ ] 8.7 Contraste texte sur vidéo ≥ 4.5:1

## Dev Notes

### Architecture & Patterns CRITIQUES

**Import GSAP — RÈGLE ABSOLUE :**
```typescript
// ✅ CORRECT — TOUJOURS ce pattern
import { gsap, ScrollTrigger } from '../lib/gsap';

// ❌ INTERDIT — import direct cause double bundle (~48kb au lieu de ~24kb)
import { gsap } from 'gsap';
```
[Source: docs/implementation-artifacts/2-1-module-gsap-unifie-sectionreveal.md]

**Pattern prefers-reduced-motion — OBLIGATOIRE :**
```typescript
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.to(titleElement, {
    y: -50,
    ease: 'none',
    scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 1 }
  });
  return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
});
```
[Source: docs/planning-artifacts/architecture.md — Section GSAP Integration]

**Progressive Enhancement — OBLIGATOIRE :**
- Sans JS : poster statique visible, texte lisible, pas de flash
- Avec JS : vidéo joue, animations GSAP déclenchées au scroll
- CSS fallback via `[data-reveal]` + IntersectionObserver (déjà dans BaseLayout)
[Source: docs/implementation-artifacts/2-1-module-gsap-unifie-sectionreveal.md]

**Vidéo HTML5 sur iOS Safari — CRITIQUE (80%+ du trafic) :**
- Attributs OBLIGATOIRES : `autoplay muted loop playsinline`
- Le poster DOIT être visible pendant le chargement vidéo (LCP)
- `playsinline` empêche le plein écran natif iOS
- Pas de piste audio = taille réduite
[Source: docs/planning-artifacts/prd.md — FR1, FR2]

**Détection Save-Data :**
```typescript
const saveData = (navigator as any).connection?.saveData === true;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (saveData || reducedMotion) {
  // Ne PAS charger la vidéo — poster uniquement
}
```
Note : `prefers-reduced-data` CSS media query existe mais support limité. Utiliser JS pour `navigator.connection.saveData`.

**Tokens CSS à utiliser :**
```css
/* Couleurs */
bg-warm-black / rgba(44, 40, 37, 0.8) — overlay hero
text-white — titre/sous-titre sur overlay
font-serif — Lora (titres)
font-sans — Plus Jakarta Sans (sous-titre)

/* GSAP */
--gsap-duration-slow: 600ms (→ 0.6s pour GSAP)
--gsap-ease-slow: ease-in-out
```
[Source: web/src/styles/global.css — @theme tokens]

### Structure des composants

```
web/src/components/HeroSection.astro   ← Composant statique (poster + vidéo + titre)
web/src/components/ScrollHint.astro    ← Island client:visible (JS minimal)
web/src/pages/index.astro              ← Intègre HeroSection
web/src/layouts/BaseLayout.astro       ← Ajouter <link rel="preload"> poster
public/videos/hero-mobile.mp4         ← Vidéo 720p ~2MB (non traité par Astro)
public/videos/hero-desktop.mp4        ← Vidéo 1080p ~4MB (non traité par Astro)
src/assets/images/hero-poster.webp    ← Poster traité par astro:assets
```
[Source: docs/planning-artifacts/architecture.md — File Organization]

### Performance Budget

| Métrique | Cible | Notes |
|----------|-------|-------|
| LCP | < 2.5s sur 4G mobile Safari iOS | Poster préchargé = élément LCP |
| CLS | < 0.1 | Container 100vh fixe, pas de layout shift |
| Poster | < 100kb WebP | Responsive srcset 768w, 1440w, 2880w |
| Vidéo mobile | ~2MB MP4 H.264 720p | 8-12s, CRF 23-28, sans audio |
| Vidéo desktop | ~4MB MP4 H.264 1080p | 10-15s, CRF 23-28, sans audio |
| JS total site | ~20kb gzipped | GSAP ~8kb, reste ~12kb |
[Source: docs/planning-artifacts/architecture.md — NFR, Performance]

### Accessibilité

- `<section>` pour le container hero avec `aria-label`
- `<h1>` unique sur la page (titre hero)
- `aria-hidden="true"` sur `<video>` et ScrollHint (décoratifs)
- Contraste texte blanc sur overlay sombre ≥ 4.5:1
- Skip-to-content link sera ajouté en Story 2.6
- Touch target minimum 44x44px (pas de CTA ici, mais le ScrollHint ne doit pas bloquer)
[Source: docs/planning-artifacts/ux-design-specification.md — Accessibility]

### Learnings de Story 2-1 (GSAP Module)

- **Tests DANS `web/tests/`** — JAMAIS dans `src/` (erreurs vitest internes)
- **`gsap.matchMedia()`** — Méthode GSAP recommandée pour prefers-reduced-motion
- **`once: true`** sur ScrollTrigger — animation joue une seule fois
- **Cleanup function** — Toujours retourner `() => { ScrollTrigger.getAll().forEach(st => st.kill()); }`
- **Pas d'animation de propriétés layout** — Utiliser transform (y, x, scale), PAS width/height/margin
- **Conversion ms→s** pour GSAP : `300ms` → `duration: 0.3`
- **`?? fallback`** au lieu de `!` (ESLint no-non-null-assertion)
- **Prettier lowercase les hex** — valeurs tests en minuscules (`#7b8f6b` pas `#7B8F6B`)
[Source: docs/implementation-artifacts/2-1-module-gsap-unifie-sectionreveal.md — Dev Notes & Code Review]

### Assets disponibles

Les fichiers .mov sources sont dans `assets/Hero section/` :
- `RPReplay_Final1738945890.mov`
- `RPReplay_Final1739199593.mov`
- `IMG_1354.mov`

Commande FFmpeg pour conversion :
```bash
# Desktop 1080p
ffmpeg -i input.mov -c:v libx264 -crf 25 -preset slow -vf "scale=1920:1080" -an -movflags +faststart hero-desktop.mp4

# Mobile 720p
ffmpeg -i input.mov -c:v libx264 -crf 25 -preset slow -vf "scale=1280:720" -an -movflags +faststart hero-mobile.mp4
```
Note : `-an` supprime l'audio, `-movflags +faststart` optimise le streaming progressif.

### Project Structure Notes

- Alignement avec structure unifiée : composants dans `src/components/`, assets traités dans `src/assets/`, vidéos non-traitées dans `public/videos/`
- Pattern island : ScrollHint utilise `client:visible` (même pattern que SectionReveal)
- HeroSection est principalement statique — le JS est minimal (fade vidéo + détection reduced-motion)
- Pas de conflit détecté avec les stories précédentes

### References

- [Source: docs/planning-artifacts/epics.md — Epic 2, Story 2.2]
- [Source: docs/planning-artifacts/architecture.md — FR1-FR4, Component Architecture, GSAP Integration, Performance NFRs]
- [Source: docs/planning-artifacts/ux-design-specification.md — Hero Section, ScrollHint, Video Requirements, Accessibility]
- [Source: docs/planning-artifacts/prd.md — FR1, FR2, FR4, Performance Targets, Mobile Requirements]
- [Source: docs/implementation-artifacts/2-1-module-gsap-unifie-sectionreveal.md — GSAP Patterns, Learnings, Code Review]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- ESLint `no-undef` pour `ImageMetadata` dans fichiers `.astro` — résolu en ajoutant le global dans `eslint.config.mjs`
- FFmpeg non installé — installé via `brew install ffmpeg`
- FFmpeg WebP encoder absent — utilisé sharp (via Astro) pour la conversion poster PNG→WebP
- Vidéo desktop H.264 High 10 (HDR/10-bit/BT.2020) ne chargeait pas dans les navigateurs — ré-encodée en High 8-bit SDR (BT.709)
- Architecture initiale mobile/desktop séparées → simplifiée en vidéo unique (demande utilisateur)
- Vidéo source 720p upscalée à 1920w via FFmpeg lanczos pour qualité desktop

### Completion Notes List

- HeroSection.astro : composant avec poster `<Image>` responsive (768/1440/2880w), vidéo unique (object-fit cover center), overlay warm-black 0.8, titres Lora/Plus Jakarta Sans, layout 100vh centré
- Détection prefers-reduced-motion et Save-Data dans script client — vidéo supprimée si activé, poster seul affiché
- Fade-in vidéo via CSS transition opacity + classe `is-playing` sur play() promise
- ScrollHint.astro : texte "scroll to explore" + chevron SVG pulsant (désactivé sur reduced-motion), positionné absolute bottom dans le hero, fade-out au scroll > 50px, aria-hidden="true"
- Parallaxe GSAP : import depuis `src/lib/gsap.ts` (module unifié), `gsap.matchMedia()` pour reduced-motion, `y: -50` avec scrub:1, cleanup ciblé
- BaseLayout : nouvelle prop `heroPreloadImage?` avec `<link rel="preload" as="image" type="image/webp">` conditionnel
- index.astro : intégration HeroSection avec getImage() pour preload optimisé du poster
- Assets : vidéo unique 1920x3632 7.9MB (RPReplay_Final1738945890.mov→H.264 upscalé lanczos), poster WebP 38KB
- ESLint config : ajout `ImageMetadata` comme global readonly pour les fichiers `.astro`
- 258 tests passent (51 HeroSection + 17 ScrollHint + tests existants), 0 régressions
- Lint 0 erreurs, build réussi

### File List

- `web/src/components/HeroSection.astro` (nouveau)
- `web/src/components/ScrollHint.astro` (nouveau)
- `web/src/pages/index.astro` (modifié — intégration HeroSection + getImage preload)
- `web/src/layouts/BaseLayout.astro` (modifié — prop heroPreloadImage + link preload)
- `web/src/assets/images/hero-poster.webp` (nouveau — poster 38KB, extrait de RPReplay)
- `web/public/videos/hero.mp4` (nouveau — 1920x3632, 7.9MB, H.264 High 8-bit SDR, sans audio)
- `web/public/videos/.gitkeep` (supprimé)
- `web/eslint.config.mjs` (modifié — ajout ImageMetadata global pour .astro)
- `web/tests/components/HeroSection.test.ts` (nouveau — 51 tests)
- `web/tests/components/ScrollHint.test.ts` (nouveau — 17 tests)
- `web/tests/layouts/BaseLayout.test.ts` (modifié — tests heroPreloadImage)
- `web/tests/pages/index.test.ts` (modifié — tests intégration HeroSection)

### Change Log

- 2026-02-10: Story 2-2 implémentée — HeroSection vidéo immersive avec poster WebP, vidéo H.264 unique, ScrollHint animé, parallaxe GSAP, support prefers-reduced-motion/Save-Data, preload poster dans BaseLayout
- 2026-02-10: Code review — overlay 0.5→0.8, line-height 1.1→1.2, alt text poster, catch vidéo non-silencieux, ScrollHint reduced-motion, story file mis à jour
