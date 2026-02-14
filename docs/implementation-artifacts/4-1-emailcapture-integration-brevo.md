# Story 4.1: EmailCapture & intégration Brevo

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want m'inscrire à la newsletter avec un seul champ email et recevoir un email de bienvenue,
So that je reste connecté à l'aventure Slow Adventures même si je ne suis pas prêt à réserver maintenant.

## Acceptance Criteria

### AC1 — Section Email Capture visible après le CTA final

1. **Given** le visiteur scrolle après la section CTA final **When** la section Email Capture entre dans le viewport **Then** une section sur fond dark photo overlay est affichée avec un titre positif (ex: "Reste connecté(e) à l'aventure"), un champ email, un bouton submit "Je reste connecté(e)" et un texte RGPD court (FR16) **And** la formulation est positive — pas de "pas encore prêt(e)" ou formulation négative **And** le tutoiement est utilisé **And** un CTAButton (section CTA) est visible juste au-dessus de la section email capture (double objectif) **And** le composant `EmailCapture.astro` est un composant `.astro` avec `<script>` tag (PAS de `client:visible` sur un `.astro`)

### AC2 — Accessibilité du formulaire

2. **Given** le formulaire est affiché **When** on inspecte l'accessibilité **Then** un `<label>` avec `sr-only` ("Ton adresse email") est associé au champ email **And** le placeholder est "ton@email.com" **And** le texte RGPD dit : "En t'inscrivant, tu recevras nos inspirations voyage. Désabonnement en un clic." **And** le bouton submit a un touch target minimum 44x44px **And** le formulaire utilise un `<form>` standard (Enter fonctionne nativement)

### AC3 — Validation email côté client

3. **Given** le visiteur entre un email invalide et soumet **When** la validation côté client s'exécute **Then** une bordure `terracotta` apparaît sur le champ et un message "Hmm, cette adresse ne semble pas valide" s'affiche sous le champ **And** le message d'erreur a `aria-live="polite"` **And** la validation utilise une regex basique (pas de blocage .fr/.com obligatoire)

### AC4 — Soumission réussie vers Brevo

4. **Given** le visiteur entre un email valide et soumet **When** la requête est envoyée à l'API Brevo **Then** le bouton submit est remplacé par un spinner (SVG animé, terracotta) pendant le chargement **And** `web/src/lib/brevo.ts` envoie un `fetch()` POST vers `https://api.brevo.com/v3/contacts` avec la clé publique `PUBLIC_BREVO_API_KEY` dans le header `api-key`

### AC5 — Message de succès

5. **Given** l'API Brevo répond avec succès (201) **When** l'inscription est confirmée **Then** le champ et le bouton sont remplacés par un message de succès en `sauge` : "Bienvenue dans l'aventure ! Regarde ta boîte mail." (permanent, pas de reset) **And** le visiteur reçoit un email de bienvenue automatique configuré dans Brevo (FR17)

### AC6 — Gestion d'erreur Brevo

6. **Given** l'API Brevo échoue (erreur réseau ou serveur) **When** la requête échoue **Then** un message d'erreur inline s'affiche : "Oups, quelque chose n'a pas marché. Réessaie ?" (tutoiement) (NFR14) **And** l'erreur est loggée : `console.error('[slow-adventures]', error)` **And** le visiteur peut réessayer

### AC7 — Tests composant et utilitaire

7. **Given** le composant EmailCapture et le module brevo.ts **When** on exécute les tests **Then** `web/tests/components/email-capture.test.ts` couvre : validation email, états loading/success/error, accessibilité (NFR20) **And** `web/tests/lib/brevo.test.ts` couvre : appel API mock fetch, gestion erreur, header api-key

### AC8 — Animation d'entrée

8. **Given** la section Email Capture entre dans le viewport **When** le visiteur scrolle **Then** l'input et le texte apparaissent en fade-in (via SectionReveal, ~0.5 viewport) **And** l'animation est douce, pas insistante

## Tasks / Subtasks

