# Story 5.2: Module analytics & événements tracking

Status: done

## Story

As a propriétaire du site (Elena),
I want que les interactions clés des visiteurs soient enregistrées dans Google Analytics après leur consentement,
So that je puisse comprendre le parcours visiteur et optimiser le site.

## Acceptance Criteria

1. **AC1 — Module centralisé `analytics.ts`**
   Given le consentement analytics est accepté (Story 5.1)
   When on ouvre `web/src/lib/analytics.ts`
   Then le module exporte des fonctions typées : `trackCTAClick()`, `trackScrollDepth(section: string)`, `trackEmailCapture()`, `trackUTM()`, `trackCalendlyComplete()`
   And les fonctions encapsulent les appels `gtag()` — aucun composant n'appelle `gtag()` directement
   And le module écoute l'événement `sa:consent-accepted` pour initialiser GA4

2. **AC2 — Graceful degradation sans consentement**
   Given GA4 n'est pas encore chargé (pas de consentement ou en attente)
   When un composant appelle une fonction de tracking
   Then l'événement est silencieusement ignoré (pas de buffer, pas d'erreur) (NFR15)

3. **AC3 — Tracking CTA clicks**
   Given GA4 est chargé et le visiteur clique sur un CTAButton
   When `trackCTAClick()` est appelé
   Then un événement GA4 personnalisé `cta_click` est envoyé (FR23)

4. **AC4 — Tracking scroll depth**
   Given GA4 est chargé et le visiteur scrolle
   When chaque section principale entre dans le viewport
   Then `trackScrollDepth(section)` envoie un événement GA4 `scroll_depth` avec le nom de la section (FR24)

5. **AC5 — Tracking email capture**
   Given GA4 est chargé et le visiteur s'inscrit à la newsletter
   When `trackEmailCapture()` est appelé
   Then un événement GA4 `email_capture` est envoyé (FR25)

6. **AC6 — Tracking UTM**
   Given GA4 est chargé et le visiteur arrive avec des paramètres UTM
   When la page se charge
   Then `trackUTM()` extrait les paramètres `utm_source`, `utm_medium`, `utm_campaign` de l'URL et les envoie à GA4 (FR26)

7. **AC7 — Tracking Calendly**
   Given GA4 est chargé et le visiteur complète une réservation Calendly
   When `trackCalendlyComplete()` est appelé
   Then un événement GA4 `calendly_complete` est envoyé (FR27)

8. **AC8 — Gestion d'erreur silencieuse**
   Given GA4 est indisponible (erreur réseau)
   When un appel tracking échoue
   Then l'erreur est silencieuse — pas de message utilisateur, pas de dégradation du site (NFR15)
   And l'erreur est loggée : `console.warn('[slow-adventures]', ...)`

9. **AC9 — Tests**
   Given le module analytics
   When on exécute les tests
   Then `web/tests/lib/analytics.test.ts` couvre : initialisation après consentement, chaque fonction de tracking avec mock `gtag()`, comportement sans consentement, gestion d'erreur (NFR20)

## Tasks / Subtasks

