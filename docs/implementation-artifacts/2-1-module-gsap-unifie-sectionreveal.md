# Story 2.1: Module GSAP unifié & SectionReveal

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur du site Slow Adventures,
I want que les sections du site apparaissent avec des animations fluides au scroll,
so that l'expérience de navigation soit immersive et stimulante visuellement.

## Acceptance Criteria (BDD)

### Scenario 1: Module GSAP unifié

```gherkin
Given le projet est initialisé (Epic 1 terminé)
When j'ouvre web/src/lib/gsap.ts
Then le fichier importe `gsap` et `ScrollTrigger` depuis le package 'gsap'
And le plugin ScrollTrigger est enregistré via gsap.registerPlugin()
And gsap et ScrollTrigger sont exportés comme named exports
And c'est le SEUL fichier du projet qui importe directement depuis 'gsap'
```

### Scenario 2: Composant SectionReveal — rendu

```gherkin
Given gsap.ts existe et exporte gsap + ScrollTrigger
When je crée web/src/components/SectionReveal.astro
Then le composant importe GSAP exclusivement depuis src/lib/gsap.ts
And le composant est un island interactif avec la directive client:visible
And le composant accepte les props : animation, delay, duration
And le composant encapsule un <slot> pour le contenu enfant
And le composant ajoute l'attribut data-reveal sur son wrapper
```

### Scenario 3: Animation au scroll (viewport entry)

```gherkin
Given un composant SectionReveal est dans le DOM mais pas encore visible
When l'utilisateur scrolle et la section entre dans le viewport
Then GSAP ScrollTrigger détecte le point de déclenchement (top 80%)
And le contenu s'anime selon le type d'animation configuré :
  - fade-up : opacity 0→1, translateY 20px→0
  - fade-in : opacity 0→1 uniquement
  - stagger : éléments multiples avec espacement de 150ms
And l'animation se joue une seule fois (once: true)
And l'animation se complète sans jank ni saccade
```

### Scenario 4: Respect de prefers-reduced-motion

```gherkin
Given l'utilisateur a activé prefers-reduced-motion: reduce dans ses paramètres OS
When la page se charge
Then tout le contenu SectionReveal s'affiche immédiatement
And l'opacity est à 1
And aucune animation GSAP ne s'initialise
And aucun code d'animation JavaScript ne s'exécute
And la règle CSS @media (prefers-reduced-motion: reduce) est active
```

### Scenario 5: Fallback CSS sans GSAP

```gherkin
Given GSAP n'a pas encore chargé (latence réseau)
When une section avec SectionReveal entre dans le viewport
Then le micro-script IntersectionObserver natif détecte l'intersection
And la transition CSS (opacity 200ms ease-in) est appliquée via l'attribut [data-reveal]
And le contenu devient visible sans framework d'animation JavaScript
And quand GSAP charge plus tard, aucun conflit ne se produit
```

### Scenario 6: Aucun import GSAP direct ailleurs

```gherkin
Given tous les composants du projet
When je recherche tout import "from 'gsap'" dans le codebase
Then seul web/src/lib/gsap.ts contient de tels imports
And tous les autres composants importent depuis : import { gsap, ScrollTrigger } from '../lib/gsap'
```

## Tasks / Subtasks

