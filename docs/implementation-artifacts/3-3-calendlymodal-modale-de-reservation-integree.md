# Story 3.3: CalendlyModal — modale de réservation intégrée

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want réserver une discovery call dans une modale sans quitter le site et pouvoir fermer la modale pour revenir exactement où j'étais,
So that le processus de réservation soit fluide et sans friction.

## Acceptance Criteria

### AC1 — Ouverture de la modale au clic sur CTAButton

1. **Given** le visiteur clique sur n'importe quel CTAButton avec `data-calendly-trigger` **When** JavaScript est activé **Then** la modale CalendlyModal s'ouvre en slide-up (400ms ease-out) (FR12) **And** le fond du site est recouvert d'un overlay dark `rgba(44, 40, 37, 0.7)` + `backdrop-filter: blur` **And** une iframe Calendly est chargée dans la modale avec l'URL `PUBLIC_CALENDLY_URL` **And** un bouton fermer (X) est positionné en haut à droite, couleur `warm-gray` **And** le scroll du body est verrouillé pendant l'ouverture de la modale

### AC2 — Choix de créneau dans l'iframe

2. **Given** la modale est ouverte **When** le visiteur choisit un créneau dans l'iframe Calendly **Then** Calendly affiche sa propre confirmation dans l'iframe (FR13) **And** la modale reste ouverte — le visiteur ferme quand il veut

### AC3 — Fermeture de la modale (3 méthodes)

3. **Given** la modale est ouverte **When** le visiteur clique sur le bouton fermer (X) OU appuie sur Escape OU clique sur l'overlay **Then** la modale se ferme en fade-out (300ms) (FR14) **And** le scroll du body est restauré **And** la position de scroll est préservée — le visiteur revient exactement où il était **And** le focus est restauré sur l'élément qui a ouvert la modale

### AC4 — Focus trap & accessibilité

4. **Given** la modale est ouverte **When** le visiteur navigue au clavier **Then** le focus est piégé dans la modale (focus trap) — Tab et Shift+Tab ne sortent pas de la modale **And** `aria-modal="true"` et `role="dialog"` sont appliqués **And** un `aria-label` descriptif est présent sur la modale

### AC5 — Full-screen mobile + masquage StickyMobileCTA

5. **Given** le visiteur est sur mobile **When** la modale est ouverte **Then** la modale est full-screen (pas de margin) **And** le StickyMobileCTA est masqué (via CustomEvent `sa:modal-open`)

### AC6 — Fallback sans JavaScript

6. **Given** JavaScript est désactivé **When** le visiteur clique sur un CTAButton **Then** le lien `<a href>` redirige vers calendly.com normalement — l'utilisateur peut booker (FR15) **And** le site ne génère aucune erreur visible

### AC7 — Gestion d'erreur Calendly indisponible

7. **Given** Calendly est indisponible (réseau) **When** l'iframe ne charge pas après un timeout **Then** un message "Le service est temporairement indisponible" est affiché dans la modale (NFR13) **And** un lien de fallback vers calendly.com est proposé **And** l'erreur est loggée avec `console.error('[slow-adventures]', ...)`

### AC8 — Tests composant

8. **Given** le composant CalendlyModal **When** on exécute les tests **Then** `web/tests/components/calendly-modal.test.ts` couvre : ouverture/fermeture, scroll lock, focus trap, accessibilité, CustomEvents (NFR20)

## Tasks / Subtasks