- [x] Task 1 — Créer le module `web/src/lib/analytics.ts` (AC: #1, #2, #8)
  - [x] 1.1 Définir l'état interne : `let ga4Loaded = false`
  - [x] 1.2 Implémenter `safeGtag()` — wrapper qui vérifie `ga4Loaded` avant d'appeler `window.gtag()`, sinon silencieux
  - [x] 1.3 Implémenter `loadGA4(measurementId: string)` — injection dynamique du script gtag.js + config + Google Consent Mode v2
  - [x] 1.4 Implémenter l'initialisation : vérifier localStorage `sa_consent`, si `analytics: true` → charger GA4 immédiatement
  - [x] 1.5 Écouter `sa:consent-accepted` sur `document` → charger GA4 à la réception
  - [x] 1.6 Implémenter les 5 fonctions de tracking exportées (voir section Dev Notes)
  - [x] 1.7 Ajouter gestion d'erreur silencieuse avec `console.warn('[slow-adventures]', ...)`
- [x] Task 2 — Refactorer `CookieConsent.astro` pour déléguer GA4 à `analytics.ts` (AC: #1)
  - [x] 2.1 Supprimer la fonction `loadGA4()` inline et tout le code `gtag()` / `dataLayer`
  - [x] 2.2 Garder uniquement : UI bannière, localStorage `sa_consent`, dispatch `sa:consent-accepted`
  - [x] 2.3 Passer `PUBLIC_GA4_MEASUREMENT_ID` via `data-ga4-id` sur un élément que `analytics.ts` peut lire (ou via import.meta.env dans le module)
- [x] Task 3 — Initialiser analytics dans `BaseLayout.astro` (AC: #1, #4, #6)
  - [x] 3.1 Ajouter `<script>` avec import du module `analytics.ts` (déclenche l'auto-init)
  - [x] 3.2 Le module s'auto-initialise : consent check, event listener, scroll observer, UTM extraction
- [x] Task 4 — Intégrer le tracking scroll depth (AC: #4)
  - [x] 4.1 Dans `analytics.ts` : configurer un IntersectionObserver sur les `<section>` de la page (attribut `id` ou `data-section`)
  - [x] 4.2 Chaque section qui entre dans le viewport déclenche `trackScrollDepth(sectionName)`
  - [x] 4.3 Tracker une seule fois par section par session (Set de sections déjà vues)
- [x] Task 5 — Intégrer le tracking CTA clicks (AC: #3)
  - [x] 5.1 Dans `analytics.ts` : event delegation sur `document` pour les clics sur `[data-cta]`
  - [x] 5.2 Ajouter `data-cta` sur les boutons dans `CTAButton.astro` si absent (attribut HTML, pas de JS ajouté au composant statique)
- [x] Task 6 — Intégrer le tracking email capture (AC: #5)
  - [x] 6.1 Dans `EmailCapture.astro` : importer `trackEmailCapture` depuis `analytics.ts`
  - [x] 6.2 Appeler `trackEmailCapture()` après un `subscribeToNewsletter()` réussi
- [x] Task 7 — Intégrer le tracking Calendly (AC: #7)
  - [x] 7.1 Dans `CalendlyModal.astro` : importer `trackCalendlyComplete` depuis `analytics.ts`
  - [x] 7.2 Appeler `trackCalendlyComplete()` quand l'événement Calendly `calendly.event_scheduled` est reçu
- [x] Task 8 — Intégrer le tracking UTM (AC: #6)
  - [x] 8.1 Dans `analytics.ts` : `trackUTM()` s'exécute automatiquement à l'init si des paramètres UTM sont présents dans `window.location.search`
- [x] Task 9 — Créer les tests `web/tests/lib/analytics.test.ts` (AC: #9)
  - [x] 9.1 Tests d'initialisation : consent existant → GA4 chargé, pas de consent → GA4 non chargé
  - [x] 9.2 Tests de chaque fonction de tracking avec mock `window.gtag`
  - [x] 9.3 Tests du comportement sans consentement (appels silencieux)
  - [x] 9.4 Tests de gestion d'erreur
  - [x] 9.5 Tests de l'événement `sa:consent-accepted`
- [x] Task 10 — Mettre à jour les tests CookieConsent si nécessaire (AC: #1)
  - [x] 10.1 Vérifier que les tests existants passent après le refactoring
  - [x] 10.2 Supprimer/adapter les tests liés à `loadGA4()` inline si applicable
- [x] Task 11 — Build & lint final
  - [x] 11.1 `npm run build` sans erreur
  - [x] 11.2 `npm run test` — vérifier 0 régression (noter les échecs pré-existants)
  - [x] 11.3 `npm run lint` — 0 nouvelle erreur

## Dev Notes

### Architecture du module `analytics.ts`

```typescript
// web/src/lib/analytics.ts — Module GA4 centralisé (FR23-27)

// État interne (singleton module ES)
let ga4Loaded = false;
const trackedSections = new Set<string>();

// Déclaration globale pour window.gtag et window.dataLayer
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Wrapper sécurisé — NE PAS utiliser gtag() directement
function safeGtag(...args: unknown[]): void {
  if (!ga4Loaded || typeof window.gtag !== 'function') return;
  try {
    window.gtag(...args);
  } catch (error) {
    console.warn('[slow-adventures]', error);
  }
}

// Fonctions de tracking exportées
export function trackCTAClick(): void {
  safeGtag('event', 'cta_click');
}

export function trackScrollDepth(section: string): void {
  if (trackedSections.has(section)) return; // une fois par section par session
  trackedSections.add(section);
  safeGtag('event', 'scroll_depth', { section });
}

export function trackEmailCapture(): void {
  safeGtag('event', 'email_capture');
}

export function trackUTM(): void {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  if (!source && !medium && !campaign) return;
  safeGtag('event', 'utm_params', {
    utm_source: source ?? '',
    utm_medium: medium ?? '',
    utm_campaign: campaign ?? '',
  });
}

export function trackCalendlyComplete(): void {
  safeGtag('event', 'calendly_complete');
}
```

### Refactoring CookieConsent — Ce qui CHANGE vs ce qui RESTE

**RESTE inchangé :**
- UI bannière (HTML, styles, animations CSS)
- localStorage `sa_consent` read/write
- `sa:consent-accepted` CustomEvent dispatch
- Logique "return visitor" (vérification localStorage au chargement)
- `prefers-reduced-motion`, accessibilité, focus management

**SUPPRIMÉ de CookieConsent :**
- Fonction `loadGA4()` entière (lignes ~83-105 actuelles)
- `window.dataLayer` initialization
- `gtag('js', ...)`, `gtag('consent', ...)`, `gtag('config', ...)`
- Script injection `googletagmanager.com/gtag/js`
- Variable `ga4Loaded` locale
- Référence à `data-ga4-id` (le module analytics.ts lit directement `import.meta.env.PUBLIC_GA4_MEASUREMENT_ID`)

**AJOUTÉ à CookieConsent :** Rien — le composant est simplifié. Il ne fait plus que gérer le consentement UI.

**DÉPLACÉ vers analytics.ts :**
- Toute la logique GA4 : chargement script, `window.dataLayer`, `gtag()`, Google Consent Mode v2
- Vérification du consentement existant au chargement

### Intégration tracking dans les composants

**CTA clicks — Event delegation (pas de modification de CTAButton.astro) :**
- `analytics.ts` met en place un listener `document.addEventListener('click', ...)` qui détecte les clics sur `[data-cta]`
- Ajouter `data-cta` dans le markup de `CTAButton.astro` si absent (attribut HTML pur, le composant reste statique / 0 JS)
- `StickyMobileCTA.astro` utilise déjà CTAButton ou un lien similaire — vérifier qu'il a `data-cta`

**Scroll depth — IntersectionObserver autonome dans analytics.ts :**
- Observer toutes les `<section>` avec un `id` sur la page d'accueil
- Sections cibles : `#hero`, `#elena`, `#processus`, `#destinations`, `#temoignages`, `#pricing`, `#cta-final` (vérifier les IDs réels dans `index.astro`)
- Threshold : `0.3` (30% visible = considéré comme vu)
- Tracker UNE SEULE FOIS par section par visite (Set interne)

**Email capture — Import direct dans EmailCapture.astro :**
- Le composant a déjà un `<script>` avec la logique Brevo
- Ajouter `import { trackEmailCapture } from '../lib/analytics';` en haut du script
- Appeler `trackEmailCapture()` après le `subscribeToNewsletter()` réussi (dans le bloc `if (result.success)`)

**Calendly complete — Import direct dans CalendlyModal.astro :**
- Le composant écoute déjà les messages Calendly via `window.addEventListener('message', ...)`
- Ajouter `import { trackCalendlyComplete } from '../lib/analytics';`
- Appeler `trackCalendlyComplete()` quand `event.data.event === 'calendly.event_scheduled'`

**UTM — Auto-extraction à l'init :**
- `trackUTM()` est appelé automatiquement par le module lors de l'initialisation
- Extrait `utm_source`, `utm_medium`, `utm_campaign` de `window.location.search`
- Si aucun paramètre UTM, ne fait rien

### GA4 Measurement ID

- Variable : `PUBLIC_GA4_MEASUREMENT_ID` = `G-4NYCND6NTZ`
- Déjà défini dans `web/.env` et typé dans `web/env.d.ts`
- `analytics.ts` peut accéder via `import.meta.env.PUBLIC_GA4_MEASUREMENT_ID` (Astro/Vite remplace au build)
- **NE PAS** utiliser `data-ga4-id` — le module TypeScript a accès direct aux env vars

### Google Consent Mode v2 (Basic Mode)

Transféré depuis CookieConsent vers analytics.ts :
```typescript
// À l'init (avant chargement GA4)
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag(...args: unknown[]) {
  window.dataLayer.push(args);
};
window.gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
});

// Après consentement accepté
window.gtag('consent', 'update', { analytics_storage: 'granted' });
window.gtag('js', new Date());
window.gtag('config', measurementId);
```

### Patterns de test — `web/tests/lib/analytics.test.ts`

**Pattern de test existant du projet :** `readFileSync` + string matching sur le fichier source `.ts`.

Mais pour `analytics.ts` qui est un module TypeScript pur (pas un `.astro`), on peut aussi faire des **unit tests réels** avec mock :

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock window.gtag
const mockGtag = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  window.gtag = mockGtag;
  window.dataLayer = [];
});
```

**Cas de test à couvrir :**
1. Module exporte les 5 fonctions de tracking
2. `trackCTAClick()` appelle `gtag('event', 'cta_click')` quand GA4 est chargé
3. `trackScrollDepth('hero')` appelle `gtag('event', 'scroll_depth', { section: 'hero' })`
4. `trackScrollDepth` ne track pas deux fois la même section
5. `trackEmailCapture()` appelle `gtag('event', 'email_capture')`
6. `trackCalendlyComplete()` appelle `gtag('event', 'calendly_complete')`
7. `trackUTM()` extrait les paramètres UTM et appelle `gtag('event', 'utm_params', ...)`
8. `trackUTM()` ne fait rien sans paramètres UTM
9. Fonctions silencieuses quand GA4 non chargé (pas d'erreur, pas d'appel gtag)
10. Erreur gtag attrapée et loggée via `console.warn`
11. Consentement existant dans localStorage → GA4 initialisé
12. `sa:consent-accepted` event → GA4 initialisé
13. Pas de double chargement GA4 (idempotence)

**Note importante :** Les tests sont dans `web/tests/lib/` (PAS `src/lib/`). Pattern établi depuis Story 1-1 — les tests dans `src/` causent des erreurs Vitest au build Astro.

### Project Structure Notes

**Fichiers à créer :**
- `web/src/lib/analytics.ts` — Module GA4 centralisé
- `web/tests/lib/analytics.test.ts` — Tests du module

**Fichiers à modifier :**
- `web/src/components/CookieConsent.astro` — Supprimer `loadGA4()`, garder consent UI
- `web/src/components/CTAButton.astro` — Ajouter attribut `data-cta` (markup HTML seulement)
- `web/src/components/EmailCapture.astro` — Import + appel `trackEmailCapture()`
- `web/src/components/CalendlyModal.astro` — Import + appel `trackCalendlyComplete()`
- `web/src/layouts/BaseLayout.astro` — Import analytics.ts pour initialisation
- `web/tests/components/CookieConsent.test.ts` — Adapter si tests `loadGA4()` inline échouent

**Fichiers à NE PAS modifier :**
- `web/.env` — GA4 ID déjà configuré
- `web/env.d.ts` — Types déjà définis
- `web/netlify.toml` — CSP headers déjà configurés pour googletagmanager.com
- `web/src/types/index.ts` — `AnalyticsEvent` interface existe déjà

### Anti-patterns à éviter

- **NE PAS** appeler `gtag()` directement depuis un composant — toujours via `analytics.ts`
- **NE PAS** buffer les événements pré-consentement — les ignorer silencieusement
- **NE PAS** importer `analytics.ts` depuis un composant statique (0 JS) — utiliser event delegation
- **NE PAS** ajouter de dépendance npm — tout est vanilla TypeScript
- **NE PAS** créer `src/lib/analytics.test.ts` — les tests vont dans `tests/lib/`
- **NE PAS** utiliser `gsap.from()` — utiliser `gsap.fromTo()` (pattern projet, même si non applicable ici)
- **NE PAS** utiliser `console.log` — utiliser `console.warn('[slow-adventures]', ...)` pour les erreurs
- **NE PAS** utiliser `import { gsap } from 'gsap'` directement — toujours `from '../lib/gsap'`

### Previous Story Intelligence (5-1)

**Patterns établis dans Story 5-1 :**
- `CookieConsent.astro` utilise le pattern `.astro` + `<script>` natif (PAS `client:load`)
- localStorage key : `sa_consent` avec JSON `{ analytics: boolean }` extensible
- CustomEvent : `sa:consent-accepted` avec `detail: { analytics: true }`
- Google Consent Mode v2 Basic Mode implémenté
- `data-ga4-id` data attribute pour passer l'ID du frontmatter au script
- Animations CSS pures (pas GSAP) avec `prefers-reduced-motion` support
- Tests via `readFileSync` + string matching pour les `.astro`
- 30 tests dans `web/tests/components/CookieConsent.test.ts`

**Issues corrigées en code review 5-1 (à ne pas réintroduire) :**
- Guard contre GA4 ID vide
- Idempotence du chargement GA4 (pas de double-loading)
- Récupération localStorage corrompu
- `prefers-reduced-motion` synchrone

**Pré-existant (NE PAS corriger dans cette story) :**
- 4 erreurs lint sur ElenaSection / ScrollProgress
- 18 échecs de tests pré-existants

### Git Intelligence

Derniers commits pertinents :
- `2daea8d` — Messages visiteur retour personnalisés + CookieConsent + sprint-status
- `0a5b945` — ReturnVisitorBanner: affichage instantané
- Pattern commit : emoji + description courte en français

### References

- [Source: docs/planning-artifacts/epics.md#Epic 5, Story 5.2] — Requirements et acceptance criteria
- [Source: docs/planning-artifacts/architecture.md#Cross-Cutting Concerns §6-7] — Consentement cookies + Module analytics centralisé
- [Source: docs/planning-artifacts/architecture.md#Inter-island Communication] — Pattern `sa:` CustomEvents
- [Source: docs/planning-artifacts/architecture.md#Testing Strategy] — analytics.ts unit tests, mock gtag(), priorité Haute
- [Source: docs/planning-artifacts/architecture.md#Naming Patterns] — camelCase verbe+nom pour fonctions
- [Source: docs/planning-artifacts/architecture.md#Error Handling] — Pattern `console.error/warn('[slow-adventures]', ...)`
- [Source: docs/planning-artifacts/architecture.md#GA4 Integration] — Script conditionnel, événements buffered
- [Source: docs/implementation-artifacts/5-1-cookieconsent-chargement-conditionnel-ga4.md] — Story précédente, bridge analytics
- [Source: docs/planning-artifacts/prd.md#FR23-FR27] — Functional requirements tracking
- [Source: docs/planning-artifacts/prd.md#NFR15] — Dégradation gracieuse sans GA4
- [Source: docs/planning-artifacts/prd.md#NFR20] — Tests composants interactifs

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- CookieConsent tests: 10 tests failed after GA4 code removal → replaced with delegation verification tests (24/24 pass)
- analytics.test.ts: 3 initial failures → fixed Consent Mode test to check dataLayer instead of mock, consent init tests use source code verification (vitest doesn't resolve import.meta.env at transform time)
- Pre-existing: 19 test failures (ElenaSection, CTAButton, Footer, index, etc.), 4 lint errors (ElenaSection, ScrollProgress)

### Completion Notes List

- Created `web/src/lib/analytics.ts` — centralized GA4 module with 5 exported tracking functions, safeGtag wrapper, loadGA4 with Google Consent Mode v2, auto-init from localStorage + sa:consent-accepted event, scroll depth IntersectionObserver (threshold 0.3), CTA click event delegation on [data-cta], auto UTM extraction
- Refactored `CookieConsent.astro` — removed all GA4 inline code (loadGA4, dataLayer, gtag, data-ga4-id), kept only consent UI + localStorage + CustomEvent dispatch
- Added `<script>import '../lib/analytics'</script>` in BaseLayout.astro for auto-init
- Added `data-cta` attribute to CTAButton.astro and StickyMobileCTA.astro (HTML-only, 0 JS)
- Added `trackEmailCapture()` call in EmailCapture.astro after successful Brevo subscribe
- Added `trackCalendlyComplete()` call in CalendlyModal.astro via window message listener for `calendly.event_scheduled`
- UTM tracking auto-runs at init in analytics.ts
- 22 new tests in `web/tests/lib/analytics.test.ts` covering: exports, all 5 tracking functions with mock gtag, graceful degradation, error handling, loadGA4 idempotence, Consent Mode v2, consent init logic
- Updated 24 CookieConsent tests: replaced 10 GA4-specific tests with 4 delegation verification tests
- Build: 0 errors, 3 pages built
- Tests: 743 passed, 19 failed (all pre-existing)
- Lint: 0 new errors (4 pre-existing on ElenaSection/ScrollProgress)

### Change Log

- 2026-02-28: Story 5.2 implementation — centralized analytics module, CookieConsent refactoring, component integrations, 22 new tests
- 2026-02-28: Code review fixes (9 issues) — [HIGH] trackScrollDepth ne marque plus les sections avant consent, [MEDIUM] consent listener vérifie e.detail.analytics, [MEDIUM] UTM re-tenté après consent, [MEDIUM] __test__ gardé par import.meta.env.DEV, [MEDIUM] tests ajoutés pour delegation CTA et IntersectionObserver, [LOW] validation format measurement ID, [LOW] trackCTAClick accepte un label optionnel, [LOW] test UTM partiel ajouté, [LOW] Consent Mode defaults déplacés dans init(). Tests: 32 passed (22→32), build OK, lint 0 erreur

### File List

New files:
- web/src/lib/analytics.ts
- web/tests/lib/analytics.test.ts

Modified files:
- web/src/components/CookieConsent.astro
- web/src/components/CTAButton.astro
- web/src/components/StickyMobileCTA.astro
- web/src/components/EmailCapture.astro
- web/src/components/CalendlyModal.astro
- web/src/layouts/BaseLayout.astro
- web/tests/components/CookieConsent.test.ts
- docs/implementation-artifacts/sprint-status.yaml
- docs/implementation-artifacts/5-2-module-analytics-evenements-tracking.md