- [x] Task 1 : Installer GSAP (AC: #1)
  - [x] 1.1 `npm install gsap` dans `web/` — déjà installé (gsap ^3.14.2 dans package.json)
  - [x] 1.2 Vérifier que la version installée est ^3.14 — confirmé 3.14.2
- [x] Task 2 : Créer le module GSAP unifié `src/lib/gsap.ts` (AC: #1, #6)
  - [x] 2.1 Importer `gsap` depuis `'gsap'`
  - [x] 2.2 Importer `ScrollTrigger` depuis `'gsap/ScrollTrigger'`
  - [x] 2.3 Appeler `gsap.registerPlugin(ScrollTrigger)`
  - [x] 2.4 Exporter `{ gsap, ScrollTrigger }` comme named exports
- [x] Task 3 : Ajouter les règles CSS fallback dans `global.css` (AC: #4, #5)
  - [x] 3.1 Ajouter `[data-reveal] { opacity: 0; }` (état initial masqué)
  - [x] 3.2 Ajouter `[data-reveal].revealed { opacity: 1; transition: opacity 200ms ease-in; }` (fallback CSS)
  - [x] 3.3 Ajouter `@media (prefers-reduced-motion: reduce) { [data-reveal] { opacity: 1; } }` (accessibilité)
- [x] Task 4 : Créer le composant `SectionReveal.astro` (AC: #2, #3)
  - [x] 4.1 Définir l'interface Props TypeScript : `animation`, `delay`, `duration`
  - [x] 4.2 Créer le markup HTML avec `<div data-reveal>` + `<slot />`
  - [x] 4.3 Implémenter le script client avec import depuis `../lib/gsap`
  - [x] 4.4 Configurer ScrollTrigger avec `start: 'top 80%'` et `once: true`
  - [x] 4.5 Implémenter les 3 types d'animation : fade-up, fade-in, stagger
  - [x] 4.6 Utiliser `gsap.matchMedia()` pour `prefers-reduced-motion`
  - [x] 4.7 Ajouter le cleanup des ScrollTriggers
- [x] Task 5 : Implémenter le micro-script IntersectionObserver fallback (AC: #5)
  - [x] 5.1 Ajouter un script inline dans BaseLayout pour le fallback `[data-reveal]`
  - [x] 5.2 Ajouter la classe `.revealed` quand l'élément entre dans le viewport
  - [x] 5.3 S'assurer qu'il n'y a pas de conflit quand GSAP charge ensuite
- [x] Task 6 : Écrire les tests (AC: #1, #2, #3, #4, #5, #6)
  - [x] 6.1 Tests pour `gsap.ts` : exports, registerPlugin
  - [x] 6.2 Tests pour `SectionReveal.astro` : props, attribut data-reveal, structure HTML
  - [x] 6.3 Tests pour le CSS : règle `[data-reveal]`, `prefers-reduced-motion`
  - [x] 6.4 Tests pour l'enforcement : aucun import direct `from 'gsap'` hors `gsap.ts`
  - [x] 6.5 Tests build-output : vérifier que les pages avec SectionReveal buildent correctement
- [x] Task 7 : Validation finale
  - [x] 7.1 `npm run lint` — 0 erreurs
  - [x] 7.2 `npm run test` — 177 tests passent (0 régressions, +40 nouveaux)
  - [x] 7.3 `npm run build` — build réussi
  - [ ] 7.4 Vérifier visuellement les animations en dev server

## Dev Notes

### Contexte développeur — CRITIQUE

**Cette story est la FONDATION de toutes les animations du site.** Chaque story suivante (2-2 à 2-5) dépend de SectionReveal pour ses animations. Un bug ici casse toutes les futures stories.

### Contraintes architecturales obligatoires

1. **Import GSAP UNIQUEMENT depuis `src/lib/gsap.ts`** — jamais directement depuis `'gsap'`. Raison : Astro déduplique le bundle au build uniquement si tous les imports ont le même chemin. Import direct = double bundle (~48kb au lieu de ~24kb).

2. **`client:visible`** pour SectionReveal — PAS `client:load`. Le composant ne doit se hydrater que quand il entre dans le viewport. Cela économise du JS sur le chargement initial.

3. **`gsap.matchMedia()`** est la méthode RECOMMANDÉE par GSAP pour gérer `prefers-reduced-motion` (plutôt que `window.matchMedia` manuel). Elle révoque automatiquement les animations quand la media query change.

4. **Progressive enhancement obligatoire** : le contenu DOIT être visible sans JS grâce au fallback CSS + IntersectionObserver. GSAP est une amélioration, pas un prérequis.

5. **`once: true`** sur ScrollTrigger — les animations ne se jouent qu'une fois. Pas de replay au re-scroll.

### Pattern GSAP avec gsap.matchMedia() — à utiliser

```typescript
// Pattern recommandé GSAP 3.14+ (meilleur que window.matchMedia manuel)
import { gsap, ScrollTrigger } from '../lib/gsap';

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  // Ces animations sont automatiquement révoquées si la media query change
  gsap.from(element, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      once: true,
    },
  });
});
// Si prefers-reduced-motion: reduce → rien ne s'exécute, contenu visible via CSS
```

### Spécifications d'animation par type

| Type | Comportement | Durée | Usage futur |
|------|-------------|-------|-------------|
| `fade-up` (défaut) | opacity 0→1 + translateY 20px→0 | 300-600ms | Sections principales, blocs contenu |
| `fade-in` | opacity 0→1 uniquement | 300-600ms | Photos, éléments secondaires |
| `stagger` | Éléments multiples, espacement 150ms | 300ms/élément | ProcessStep, PricingRow, listes |

### Tokens CSS GSAP (déjà dans global.css)

Les custom properties suivantes sont DÉJÀ définies dans `web/src/styles/global.css` :

```css
:root {
  --gsap-duration-default: 300ms;
  --gsap-duration-slow: 600ms;
  --gsap-ease-default: ease-out;
  --gsap-ease-slow: ease-in-out;
}
```

Utiliser ces tokens dans le composant pour la cohérence. Convertir ms→secondes pour GSAP (`300ms` → `0.3`).

### Composant SectionReveal — Structure attendue

```astro
---
interface Props {
  animation?: 'fade-up' | 'fade-in' | 'stagger';
  delay?: number;
  duration?: number;
}

const { animation = 'fade-up', delay = 0, duration = 600 } = Astro.props;
---

<div
  data-reveal
  data-animation={animation}
  data-delay={delay}
  data-duration={duration}
>
  <slot />
</div>

<script>
  import { gsap, ScrollTrigger } from '../lib/gsap';

  // Sélectionner tous les éléments [data-reveal] dans cette instance
  const elements = document.querySelectorAll('[data-reveal]');

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    elements.forEach((el) => {
      const animation = el.getAttribute('data-animation') ?? 'fade-up';
      const delay = Number(el.getAttribute('data-delay') ?? 0) / 1000;
      const duration = Number(el.getAttribute('data-duration') ?? 600) / 1000;

      if (animation === 'stagger') {
        gsap.from(el.children, {
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration,
          delay,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        });
      } else {
        gsap.from(el, {
          opacity: 0,
          y: animation === 'fade-up' ? 20 : 0,
          duration,
          delay,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        });
      }
    });

    // Cleanup quand matchMedia révoque
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  });
</script>
```

### Micro-script IntersectionObserver (fallback)

À ajouter dans `BaseLayout.astro` (inline, ~20 lignes) :

```html
<script is:inline>
  // Fallback CSS pour [data-reveal] quand GSAP n'est pas encore chargé
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
  } else {
    // Navigateur sans IntersectionObserver → tout visible
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed'));
  }
</script>
```

### Project Structure Notes

```
web/src/
├── lib/
│   └── gsap.ts                  ← NOUVEAU — point d'entrée GSAP unifié
├── components/
│   ├── Footer.astro             (existant)
│   └── SectionReveal.astro      ← NOUVEAU — island client:visible
├── layouts/
│   └── BaseLayout.astro         ← MODIFIÉ — ajout micro-script IO fallback
├── styles/
│   └── global.css               ← MODIFIÉ — ajout règles [data-reveal]
web/tests/
├── lib/
│   └── gsap.test.ts             ← NOUVEAU
├── components/
│   └── SectionReveal.test.ts    ← NOUVEAU
├── styles/
│   └── global.css.test.ts       ← MODIFIÉ — ajout tests [data-reveal]
└── build-output.test.ts         ← MODIFIÉ — ajout tests build
```

### Dépendances à installer

| Package | Version | Type | Raison |
|---------|---------|------|--------|
| `gsap` | `^3.14` | dependency | Animations GSAP + ScrollTrigger |

### Budget performance JS

| Composant | Brut | Gzippé | Directive |
|-----------|------|--------|-----------|
| GSAP + ScrollTrigger | ~24kb | ~8kb | Partagé |
| SectionReveal.astro | ~0kb (dédupliqué) | ~0kb | `client:visible` |
| IO fallback (inline) | ~0.5kb | ~0.2kb | `is:inline` |

Budget total JS du projet : ~20kb gzippé. GSAP en consomme ~8kb → reste ~12kb pour le reste.

### Anti-patterns à ÉVITER

| Anti-pattern | Problème | Conséquence |
|---|---|---|
| `import { gsap } from 'gsap'` dans un composant | Bypass déduplication Astro | Double bundle ~48kb |
| `client:load` sur SectionReveal | Charge JS inutilement au premier octet | Performance dégradée |
| Oublier `once: true` sur ScrollTrigger | Animations rejouent au scroll up/down | UX confuse |
| Pas de cleanup ScrollTrigger | Memory leaks | Dégradation progressive |
| Hardcoder durées/easings | Incohérence avec tokens CSS | Maintenance difficile |
| Ignorer `prefers-reduced-motion` | Violation WCAG 2.1 | Accessibilité cassée |
| Animer des propriétés layout (width, height, margin) | Recalcul layout | Jank, CLS > 0.1 |

### Intelligence des stories précédentes (Epic 1)

**Patterns établis à respecter :**
- Tests dans `web/tests/` (PAS dans `src/`) — évite les conflits Astro/Vite au build
- Prettier lowercases les hex → assertions tests en minuscules
- `?? fallback` au lieu de `!` (ESLint `no-non-null-assertion`)
- Lancer `prettier --write` immédiatement après création de fichiers
- 137 tests existants — zéro régression attendue

**Conventions de commit :** Emoji prefix + description FR + body détaillé + `Co-Authored-By`

### Intelligence Git

**Derniers commits (patterns):**
- `90f2a82` Story 1-3: Pages légales, footer & conformité
- `0725214` OG image avec fond terracotta + meta tags Twitter
- `2320c8a` Story 1-2: Design tokens, BaseLayout & SEO

**Fichiers récents pertinents :**
- `web/src/styles/global.css` — tokens GSAP déjà définis
- `web/src/layouts/BaseLayout.astro` — à modifier pour le fallback IO
- `web/src/types/index.ts` — types partagés (ajouter SectionRevealProps si pertinent)

### Informations techniques actualisées

**GSAP 3.14.2** (dernière version stable, février 2025) :
- ScrollTrigger inclus dans le package principal npm `gsap`
- `gsap.matchMedia()` est le pattern recommandé pour responsive + accessibilité
- GSAP est désormais **gratuit pour tous** (acquisition Webflow 2024)
- Import : `import { gsap } from 'gsap'` + `import { ScrollTrigger } from 'gsap/ScrollTrigger'`
- Enregistrement obligatoire : `gsap.registerPlugin(ScrollTrigger)`

**Astro 5 `client:visible`** :
- Rend d'abord en HTML statique côté serveur
- Hydrate uniquement quand l'élément entre dans le viewport
- Utilise IntersectionObserver en interne
- Parfait pour les composants "below the fold"

### References

- [Source: docs/planning-artifacts/epics.md#Epic 2 — Story 2.1]
- [Source: docs/planning-artifacts/architecture.md#GSAP Point d'entrée unique]
- [Source: docs/planning-artifacts/architecture.md#Pattern GSAP prefers-reduced-motion]
- [Source: docs/planning-artifacts/architecture.md#Hydration Strategy]
- [Source: docs/planning-artifacts/ux-design-specification.md#Animations par section]
- [Source: docs/planning-artifacts/ux-design-specification.md#prefers-reduced-motion]
- [Source: docs/implementation-artifacts/1-3-pages-legales-footer-conformite.md#Dev Notes]
- [Source: GSAP docs — gsap.matchMedia()](https://gsap.com/docs/v3/GSAP/gsap.matchMedia())
- [Source: Astro docs — Islands architecture](https://docs.astro.build/en/concepts/islands/)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- ESLint `no-var` erreur dans le script inline BaseLayout.astro — corrigé `var` → `const`

### Completion Notes List

- GSAP 3.14.2 était déjà installé dans package.json (ajouté pendant la story 1-2 ou planning)
- Module GSAP unifié créé en `src/lib/gsap.ts` — point d'entrée unique pour tout le projet
- Composant `SectionReveal.astro` créé avec 3 types d'animation (fade-up, fade-in, stagger)
- `gsap.matchMedia()` utilisé pour `prefers-reduced-motion` (pattern recommandé GSAP 3.14+)
- Fallback IntersectionObserver ajouté dans BaseLayout en script `is:inline` pour progressive enhancement
- Règles CSS `[data-reveal]` ajoutées : état initial masqué, fallback `.revealed`, et override `prefers-reduced-motion: reduce`
- 40 nouveaux tests ajoutés (137 → 177 total) : module gsap, SectionReveal, CSS rules, enforcement, build-output, BaseLayout IO fallback
- Task 7.4 (vérification visuelle) laissée non cochée — nécessite validation manuelle par l'utilisateur
- Code review : coordination IO/GSAP ajoutée (évite flash d'opacité), cleanup ScrollTrigger scopé aux triggers `[data-reveal]`, noscript fallback pour progressive enhancement sans JS, assertions CSS tests renforcées
- Déviation connue AC #2 : `client:visible` impossible sur composant `.astro` (réservé aux composants framework React/Vue/Svelte). Le `<script>` Astro hoisted est l'idiome correct. ScrollTrigger assure la détection de visibilité pour les animations.

### Change Log

- 2026-02-10: Story 2-1 implémentée — module GSAP unifié, composant SectionReveal, fallback CSS/IO, 35 tests ajoutés
- 2026-02-10: Code review (8 findings: 2H, 4M, 2L) — tous corrigés. Coordination IO/GSAP, cleanup scopé, noscript fallback, epic-1→done, tests améliorés (+5)

### File List

**Nouveaux fichiers :**
- `web/src/lib/gsap.ts` — module GSAP unifié (import, register, export)
- `web/src/components/SectionReveal.astro` — composant island avec animations scroll
- `web/tests/lib/gsap.test.ts` — tests module GSAP (4 tests)
- `web/tests/lib/gsap-enforcement.test.ts` — test d'enforcement imports GSAP (1 test)
- `web/tests/components/SectionReveal.test.ts` — tests composant SectionReveal (21 tests)

**Fichiers modifiés :**
- `web/src/styles/global.css` — ajout règles `[data-reveal]`, `.revealed`, `prefers-reduced-motion`
- `web/src/layouts/BaseLayout.astro` — ajout script IO fallback + expose `__revealObserver` + noscript `[data-reveal]`
- `web/src/components/SectionReveal.astro` — coordination IO/GSAP + cleanup ScrollTrigger scopé
- `web/tests/styles/global.css.test.ts` — 3 tests `[data-reveal]` (assertions regex scopées au sélecteur)
- `web/tests/layouts/BaseLayout.test.ts` — 7 tests IO fallback + coordination GSAP + noscript
- `web/tests/components/SectionReveal.test.ts` — 3 tests coordination IO + cleanup scopé
- `web/tests/build-output.test.ts` — 1 test IO fallback dans build output
- `docs/implementation-artifacts/sprint-status.yaml` — story 2-1 → done, epic-1 → done
- `docs/implementation-artifacts/2-1-module-gsap-unifie-sectionreveal.md` — mise à jour tasks, status, dev record
- `README.md` — ajout section Assets et mise à jour structure monorepo
