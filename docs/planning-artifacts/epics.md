---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - "docs/planning-artifacts/prd.md"
  - "docs/planning-artifacts/architecture.md"
  - "docs/planning-artifacts/ux-design-specification.md"
---

# slow-adventures - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for slow-adventures, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Expérience Immersive & Storytelling (FR1-FR9)**

- FR1: Le visiteur peut visionner une vidéo hero immersive en arrivant sur le site
- FR2: Le visiteur voit un contenu visuel immédiat pendant le chargement de la vidéo hero
- FR3: Le visiteur peut scroller à travers les sections du site avec des animations de transition
- FR4: Le visiteur ayant activé la préférence de mouvement réduit peut naviguer sur le site sans animations
- FR5: Le visiteur peut découvrir l'histoire et l'expertise d'Elena dans une section dédiée
- FR6: Le visiteur peut explorer les destinations par pays dans des blocs visuels immersifs
- FR7: Le visiteur peut consulter le processus de création de voyage étape par étape
- FR8: Le visiteur peut lire des témoignages de clients précédents
- FR9: Le visiteur peut consulter le pricing de manière transparente

**Conversion & Prise de Contact (FR10-FR15)**

- FR10: Le visiteur peut accéder au CTA principal depuis n'importe quel point du site (sticky mobile)
- FR11: Le visiteur peut accéder à la prise de rendez-vous depuis une section de fermeture émotionnelle en fin de parcours
- FR12: Le visiteur peut réserver une discovery call via une modale intégrée sans quitter le site
- FR13: Le visiteur peut choisir un créneau horaire pour sa discovery call
- FR14: Le visiteur peut fermer la modale de réservation et revenir au site
- FR15: Le visiteur peut accéder au booking Calendly même sans JavaScript activé (fallback lien direct)

**Capture & Nurturing Email (FR16-FR19)**

- FR16: Le visiteur peut s'inscrire à la newsletter via un formulaire email
- FR17: Le visiteur inscrit reçoit un email de bienvenue automatique *(config Brevo, pas de dev custom)*
- FR18: Le visiteur inscrit reçoit une newsletter hebdomadaire automatique *(config Brevo, pas de dev custom)*
- FR19: Le visiteur ayant réservé une discovery call reçoit un email de confirmation automatique *(natif Calendly, pas de dev custom)*

**Engagement & Rétention (FR20-FR22)**

- FR20: Le visiteur de retour est reconnu et reçoit un message de bienvenue personnalisé
- FR21: Le visiteur peut utiliser le site entièrement au clavier
- FR22: Le visiteur utilisant un lecteur d'écran peut accéder à tout le contenu

**Tracking & Analytics (FR23-FR27)**

- FR23: Le système enregistre les clics sur le CTA principal
- FR24: Le système enregistre la profondeur de scroll par section
- FR25: Le système enregistre les inscriptions email
- FR26: Le système enregistre les paramètres UTM des visiteurs
- FR27: Le système enregistre les réservations Calendly complétées

**SEO & Découvrabilité (FR28-FR30)**

- FR28: Les moteurs de recherche peuvent indexer le contenu du site avec des métadonnées structurées
- FR29: Les réseaux sociaux affichent un aperçu riche lors du partage du lien du site
- FR30: Le site génère automatiquement un sitemap

**Conformité & Légal (FR31-FR34)**

- FR31: Le visiteur peut accéder aux mentions légales
- FR32: Le visiteur peut consulter la politique de confidentialité (RGPD)
- FR33: Le visiteur est informé de l'utilisation des cookies et peut les accepter/refuser
- FR34: Le visiteur peut accéder aux coordonnées de contact d'Elena depuis le footer

### NonFunctional Requirements

**Performance (NFR1-NFR5)**

- NFR1: Le LCP est inférieur à 2.5 secondes sur une connexion 4G mobile (Safari iOS)
- NFR2: Le CLS reste inférieur à 0.1 pendant toute la navigation
- NFR3: Les animations scroll ne provoquent pas de jank visible sur les appareils cibles *(test : validation manuelle iPhone réel + Chrome DevTools Performance)*
- NFR4: Le site est navigable de manière fluide sur mobile, tablette et desktop
- NFR5: Chaque image de section (hors hero) pèse moins de 100kb en format WebP/AVIF

**Accessibilité (NFR6-NFR9)**

- NFR6: Le site atteint un score Lighthouse Accessibility de 95+
- NFR7: Zéro violation axe critical ou serious
- NFR8: Les contrastes de couleur respectent le ratio 4.5:1 minimum sur toute la palette
- NFR9: Les animations respectent la préférence `prefers-reduced-motion` du système

**Sécurité & Confidentialité (NFR10-NFR12)**

- NFR10: Toutes les connexions utilisent HTTPS
- NFR11: Les emails collectés sont traités conformément au RGPD
- NFR12: Aucune donnée personnelle n'est stockée sur l'infrastructure Netlify — les emails sont envoyés directement à l'API Brevo côté client

**Résilience des Intégrations (NFR13-NFR16)**

- NFR13: Si Calendly est indisponible, le visiteur peut accéder à un lien direct de fallback
- NFR14: Si Brevo est indisponible, le formulaire email affiche un message d'erreur clair
- NFR15: Si Google Analytics est indisponible, le site fonctionne normalement sans dégradation
- NFR16: Le contenu du site reste accessible même sans JavaScript (dégradation gracieuse)

**Maintenabilité (NFR17-NFR20)**

- NFR17: Le contenu textuel et les images sont isolés dans des fichiers dédiés, permettant une modification sans toucher à la logique des composants
- NFR18: Le code respecte TypeScript strict mode et les règles ESLint du projet sans erreur ni warning
- NFR19: Le build Netlify se complète en moins de 2 minutes
- NFR20: Les composants interactifs (îlots) ont une couverture de test couvrant les comportements critiques (CTA, modale Calendly, formulaire Brevo, détection retour visiteur)

### Additional Requirements

**Depuis l'Architecture :**

