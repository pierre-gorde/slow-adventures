# Story 5.1: CookieConsent & chargement conditionnel GA4

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want être informé de l'utilisation des cookies et pouvoir accepter ou refuser le tracking analytique,
So that ma vie privée soit respectée conformément au RGPD.

## Acceptance Criteria

1. **AC1 — Bannière de consentement au premier chargement**
   **Given** le visiteur arrive sur le site pour la première fois
   **When** la page se charge
   **Then** une bannière de consentement cookies apparaît (FR33)
   **And** le composant `CookieConsent.astro` est un island interactif avec `<script>` natif (pattern Astro 5 — pas de `client:load` sur `.astro`)
   **And** la bannière est légère (~2kb JS), sans dépendance tierce
   **And** le texte explique l'utilisation de cookies analytiques (GA4) avec un lien vers `/politique-confidentialite`
   **And** deux boutons sont présents : "Accepter" et "Refuser"

2. **AC2 — Acceptation du consentement + chargement GA4**
   **Given** le visiteur clique sur "Accepter"
   **When** le consentement est enregistré
   **Then** le choix `{ analytics: true }` est stocké dans localStorage sous la clé `sa_consent`
   **And** un événement `sa:consent-accepted` (CustomEvent avec `detail: { analytics: true }`) est dispatché sur `document`
   **And** la bannière disparaît en fade-out
   **And** le script GA4 (`gtag.js`) est chargé dynamiquement avec le `PUBLIC_GA4_MEASUREMENT_ID`
   **And** `gtag('consent', 'update', { analytics_storage: 'granted' })` est appelé après chargement

3. **AC3 — Refus du consentement**
   **Given** le visiteur clique sur "Refuser"
   **When** le refus est enregistré
   **Then** le choix `{ analytics: false }` est stocké dans localStorage sous la clé `sa_consent`
   **And** la bannière disparaît en fade-out
   **And** GA4 n'est PAS chargé — le site fonctionne normalement sans tracking (NFR15)
   **And** aucune donnée personnelle n'est collectée (NFR11)

4. **AC4 — Visiteur de retour avec consentement existant**
   **Given** le visiteur revient sur le site
   **When** un choix de consentement existe déjà dans localStorage (`sa_consent`)
   **Then** la bannière ne réapparaît pas
   **And** le comportement GA4 suit le choix précédent (chargé si accepté, ignoré si refusé)

5. **AC5 — Privacy by default (sans JS)**
   **Given** JavaScript est désactivé
   **When** la page se charge
   **Then** la bannière ne s'affiche pas et GA4 ne charge pas (privacy by default) (NFR16)

6. **AC6 — Tests**
   **Given** le composant CookieConsent
   **When** on exécute les tests
   **Then** `web/tests/components/CookieConsent.test.ts` couvre : affichage bannière, acceptation, refus, persistance localStorage, dispatch CustomEvent, chargement conditionnel GA4, accessibilité, prefers-reduced-motion (NFR20)

## Tasks / Subtasks