- [x] Task 1: Créer le module `brevo.ts` — client API Brevo (AC: #4, #5, #6)
  - [x] 1.1 Créer `web/src/lib/brevo.ts` avec une fonction `subscribeToNewsletter(email: string): Promise<BrevoResult>`
  - [x] 1.2 Endpoint : `POST https://api.brevo.com/v3/contacts`
  - [x] 1.3 Headers : `{ 'api-key': import.meta.env.PUBLIC_BREVO_API_KEY, 'Content-Type': 'application/json' }`
  - [x] 1.4 Body : `{ email, listIds: [LIST_ID], updateEnabled: true }` — la `LIST_ID` sera une constante dans le module (configurable)
  - [x] 1.5 Retour typé : `{ success: true, id: number }` ou `{ success: false, error: string }`
  - [x] 1.6 Gestion d'erreur : `try/catch` avec logging `console.error('[slow-adventures]', error)`
  - [x] 1.7 Pas de retry automatique — l'utilisateur peut réessayer manuellement

- [x] Task 2: Ajouter les types dans `src/types/index.ts` (AC: #4, #7)
  - [x] 2.1 Ajouter `BrevoResult` type : `{ success: true; id: number } | { success: false; error: string }`

- [x] Task 3: Créer le composant `EmailCapture.astro` — markup HTML (AC: #1, #2, #8)
  - [x] 3.1 Créer `web/src/components/EmailCapture.astro` — composant `.astro` avec `<script>` tag (PAS de `client:visible` — non supporté sur composants `.astro` en Astro 5)
  - [x] 3.2 Section wrapper : `<section id="email-capture" aria-labelledby="heading-email-capture">` avec fond dark photo overlay (même pattern que section CTA final mais image différente)
  - [x] 3.3 Titre : `<h2 id="heading-email-capture">` avec texte positif : "Reste connecté(e) à l'aventure"
  - [x] 3.4 Formulaire : `<form id="email-form">` avec `<label class="sr-only" for="email-input">Ton adresse email</label>`, `<input id="email-input" type="email" placeholder="ton@email.com" required>`, bouton submit "Je reste connecté(e)"
  - [x] 3.5 Texte RGPD : `<p>` avec "En t'inscrivant, tu recevras nos inspirations voyage. Désabonnement en un clic."
  - [x] 3.6 Zone d'erreur : `<div id="email-error" role="alert" aria-live="polite" class="hidden">` pour les messages d'erreur
  - [x] 3.7 Zone de succès : `<div id="email-success" class="hidden">` avec message sauge "Bienvenue dans l'aventure ! Regarde ta boîte mail."
  - [x] 3.8 Spinner SVG : `<svg id="email-spinner" class="hidden animate-spin">` terracotta animé, remplace le bouton pendant le chargement
  - [x] 3.9 `data-reveal` attribut sur le contenu pour SectionReveal animation (fade-in)
  - [x] 3.10 Touch targets : bouton submit min 44x44px, espacement 8px entre input et bouton

- [x] Task 4: Logique client-side — soumission du formulaire (AC: #3, #4, #5, #6)
  - [x] 4.1 Écouter `submit` sur le `<form>` avec `preventDefault()`
  - [x] 4.2 Validation email côté client : regex basique `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` — pas de validation restrictive
  - [x] 4.3 Si email invalide : afficher bordure terracotta sur l'input + message "Hmm, cette adresse ne semble pas valide" dans la zone d'erreur
  - [x] 4.4 Si email valide : masquer le bouton submit, afficher le spinner SVG, désactiver l'input
  - [x] 4.5 Appeler `subscribeToNewsletter(email)` depuis `src/lib/brevo.ts`
  - [x] 4.6 Si succès : masquer le formulaire entier, afficher le message de succès en sauge (permanent)
  - [x] 4.7 Si erreur : masquer le spinner, réafficher le bouton, afficher le message d'erreur inline ("Oups, quelque chose n'a pas marché. Réessaie ?")
  - [x] 4.8 Le visiteur peut réessayer après une erreur

- [x] Task 5: Intégrer EmailCapture dans `index.astro` (AC: #1, #8)
  - [x] 5.1 Importer `EmailCapture` dans `web/src/pages/index.astro`
  - [x] 5.2 Placer la section Email Capture APRÈS la section CTA final (`id="cta-final"`) et AVANT `</main>`
  - [x] 5.3 Wraper dans un `<SectionReveal>` pour l'animation fade-in
  - [x] 5.4 Vérifier l'ordre final des sections dans `<main>` : Elena → Destinations → Processus → Témoignages → Tarifs → CTA Final → **Email Capture**

- [x] Task 6: Tests (AC: #7)
  - [x] 6.1 Créer `web/tests/lib/brevo.test.ts` — tests unitaires sur brevo.ts
  - [x] 6.2 Test : appel API avec bons headers (`api-key`, `Content-Type: application/json`)
  - [x] 6.3 Test : body contient `email` et `listIds`
  - [x] 6.4 Test : retourne `{ success: true, id }` en cas de succès (201)
  - [x] 6.5 Test : retourne `{ success: false, error }` en cas d'erreur réseau
  - [x] 6.6 Test : retourne `{ success: false, error }` en cas d'erreur serveur (400, 429)
  - [x] 6.7 Test : logging `console.error('[slow-adventures]', ...)` en cas d'erreur
  - [x] 6.8 Créer `web/tests/components/email-capture.test.ts` — tests source-level
  - [x] 6.9 Test : présence de `<form` dans le composant
  - [x] 6.10 Test : présence de `<label` avec `sr-only` et "Ton adresse email"
  - [x] 6.11 Test : présence de `type="email"` sur l'input
  - [x] 6.12 Test : présence de `placeholder="ton@email.com"`
  - [x] 6.13 Test : présence de `aria-live="polite"` ou `role="alert"` pour les messages d'erreur
  - [x] 6.14 Test : présence du texte RGPD ("inspirations voyage" et "Désabonnement")
  - [x] 6.15 Test : présence de `console.error` avec préfixe `[slow-adventures]`
  - [x] 6.16 Test : présence de `api.brevo.com` ou import de brevo.ts
  - [x] 6.17 Test : présence du message de succès "Bienvenue dans l'aventure"
  - [x] 6.18 Test : présence du message d'erreur "Oups"
  - [x] 6.19 Test d'intégration dans `index.test.ts` : EmailCapture importé et présent dans la page
  - [x] 6.20 Test : présence de `prefers-reduced-motion` OU composant statique sans animations JS directes (animations gérées par SectionReveal parent)

- [x] Task 7: Validation finale (AC: all)
  - [x] 7.1 `npm run lint` — 0 erreurs ESLint et Prettier
  - [x] 7.2 `npm run test` — tous les tests passent (0 regressions sur les 615+ existants)
  - [x] 7.3 `npm run build` — build réussi (0 warnings non-attendus)
  - [ ] 7.4 Vérification visuelle : section email capture visible après CTA final, formulaire fonctionnel

## Dev Notes

### CRITIQUE : Astro 5 — PAS de `client:visible` sur composants `.astro`

**Leçon confirmée de Story 3-2 et 3-3 :** Astro 5 ne supporte PAS les directives d'hydratation (`client:load`, `client:visible`, etc.) sur les composants `.astro`. Ces directives ne fonctionnent que sur les composants de frameworks (React, Svelte, Vue).

Pour les composants `.astro` interactifs, le `<script>` tag natif est automatiquement bundlé et exécuté par Astro. C'est le pattern utilisé par tous les composants interactifs existants : `StickyMobileCTA.astro`, `CalendlyModal.astro`, `SectionReveal.astro`, `HeroSection.astro`.

**Implication :** `EmailCapture.astro` est un composant `.astro` standard avec un `<script>` tag. Pas de `client:visible`. Le script s'exécute au chargement de la page.

### IMPORTANT : Ce qui est DÉJÀ fait vs ce qui est NOUVEAU

**DÉJÀ IMPLÉMENTÉ (NE PAS RECRÉER) :**
- `CTAButton.astro` — composant statique avec `data-calendly-trigger` et `href={PUBLIC_CALENDLY_URL}` (stories 2-3, 3-1)
- Section CTA finale `id="cta-final"` avec CTAButton solid (story 3-1)
- Variable `PUBLIC_BREVO_API_KEY` dans `.env.example` (story 1-1)
- CSP dans `netlify.toml` : `connect-src https://api.brevo.com` — DÉJÀ configuré pour les appels fetch vers Brevo
- Design tokens dans `global.css` — warm-black, creme, terracotta, sauge, warm-gray (story 1-2)
- Focus-visible global et `motion-safe:` transitions (story 2-6)
- `SectionReveal.astro` pour les animations de scroll (story 2-1)
- Type system dans `src/types/index.ts` (DestinationData, AnalyticsEvent, ProcessStepData, TestimonialData, PricingData)
- `src/lib/` existe avec `gsap.ts` (pattern de module utilitaire établi)

**NOUVEAU À IMPLÉMENTER :**
- `web/src/lib/brevo.ts` — client API Brevo (nouveau fichier)
- `web/src/components/EmailCapture.astro` — composant formulaire (nouveau fichier)
- Ajout type `BrevoResult` dans `web/src/types/index.ts`
- Import + placement EmailCapture dans `web/src/pages/index.astro`
- Tests pour brevo.ts et EmailCapture

### API Brevo — Spécifications techniques 2026

**Endpoint :** `POST https://api.brevo.com/v3/contacts`

**Headers requis :**
```
api-key: xkeysib-XXXXXXXX
Content-Type: application/json
```

**IMPORTANT :** Le header est `api-key` (PAS `Authorization` ni `Authorization: Bearer`).

**Body :**
```json
{
  "email": "user@example.com",
  "listIds": [4],
  "updateEnabled": true
}
```

- `listIds` : tableau d'IDs de listes Brevo (Elena doit créer la liste dans Brevo et fournir l'ID)
- `updateEnabled: true` : met à jour le contact s'il existe déjà (pas de doublon)

**Réponses :**
- **201 Created** : `{ "id": 123456 }` — succès
- **400 Bad Request** : email invalide, paramètres manquants
- **401 Unauthorized** : clé API invalide
- **429 Too Many Requests** : rate limit dépassé (10 req/s max)

**Sécurité côté client :** L'architecture (docs/planning-artifacts/architecture.md) documente l'utilisation d'une clé publique Brevo à permissions restreintes (inscription uniquement) côté client comme acceptable pour le MVP. C'est le pattern prévu — pas de backend au MVP.

### CORS — Note importante

Brevo recommande officiellement l'appel serveur-side. Cependant, notre architecture MVP n'a pas de backend. L'appel côté client avec une clé restreinte est le pattern documenté et accepté. Si CORS bloque les appels, une solution de contournement sera nécessaire (Netlify Function ou formulaire Netlify). **Tester en premier l'appel direct côté client.**

Si le `fetch()` côté client vers `https://api.brevo.com/v3/contacts` est bloqué par CORS :
1. **Option A (recommandée)** : Créer une Netlify Function (`netlify/functions/subscribe.ts`) comme proxy
2. **Option B** : Utiliser Netlify Forms avec webhook Zapier vers Brevo
3. **Option C** : Formulaire Brevo hébergé (embed iframe)

Le dev agent doit tester l'appel direct en premier, et basculer sur l'Option A si nécessaire. Si Option A est choisie, documenter la modification et mettre à jour le CSP.

### Structure HTML recommandée

```astro
---
// EmailCapture.astro — Composant .astro avec <script> natif
---

<section
  id="email-capture"
  aria-labelledby="heading-email-capture"
  class="relative min-h-[50vh] flex items-center justify-center overflow-hidden"
>
  <!-- Fond dark photo overlay -->
  <div class="absolute inset-0">
    <div class="absolute inset-0 bg-warm-black/75"></div>
  </div>

  <!-- Contenu -->
  <div class="relative z-10 sa-section-padding text-center max-w-xl mx-auto" data-reveal>
    <h2
      id="heading-email-capture"
      class="font-serif text-3xl md:text-4xl text-white mb-4"
    >
      Reste connecté(e) à l'aventure
    </h2>

    <!-- Formulaire -->
    <form id="email-form" class="mt-8">
      <label for="email-input" class="sr-only">Ton adresse email</label>
      <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-center">
        <input
          id="email-input"
          type="email"
          name="email"
          placeholder="ton@email.com"
          required
          autocomplete="email"
          class="w-full sm:w-auto sm:flex-1 max-w-sm px-4 py-3 rounded-round
                 text-warm-black font-sans placeholder:text-warm-gray/60
                 border-2 border-transparent
                 focus:outline-none focus:border-terracotta
                 motion-safe:transition-colors motion-safe:duration-200"
        />
        <button
          id="email-submit"
          type="submit"
          class="px-6 py-3 min-h-[44px] bg-terracotta text-white font-sans font-semibold
                 rounded-round motion-safe:transition-all motion-safe:duration-300
                 hover:shadow-[0_8px_32px_rgba(192,96,62,0.15)] hover:scale-[1.02]
                 active:bg-terracotta-dark"
        >
          Je reste connecté(e)
        </button>
        <!-- Spinner (masqué) -->
        <div id="email-spinner" class="hidden flex items-center justify-center px-6 py-3">
          <svg class="animate-spin h-6 w-6 text-terracotta" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div id="email-error" role="alert" aria-live="polite" class="hidden mt-3 text-terracotta font-sans text-sm">
      </div>
    </form>

    <!-- Message de succès (masqué) -->
    <div id="email-success" class="hidden mt-8">
      <p class="text-sauge font-sans text-lg font-medium">
        Bienvenue dans l'aventure ! Regarde ta boîte mail.
      </p>
    </div>

    <!-- Texte RGPD -->
    <p id="email-rgpd" class="mt-4 text-white/60 font-sans text-xs">
      En t'inscrivant, tu recevras nos inspirations voyage. Désabonnement en un clic.
    </p>
  </div>
</section>

<script>
  // Import de brevo.ts pour l'appel API
  import { subscribeToNewsletter } from '../lib/brevo';

  // ... logique formulaire (voir Tasks 4)
</script>
```

### Pattern brevo.ts recommandé

```typescript
// src/lib/brevo.ts

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/contacts';
const BREVO_LIST_ID = 2; // À configurer selon la liste Brevo d'Elena

interface BrevoSuccessResult {
  success: true;
  id: number;
}

interface BrevoErrorResult {
  success: false;
  error: string;
}

type BrevoResult = BrevoSuccessResult | BrevoErrorResult;

export async function subscribeToNewsletter(email: string): Promise<BrevoResult> {
  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': import.meta.env.PUBLIC_BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message ?? `Brevo API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error('[slow-adventures]', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
```

### Logique JavaScript EmailCapture — pseudo-code

```typescript
import { subscribeToNewsletter } from '../lib/brevo';

const form = document.getElementById('email-form') as HTMLFormElement | null;
const input = document.getElementById('email-input') as HTMLInputElement | null;
const submitBtn = document.getElementById('email-submit');
const spinner = document.getElementById('email-spinner');
const errorDiv = document.getElementById('email-error');
const successDiv = document.getElementById('email-success');
const rgpdText = document.getElementById('email-rgpd');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = input?.value.trim() ?? '';

  // Validation
  if (!EMAIL_REGEX.test(email)) {
    if (input) input.classList.add('border-terracotta');
    if (errorDiv) {
      errorDiv.textContent = 'Hmm, cette adresse ne semble pas valide';
      errorDiv.classList.remove('hidden');
    }
    return;
  }

  // Reset erreurs
  if (input) input.classList.remove('border-terracotta');
  if (errorDiv) errorDiv.classList.add('hidden');

  // Loading
  if (submitBtn) submitBtn.classList.add('hidden');
  if (spinner) spinner.classList.remove('hidden');
  if (input) input.disabled = true;

  // Appel API
  const result = await subscribeToNewsletter(email);

  if (result.success) {
    // Succès : masquer formulaire, afficher message
    if (form) form.classList.add('hidden');
    if (rgpdText) rgpdText.classList.add('hidden');
    if (successDiv) successDiv.classList.remove('hidden');
  } else {
    // Erreur : réafficher bouton, afficher message
    if (spinner) spinner.classList.add('hidden');
    if (submitBtn) submitBtn.classList.remove('hidden');
    if (input) input.disabled = false;
    if (errorDiv) {
      errorDiv.textContent = 'Oups, quelque chose n\'a pas marché. Réessaie ?';
      errorDiv.classList.remove('hidden');
    }
  }
});

// Clear erreur quand l'utilisateur tape
input?.addEventListener('input', () => {
  if (input) input.classList.remove('border-terracotta');
  if (errorDiv) errorDiv.classList.add('hidden');
});
```

### Stacking context et positionnement

| Composant | z-index | Position dans index.astro |
|-----------|---------|--------------------------|
| CalendlyModal overlay | `z-[60]` | Après `</main>`, avant StickyMobileCTA |
| StickyMobileCTA | `z-50` | Après CalendlyModal |
| EmailCapture | z-auto (dans le flux) | Dernière section de `<main>`, après CTA final |

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
    <EmailCapture />                 ← NOUVEAU
  </main>
  <CalendlyModal />
  <StickyMobileCTA />
</BaseLayout>
```

### Design visuel — Tokens à utiliser

| Élément | Token Tailwind | Valeur |
|---------|---------------|--------|
| Fond section | `bg-warm-black` + overlay | `#2c2825` |
| Titre h2 | `text-white font-serif` | Lora, blanc |
| Input fond | `bg-white` (implicite par défaut) | blanc |
| Input placeholder | `text-warm-gray/60` | `#6b5e52` 60% |
| Input focus | `border-terracotta` | `#c0603e` |
| Bouton submit | `bg-terracotta text-white` | `#c0603e`, blanc |
| Bouton hover shadow | `rgba(192,96,62,0.15)` | Shadow chaude |
| Bouton active | `bg-terracotta-dark` | `#a04e30` |
| Spinner | `text-terracotta` | `#c0603e` |
| Message erreur | `text-terracotta` | `#c0603e` |
| Message succès | `text-sauge` | `#7b8f6b` |
| Texte RGPD | `text-white/60` | blanc 60% |
| Border radius | `rounded-round` | 24px |

### Animation d'entrée

L'animation d'entrée est gérée par `SectionReveal` parent dans `index.astro`, pas par le composant EmailCapture lui-même. Le composant utilise `data-reveal` sur son contenu pour que SectionReveal puisse animer le fade-in.

### Fond photo overlay — Options d'image

Le composant a besoin d'une image de fond dark pour le overlay. Options :
1. **Réutiliser une image existante** de `src/assets/images/` avec un overlay opaque plus fort
2. **Utiliser un fond uni** `bg-warm-black` si aucune image appropriée n'est disponible (MVP acceptable)
3. **Ajouter une nouvelle image** dans `src/assets/images/` si Elena en fournit une

Pour le MVP, un fond `bg-warm-black` avec un gradient subtil est suffisant. L'image de fond peut être ajoutée plus tard.

### Patterns établis — À RESPECTER

- **Tests** : dans `web/tests/` JAMAIS dans `src/` — Astro/Vite traite les `.test.ts` dans `src/` au build causant des erreurs vitest
- **Tests pattern** : `readFileSync` + string matching / regex pour les composants `.astro` (pas de rendu DOM)
- **Tests brevo.ts** : peut utiliser des tests unitaires standard avec mock `fetch` (`vi.fn()`) car c'est du TS pur
- **Prettier** : lowercases hex — tester avec `#c0603e` pas `#C0603E`
- **ESLint** : `?? fallback` au lieu de `!` (no-non-null-assertion)
- **GSAP** : PAS nécessaire pour EmailCapture — animations gérées par SectionReveal parent
- **Tailwind v4** : tokens dans `@theme` de `global.css`, pas de `tailwind.config.mjs`
- **Accessibilité** : `<label>` sr-only, `aria-live="polite"`, `role="alert"`, touch targets 44px
- **Focus-visible** : géré globalement dans `global.css` (pas de classes inline)
- **Logging** : `console.error('[slow-adventures]', ...)` pour les erreurs
- **Nommage** : PascalCase pour le composant, camelCase pour les variables/fonctions
- **Import brevo.ts** : `import { subscribeToNewsletter } from '../lib/brevo'` dans le `<script>` tag

### Pièges à éviter

| Piège | Solution |
|-------|----------|
| Utiliser `client:visible` sur `.astro` | NON — utiliser `<script>` tag natif (leçon stories 3-2, 3-3) |
| Header `Authorization: Bearer` pour Brevo | NON — utiliser `api-key` en header |
| Regex email trop restrictive | NON — regex basique `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, pas de blocage .fr/.com |
| Oublier `updateEnabled: true` | Brevo retourne 400 si le contact existe déjà sans ce flag |
| Mettre les tests dans `src/` | NON — tests dans `web/tests/` uniquement |
| Importer GSAP pour les animations | NON — SectionReveal parent gère les animations |
| Oublier le texte RGPD | Obligatoire — "En t'inscrivant, tu recevras nos inspirations voyage." |
| `console.log` au lieu de `console.error` | NON — uniquement `console.error` avec préfixe `[slow-adventures]` |
| Formulation négative | NON — pas de "pas encore prêt(e)", toujours positif |
| Oublier l'attribut `autocomplete="email"` | Améliore l'UX mobile (suggestion d'email) |
| Unicode encoding dans le Write tool | Leçon story 3-3 — vérifier que les accents sont bien encodés |

### Budget JS estimé

~5kb minifié (estimation UX spec). Le composant utilise :
- `fetch` API native (0kb)
- Validation regex (0kb JS supplémentaire)
- Manipulation DOM basique (0kb)
- Import de `brevo.ts` (~2kb)
- Aucune dépendance npm additionnelle
- Pas de GSAP (animations par SectionReveal parent)

### Configuration Brevo requise (hors dev)

Elena doit configurer dans Brevo AVANT le test en production :
1. **Créer une liste de contacts** pour la newsletter (ex: "Newsletter Slow Adventures") et noter l'ID
2. **Configurer l'email de bienvenue automatique** (FR17) — déclenché à l'inscription
3. **Configurer la newsletter hebdomadaire** (FR18) — envoi chaque vendredi
4. **Générer une clé API** à permissions restreintes (inscription contacts uniquement)
5. **Mettre la clé dans les variables d'environnement Netlify** (`PUBLIC_BREVO_API_KEY`)

### Project Structure Notes

- **Nouveau fichier** : `web/src/lib/brevo.ts`
- **Nouveau fichier** : `web/src/components/EmailCapture.astro`
- **Nouveau fichier test** : `web/tests/lib/brevo.test.ts`
- **Nouveau fichier test** : `web/tests/components/email-capture.test.ts`
- **Fichier modifié** : `web/src/types/index.ts` (ajout BrevoResult)
- **Fichier modifié** : `web/src/pages/index.astro` (import + placement EmailCapture)
- **Fichier modifié** : `web/tests/pages/index.test.ts` (test import EmailCapture)
- Aucune dépendance npm ajoutée
- Aucune modification de `global.css` nécessaire
- Aucune modification de `netlify.toml` (CSP `connect-src https://api.brevo.com` déjà en place)

### References

- [Source: docs/planning-artifacts/epics.md#Story 4.1] — AC complètes, FR16-FR18, NFR14, NFR20
- [Source: docs/planning-artifacts/prd.md#FR16-FR18] — Formulaire email, email bienvenue, newsletter hebdo
- [Source: docs/planning-artifacts/prd.md#NFR12] — Aucune donnée perso sur Netlify, emails via API Brevo côté client
- [Source: docs/planning-artifacts/prd.md#NFR14] — Fallback si Brevo indisponible, message d'erreur clair
- [Source: docs/planning-artifacts/prd.md#NFR20] — Tests composants interactifs (EmailCapture, brevo.ts)
- [Source: docs/planning-artifacts/architecture.md#Patterns d'Intégration Tierces] — Brevo: fetch API, clé publique, try/catch
- [Source: docs/planning-artifacts/architecture.md#Variables d'Environnement] — PUBLIC_BREVO_API_KEY, clé publique restreinte
- [Source: docs/planning-artifacts/architecture.md#Sécurité CSP] — `connect-src https://api.brevo.com` déjà configuré
- [Source: docs/planning-artifacts/architecture.md#Testing] — EmailCapture: DOM tests validation/états, brevo.ts: unit tests mock fetch, priorité haute
- [Source: docs/planning-artifacts/architecture.md#Code Patterns] — Structure island, gestion d'erreurs tutoiement, préfixe `[slow-adventures]`
- [Source: docs/planning-artifacts/architecture.md#Anti-Patterns] — Pas d'import GSAP direct, pas de querySelector sans null check
- [Source: docs/planning-artifacts/ux-design-specification.md#EmailCapture.astro] — Island client:visible (corrigé: script natif), ~5kb, Brevo integration
- [Source: docs/planning-artifacts/ux-design-specification.md#Form Patterns] — Structure formulaire, règles validation, texte RGPD
- [Source: docs/planning-artifacts/ux-design-specification.md#Feedback Patterns] — États default/validation error/loading/success/error
- [Source: docs/planning-artifacts/ux-design-specification.md#Section Strategy] — Email Capture: Full Immersif, fond dark photo overlay, fade-in, ~0.5 viewport
- [Source: docs/planning-artifacts/ux-design-specification.md#Content Strategy] — Tutoiement, formulation positive, pas de formulation négative
- [Source: docs/implementation-artifacts/3-3-calendlymodal-modale-de-reservation-integree.md] — Pattern `.astro` + `<script>`, tests `readFileSync`, leçon Unicode Write tool
- [Source: Brevo API Documentation 2026] — POST /v3/contacts, header `api-key`, body `email`+`listIds`+`updateEnabled`, réponses 201/400/429

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Prettier reformate le .astro (attributs multi-lignes, texte RGPD wrappé) — tests adaptés pour matcher le contenu reformaté
- `import.meta.env.PUBLIC_BREVO_API_KEY` est `undefined` en environnement vitest — corrigé avec `vi.stubEnv('PUBLIC_BREVO_API_KEY', ...)` dans `beforeEach` pour tester la valeur du header

### Completion Notes List

- ✅ Module `brevo.ts` : client API Brevo avec `subscribeToNewsletter()`, endpoint POST /v3/contacts, header `api-key`, body avec `email`/`listIds`/`updateEnabled`, gestion d'erreur try/catch avec logging `[slow-adventures]`
- ✅ Type `BrevoResult` ajouté dans `src/types/index.ts` — union discriminée `success: true | false`
- ✅ Composant `EmailCapture.astro` : section dark bg, formulaire accessible (label sr-only, aria-live, role="alert", aria-describedby, touch targets 44px, novalidate), spinner SVG terracotta avec statut sr-only, messages succès/erreur, texte RGPD, tutoiement positif
- ✅ Logique client-side dans `<script>` tag natif (pas de `client:visible`) : validation regex, états loading/success/error, réessai possible après erreur
- ✅ Intégration dans `index.astro` : importé et placé après CTA final, wrappé dans `<SectionReveal animation="fade-in">`
- ✅ 19 tests brevo.ts (source analysis + behavioral avec mock fetch + vi.stubEnv), 41 tests email-capture.test.ts (structure, accessibilité, RGPD, spinner, validation, messages, novalidate, aria-describedby, email-status), 5 tests intégration index.test.ts
- ✅ 684 tests passent (0 régressions), lint 0 erreurs, build réussi
- ⏳ 7.4 Vérification visuelle à faire par Elena (nécessite `PUBLIC_BREVO_API_KEY` configurée dans Brevo)

### Change Log

- 2026-02-14: Story 4-1 implémentée — EmailCapture & intégration Brevo (formulaire newsletter, client API, tests complets)
- 2026-02-14: Code review fixes — novalidate form (M1), statut spinner accessible aria-live assertive (M2), doc BREVO_LIST_ID (M3), fix test trompeur console.error (M4), test valeur api-key avec vi.stubEnv (M5), aria-describedby input→error (L1), 3 tests ajoutés (684 total)

### File List

- `web/src/lib/brevo.ts` — NOUVEAU — Client API Brevo (subscribeToNewsletter)
- `web/src/components/EmailCapture.astro` — NOUVEAU — Composant formulaire newsletter
- `web/src/types/index.ts` — MODIFIÉ — Ajout type BrevoResult
- `web/src/pages/index.astro` — MODIFIÉ — Import + placement EmailCapture après CTA final
- `web/tests/lib/brevo.test.ts` — NOUVEAU — 19 tests unitaires brevo.ts
- `web/tests/components/email-capture.test.ts` — NOUVEAU — 38 tests composant EmailCapture
- `web/tests/pages/index.test.ts` — MODIFIÉ — 5 tests intégration EmailCapture ajoutés