- **Starter template** : `create astro` minimal (`npm create astro@latest slow-adventures -- --template minimal --typescript strict`) — sera la base d'Epic 1 Story 1
- Astro 5 stable (pas Astro 6 beta) — aucune feature v6 nécessaire
- Tailwind v4 avec config CSS-based (`@tailwindcss/vite`) — remplace l'ancien `@astrojs/tailwind` deprecated
- Un seul fichier CSS `src/styles/global.css` (fusion tokens.css + config Tailwind)
- `src/lib/` pour les utilitaires TypeScript (analytics.ts, brevo.ts, gsap.ts)
- Content collections Astro 5 avec schema Zod pour les destinations
- Variables d'environnement : `.env` avec préfixe `PUBLIC_` (BREVO_API_KEY, CALENDLY_URL, GA4_MEASUREMENT_ID, SITE_URL)
- Déploiement GitHub Actions → Netlify CLI (pas de build côté Netlify)
- `netlify.toml` : headers de sécurité (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) + cache headers
- ESLint (`@typescript-eslint` + plugin Astro) + Prettier (+ plugin Astro)
- Vitest pour les tests unitaires et DOM, tests co-localisés
- Import GSAP unifié obligatoire depuis `src/lib/gsap.ts` — jamais d'import direct `from 'gsap'`
- CookieConsent island pour consentement RGPD + chargement conditionnel GA4
- Communication inter-islands via CustomEvents avec préfixe `sa:` (ex: `sa:consent-accepted`, `sa:modal-open`)
- Progressive enhancement obligatoire : chaque island a un fallback sans JS
- Logging avec préfixe `[slow-adventures]` (console.error/warn uniquement)
- Structure projet plate pour les composants (14 fichiers dans `src/components/`, pas de sous-dossiers)
- Arborescence complète définie : `src/components/`, `src/content/destinations/`, `src/data/`, `src/layouts/`, `src/lib/`, `src/pages/`, `src/styles/`, `src/types/`

**Depuis l'UX Design :**

- Hero : pas de CTA dans le hero — le hero fait rêver, pas vendre. Vidéo dark plein écran (autoplay, muted, loop, playsinline) + "scroll to explore"
- Stratégie CTA responsive : desktop = CTA intégrés aux sections (Elena, après destinations, témoignages) ; mobile = sticky CTA remplace les intégrés
- CTAButton : 3 variants (solid/outline/ghost), prop `desktopOnly`, prop `size` (default/small)
- StickyMobileCTA : apparaît après scroll > 100vh, se masque quand section CTA finale visible, délai réapparition 300ms, mobile uniquement
- Alternance dark/light entre sections pour le rythme visuel (hero dark → Elena dark → destinations full immersif → processus clair → témoignages dark → pricing clair → CTA final dark → email dark)
- Direction visuelle hybride : Story Vertical (hero), Cinématique (Elena, pricing, CTA final), Full Immersif (destinations, processus, témoignages, email)
- Éléments graphiques : texture grain/noise (SVG, opacité 3-5%), gradient chaud overlay, ligne séparatrice ambre 60px, formes organiques blob (clip-path), icônes ligne simple SVG
- Tutoiement systématique dans tous les messages et textes du site
- Formulations inclusives (non genrées) — pas de "prête/prêt", utiliser des tournures neutres
- Email capture : formulation positive ("Reste connecté(e) à l'aventure"), double objectif CTA + newsletter
- Skip-to-content link obligatoire (WCAG 2.4.1)
- Animations GSAP par section : hero (parallax titre), Elena (scale-in photo, fade-in texte), destinations (fade-in par pays, overlay progressif), processus (stagger steps 150ms), témoignages (fade-in slide-up), pricing (stagger lignes 100ms), CTA final (scale-in), email (fade-in)
- Fallback GSAP en CSS transitions (opacity 200ms via IntersectionObserver natif)
- ReturnVisitorBanner : positionné entre hero et Elena, auto-dismiss 5s, sessionStorage flag pour ne pas réafficher
- CalendlyModal : slide-up 400ms, fond `rgba(44,40,37,0.7)` + backdrop-blur, full-screen mobile, scroll lock, focus trap
- Shadows chaudes teintées terracotta : cards `0 4px 24px rgba(192,96,62,0.08)`, CTA hover `0 8px 32px rgba(192,96,62,0.15)`

### FR Coverage Map

- FR1: Epic 2 — Vidéo hero immersive (HeroSection)
- FR2: Epic 2 — Poster image pendant chargement vidéo (HeroSection)
- FR3: Epic 2 — Animations scroll de transition (SectionReveal + GSAP)
- FR4: Epic 2 — Support prefers-reduced-motion (SectionReveal + HeroSection)
- FR5: Epic 2 — Section Elena storytelling (ElenaSection)
- FR6: Epic 2 — Blocs destination par pays (DestinationBlock + content collections)
- FR7: Epic 2 — Section processus étape par étape (ProcessStep)
- FR8: Epic 2 — Section témoignages clients (TestimonialCard)
- FR9: Epic 2 — Section pricing transparent (PricingRow)
- FR10: Epic 3 — CTA sticky mobile (StickyMobileCTA)
- FR11: Epic 3 — Section CTA final fermeture émotionnelle
- FR12: Epic 3 — Modale Calendly intégrée (CalendlyModal)
- FR13: Epic 3 — Choix créneau horaire (CalendlyModal iframe)
- FR14: Epic 3 — Fermeture modale retour au site (CalendlyModal)
- FR15: Epic 3 — Fallback Calendly sans JavaScript (CTAButton `<a href>`)
- FR16: Epic 4 — Formulaire email newsletter (EmailCapture + brevo.ts)
- FR17: Epic 4 — Email de bienvenue automatique (config Brevo)
- FR18: Epic 4 — Newsletter hebdomadaire automatique (config Brevo)
- FR19: Epic 4 — Email confirmation post-booking (config Calendly)
- FR20: Epic 4 — Détection visiteur retour (ReturnVisitorBanner + localStorage)
- FR21: Epic 2 — Navigation clavier complète (skip-to-content, tab order, focus visible)
- FR22: Epic 2 — Accessibilité lecteur d'écran (ARIA, sémantique HTML, alt text)
- FR23: Epic 5 — Tracking clics CTA (analytics.ts)
- FR24: Epic 5 — Tracking scroll depth par section (analytics.ts)
- FR25: Epic 5 — Tracking inscriptions email (analytics.ts)
- FR26: Epic 5 — Tracking paramètres UTM (analytics.ts)
- FR27: Epic 5 — Tracking réservations Calendly (analytics.ts)
- FR28: Epic 1 — Métadonnées structurées Schema.org (BaseLayout)
- FR29: Epic 1 — Open Graph aperçu riche (BaseLayout)
- FR30: Epic 1 — Sitemap XML automatique (Astro sitemap integration)
- FR31: Epic 1 — Page mentions légales (mentions-legales.astro)
- FR32: Epic 1 — Page politique de confidentialité (politique-confidentialite.astro)
- FR33: Epic 5 — Bannière consentement cookies (CookieConsent)
- FR34: Epic 1 — Coordonnées contact footer