- [x] Task 1 — Créer le composant CookieConsent.astro (AC: #1, #2, #3, #4, #5)
  - [x] 1.1 Créer `web/src/components/CookieConsent.astro` avec markup HTML accessible
  - [x] 1.2 Implémenter le markup : bannière fixe en bas de page, texte explicatif avec lien `/politique-confidentialite`, boutons "Accepter" et "Refuser"
  - [x] 1.3 Implémenter la logique localStorage dans `<script>` natif : lecture/écriture de `sa_consent` (objet JSON `{ analytics: boolean }`)
  - [x] 1.4 Implémenter le dispatch de CustomEvent `sa:consent-accepted` avec `detail: { analytics: true }` sur acceptation
  - [x] 1.5 Implémenter le chargement dynamique de GA4 : créer `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}">` + initialisation `gtag()` avec consent mode
  - [x] 1.6 Implémenter la bannière masquée par défaut (privacy by default) — visible uniquement si pas de choix localStorage existant
  - [x] 1.7 Implémenter fade-in CSS à l'apparition et fade-out à la disparition
  - [x] 1.8 Respecter `prefers-reduced-motion` (pas d'animation si activé)
  - [x] 1.9 Accessibilité : `role="dialog"`, `aria-label`, boutons avec texte explicite, focus management (focus sur le premier bouton à l'apparition)

- [x] Task 2 — Intégrer dans BaseLayout.astro (AC: #1, #4)
  - [x] 2.1 Importer `CookieConsent` dans `web/src/layouts/BaseLayout.astro`
  - [x] 2.2 Placer le composant juste avant `</body>` (dernier élément du DOM)
  - [x] 2.3 Passer le `PUBLIC_GA4_MEASUREMENT_ID` comme data attribute si nécessaire

- [x] Task 3 — Tests (AC: #6)
  - [x] 3.1 Créer `web/tests/components/CookieConsent.test.ts`
  - [x] 3.2 Test : structure HTML — `role="dialog"`, `aria-label`, boutons "Accepter" et "Refuser"
  - [x] 3.3 Test : bannière masquée par défaut (hidden ou display:none)
  - [x] 3.4 Test : script contient `localStorage.getItem('sa_consent')` (lecture consentement)
  - [x] 3.5 Test : script contient `localStorage.setItem('sa_consent'` (écriture consentement)
  - [x] 3.6 Test : script contient `sa:consent-accepted` (dispatch CustomEvent)
  - [x] 3.7 Test : script contient `googletagmanager.com/gtag/js` (chargement dynamique GA4)
  - [x] 3.8 Test : script contient `PUBLIC_GA4_MEASUREMENT_ID` ou `import.meta.env` (variable d'environnement)
  - [x] 3.9 Test : script contient `prefers-reduced-motion` (accessibilité animations)
  - [x] 3.10 Test : lien vers `/politique-confidentialite` présent dans le HTML
  - [x] 3.11 Test : script contient `consent` et `analytics_storage` (Google Consent Mode)
  - [x] 3.12 Vérifier que les tests de la story passent (`npx vitest run tests/components/CookieConsent.test.ts`)

- [x] Task 4 — Validation finale (AC: all)
  - [x] 4.1 `npm run build` dans `web/` — build réussi
  - [x] 4.2 `npm run lint` — 0 erreurs sur fichiers de cette story
  - [x] 4.3 Vérification : la bannière s'affiche au premier chargement, disparaît après clic, ne réapparaît pas au rechargement

## Dev Notes

### Architecture & Patterns obligatoires

- **Type de composant :** Island Astro avec `<script>` natif (pas de `client:load` directive — Astro 5 ne supporte pas l'hydration sur `.astro`, pattern confirmé par Stories 4-1, 4-3)
- **Pattern identique à :** `ReturnVisitorBanner.astro`, `EmailCapture.astro`, `StickyMobileCTA.astro` — fichier `.astro` avec `<script>` tag inline
- **Communication inter-islands :** Dispatch `sa:consent-accepted` CustomEvent — le module `analytics.ts` (Story 5-2) l'écoutera pour initialiser le tracking
- **Import GSAP :** NON requis — ce composant utilise des transitions CSS pures
- **Placement :** Dans `BaseLayout.astro` (pas `index.astro`) car le consentement s'applique à TOUTES les pages (mentions légales, politique confidentialité incluses)
- **Progressive enhancement :** Bannière masquée par défaut (privacy by default). Sans JS, aucun tracking, aucune bannière = conforme RGPD

### Détails techniques d'implémentation

**localStorage (cross-session) :**
| Clé | Type | Description |
|-----|------|-------------|
| `sa_consent` | `string` (JSON parsé) | Objet `{ analytics: boolean }` — extensible pour futurs types de cookies |

**Format de stockage :**

```typescript
// Acceptation
localStorage.setItem("sa_consent", JSON.stringify({ analytics: true }));

// Refus
localStorage.setItem("sa_consent", JSON.stringify({ analytics: false }));

// Lecture
const consent = JSON.parse(localStorage.getItem("sa_consent") ?? "null");
```

**Pourquoi un objet JSON ?** Extensibilité future (marketing cookies, etc.) sans changer de clé localStorage. Pattern recommandé pour la gestion de consentement granulaire.

**Flow logique du script :**

1. Page charge → lire `localStorage.getItem('sa_consent')`
2. Si `null` (aucun choix) : afficher la bannière (fade-in CSS)
3. Si choix existe et `analytics: true` → charger GA4 silencieusement, ne pas afficher la bannière
4. Si choix existe et `analytics: false` → ne rien faire, ne pas afficher la bannière
5. Clic "Accepter" → `localStorage.setItem`, dispatch `sa:consent-accepted`, charger GA4, masquer bannière (fade-out)
6. Clic "Refuser" → `localStorage.setItem`, masquer bannière (fade-out)

**Chargement dynamique GA4 (gtag.js) :**

```typescript
function loadGA4(measurementId: string): void {
  // 1. Injecter le script gtag.js
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // 2. Initialiser gtag avec consent mode
  window.dataLayer = window.dataLayer ?? [];
  function gtag(...args: unknown[]): void {
    window.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("config", measurementId);
}
```

**Note technique — Google Consent Mode v2 :**
Depuis mars 2024, Google requiert Consent Mode v2 pour GA4 dans l'UE. Notre approche (Basic Mode) :

- On ne charge GA4 qu'après consentement (pas de pings anonymes)
- `analytics_storage` est mis à `'denied'` par défaut puis `'granted'` après acceptation
- Les paramètres `ad_storage`, `ad_user_data`, `ad_personalization` restent `'denied'` (pas de Google Ads au MVP)
- Cette approche est la plus simple et la plus privacy-friendly — suffisante pour un MVP sans Google Ads

**Variable d'environnement :**

- `PUBLIC_GA4_MEASUREMENT_ID` — déjà défini dans `.env` (`G-PLACEHOLDER`) et typé dans `env.d.ts`
- Accès dans le `<script>` Astro : Le Measurement ID doit être passé via un `data-*` attribute depuis le frontmatter car `import.meta.env` n'est pas disponible dans les `<script>` tag côté client en Astro 5

```astro
---
const ga4Id = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID;
---
<div id="cookie-consent" data-ga4-id={ga4Id} hidden>
  <!-- ... -->
</div>

<script>
  const container = document.getElementById('cookie-consent');
  const ga4Id = container?.dataset.ga4Id ?? '';
  // ...
</script>
```

**IMPORTANT — Correction du pattern `import.meta.env` :**
En Astro 5, `import.meta.env.PUBLIC_*` est disponible dans les `<script>` tags inline car ils sont traités par Vite au build time. Cependant, le pattern `data-*` attribute est plus explicite et évite toute confusion. Les deux approches fonctionnent — utiliser celle qui est la plus lisible.

**CustomEvent dispatché :**

```typescript
document.dispatchEvent(
  new CustomEvent("sa:consent-accepted", {
    detail: { analytics: true },
  }),
);
```

Ce CustomEvent sera écouté par `analytics.ts` (Story 5-2) pour initialiser le module de tracking. En attendant la Story 5-2, le dispatch est déjà en place et prêt.

**Styling :**

- Position : `fixed bottom-0 left-0 right-0` (bannière en bas de page)
- Z-index : `z-50` (au-dessus de tout, y compris StickyMobileCTA)
- Fond : `bg-warm-black/95` (fond sombre semi-transparent pour contraste)
- Texte : `text-creme` (lisible sur fond sombre)
- Font : `font-sans` (Plus Jakarta Sans)
- Padding : `px-6 py-4 md:px-12 md:py-6`
- Layout : flex responsive — texte à gauche, boutons à droite (desktop), empilés (mobile)
- Bouton "Accepter" : `bg-terracotta text-white` (CTA principal, style identique à CTAButton)
- Bouton "Refuser" : `text-creme/70 underline` (lien discret, pas un bouton proéminent)
- Taille boutons : minimum 44x44px (touch targets, accessibilité)
- Texte : `text-sm` — concis, tutoiement, lien `/politique-confidentialite`
- Max-width container : `max-w-6xl mx-auto` pour centrer sur grands écrans

**Animations CSS (pas GSAP) :**

```css
/* Fade-in à l'apparition */
.sa-consent-enter {
  opacity: 0;
  transform: translateY(100%);
  transition:
    opacity 400ms ease-out,
    transform 400ms ease-out;
}
.sa-consent-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Fade-out à la disparition */
.sa-consent-exit {
  opacity: 0;
  transform: translateY(100%);
  transition:
    opacity 300ms ease-out,
    transform 300ms ease-out;
}
```

- Respecter `prefers-reduced-motion: reduce` → si activé, afficher/masquer sans animation (transition directe)

**Accessibilité :**

- `role="dialog"` sur le conteneur
- `aria-label="Bannière de consentement cookies"` sur le conteneur
- `aria-describedby` pointant vers le texte explicatif
- Focus automatique sur le premier bouton ("Accepter") à l'apparition
- Les boutons ont un texte explicite (pas d'icônes seules)
- Contrastes : terracotta sur warm-black = ratio > 4.5:1 (validé), creme sur warm-black = ratio > 4.5:1
- Le texte du lien politique confidentialité a `text-decoration: underline` pour être identifiable

**Budget JS estimé :** ~1.5kb minifié (~0.6kb gzippé) — aucune dépendance externe

**CSP Headers — Déjà configurés :**
Le `netlify.toml` autorise déjà `https://www.googletagmanager.com` dans `script-src` et `https://www.google-analytics.com` dans `connect-src`. Aucune modification nécessaire.

### Placement dans BaseLayout.astro

```astro
---
import CookieConsent from '../components/CookieConsent.astro';
---
<html>
  <head>...</head>
  <body>
    <slot />
    <CookieConsent />
  </body>
</html>
```

**Note :** Le composant est placé dans `BaseLayout.astro` (pas `index.astro`) car il doit apparaître sur TOUTES les pages du site, y compris les pages légales.

### Testing patterns

**Fichier :** `web/tests/components/CookieConsent.test.ts`

**Pattern établi (Stories 4-1, 4-3) :** Tests basés sur `readFileSync` + string matching pour les fichiers `.astro` :

```typescript
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const component = readFileSync(
  resolve(__dirname, "../../src/components/CookieConsent.astro"),
  "utf-8",
);
```

**Cas de test requis :**

1. Structure HTML : `role="dialog"`, `aria-label` présents
2. Boutons : texte "Accepter" et "Refuser" présents dans le HTML
3. Lien : `/politique-confidentialite` présent dans le HTML
4. Script contient `localStorage.getItem('sa_consent')` (lecture consentement)
5. Script contient `localStorage.setItem('sa_consent'` (écriture consentement)
6. Script contient `sa:consent-accepted` (dispatch CustomEvent)
7. Script contient `googletagmanager.com/gtag/js` (URL script GA4)
8. Script contient `analytics_storage` (Google Consent Mode v2)
9. Script contient `prefers-reduced-motion` (accessibilité)
10. Bannière masquée par défaut (`hidden` attribute dans le HTML)
11. Script contient `dataLayer` (initialisation gtag)
12. Variable GA4 : contient `data-ga4-id` ou `PUBLIC_GA4_MEASUREMENT_ID`

### Interaction avec la Story 5-2

La Story 5-1 prépare le terrain pour la 5-2 :

- **5-1 crée :** Le composant CookieConsent + le mécanisme de chargement conditionnel GA4
- **5-2 créera :** Le module `analytics.ts` avec les fonctions de tracking (`trackCTAClick()`, etc.)
- **Pont entre les deux :** Le CustomEvent `sa:consent-accepted` dispatché par CookieConsent sera écouté par `analytics.ts`
- **En 5-1 :** Le chargement GA4 se fait dans CookieConsent (script injection + `gtag('config', ...)`)
- **En 5-2 :** Le module `analytics.ts` prendra en charge l'écoute du consentement et centralisera les appels `gtag()`. Le code de chargement GA4 de CookieConsent pourra être refactorisé pour déléguer à `analytics.ts`

### Learnings des Stories précédentes

- **Story 4-1 (EmailCapture) :** Astro 5 ne supporte PAS `client:visible`/`client:load` sur `.astro` — utiliser `<script>` natif. Tests `.astro` : `readFileSync` + string matching
- **Story 4-3 (ReturnVisitorBanner) :** localStorage pattern (lecture/écriture), IntersectionObserver, CSS transitions (fade-in/out), `prefers-reduced-motion`, `void element.offsetHeight` pour force reflow
- **Pattern commun :** Tutoiement dans les messages, espaces insécables avant `!`, `?`, `:`, logging avec `[slow-adventures]`
- **Tests dans `web/tests/`** (PAS dans `src/`) — Astro/Vite traite les `.test.ts` dans `src/` différemment
- **Lint/Build :** 4 erreurs lint pré-existantes (ElenaSection, ScrollProgress) + 18 échecs de tests pré-existants — ne PAS essayer de les corriger dans cette story

### Git intelligence (derniers commits pertinents)

- `6c35a3e` ReturnVisitorBanner: banner → toast flottant glass effect
- `801f928` Brevo: list ID 5, cleanup doublon, clé API dans CI + ReturnVisitorBanner + sprint-status à jour
- `086f84e` ScrollProgress: dots → barre gradient en haut de page
- Commit pattern : emoji + description concise en français

### Project Structure Notes

- **Alignement :** Structure plate `src/components/` — 1 fichier `.astro` par composant, conforme à l'architecture
- **Placement layout :** Le CookieConsent va dans `BaseLayout.astro` (toutes les pages) et non pas dans `index.astro` (page d'accueil uniquement)
- **Pas de nouveau fichier `src/lib/` pour cette story** — le chargement GA4 est inline dans le `<script>` du composant. Le module `analytics.ts` sera créé en Story 5-2
- **Pas de modification de `src/types/index.ts`** — `AnalyticsEvent` interface existe déjà mais sera utilisée en Story 5-2
- **Pas de modification de `netlify.toml`** — les CSP headers autorisent déjà `googletagmanager.com` et `google-analytics.com`
- **Pas de modification de `.env` ou `env.d.ts`** — `PUBLIC_GA4_MEASUREMENT_ID` est déjà défini et typé

### References

- [Source: docs/planning-artifacts/epics.md#Story 5.1] — User story, acceptance criteria, BDD
- [Source: docs/planning-artifacts/architecture.md#Sécurité & Conformité RGPD] — CookieConsent island, ~2kb JS, localStorage
- [Source: docs/planning-artifacts/architecture.md#Patterns d'Intégration Tierces] — GA4 conditionnel, script chargé après consentement
- [Source: docs/planning-artifacts/architecture.md#Code Patterns] — CustomEvents sa:\*, script inline, progressive enhancement
- [Source: docs/planning-artifacts/architecture.md#Frontend Architecture] — Hydration strategy: CookieConsent = client:load
- [Source: docs/planning-artifacts/architecture.md#Implementation Patterns] — Naming, structure, Tailwind tokens obligatoires
- [Source: docs/planning-artifacts/prd.md#FR33] — Bannière consentement cookies avec chargement conditionnel GA4
- [Source: docs/planning-artifacts/prd.md#NFR11] — Aucune donnée personnelle sans consentement
- [Source: docs/planning-artifacts/prd.md#NFR15] — Site fonctionne normalement sans GA4
- [Source: docs/planning-artifacts/prd.md#NFR16] — Site accessible sans JavaScript
- [Source: docs/implementation-artifacts/4-3-returnvisitorbanner-detection-visiteur-retour.md] — Pattern localStorage, CSS transitions, tests readFileSync
- [Source: docs/implementation-artifacts/4-1-emailcapture-integration-brevo.md] — Pattern .astro avec script natif
- [Source: web] — Google Consent Mode v2 (Basic Mode) — gtag consent API, analytics_storage parameter

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Test fix: regex `/client:load/` matched comment text — changed to `/client:load\s*[=>{]/` to only match actual directives

### Completion Notes List

- Composant `CookieConsent.astro` créé avec pattern `.astro` + `<script>` natif (identique à ReturnVisitorBanner, EmailCapture)
- Bannière `hidden` par défaut (privacy by default, conforme RGPD) — affichée en fade-in CSS uniquement si pas de choix localStorage
- localStorage `sa_consent` stocke un objet JSON `{ analytics: boolean }` extensible
- Chargement dynamique GA4 via injection `<script>` + Google Consent Mode v2 (Basic Mode) — `analytics_storage: 'denied'` par défaut, `'granted'` après acceptation
- CustomEvent `sa:consent-accepted` dispatché pour pont avec Story 5-2 (`analytics.ts`)
- `data-ga4-id` attribute pour passer le Measurement ID du frontmatter au script client
- Accessibilité : `role="dialog"`, `aria-label`, `aria-describedby`, focus management, `prefers-reduced-motion`, touch targets 44px
- Intégré dans `BaseLayout.astro` (toutes les pages) après `<Footer />`
- 25 tests passent (readFileSync + string matching)
- Build réussi, 0 erreur lint sur fichiers de cette story (4 erreurs pré-existantes ElenaSection/ScrollProgress)
- 18 échecs de tests pré-existants — aucune régression introduite

### File List

- `web/src/components/CookieConsent.astro` (new) — Composant bannière consentement cookies + chargement conditionnel GA4
- `web/src/layouts/BaseLayout.astro` (modified) — Import et placement de CookieConsent
- `web/tests/components/CookieConsent.test.ts` (new) — 25 tests couvrant HTML, localStorage, CustomEvent, GA4, Consent Mode, accessibilité
- `docs/implementation-artifacts/sprint-status.yaml` (modified) — Status 5-1: ready-for-dev → in-progress → review
- `docs/implementation-artifacts/5-1-cookieconsent-chargement-conditionnel-ga4.md` (modified) — Tasks marquées [x], status → review

### Change Log

- 2026-02-28: Implémentation complète de la Story 5-1 — CookieConsent & chargement conditionnel GA4
- 2026-02-28: Code review — 7 issues corrigés (4 MEDIUM, 3 LOW) : garde ID vide, idempotence GA4, recovery localStorage corrompu, sync prefers-reduced-motion, aria-modal, commentaire reflow, 5 tests ajoutés (30 total)