- [x]Task 1: Créer le composant `CalendlyModal.astro` — markup HTML (AC: #1, #4, #5)
  - [x]1.1 Créer `web/src/components/CalendlyModal.astro` — composant `.astro` avec `<script>` (PAS de `client:load` — non supporté sur composants `.astro` en Astro 5)
  - [x]1.2 Overlay : `<div>` fixed plein écran avec `bg-warm-black/70 backdrop-blur-sm`, `z-[60]` (au-dessus du StickyMobileCTA z-50)
  - [x]1.3 Container modale : `role="dialog"`, `aria-modal="true"`, `aria-label="Réserver une discovery call"`, centré vertical/horizontal
  - [x]1.4 Bouton fermer : `<button>` avec SVG `X`, couleur `warm-gray`, `aria-label="Fermer"`, taille minimum 44x44px
  - [x]1.5 Zone iframe : `<iframe>` avec `src` vide (chargé dynamiquement par JS), `title="Calendly - Réserver une discovery call"`, `min-width: 320px`, `height: 700px` desktop / `100dvh` mobile
  - [x]1.6 Message d'erreur : `<div>` masqué par défaut avec message "Le service est temporairement indisponible" + lien fallback vers `PUBLIC_CALENDLY_URL`
  - [x]1.7 État initial : tout masqué (`hidden`) — le `<script>` gère l'affichage
  - [x]1.8 Responsive : desktop = modale centrée max-w-2xl, rounded-soft, shadow ; mobile = full-screen (inset-0, no rounded)

- [x]Task 2: Logique client-side — ouverture/fermeture (AC: #1, #2, #3, #5)
  - [x]2.1 Intercepter les clics sur tous les `[data-calendly-trigger]` via `document.querySelectorAll` + `addEventListener('click', ...)`
  - [x]2.2 `preventDefault()` sur le clic, stocker `document.activeElement` comme `triggerElement`
  - [x]2.3 Afficher la modale : retirer `hidden`, charger l'iframe `src` = `import.meta.env.PUBLIC_CALENDLY_URL`, appliquer animation slide-up (CSS `transform: translateY(100%) → translateY(0)` en 400ms ease-out)
  - [x]2.4 Scroll lock : `document.body.style.overflow = 'hidden'` ; stocker `scrollY` position
  - [x]2.5 Dispatcher `sa:modal-open` CustomEvent (StickyMobileCTA écoute déjà)
  - [x]2.6 Fermeture : clic overlay (vérifier `e.target === overlay`), clic bouton X, touche Escape (`keydown` event)
  - [x]2.7 Animation fermeture : fade-out 300ms, puis `hidden` et réinitialiser iframe `src` à `''` (nettoyer la session Calendly)
  - [x]2.8 Restaurer scroll : `document.body.style.overflow = ''` puis `window.scrollTo(0, savedScrollY)`
  - [x]2.9 Restaurer focus : `triggerElement?.focus()`
  - [x]2.10 Dispatcher `sa:modal-close` CustomEvent
  - [x]2.11 Respecter `prefers-reduced-motion` : si actif, animations instantanées (pas de slide-up/fade-out)

- [x]Task 3: Focus trap (AC: #4)
  - [x]3.1 Collecter tous les éléments focusables dans la modale : `button, [href], iframe, [tabindex]:not([tabindex="-1"])`
  - [x]3.2 Sur `keydown Tab` : si dernier élément focusé → boucler vers le premier ; si `Shift+Tab` sur premier → boucler vers le dernier
  - [x]3.3 Au focus trap : mettre le focus sur le bouton fermer (premier élément interactif)

- [x]Task 4: Gestion d'erreur — timeout iframe (AC: #7)
  - [x]4.1 Au chargement de l'iframe, démarrer un timer de 10 secondes
  - [x]4.2 Écouter `iframe.onload` pour annuler le timer (iframe chargée avec succès)
  - [x]4.3 Si timeout atteint : masquer l'iframe, afficher le message d'erreur avec lien fallback
  - [x]4.4 Logger : `console.error('[slow-adventures]', 'Calendly iframe load timeout')`

- [x]Task 5: Intégrer CalendlyModal dans `index.astro` (AC: #1)
  - [x]5.1 Importer `CalendlyModal` dans `web/src/pages/index.astro`
  - [x]5.2 Placer `<CalendlyModal />` après `</main>` et avant `<StickyMobileCTA />` dans le flux du document
  - [x]5.3 Vérifier que l'ordre est : `</main>` → `<CalendlyModal />` → `<StickyMobileCTA />` → `</BaseLayout>`

- [x]Task 6: Tests (AC: #8)
  - [x]6.1 Créer `web/tests/components/calendly-modal.test.ts` — tests source-level sur le composant `.astro`
  - [x]6.2 Test : présence de `role="dialog"` et `aria-modal="true"`
  - [x]6.3 Test : présence de `aria-label` sur la modale
  - [x]6.4 Test : présence de `<iframe` avec `title` attribut
  - [x]6.5 Test : présence de `PUBLIC_CALENDLY_URL` dans le code (pour l'iframe src)
  - [x]6.6 Test : présence de `sa:modal-open` et `sa:modal-close` CustomEvents dans le script
  - [x]6.7 Test : présence de gestion Escape (`keydown` + `Escape`)
  - [x]6.8 Test : présence de scroll lock (`overflow`)
  - [x]6.9 Test : présence de focus trap logic (`focusable` elements, `Tab`, `shiftKey`)
  - [x]6.10 Test : présence du bouton fermer avec `aria-label` (ex: "Fermer")
  - [x]6.11 Test : présence de `z-[60]` ou z-index supérieur à 50
  - [x]6.12 Test : présence du message d'erreur timeout (NFR13)
  - [x]6.13 Test : présence de `console.error` avec préfixe `[slow-adventures]`
  - [x]6.14 Test : présence de `backdrop-blur` ou `backdrop-filter` sur l'overlay
  - [x]6.15 Test d'intégration dans `index.test.ts` : CalendlyModal importé et placé dans la page
  - [x]6.16 Test : présence de `prefers-reduced-motion` check dans le script

- [x]Task 7: Validation finale (AC: all)
  - [x]7.1 `npm run lint` — 0 erreurs ESLint et Prettier
  - [x]7.2 `npm run test` — tous les tests passent (0 regressions sur les 564+ existants)
  - [x]7.3 `npm run build` — build réussi (0 warnings non-attendus)
  - [x]7.4 Vérification : modale s'ouvre au clic CTA, se ferme via X/Escape/overlay, scroll lock fonctionne

## Dev Notes

### CRITIQUE : Astro 5 — PAS de `client:load` sur composants `.astro`

**Leçon apprise de Story 3-2 :** Astro 5 ne supporte PAS les directives d'hydratation (`client:load`, `client:visible`, etc.) sur les composants `.astro`. Ces directives ne fonctionnent que sur les composants de frameworks (React, Svelte, Vue).

Pour les composants `.astro` interactifs, le `<script>` tag natif est automatiquement bundlé et exécuté par Astro. C'est le pattern utilisé par `StickyMobileCTA.astro` (Story 3-2) et `SectionReveal.astro` (Story 2-1).

**Implication :** Le composant `CalendlyModal.astro` est un composant `.astro` standard avec un `<script>` tag. Pas de `client:load`. Le script s'exécute automatiquement au chargement de la page.

### IMPORTANT : Ce qui est DÉJÀ fait vs ce qui est NOUVEAU

**DÉJÀ IMPLÉMENTÉ (NE PAS RECRÉER) :**
- `CTAButton.astro` — composant statique avec `data-calendly-trigger` et `href={PUBLIC_CALENDLY_URL}` (stories 2-3, 3-1)
- `StickyMobileCTA.astro` — écoute DÉJÀ `sa:modal-open` / `sa:modal-close` pour se masquer/afficher (story 3-2)
- Section CTA finale `id="cta-final"` avec CTAButton solid (story 3-1)
- Variable `PUBLIC_CALENDLY_URL` dans `.env` et `.env.example` (story 3-1)
- Design tokens dans `global.css` — warm-black, creme, terracotta, warm-gray (story 1-2)
- Focus-visible global et `motion-safe:` transitions (story 2-6)
- CSP dans `netlify.toml` : `frame-src https://calendly.com` — DÉJÀ configuré pour l'iframe

**NOUVEAU À IMPLÉMENTER :**
- `CalendlyModal.astro` — nouveau composant (le fichier n'existe pas encore)
- Import et placement dans `index.astro`
- Tests pour le nouveau composant

### Architecture du composant CalendlyModal

**Type :** Composant `.astro` avec `<script>` tag (interactivité client-side native Astro 5).

**Pourquoi PAS une iframe directe :** La modale doit intercepter les clics sur des éléments `[data-calendly-trigger]` dispersés dans tout le DOM. Le `<script>` tag gère cette logique de manière centralisée.

**Approche iframe directe (PAS Calendly widget.js) :**
- Pas de dépendance externe (`https://assets.calendly.com/assets/external/widget.js`)
- Pas de modification CSP (`script-src` n'a pas besoin d'ajouter `assets.calendly.com`)
- `frame-src https://calendly.com` est DÉJÀ dans le CSP `netlify.toml`
- Suffisant pour le scope MVP (Epic 5 ajoutera le tracking `calendly_complete` via postMessage si nécessaire)
- Plus résilient : si Calendly change son widget.js, notre modale n'est pas impactée

### Structure HTML recommandée

```astro
---
// CalendlyModal.astro — Composant .astro avec <script> natif
const calendlyUrl = import.meta.env.PUBLIC_CALENDLY_URL;
---

<!-- Overlay + modale — masqué par défaut -->
<div
  id="calendly-overlay"
  class="fixed inset-0 z-[60] hidden"
  aria-hidden="true"
>
  <!-- Overlay fond -->
  <div
    class="absolute inset-0 bg-warm-black/70 backdrop-blur-sm"
    data-overlay-bg
  ></div>

  <!-- Container modale -->
  <div
    id="calendly-modal"
    role="dialog"
    aria-modal="true"
    aria-label="Réserver une discovery call"
    class="relative z-10 flex flex-col
           /* Mobile: full-screen */
           inset-0 absolute
           /* Desktop: centré avec max-width */
           lg:inset-auto lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
           lg:w-full lg:max-w-2xl lg:h-[85vh] lg:rounded-soft lg:shadow-xl
           bg-white overflow-hidden"
  >
    <!-- Header avec bouton fermer -->
    <div class="flex items-center justify-end p-3 lg:p-4">
      <button
        id="calendly-close"
        type="button"
        aria-label="Fermer"
        class="flex items-center justify-center w-11 h-11 text-warm-gray rounded-full
               motion-safe:transition-colors motion-safe:duration-200 hover:bg-creme-dark"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Iframe Calendly -->
    <iframe
      id="calendly-iframe"
      title="Calendly - Réserver une discovery call"
      class="flex-1 w-full border-0"
      style="min-width: 320px;"
      loading="lazy"
      allow="payment"
    ></iframe>

    <!-- Message d'erreur (masqué par défaut) -->
    <div
      id="calendly-error"
      class="hidden flex-1 flex flex-col items-center justify-center p-8 text-center"
    >
      <p class="text-warm-black font-sans text-lg mb-4">
        Le service est temporairement indisponible.
      </p>
      <a
        href={calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="text-terracotta font-sans font-medium underline underline-offset-4
               motion-safe:transition-colors motion-safe:duration-200 hover:text-terracotta-dark"
      >
        Réserver directement sur Calendly
      </a>
    </div>
  </div>
</div>

<script>
  // ... logique client-side (voir Tasks 2-4)
</script>
```

### Logique JavaScript — pseudo-code

```typescript
// === Éléments DOM ===
const overlay = document.getElementById('calendly-overlay');
const modal = document.getElementById('calendly-modal');
const iframe = document.getElementById('calendly-iframe') as HTMLIFrameElement | null;
const closeBtn = document.getElementById('calendly-close');
const errorDiv = document.getElementById('calendly-error');
const overlayBg = overlay?.querySelector('[data-overlay-bg]');

// === État ===
let triggerElement: HTMLElement | null = null;
let savedScrollY = 0;
let loadTimeout: ReturnType<typeof setTimeout> | null = null;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CALENDLY_URL = '...'; // Injecté depuis le frontmatter ou data attribute

// === Ouverture ===
function openModal(trigger: HTMLElement) {
  triggerElement = trigger;
  savedScrollY = window.scrollY;

  // Charger l'iframe
  if (iframe) iframe.src = CALENDLY_URL;

  // Afficher l'overlay
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden', 'false');

  // Scroll lock
  document.body.style.overflow = 'hidden';

  // Animation slide-up (si motion OK)
  if (!prefersReducedMotion) {
    modal.style.transform = 'translateY(100%)';
    requestAnimationFrame(() => {
      modal.style.transition = 'transform 400ms ease-out';
      modal.style.transform = 'translateY(0)';
    });
  }

  // Focus sur bouton fermer
  closeBtn?.focus();

  // Timeout iframe
  loadTimeout = setTimeout(() => {
    if (iframe) iframe.classList.add('hidden');
    errorDiv?.classList.remove('hidden');
    console.error('[slow-adventures]', 'Calendly iframe load timeout');
  }, 10_000);

  // Écouter iframe.onload
  if (iframe) {
    iframe.onload = () => {
      if (loadTimeout) clearTimeout(loadTimeout);
    };
  }

  // Dispatcher CustomEvent
  document.dispatchEvent(new CustomEvent('sa:modal-open'));
}

// === Fermeture ===
function closeModal() {
  // Animation fade-out
  // ...

  // Nettoyer iframe
  if (iframe) iframe.src = '';
  if (loadTimeout) clearTimeout(loadTimeout);

  // Masquer
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden', 'true');
  errorDiv?.classList.add('hidden');
  if (iframe) iframe.classList.remove('hidden');

  // Restaurer scroll
  document.body.style.overflow = '';
  window.scrollTo(0, savedScrollY);

  // Restaurer focus
  triggerElement?.focus();
  triggerElement = null;

  // Dispatcher CustomEvent
  document.dispatchEvent(new CustomEvent('sa:modal-close'));
}

// === Focus trap ===
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key !== 'Tab') return;

  const focusables = modal.querySelectorAll<HTMLElement>(
    'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last?.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first?.focus();
  }
}

// === Interception clics ===
document.querySelectorAll<HTMLElement>('[data-calendly-trigger]').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(trigger);
  });
});

// === Event listeners ===
closeBtn?.addEventListener('click', closeModal);
overlayBg?.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (overlay && !overlay.classList.contains('hidden')) {
    handleKeydown(e);
  }
});
```

### Stacking context — z-index

| Composant | z-index | Raison |
|-----------|---------|--------|
| CalendlyModal overlay | `z-[60]` | Au-dessus de tout, y compris StickyMobileCTA |
| StickyMobileCTA | `z-50` | Barre fixe en bas de l'écran |
| SectionReveal | z-auto | Pas de z-index spécifique |

### Communication inter-islands — CustomEvents DÉJÀ en place

Le StickyMobileCTA écoute DÉJÀ ces événements (implémenté story 3-2) :

```javascript
// StickyMobileCTA.astro — DÉJÀ IMPLÉMENTÉ
document.addEventListener('sa:modal-open', () => {
  modalOpen = true;
  updateVisibility();
});
document.addEventListener('sa:modal-close', () => {
  modalOpen = false;
  updateVisibility();
});
```

CalendlyModal DOIT dispatcher :
- `sa:modal-open` à l'ouverture
- `sa:modal-close` à la fermeture

### Responsive design

| Breakpoint | Comportement modale |
|-----------|---------------------|
| Mobile (< lg) | Full-screen (`inset-0`), pas de rounded corners, pas de shadow |
| Desktop (>= lg) | Centré, `max-w-2xl`, `h-[85vh]`, `rounded-soft`, shadow |

### iframe Calendly — Détails techniques

- **src** : `PUBLIC_CALENDLY_URL` (ex: `https://calendly.com/slow-adventures/discovery-call`)
- **Chargé dynamiquement** : le `src` est vide dans le HTML initial, rempli par JS à l'ouverture (évite le chargement anticipé)
- **Nettoyé à la fermeture** : `iframe.src = ''` (libère la session Calendly, réinitialise pour la prochaine ouverture)
- **CSP** : `frame-src https://calendly.com` DÉJÀ dans `netlify.toml` — aucune modification nécessaire
- **Timeout** : 10 secondes avant d'afficher le message d'erreur
- **`title`** : Obligatoire pour l'accessibilité — "Calendly - Réserver une discovery call"
- **`allow="payment"`** : Pour permettre les paiements intégrés si Calendly les utilise
- **`loading="lazy"`** : Pas vraiment utile ici (chargé dynamiquement), mais bon signal

### Calendly URL — Paramètres optionnels

L'URL Calendly peut être enrichie de query params :
- `?hide_gdpr_banner=1` — masque la bannière RGPD Calendly (on gère le consentement nous-mêmes)
- `?hide_event_type_details=1` — masque les détails du type d'événement
- `?background_color=fff9f3` — fond crème pour intégration visuelle

Le dev agent peut ajouter ces params à `iframe.src` au moment du chargement sans modifier `.env`.

### Scroll lock — Implémentation robuste

```typescript
// Ouverture
savedScrollY = window.scrollY;
document.body.style.overflow = 'hidden';
// Optionnel: empêcher le "jump" sur iOS
document.body.style.position = 'fixed';
document.body.style.top = `-${savedScrollY}px`;
document.body.style.width = '100%';

// Fermeture
document.body.style.overflow = '';
document.body.style.position = '';
document.body.style.top = '';
document.body.style.width = '';
window.scrollTo(0, savedScrollY);
```

**Note iOS :** Sur Safari iOS, `overflow: hidden` seul ne suffit pas toujours pour bloquer le scroll. Le pattern `position: fixed` + `top: -scrollY` est plus fiable. À tester et ajuster si nécessaire.

### Patterns établis — À RESPECTER

- **Tests** : dans `web/tests/` JAMAIS dans `src/` — Astro/Vite traite les `.test.ts` dans `src/` au build causant des erreurs vitest
- **Tests pattern** : `readFileSync` + string matching / regex (pas de rendu DOM)
- **Prettier** : lowercases hex — tester avec `#c0603e` pas `#C0603E`
- **ESLint** : `?? fallback` au lieu de `!` (no-non-null-assertion)
- **GSAP** : PAS nécessaire pour CalendlyModal — utiliser CSS transitions + `requestAnimationFrame`
- **Tailwind v4** : tokens dans `@theme` de `global.css`, pas de `tailwind.config.mjs`
- **Accessibilité** : `role="dialog"`, `aria-modal="true"`, `aria-label`, focus trap, touch targets 44px
- **Focus-visible** : géré globalement dans `global.css` (pas de classes inline)
- **Logging** : `console.error('[slow-adventures]', ...)` pour les erreurs
- **Progressive enhancement** : le `<a href>` des CTAButton fonctionne sans JS (FR15)
- **CustomEvents** : préfixe `sa:` — `sa:modal-open`, `sa:modal-close`
- **prefers-reduced-motion** : vérifier et désactiver les animations si actif
- **Nommage** : PascalCase pour le composant, camelCase pour les variables/fonctions

### Pièges à éviter

| Piège | Solution |
|-------|----------|
| Utiliser `client:load` sur `.astro` | NON — utiliser `<script>` tag natif (leçon story 3-2) |
| Charger `widget.js` de Calendly | NON — iframe directe suffit, évite dépendance externe + CSP |
| Importer GSAP pour les animations modale | NON — CSS transitions + rAF suffisent |
| Oublier de vider `iframe.src` à la fermeture | La session Calendly reste active, consomme des ressources |
| `overflow: hidden` seul pour scroll lock iOS | Utiliser `position: fixed` + `top: -scrollY` |
| Focus trap sans `<iframe>` dans les focusables | L'iframe doit être incluse dans la liste des éléments focusables |
| Oublier de dispatcher `sa:modal-close` | StickyMobileCTA reste masqué indéfiniment |
| z-index inférieur à 50 | La modale serait derrière le StickyMobileCTA |
| Tester avec `readFileSync` dans `src/` | Tests DOIVENT être dans `web/tests/` |

### Budget JS estimé

~3-4kb minifié. Le composant utilise uniquement :
- `document.querySelectorAll` + `addEventListener` (API native, 0kb)
- `requestAnimationFrame` (API native, 0kb)
- `setTimeout` / `clearTimeout` (API native, 0kb)
- `CustomEvent` (API native, 0kb)
- CSS transitions pour animations (0kb JS)
- Aucune dépendance npm additionnelle
- Pas de GSAP, pas de widget.js Calendly

### Ordre des sections dans index.astro (après modification)

```
<BaseLayout ...>
  <header>
    <HeroSection ... />
  </header>
  <main id="main">
    <ElenaSection id="elena" ... />
    <section id="destinations" ... />
    <section id="processus" ... />
    <section id="temoignages" ... />
    <section id="tarifs" ... />
    <section id="cta-final" ... />
  </main>
  <CalendlyModal />          ← NOUVEAU
  <StickyMobileCTA />
</BaseLayout>
```

### Project Structure Notes

- **Nouveau fichier** : `web/src/components/CalendlyModal.astro`
- **Nouveau fichier test** : `web/tests/components/calendly-modal.test.ts`
- **Fichier modifié** : `web/src/pages/index.astro` (import + placement CalendlyModal)
- **Fichier modifié** : `web/tests/pages/index.test.ts` (test import CalendlyModal)
- Aucune dépendance npm ajoutée
- Aucune modification de `global.css` nécessaire
- Aucune modification de `netlify.toml` (CSP `frame-src https://calendly.com` déjà en place)

### References

- [Source: docs/planning-artifacts/epics.md#Story 3.3] — AC complètes, FR12-FR15, NFR13, NFR20
- [Source: docs/planning-artifacts/prd.md#FR12-FR15] — Modale Calendly intégrée, choix créneau, fermeture, fallback sans JS
- [Source: docs/planning-artifacts/prd.md#NFR13] — Fallback si Calendly indisponible
- [Source: docs/planning-artifacts/prd.md#NFR20] — Tests composants interactifs (CalendlyModal)
- [Source: docs/planning-artifacts/architecture.md#Patterns d'Intégration Tierces] — Iframe Calendly, timeout, message erreur
- [Source: docs/planning-artifacts/architecture.md#Hydration Strategy] — CalendlyModal: client:load (corrigé: script natif Astro)
- [Source: docs/planning-artifacts/architecture.md#Communication inter-islands] — CustomEvents `sa:modal-open`, `sa:modal-close`
- [Source: docs/planning-artifacts/architecture.md#Progressive Enhancement] — Lien direct `<a href>` fallback Calendly
- [Source: docs/planning-artifacts/architecture.md#Sécurité CSP] — `frame-src https://calendly.com`
- [Source: docs/planning-artifacts/architecture.md#Testing] — CalendlyModal: DOM tests ouverture/fermeture, scroll lock, priorité moyenne
- [Source: docs/planning-artifacts/architecture.md#Anti-Patterns] — Pas d'import GSAP direct, pas de querySelector sans null check
- [Source: docs/implementation-artifacts/3-1-ctabutton-section-cta-final.md] — CTAButton `data-calendly-trigger`, `PUBLIC_CALENDLY_URL` câblé
- [Source: docs/implementation-artifacts/3-2-stickymobilecta.md] — StickyMobileCTA écoute `sa:modal-open` / `sa:modal-close`, leçon `client:load` non supporté sur `.astro`

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Unicode encoding issue: Write tool encoded `é` as literal `\u00e9` in .astro file. Fixed with Python string replacement before running tests.

### Completion Notes List

- Created CalendlyModal.astro with full modal markup, slide-up/fade-out animations, scroll lock (iOS-safe pattern), focus trap, iframe timeout error handling, and CustomEvent coordination with StickyMobileCTA
- Integrated CalendlyModal in index.astro between `</main>` and `<StickyMobileCTA />`
- 46 new component tests + 5 new integration tests in index.test.ts
- All 615 tests pass, 0 regressions, lint clean, build successful
- No new npm dependencies added
- No CSP or netlify.toml changes needed (frame-src already configured)

### Change Log

- 2026-02-14: Story 3.3 implemented — CalendlyModal modale de réservation Calendly intégrée
- 2026-02-14: Code review — 4 MEDIUM + 2 LOW fixes applied (iframe about:blank, re-entrancy guards, role="alert", focus timing, removed loading="lazy")

### File List

- web/src/components/CalendlyModal.astro (new)
- web/src/pages/index.astro (modified — import + placement CalendlyModal)
- web/tests/components/calendly-modal.test.ts (new)
- web/tests/pages/index.test.ts (modified — CalendlyModal integration tests)
- docs/implementation-artifacts/sprint-status.yaml (modified — status update)
- docs/implementation-artifacts/3-3-calendlymodal-modale-de-reservation-integree.md (modified — task completion + dev record)