## Epic List

### Epic 1: Fondation & Infrastructure déployable
Le site est initialisé, déployable et conforme — squelette fonctionnel avec pages légales, SEO de base et pipeline de déploiement. Le visiteur peut accéder aux pages légales, aux coordonnées d'Elena, et les moteurs de recherche peuvent indexer le site.
**FRs couverts:** FR28, FR29, FR30, FR31, FR32, FR34

### Epic 2: Expérience immersive & Contenu
Le visiteur vit l'expérience scroll immersive complète — du hero vidéo au pricing, avec animations de transition, accessibilité clavier et lecteur d'écran. Chaque section raconte une partie de l'histoire Slow Adventures.
**FRs couverts:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR21, FR22

### Epic 3: Conversion & Booking Calendly
Le visiteur peut réserver une discovery call depuis n'importe quel point du site — CTA toujours accessible (sticky mobile + intégrés desktop), modale Calendly intégrée, fallback sans JS.
**FRs couverts:** FR10, FR11, FR12, FR13, FR14, FR15

### Epic 4: Capture Email & Engagement
Le visiteur peut s'inscrire à la newsletter et les visiteurs de retour sont reconnus avec un message chaleureux — filet de sécurité pour les prospects en cycle de décision long.
**FRs couverts:** FR16, FR17, FR18, FR19, FR20

### Epic 5: Analytics, Consentement & Tracking
Le système collecte les données d'engagement après consentement utilisateur, permettant de comprendre le parcours visiteur et de prendre des décisions data-driven.
**FRs couverts:** FR23, FR24, FR25, FR26, FR27, FR33

**Note monorepo :** Le projet Astro est dans le dossier `web/` (structure monorepo `api/` + `web/`). Tous les chemins de fichiers ci-dessous sont relatifs à `web/`.

---

## Epic 1: Fondation & Infrastructure déployable

Le site est initialisé, déployable et conforme — squelette fonctionnel avec pages légales, SEO de base et pipeline de déploiement. Le visiteur peut accéder aux pages légales, aux coordonnées d'Elena, et les moteurs de recherche peuvent indexer le site.

### Story 1.1: Initialisation projet & pipeline de déploiement

As a développeur,
I want initialiser le projet Astro dans `web/` avec toutes les dépendances, configs et le pipeline de déploiement,
So that le projet build, lint et se déploie automatiquement sur Netlify à chaque push sur main.

**Acceptance Criteria:**

**Given** le dossier `web/` n'existe pas encore
**When** le projet est initialisé avec `create astro` minimal + TypeScript strict
**Then** le dossier `web/` contient un projet Astro 5 fonctionnel avec TypeScript strict
**And** les dépendances sont installées : `tailwindcss`, `@tailwindcss/vite`, `gsap`, `@astrojs/sitemap`, `astro-robots-txt`
**And** les devDependencies sont installées : `vitest`, `@testing-library/dom`, `typescript`, `eslint`, `prettier` avec plugins Astro

**Given** le projet est initialisé
**When** on exécute `npm run build` dans `web/`
**Then** le build se complète sans erreur en moins de 2 minutes (NFR19)
**And** le dossier `web/dist/` est généré

**Given** le projet est initialisé
**When** on exécute `npm run lint` dans `web/`
**Then** ESLint (`@typescript-eslint` + plugin Astro) et Prettier (+ plugin Astro) passent sans erreur ni warning (NFR18)

**Given** le build est réussi
**When** un push est fait sur la branche `main`
**Then** GitHub Actions exécute le workflow `deploy.yml` qui build et déploie sur Netlify via `netlify-cli`
**And** le site est accessible en HTTPS sur le domaine Netlify (NFR10)

**Given** le projet est initialisé
**When** on inspecte la structure `web/src/`
**Then** les dossiers suivants existent : `components/`, `content/destinations/`, `data/`, `layouts/`, `lib/`, `pages/`, `styles/`, `types/`
**And** `web/.env.example` documente les variables : `PUBLIC_BREVO_API_KEY`, `PUBLIC_CALENDLY_URL`, `PUBLIC_GA4_MEASUREMENT_ID`, `SITE_URL`
**And** `web/netlify.toml` contient les headers de sécurité (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) et les headers cache (immutable pour `/assets/*`, must-revalidate pour `/*.html`)
**And** `web/vitest.config.ts` est configuré pour inclure `src/**/*.test.ts`
**And** `web/astro.config.mjs` configure sitemap, robots-txt et le plugin Vite Tailwind

### Story 1.2: Design tokens, BaseLayout & SEO

As a visiteur,
I want que le site ait une identité visuelle cohérente et soit découvrable par les moteurs de recherche,
So that je perçoive immédiatement l'univers Slow Adventures et que le site apparaisse dans les résultats de recherche.

**Acceptance Criteria:**

**Given** le projet est initialisé (Story 1.1)
**When** on ouvre `web/src/styles/global.css`
**Then** le fichier contient `@import "tailwindcss"` et un bloc `@theme` avec tous les tokens de couleur (terracotta, terracotta-light, terracotta-dark, terracotta-muted, bleu, creme, creme-dark, sauge, ambre, warm-black, warm-gray), les familles de polices (serif: Lora, sans: Plus Jakarta Sans), et les border-radius (soft, round, full)
**And** les custom properties GSAP sont définies dans `:root` (--gsap-duration-default, --gsap-duration-slow, --gsap-ease-default, --gsap-ease-slow)

**Given** le fichier `global.css` est configuré
**When** on ouvre `web/src/layouts/BaseLayout.astro`
**Then** le composant accepte les props `title`, `description`, `ogImage`
**And** le `<head>` contient : meta charset, viewport, title, description, les liens preconnect/preload Google Fonts (Lora 600, Plus Jakarta Sans 400/500/600) avec `font-display: swap`
**And** le `<head>` contient les meta Open Graph (og:title, og:description, og:image, og:type, og:url) (FR29)
**And** le `<head>` contient un script JSON-LD Schema.org de type LocalBusiness + TravelAgency (FR28)
**And** le `<body>` contient un `<slot />` pour le contenu de page

**Given** BaseLayout est créé
**When** on ouvre `web/src/pages/index.astro`
**Then** la page utilise BaseLayout avec un titre et une description appropriés
**And** la page contient un `<main>` vide (squelette pour les futures sections)

**Given** le site est buildé et déployé
**When** un moteur de recherche accède au site
**Then** un sitemap XML est généré automatiquement à `/sitemap-index.xml` (FR30)
**And** un fichier `robots.txt` est généré automatiquement

**Given** le site est déployé
**When** on partage le lien du site sur un réseau social
**Then** un aperçu riche est affiché avec le titre, la description et l'image OG (FR29)

**Given** le projet est initialisé
**When** on ouvre `web/src/types/index.ts`
**Then** le fichier exporte les types partagés du projet (DestinationData, AnalyticsEvent, etc.)

### Story 1.3: Pages légales, footer & conformité

As a visiteur,
I want accéder aux mentions légales, à la politique de confidentialité et aux coordonnées d'Elena,
So that je puisse vérifier la conformité légale et contacter Elena directement.

**Acceptance Criteria:**

**Given** BaseLayout existe (Story 1.2)
**When** on navigue vers `/mentions-legales`
**Then** la page affiche le contenu des mentions légales avec le BaseLayout (FR31)
**And** la page est accessible au clavier et aux lecteurs d'écran

**Given** BaseLayout existe (Story 1.2)
**When** on navigue vers `/politique-confidentialite`
**Then** la page affiche la politique de confidentialité RGPD avec le BaseLayout (FR32)
**And** la page mentionne l'utilisation de Brevo pour les emails et de Google Analytics pour le tracking

**Given** les pages légales existent
**When** on navigue sur n'importe quelle page du site
**Then** un footer est visible en bas de page avec les coordonnées de contact d'Elena (FR34)
**And** le footer contient des liens vers `/mentions-legales` et `/politique-confidentialite`
**And** le footer utilise les design tokens (warm-black, warm-gray, creme) et la police Plus Jakarta Sans
**And** le footer est sémantiquement balisé avec `<footer>` et les liens sont des `<a>` avec texte descriptif

---

## Epic 2: Expérience immersive & Contenu

Le visiteur vit l'expérience scroll immersive complète — du hero vidéo au pricing, avec animations de transition, accessibilité clavier et lecteur d'écran. Chaque section raconte une partie de l'histoire Slow Adventures.

### Story 2.1: Module GSAP unifié & SectionReveal

As a visiteur,
I want que les sections du site apparaissent avec des animations fluides au scroll,
So that l'expérience de navigation soit immersive et stimulante visuellement.

**Acceptance Criteria:**

**Given** le projet est initialisé (Epic 1)
**When** on ouvre `web/src/lib/gsap.ts`
**Then** le fichier importe `gsap` et `ScrollTrigger` depuis le package `gsap`, enregistre le plugin et exporte les deux
**And** c'est le SEUL point d'import GSAP du projet — aucun autre fichier n'importe directement depuis `'gsap'`

**Given** `gsap.ts` existe
**When** on ouvre `web/src/components/SectionReveal.astro`
**Then** le composant est un island interactif (`client:visible`) qui wrape un `<slot>` enfant
**And** le composant accepte les props `animation` (fade-up | fade-in | stagger), `delay` (ms), `duration` (ms)
**And** il importe GSAP uniquement depuis `src/lib/gsap.ts`

**Given** un composant SectionReveal est visible dans le viewport
**When** le visiteur scrolle et la section entre dans le viewport
**Then** le contenu apparaît avec l'animation configurée (fade-up par défaut : opacity 0→1, translateY 20px→0) (FR3)
**And** l'animation est déclenchée via GSAP ScrollTrigger avec `start: 'top 80%'`

**Given** le visiteur a activé `prefers-reduced-motion: reduce`
**When** la page se charge
**Then** le contenu de toutes les SectionReveal est visible immédiatement sans animation (opacity: 1) (FR4)
**And** aucune animation GSAP n'est initialisée

**Given** GSAP n'a pas encore chargé (latence réseau)
**When** la section entre dans le viewport
**Then** un fallback CSS via IntersectionObserver natif applique une transition `opacity 200ms ease-in` (attribut `[data-reveal]`)

**Given** `prefers-reduced-motion: reduce` est actif
**When** on inspecte le CSS
**Then** la règle `@media (prefers-reduced-motion: reduce) { [data-reveal] { opacity: 1; } }` est présente et active

### Story 2.2: HeroSection vidéo immersive & ScrollHint

As a visiteur,
I want être immergé dès l'arrivée sur le site par une vidéo plein écran et une invitation au scroll,
So that je ressente immédiatement l'univers Slow Adventures en continuité avec Instagram.

**Acceptance Criteria:**

**Given** le visiteur arrive sur la page d'accueil
**When** la page se charge
**Then** une image poster haute qualité (WebP) est affichée immédiatement en plein écran (FR2)
**And** le poster est preloadé via `<link rel="preload">` dans BaseLayout pour servir de LCP
**And** le titre "Slow Adventures" est affiché en Lora XL centré sur le poster
**And** le sous-titre "Voyages immersifs aux Amériques" est visible sous le titre

**Given** le poster est affiché
**When** la vidéo hero a fini de charger
**Then** la vidéo remplace le poster en fade-in (FR1)
**And** la vidéo joue en boucle avec les attributs `autoplay muted loop playsinline`
**And** la vidéo est en format MP4 H.264 (mobile: 720p ~2MB, desktop: 1080p ~4MB)
**And** `aria-hidden="true"` est appliqué sur le `<video>` (purement décoratif)

**Given** le visiteur a activé `prefers-reduced-motion: reduce` OU `Save-Data`
**When** la page se charge
**Then** seul le poster statique est affiché, la vidéo ne se lance pas (FR4)

**Given** le hero est visible
**When** le visiteur n'a pas encore scrollé
**Then** un composant ScrollHint (`client:visible`) affiche "scroll to explore" avec un chevron qui pulse en bas du hero
**And** le ScrollHint a `aria-hidden="true"` (purement décoratif)

**Given** le visiteur scrolle de plus de 50px
**When** le scroll est détecté
**Then** le ScrollHint disparaît en fade-out

**Given** le hero est visible
**When** on inspecte le hero
**Then** il n'y a AUCUN CTA dans le hero — le hero fait rêver, pas vendre
**And** le titre a un léger effet parallax au scroll (GSAP, importé depuis `src/lib/gsap.ts`)

### Story 2.3: Section Elena & section Processus

As a visiteur,
I want découvrir qui est Elena et comprendre le processus de création de voyage,
So that je sois rassuré par son expertise terrain et la clarté de son accompagnement.

**Acceptance Criteria:**

**Given** le visiteur scrolle après le hero
**When** la section Elena entre dans le viewport
**Then** la section affiche un fond dark overlay avec la photo d'Elena en cercle (bordure blanche) (FR5)
**And** la photo apparaît en scale-in depuis le centre, le texte de présentation en fade-in 200ms après (via SectionReveal)
**And** le composant `ElenaSection.astro` est statique (0 JS) et accepte les props `imageSrc`, `imageAlt`, `title`, `description`, `ctaHref`
**And** un CTAButton variant `outline` avec `desktopOnly: true` est intégré sous le texte (visible uniquement sur desktop lg:)

**Given** la section Elena est affichée
**When** on inspecte l'accessibilité
**Then** la photo a un alt text descriptif, la structure heading est logique (h2)
**And** le contraste texte clair sur fond dark respecte 4.5:1 (NFR8)

**Given** le visiteur continue de scroller
**When** la section Processus entre dans le viewport
**Then** la section "Du rêve à la réalité" affiche les étapes numérotées sur fond crème (FR7)
**And** les étapes apparaissent une par une au scroll (stagger 150ms via SectionReveal `animation="stagger"`)
**And** chaque étape est un composant `ProcessStep.astro` statique (0 JS) avec les props `number`, `title`, `description`, `icon` (optionnel SVG stroke-only)
**And** les données proviennent de `src/data/processSteps.ts`

**Given** les étapes sont dans une liste
**When** on inspecte le HTML
**Then** les étapes sont dans une `<ol>` avec des `<li>` sémantiques, la numérotation est explicite

### Story 2.4: Destinations — content collections & DestinationBlock

As a visiteur,
I want explorer les destinations par pays dans des blocs visuels immersifs,
So that je voie la spécialisation Amériques d'Elena et que je me projette dans le voyage.

**Acceptance Criteria:**

**Given** le projet est initialisé
**When** on ouvre `web/src/content/config.ts`
**Then** un schema Zod définit la content collection `destinations` avec les champs : `country` (string), `description` (string), `image` (string), `overlayColor` (enum: terracotta | sauge), `order` (number)

**Given** le schema est défini
**When** on inspecte `web/src/content/destinations/`
**Then** 4 fichiers markdown existent : `perou-sacre.md`, `colombie-cafetera.md`, `costa-rica-pura-vida.md`, `patagonie-sauvage.md`
**And** chaque fichier a un frontmatter valide selon le schema Zod

**Given** les content collections existent
**When** la section Destinations est rendue dans `index.astro`
**Then** chaque pays est affiché dans un composant `DestinationBlock.astro` statique (0 JS) — un pays par bloc, jamais groupés (FR6)
**And** chaque bloc occupe ~1 viewport avec photo plein écran + overlay coloré (terracotta ou sauge selon le frontmatter)
**And** le nom du pays et une courte description sont affichés en texte blanc sur l'overlay
**And** les destinations sont triées par le champ `order`

**Given** la section Destinations est visible
**When** le visiteur scrolle
**Then** chaque pays entre en fade-in, l'overlay s'intensifie progressivement de 30% à 55% opacité (via SectionReveal)

**Given** un DestinationBlock a un prop `learnMoreHref`
**When** le bloc est rendu
**Then** un lien "en savoir plus" (CTAButton variant `ghost`) est affiché
**And** si `learnMoreHref` est absent (MVP), aucun lien ne s'affiche

**Given** on inspecte l'accessibilité
**When** un lecteur d'écran lit la section
**Then** chaque image a un alt text descriptif et le contraste texte blanc sur overlay est vérifié ≥ 4.5:1

### Story 2.5: Témoignages & Pricing

As a visiteur,
I want lire des témoignages de clients et consulter le pricing transparent,
So that je sois convaincu par la preuve sociale et rassuré sur le coût.

**Acceptance Criteria:**

**Given** le visiteur scrolle après les destinations
**When** la section Témoignages entre dans le viewport
**Then** des citations clients sont affichées sur fond photo avec overlay ambre (FR8)
**And** chaque citation est un composant `TestimonialCard.astro` statique (0 JS) avec les props `imageSrc`, `quote`, `name`, `tripContext`
**And** les citations apparaissent en fade-in avec léger slide-up (via SectionReveal)
**And** les données proviennent de `src/data/testimonials.ts`
**And** un CTAButton variant `outline` avec `desktopOnly: true` est intégré dans la section (visible uniquement desktop)

**Given** une TestimonialCard est rendue
**When** on inspecte le HTML
**Then** la citation utilise `<blockquote>` et l'attribution utilise `<cite>` (sémantique)

**Given** le visiteur scrolle après les témoignages
**When** la section Pricing entre dans le viewport
**Then** les tarifs sont affichés de manière transparente sur fond crème, lignes claires (FR9)
**And** chaque ligne est un composant `PricingRow.astro` statique (0 JS) avec les props `label`, `price`, `description` (optionnel)
**And** les lignes apparaissent une par une (stagger 100ms via SectionReveal)
**And** les données proviennent de `src/data/pricing.ts`

**Given** la section Pricing est rendue
**When** on inspecte le HTML
**Then** la structure utilise `<dl>` (definition list) pour label/prix

### Story 2.6: Accessibilité transversale & navigation clavier

As a visiteur utilisant un clavier ou un lecteur d'écran,
I want naviguer sur l'intégralité du site sans souris et accéder à tout le contenu via un lecteur d'écran,
So that le site soit utilisable par tous, indépendamment de mes capacités.

**Acceptance Criteria:**

**Given** le visiteur arrive sur la page
**When** il appuie sur Tab pour la première fois
**Then** un lien "Aller au contenu" (skip-to-content) apparaît visuellement, ciblant `#main` (FR21)
**And** le lien est caché visuellement par défaut (`sr-only`) et visible uniquement au focus clavier (`focus:not-sr-only`)

**Given** le visiteur navigue au clavier
**When** il appuie successivement sur Tab
**Then** le focus traverse les éléments interactifs dans l'ordre logique : skip-to-content → footer liens → sections interactives (FR21)
**And** le focus est toujours visible avec un `outline: 2px solid terracotta` + `outline-offset: 4px`
**And** toutes les zones interactives ont un touch target minimum de 44x44px

**Given** le visiteur utilise un lecteur d'écran
**When** il parcourt la page
**Then** chaque section a un heading logique (h1 → h2 → h3), pas de saut de niveau (FR22)
**And** toutes les images ont un attribut `alt` descriptif (pas vide sauf décoratives avec `aria-hidden="true"`)
**And** les éléments interactifs ont des `aria-label` ou `aria-labelledby` appropriés
**And** le HTML utilise les balises sémantiques : `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`

**Given** le site est buildé
**When** on exécute un audit Lighthouse Accessibility
**Then** le score est ≥ 95 (NFR6)
**And** zéro violation axe critical ou serious (NFR7)

**Given** la palette de couleurs est appliquée
**When** on vérifie les contrastes
**Then** toutes les combinaisons texte/fond respectent le ratio 4.5:1 minimum (NFR8)
**And** les combinaisons vérifiées incluent : warm-black/creme (11.2:1), warm-gray/creme (5.3:1), white/terracotta (4.6:1 — AA large)

---

## Epic 3: Conversion & Booking Calendly

Le visiteur peut réserver une discovery call depuis n'importe quel point du site — CTA toujours accessible (sticky mobile + intégrés desktop), modale Calendly intégrée, fallback sans JS.

### Story 3.1: CTAButton & section CTA final

As a visiteur,
I want cliquer sur un bouton d'appel à l'action chaleureux visible dans les sections du site et en fermeture émotionnelle,
So that je puisse réserver une discovery call facilement à tout moment de mon parcours.

**Acceptance Criteria:**

**Given** le projet a les design tokens et BaseLayout (Epic 1)
**When** on ouvre `web/src/components/CTAButton.astro`
**Then** le composant est statique (0 JS) et accepte les props : `text` (default: "Confiez-nous ton prochain rêve"), `subtext` (optionnel, default: "20 min, gratuit, sans engagement"), `href`, `size` (default | small), `variant` (solid | outline | ghost), `desktopOnly` (boolean)
**And** le bouton est un `<a>` sémantique avec `href` pointant vers `PUBLIC_CALENDLY_URL` (progressive enhancement) (FR15)
**And** le bouton porte l'attribut `data-calendly-trigger` pour l'interception JS future par CalendlyModal

**Given** le variant `solid` est utilisé sur fond clair
**When** le bouton est rendu
**Then** le fond est terracotta, le texte est blanc, le border-radius est `round` (24px)
**And** au hover : `box-shadow: 0 8px 32px rgba(192,96,62,0.15)` + `transform: scale(1.02)` — transition 300ms ease-out
**And** à l'état active : fond `terracotta-dark` #a04e30
**And** au focus clavier : `outline: 2px solid terracotta` + `outline-offset: 4px`

**Given** le variant `outline` est utilisé sur fond dark
**When** le bouton est rendu
**Then** le fond est transparent, la bordure est terracotta, le texte est terracotta (ou blanc sur dark)

**Given** le variant `ghost` est utilisé
**When** le bouton est rendu
**Then** le bouton est un lien textuel terracotta sans fond ni bordure

**Given** `desktopOnly: true` est passé en prop
**When** le bouton est rendu sur mobile (< lg)
**Then** le bouton est masqué (`hidden lg:block`)

**Given** le visiteur scrolle après la section pricing
**When** la section CTA final entre dans le viewport
**Then** une section de fermeture émotionnelle est affichée sur fond dark overlay (FR11)
**And** un titre inclusif (non genré) et un CTAButton variant `solid` size `default` sont affichés
**And** le titre et le bouton apparaissent en scale-in (via SectionReveal)
**And** cette section CTA est visible sur mobile ET desktop

### Story 3.2: StickyMobileCTA

As a visiteur mobile,
I want accéder au CTA principal en permanence pendant mon scroll sans qu'il gêne l'immersion,
So that je puisse réserver à tout moment sans chercher le bouton.

**Acceptance Criteria:**

**Given** le visiteur est sur mobile (< lg breakpoint)
**When** il scrolle au-delà du hero (scroll > 100vh)
**Then** une barre sticky apparaît en bas de l'écran avec un bouton terracotta "Confiez-nous ton prochain rêve" (FR10)
**And** la barre a un fond crème semi-transparent + `backdrop-filter: blur`
**And** le composant `StickyMobileCTA.astro` est un island interactif (`client:load`)
**And** le touch target du bouton est ≥ 48px de hauteur
**And** le bouton porte `data-calendly-trigger`

**Given** le sticky CTA est visible
**When** la section CTA finale (Story 3.1) entre dans le viewport
**Then** le sticky CTA se masque pour éviter le doublon

**Given** le sticky CTA s'est masqué
**When** la section CTA finale sort du viewport (scroll remonte ou continue)
**Then** le sticky CTA réapparaît avec un délai de 300ms (évite le flash lors du scroll yoyo)

**Given** le visiteur est sur desktop (≥ lg breakpoint)
**When** la page est affichée
**Then** le sticky CTA n'est pas visible (`display: none` sur desktop)

**Given** le composant est rendu
**When** on inspecte l'accessibilité
**Then** le sticky CTA a `role="complementary"` et un `aria-label` descriptif

**Given** la modale Calendly est ouverte (Epic 3 Story 3.3)
**When** le sticky CTA est visible
**Then** le sticky CTA se masque pendant que la modale est ouverte

### Story 3.3: CalendlyModal — modale de réservation intégrée

As a visiteur,
I want réserver une discovery call dans une modale sans quitter le site et pouvoir fermer la modale pour revenir exactement où j'étais,
So that le processus de réservation soit fluide et sans friction.

**Acceptance Criteria:**

**Given** le visiteur clique sur n'importe quel CTAButton avec `data-calendly-trigger`
**When** JavaScript est activé
**Then** la modale CalendlyModal s'ouvre en slide-up (400ms ease-out) (FR12)
**And** le fond du site est recouvert d'un overlay dark `rgba(44, 40, 37, 0.7)` + `backdrop-filter: blur`
**And** une iframe Calendly est chargée dans la modale avec l'URL `PUBLIC_CALENDLY_URL`
**And** un bouton fermer (X) est positionné en haut à droite, couleur `warm-gray`
**And** le scroll du body est verrouillé pendant l'ouverture de la modale

**Given** la modale est ouverte
**When** le visiteur choisit un créneau dans l'iframe Calendly
**Then** Calendly affiche sa propre confirmation dans l'iframe (FR13)
**And** la modale reste ouverte — le visiteur ferme quand il veut

**Given** la modale est ouverte
**When** le visiteur clique sur le bouton fermer (X) OU appuie sur Escape OU clique sur l'overlay
**Then** la modale se ferme en fade-out (300ms) (FR14)
**And** le scroll du body est restauré
**And** la position de scroll est préservée — le visiteur revient exactement où il était
**And** le focus est restauré sur l'élément qui a ouvert la modale

**Given** la modale est ouverte
**When** le visiteur navigue au clavier
**Then** le focus est piégé dans la modale (focus trap) — Tab et Shift+Tab ne sortent pas de la modale
**And** `aria-modal="true"` et `role="dialog"` sont appliqués
**And** un `aria-label` descriptif est présent sur la modale

**Given** le visiteur est sur mobile
**When** la modale est ouverte
**Then** la modale est full-screen (pas de margin)
**And** le StickyMobileCTA est masqué

**Given** JavaScript est désactivé
**When** le visiteur clique sur un CTAButton
**Then** le lien `<a href>` redirige vers calendly.com normalement — l'utilisateur peut booker (FR15)
**And** le site ne génère aucune erreur visible

**Given** Calendly est indisponible (réseau)
**When** l'iframe ne charge pas après un timeout
**Then** un message "Le service est temporairement indisponible" est affiché dans la modale (NFR13)
**And** l'erreur est loggée avec `console.error('[slow-adventures]', ...)`

**Given** le composant CalendlyModal
**When** on exécute les tests
**Then** `web/src/components/CalendlyModal.test.ts` couvre : ouverture/fermeture, scroll lock, focus trap (NFR20)

---

## Epic 4: Capture Email & Engagement

Le visiteur peut s'inscrire à la newsletter et les visiteurs de retour sont reconnus avec un message chaleureux — filet de sécurité pour les prospects en cycle de décision long.

### Story 4.1: EmailCapture & intégration Brevo

As a visiteur,
I want m'inscrire à la newsletter avec un seul champ email et recevoir un email de bienvenue,
So that je reste connecté à l'aventure Slow Adventures même si je ne suis pas prêt à réserver maintenant.

**Acceptance Criteria:**

**Given** le visiteur scrolle après la section CTA final
**When** la section Email Capture entre dans le viewport
**Then** une section sur fond dark photo overlay est affichée avec un titre positif (ex: "Reste connecté(e) à l'aventure"), un champ email, un bouton submit "Je reste connecté(e)" et un texte RGPD court (FR16)
**And** la formulation est positive — pas de "pas encore prêt(e)" ou formulation négative
**And** le tutoiement est utilisé
**And** un CTAButton (section CTA) est visible juste au-dessus de la section email capture (double objectif)
**And** le composant `EmailCapture.astro` est un island interactif (`client:visible`)

**Given** le formulaire est affiché
**When** on inspecte l'accessibilité
**Then** un `<label>` avec `sr-only` ("Ton adresse email") est associé au champ email
**And** le placeholder est "ton@email.com"
**And** le texte RGPD dit : "En t'inscrivant, tu recevras nos inspirations voyage. Désabonnement en un clic."
**And** le bouton submit a un touch target ≥ 44x44px

**Given** le visiteur entre un email invalide et soumet
**When** la validation côté client s'exécute
**Then** une bordure `terracotta` apparaît sur le champ et un message "Hmm, cette adresse ne semble pas valide" s'affiche sous le champ
**And** le message d'erreur a `aria-live="polite"`

**Given** le visiteur entre un email valide et soumet
**When** la requête est envoyée à l'API Brevo
**Then** le bouton submit est remplacé par un spinner (SVG animé, terracotta) pendant le chargement
**And** `web/src/lib/brevo.ts` envoie un `fetch()` POST vers l'API Brevo avec la clé publique `PUBLIC_BREVO_API_KEY` dans les headers

**Given** l'API Brevo répond avec succès
**When** l'inscription est confirmée
**Then** le champ et le bouton sont remplacés par un message de succès en `sauge` : "Bienvenue dans l'aventure ! Regarde ta boîte mail." (permanent, pas de reset)
**And** le visiteur reçoit un email de bienvenue automatique configuré dans Brevo (FR17)

**Given** l'API Brevo échoue (erreur réseau ou serveur)
**When** la requête échoue
**Then** un message d'erreur inline s'affiche : "Oups, quelque chose n'a pas marché. Réessaie ?" (tutoiement) (NFR14)
**And** l'erreur est loggée : `console.error('[slow-adventures]', error)`
**And** le visiteur peut réessayer

**Given** les séquences Brevo sont configurées
**When** un visiteur est inscrit
**Then** il reçoit une newsletter hebdomadaire automatique le vendredi (FR18)
**And** les séquences (bienvenue + hebdo) sont configurées dans Brevo, pas de dev custom

**Given** le composant EmailCapture
**When** on exécute les tests
**Then** `web/src/components/EmailCapture.test.ts` couvre : validation email, états loading/success/error (NFR20)
**And** `web/src/lib/brevo.test.ts` couvre : appel API mock fetch, gestion erreur

### Story 4.2: Configuration email confirmation Calendly

As a visiteur ayant réservé une discovery call,
I want recevoir un email de confirmation chaleureux,
So that j'aie hâte d'être au call plutôt que de l'oublier ou l'annuler.

**Acceptance Criteria:**

**Given** un visiteur a réservé un créneau via Calendly
**When** la réservation est confirmée
**Then** Calendly envoie automatiquement un email de confirmation (FR19)
**And** l'objet de l'email est configuré dans Calendly : "Parlons de ton prochain rêve" (pas "Confirmation RDV")
**And** le contenu est chaleureux, tutoiement, explique ce qui l'attend au call (faire connaissance, envies, voyages passés)
**And** le message clé est : "c'est un échange, pas un pitch"

**Given** le call est dans 1-2h
**When** le rappel automatique Calendly se déclenche
**Then** le visiteur reçoit un rappel (natif Calendly, pas de dev custom)

**Note :** Cette story est une story de configuration — pas de code custom, uniquement la config Calendly. La documentation de la config est livrée.

### Story 4.3: ReturnVisitorBanner — détection visiteur retour

As a visiteur de retour,
I want être reconnu avec un message chaleureux quand je reviens sur le site,
So that je me sente attendu et que le lien émotionnel soit renforcé.

**Acceptance Criteria:**

**Given** le visiteur arrive sur le site pour la première fois
**When** la page se charge
**Then** un flag `sa_visited: true`, `sa_visit_count: 1` et `sa_first_visit_date` sont stockés dans localStorage
**And** aucun banner n'est affiché

**Given** le visiteur revient sur le site (localStorage `sa_visited: true`)
**When** il scrolle au-delà du hero
**Then** un banner "Content de te revoir" apparaît entre le hero et la section Elena (FR20)
**And** le banner a un fond `creme-dark` semi-transparent, texte en `warm-black`
**And** le banner apparaît en fade-in CSS 400ms
**And** `sa_visit_count` est incrémenté

**Given** le banner est visible
**When** 5 secondes se sont écoulées OU le visiteur clique sur le banner
**Then** le banner disparaît en fade-out 300ms (auto-dismiss)
**And** un flag `sessionStorage` empêche le banner de réapparaître pendant la session

**Given** le composant ReturnVisitorBanner
**When** on inspecte l'accessibilité
**Then** le banner a `role="status"` et `aria-live="polite"`

**Given** le composant ReturnVisitorBanner
**When** on exécute les tests
**Then** `web/src/components/ReturnVisitorBanner.test.ts` couvre : premier visiteur (pas de banner), visiteur retour (banner affiché), auto-dismiss, sessionStorage flag (NFR20)

---

## Epic 5: Analytics, Consentement & Tracking

Le système collecte les données d'engagement après consentement utilisateur, permettant de comprendre le parcours visiteur et de prendre des décisions data-driven.

### Story 5.1: CookieConsent & chargement conditionnel GA4

As a visiteur,
I want être informé de l'utilisation des cookies et pouvoir accepter ou refuser le tracking analytique,
So that ma vie privée soit respectée conformément au RGPD.

**Acceptance Criteria:**

**Given** le visiteur arrive sur le site pour la première fois
**When** la page se charge
**Then** une bannière de consentement cookies apparaît (FR33)
**And** le composant `CookieConsent.astro` est un island interactif (`client:load`)
**And** la bannière est légère (~2kb JS), sans dépendance tierce
**And** le texte explique l'utilisation de cookies analytiques (GA4) avec un lien vers `/politique-confidentialite`
**And** deux boutons sont présents : "Accepter" et "Refuser"

**Given** le visiteur clique sur "Accepter"
**When** le consentement est enregistré
**Then** le choix est stocké dans localStorage
**And** un événement `sa:consent-accepted` (CustomEvent avec `detail: { analytics: true }`) est dispatché sur `document`
**And** la bannière disparaît
**And** le script GA4 est chargé dynamiquement avec le `PUBLIC_GA4_MEASUREMENT_ID`

**Given** le visiteur clique sur "Refuser"
**When** le refus est enregistré
**Then** le choix est stocké dans localStorage
**And** la bannière disparaît
**And** GA4 n'est PAS chargé — le site fonctionne normalement sans tracking (NFR15)
**And** aucune donnée personnelle n'est collectée (NFR11)

**Given** le visiteur revient sur le site
**When** un choix de consentement existe déjà dans localStorage
**Then** la bannière ne réapparaît pas
**And** le comportement GA4 suit le choix précédent (chargé si accepté, ignoré si refusé)

**Given** JavaScript est désactivé
**When** la page se charge
**Then** la bannière ne s'affiche pas et GA4 ne charge pas (privacy by default) (NFR16)

### Story 5.2: Module analytics & événements tracking

As a propriétaire du site (Elena),
I want que les interactions clés des visiteurs soient enregistrées dans Google Analytics après leur consentement,
So that je puisse comprendre le parcours visiteur et optimiser le site.

**Acceptance Criteria:**

**Given** le consentement analytics est accepté (Story 5.1)
**When** on ouvre `web/src/lib/analytics.ts`
**Then** le module exporte des fonctions typées : `trackCTAClick()`, `trackScrollDepth(section: string)`, `trackEmailCapture()`, `trackUTM()`, `trackCalendlyComplete()`
**And** les fonctions encapsulent les appels `gtag()` — aucun composant n'appelle `gtag()` directement
**And** le module écoute l'événement `sa:consent-accepted` pour initialiser GA4

**Given** GA4 n'est pas encore chargé (pas de consentement ou en attente)
**When** un composant appelle une fonction de tracking
**Then** l'événement est silencieusement ignoré (pas de buffer, pas d'erreur) (NFR15)

**Given** GA4 est chargé et le visiteur clique sur un CTAButton
**When** `trackCTAClick()` est appelé
**Then** un événement GA4 personnalisé `cta_click` est envoyé (FR23)

**Given** GA4 est chargé et le visiteur scrolle
**When** chaque section principale entre dans le viewport
**Then** `trackScrollDepth(section)` envoie un événement GA4 `scroll_depth` avec le nom de la section (FR24)

**Given** GA4 est chargé et le visiteur s'inscrit à la newsletter
**When** `trackEmailCapture()` est appelé
**Then** un événement GA4 `email_capture` est envoyé (FR25)

**Given** GA4 est chargé et le visiteur arrive avec des paramètres UTM
**When** la page se charge
**Then** `trackUTM()` extrait les paramètres `utm_source`, `utm_medium`, `utm_campaign` de l'URL et les envoie à GA4 (FR26)

**Given** GA4 est chargé et le visiteur complète une réservation Calendly
**When** `trackCalendlyComplete()` est appelé
**Then** un événement GA4 `calendly_complete` est envoyé (FR27)

**Given** GA4 est indisponible (erreur réseau)
**When** un appel tracking échoue
**Then** l'erreur est silencieuse — pas de message utilisateur, pas de dégradation du site (NFR15)
**And** l'erreur est loggée : `console.warn('[slow-adventures]', ...)`

**Given** le module analytics
**When** on exécute les tests
**Then** `web/src/lib/analytics.test.ts` couvre : initialisation après consentement, chaque fonction de tracking avec mock `gtag()`, comportement sans consentement, gestion d'erreur (NFR20)
