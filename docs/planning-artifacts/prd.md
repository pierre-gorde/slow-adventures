---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments:
  - "docs/planning-artifacts/product-brief-slow-adventures-2026-02-03.md"
  - "docs/brainstorming/brainstorming-session-2026-01-31.md"
  - "docs/planning-artifacts/ux-design-specification.md"
  - "README.md"
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 1
  uxDesign: 1
  projectDocs: 1
classification:
  projectType: web_app
  domain: travel_tourism
  complexity: low
  projectContext: greenfield
workflowType: 'prd'
---

# Product Requirements Document - slow-adventures

**Author:** Elena
**Date:** 2026-02-10

## Executive Summary

**Produit :** Site web one-page mobile-first pour Slow Adventures — service de création de voyages sur mesure aux Amériques.

**Différenciateur :** Elena n'est pas une agence. Elle a vécu sur le terrain, connaît les guides, les cafés cachés, les villages hors des sentiers battus. Le site est le pont de confiance entre Instagram et la discovery call.

**Cible principale :** Camille (80% du contenu) — voyageuse expérimentée, 30-40 ans, qui n'a plus le temps d'organiser mais refuse le tourisme classique. Personas secondaires : Antoine (rêveur bloqué par la logistique), Nathalie (cycle long, besoin de réassurance).

**Funnel :** Instagram → Site → CTA (discovery call Calendly) ou Email capture (nurturing Brevo) → Discovery call → Client.

**Stack :** Astro SSG + TypeScript + Tailwind CSS + GSAP — site statique, 0 serveur, 0 base de données, hébergé sur Netlify.

**Équipe :** Elena (contenu, vision) + Pierre (développement).

## Success Criteria

### Succès Utilisateur

**Le moment de vérité :** Un prospect mentionne le site spontanément en discovery call — preuve que le site a laissé une empreinte émotionnelle et fait son travail de pont de confiance.

**Métriques d'engagement site :**

| Métrique | Cible | Outil |
|----------|-------|-------|
| Taux de rebond | < 50% (alerte si > 70%) | Google Analytics |
| Temps moyen sur site | > 2 min | Google Analytics |
| Pages/session | > 3 | Google Analytics |
| Scroll depth page About | > 70% | GA / Hotjar |
| Visiteurs récurrents | > 20% du trafic | Google Analytics |

**Métriques de conversion :**

| Métrique | Cible |
|----------|-------|
| Taux de clic CTA principal | > 5% des visiteurs |
| Taux de complétion Calendly (clic CTA → créneau réservé) | > 50% |

**Critère émotionnel :** Le parcours Insta → Site → CTA → Calendly fonctionne sans friction. Zéro "trou noir pré-contact" — chaque visiteur qui hésite est capturé via email (filet de sécurité Brevo).

### Succès Business

| Métrique | 3 mois | 12 mois |
|----------|--------|---------|
| Discovery calls/mois | 2 | 6-8 |
| Taux conversion call → client | 30% | 40-50% |
| Clients B2C/mois | 0-1 | 1-3 |
| CA B2C mensuel | 0-300€ | 300-900€ |
| Témoignages récoltés | 1 | 8+ |
| Partenaires DMC actifs | 1-2 contacts | 3-5 par pays clé |

**Ratio clé :** Discovery calls → Clients. 0 conversion sur 10 calls = problème d'offre/call. 0 calls = problème de visibilité/contenu.

**Seuil ultime :** 2 000€ net/mois (quitter Marco Vasco) — horizon 18-24 mois, pas un objectif MVP.

**Signaux de pivot :**

| Signal d'alerte | Délai | Action |
|----------------|-------|--------|
| 0 discovery call en 3 mois | Mois 3 | Revoir contenu Insta, CTA, ou cible |
| Calls mais 0 conversion en 3 mois | Mois 3 | Revoir script d'appel, pricing, proposition |
| 0 client après 6 mois | Mois 6 | Pivot sérieux — tester autre canal, revoir positionnement |
| Taux de rebond > 70% | Permanent | Site ne rassure pas — revoir design/contenu |

### Succès Technique

Lighthouse Performance 90+, Accessibility 95+, LCP < 2.5s, CLS < 0.1, 0 violations axe critical/serious. Détails complets dans la section *Exigences Techniques Web App > Cibles de Performance*.

### Mesures Concrètes

- **Go/No-Go post-MVP :** 3+ discovery calls en 3 mois → ajouter blog + SEO. 0 call en 3 mois → investiguer avant d'investir plus
- **Signal le plus dangereux :** Visites sans clic CTA = le site intéresse mais ne convainc pas
- **Signal de succès :** Un prospect dit en discovery call "j'ai vu ton site" → le pont de confiance fonctionne

## Product Scope & Roadmap

### Stratégie MVP

**Type : Experience MVP** — Le minimum pour créer l'empreinte émotionnelle qui déclenche la discovery call. Outil de conversion fonctionnel dès le jour 1.

**Philosophie :** Le site n'a qu'un seul job — transformer un visiteur Instagram en discovery call (ou au minimum en email capturé). Si ça ne contribue pas à la conversion, ça sort du MVP.

**Ressources :**
- Équipe : Elena (contenu, vision, validation) + Pierre (développement)
- Timeline : dès que Pierre est disponible — scope volontairement serré
- Contenu requis avant dev : photos/vidéos destinations, textes sections, compte Calendly configuré, compte Brevo configuré

### MVP — Sections du site

1. Hero section — vidéo immersive plein écran + parallax + tagline + "scroll to explore"
2. Section Elena — storytelling anti-doute, photo cercle, fond dark
3. Section Destinations — un pays par bloc, full immersif, overlay coloré
4. Section Processus — "Du rêve à la réalité", étapes numérotées
5. Section Témoignages — citations sur fond photo overlay ambre
6. Section Pricing — transparent, lignes claires
7. Section CTA Final — fermeture émotionnelle
8. Section Email Capture — Brevo, double objectif CTA + newsletter
9. Footer minimal — mentions légales, RGPD, contact

### MVP — Must-Have Capabilities

| Capability | Pourquoi c'est indispensable |
|------------|------------------------------|
| Hero vidéo immersif | Première impression = continuité Instagram → site. Sans ça, taux de rebond élevé |
| Section Elena (authenticité) | Résout le doute n°1 de tous les personas. Sans ça, pas de confiance |
| Blocs destination par pays | Prouve la spécialisation. Sans ça, Antoine ne clique pas |
| Pricing transparent | Lève l'objection prix. Sans ça, hésitation prolongée |
| CTA sticky mobile + modale Calendly | Le mécanisme de conversion lui-même. Sans ça, 0 discovery call |
| Email capture Brevo | Filet de sécurité pour Nathalie et les visiteurs qui partent. Sans ça, perte définitive |
| Séquence email nurturing | Relance automatique des leads tièdes. Sans ça, Nathalie ne revient jamais |
| Détection visiteur retour | Micro-moment émotionnel pour Nathalie. Faible coût technique (localStorage), fort impact |
| Google Analytics + scroll depth | Seul moyen de comprendre où le site perd les visiteurs. Sans ça, on pilote à l'aveugle |
| SEO de base | Meta, Schema.org, sitemap — investissement minimal pour ne pas handicaper le référencement futur |
| Animations scroll GSAP | Fade-in, stagger, parallax — continuité avec l'univers visuel Instagram |
| Accessibilité WCAG 2.1 AA | Audience large, obligation légale, qualité technique |

**Ce qui peut être manuel au lancement :**
- Email confirmation post-booking → géré par Calendly nativement (pas de dev custom)
- Contenu site → hardcodé dans Astro (pas de CMS), Elena fournit les textes, Pierre intègre

### Post-MVP (Phase 2 — Growth)

**Déclencheur :** 3+ discovery calls en 3 mois (Go du Go/No-Go)

| Feature | Condition de démarrage |
|---------|----------------------|
| Pages destination par pays | Quand le SEO organique devient un levier |
| Blog / contenu éditorial | Quand il y a des sujets basés sur les discovery calls réelles |
| SEO avancé | Quand le trafic Instagram atteint son plafond |
| Newsletter contenu régulier | Quand la liste email justifie l'effort (50+ abonnés) |

### Expansion (Phase 3 — Vision)

**Déclencheur :** Premier client B2C parti en voyage + revenus récurrents

| Feature | Condition de démarrage |
|---------|----------------------|
| Page B2B "Entreprises" | UNIQUEMENT après premier client B2C satisfait |
| Guides téléchargeables par pays | Quand le contenu existe et la liste email est substantielle |
| Intégration avis Google + vidéo | Quand il y a assez de témoignages (8+) |
| Multi-langue | Si expansion hors francophone |
| App mobile roadbook digital | Long terme |

### Stratégie de Mitigation des Risques

**Risque technique — Vidéo hero sur mobile iOS :**
- Impact : LCP dégradé, expérience cassée si autoplay échoue
- Mitigation : poster image haute qualité chargé immédiatement, vidéo en lazy load. Attributs `autoplay muted playsinline` obligatoires iOS. Test Safari iOS prioritaire dans la QA

**Risque marché — Dépendance Instagram comme canal unique :**
- Impact : si l'algo Instagram change ou le reach baisse, le trafic vers le site s'effondre
- Mitigation : email capture (audience owned) + SEO de base (canal alternatif). Le MVP intègre déjà les deux filets

**Risque marché — Marque personnelle = point de défaillance unique :**
- Impact : Elena est le produit. Si indisponible, 0 discovery call
- Mitigation : le site et le nurturing travaillent en asynchrone — le pipeline se remplit même sans Elena

**Risque contenu — Dépendance aux assets visuels :**
- Impact : pas de photos/vidéos = pas de site émotionnel
- Mitigation : Elena fournit les assets avant le dev. Fallback : images stock haute qualité, remplacées progressivement par du contenu original

## User Journeys

**Focus contenu : Camille à 80%** — le site est écrit pour Camille en priorité. Antoine et Nathalie bénéficient de la même structure avec des lectures émotionnelles différentes.

### Mapping Section ↔ Doute par Persona

| Section du site | Camille ("Elle va comprendre ?") | Antoine ("Elle connaît vraiment ?") | Nathalie ("C'est safe ?") |
|----------------|--------------------------------|-------------------------------------|--------------------------|
| **Elena** | Ton personnalisé, "tout est possible" — elle comprend les voyageurs exigeants | Expertise terrain, "j'ai vécu là-bas" | Professionnalisme + empathie, bienveillance |
| **Destinations** | Spots hors sentiers battus — pas du tourisme classique | Spécialisation pays visible, partenaires locaux | Pays présentés avec confiance, pas de liste effrayante |
| **Processus** | Zéro prise de tête, Elena gère tout | Process structuré et pro = sérieux | Étapes claires = cadre rassurant |
| **Pricing** | Transparent = pas de piège | "300€ c'est pas cher, c'est quoi le risque ?" | Pas de mauvaise surprise financière |
| **CTA** | "20 min, gratuit, sans engagement" = faible coût psychologique | Idem | Idem + "on fait connaissance" = pas un pitch |

### Journey 1 : Camille — "La DIY fatiguée qui trouve sa personne" (Happy Path)

**Qui :** Camille, 34 ans, cadre marketing, en couple. 12+ pays en autonomie. Plus le temps d'organiser mais veut la même qualité. Son doute : "Est-ce qu'elle va comprendre ce qu'ON aime ? On n'est pas des touristes classiques."

**Scène d'ouverture :** Jeudi soir, Camille scrolle Instagram en mode pilote automatique. Une Story partagée par une amie montre un coucher de soleil sur le Salar d'Uyuni avec le logo Slow Adventures. Elle tape le profil, scrolle 3-4 posts, voit le lien en bio.

**Montée :** Elle atterrit sur le site. La vidéo hero la saisit — continuité visuelle avec l'univers Instagram. Elle scrolle naturellement. La section Elena lui montre une vraie personne, passionnée, pas un logo corporate. Les destinations défilent — des spots qu'elle ne connaissait pas. Le pricing est transparent : "à partir de 300€". Elle se dit "c'est pas cher pour ne plus se prendre la tête".

**Moment critique :** Le CTA sticky en bas de son écran dit "Confiez-nous ton prochain rêve — 20 min, gratuit, sans engagement". Elle hésite une seconde. Puis clique. La modale Calendly s'ouvre. 3 taps : créneau choisi.

**Résolution :** Email de confirmation : "Parlons de ton prochain rêve". Ton chaleureux, pas transactionnel. Camille montre le site à son conjoint le soir même. Discovery call : Elena pose les bonnes questions, comprend immédiatement qu'ils ne sont "pas des touristes classiques". Camille raccroche et dit à son conjoint : "C'est elle."

**Capabilities révélées :** Hero vidéo immersif, scroll storytelling, CTA sticky mobile, modale Calendly embed, email confirmation automatique.

### Journey 2 : Nathalie — "Le rêve qui mûrit en silence" (Edge Case — Cycle long)

**Qui :** Nathalie, 41 ans, avocate, récemment séparée. N'a jamais organisé un voyage seule. Son doute : "Partir seule en Amérique latine, c'est safe ? Est-ce qu'Elena va comprendre que ce voyage c'est pas juste des vacances ?"

**Scène d'ouverture :** Nathalie tombe sur le site via un post LinkedIn partagé par une connaissance. Elle scrolle le site entier. Tout résonne — le ton chaleureux, la transparence, la passion d'Elena. Mais elle ne clique pas. Elle referme l'onglet.

**Montée :** Pendant 10 jours, le site lui revient en tête. Elle y repense sous la douche, en marchant au palais de justice. Un vendredi soir, elle retourne sur le site. Le bandeau discret "Content de te revoir" la surprend — comme si Elena l'avait attendue. Elle scrolle jusqu'à la section email capture. Formulation positive : "Reste connecté(e) à l'aventure". Elle entre son email.

**Pivot :** Le vendredi suivant, newsletter #1 arrive — une photo du Canyon de Colca avec une micro-histoire d'Elena. Nathalie clique le lien, revient sur le site. La semaine d'après, newsletter #2 — focus Colombie, conseils pratiques. Le rêve s'installe.

**Moment critique :** Newsletter #3 — un témoignage client. Nathalie montre le site à sa meilleure amie (validation sociale). L'amie dit "fonce". Nathalie clique le CTA.

**Résolution :** Discovery call. Elena sent que ce voyage a du sens au-delà des vacances. Elle ne pousse pas, elle écoute. Nathalie pleure un peu. Elle réserve.

**Capabilities révélées :** Détection visiteur retour (localStorage), email capture Brevo, séquence nurturing automatique (bienvenue + hebdo vendredi), retour sur site via newsletter.

### Journey 3 : Antoine — "Le rêveur qui franchit le cap" (Variante expertise)

**Qui :** Antoine, 29 ans, consultant, en couple. Europe et Asie classique mais jamais les Amériques. Rêve de Colombie mais bloqué par la langue, la sécurité, la logistique. Son doute : "Est-ce qu'elle connaît VRAIMENT ce pays ?"

**Scène d'ouverture :** Antoine voit un Reel Instagram de Slow Adventures sur la Colombie — des spots hors des sentiers battus, des marchés locaux, un village qu'il n'a jamais vu sur aucun blog. Il tape le lien en bio.

**Montée :** Sur le site, il scrolle directement vers les destinations. Le bloc Colombie l'arrête — photo immersive, overlay terracotta, une phrase qui évoque l'ambiance. Il remonte vers la section Elena : elle a VÉCU là-bas. Pas une commerciale qui revend des packages, une passionnée qui connaît le terrain. Les partenaires locaux sont mentionnés.

**Moment critique :** Antoine hésite sur le pricing — "300€ c'est pas cher, c'est sérieux ?". La section pricing est transparente : process en 3 étapes, pas de surprise. Il se dit "pour 300€ je risque quoi ?". Il clique le CTA.

**Résolution :** Discovery call. Elena mentionne un guide francophone qu'elle connaît à Medellín et un café caché à Bogotá. Antoine comprend : elle ne google pas les réponses, elle les connaît. Il rentre chez lui, dit à sa copine "on part en Colombie".

**Capabilities révélées :** Blocs destination par pays (spécialisation visible), section Elena (expertise terrain), pricing transparent, CTA basse friction.

### Journey 4 : Post-CTA — "Du clic au rêve concret" (Tous personas)

**Qui :** Tout visiteur ayant cliqué "Confiez-nous ton prochain rêve".

**Scène d'ouverture :** Clic sur le CTA. La modale Calendly s'ouvre par-dessus le site (slide-up, fond flou). Le visiteur choisit un créneau de 20 min en 2-3 taps.

**Confirmation :** Email automatique immédiat — objet "Parlons de ton prochain rêve" (pas "Confirmation RDV"). Ton chaleureux : ce qui l'attend au call (faire connaissance, ses envies, ses voyages passés), rassurance ("c'est un échange, pas un pitch"). Photo Elena dans l'email.

**Rappel :** 1-2h avant le call, rappel automatique Calendly.

**Discovery call :** 20 min. Elena pose les bonnes questions, écoute, montre son expertise sans tout révéler — la "carotte" qui donne envie d'aller plus loin.

**Post-call :** Email manuel d'Elena — récap personnalisé du cahier des charges (ce que le client a dit, ses envies, ses contraintes). Le client voit que tout a été retenu. Si hésitation : relance douce 48-72h.

**Résolution :** Envoi proposition itinéraire + devis → acompte 100€ → lancement création voyage.

**Capabilities révélées :** Modale Calendly (embed, scroll lock, fallback sans JS), email confirmation automatique (Brevo/Calendly webhook), intégration Calendly rappels.

### Journey 5 : "Le visiteur qui part" (Non-conversion)

**Qui :** Un visiteur quelconque arrivé depuis Instagram. Scrolle 2-3 sections, ne clique ni le CTA ni l'email capture.

**Scène :** Il atterrit sur le hero, scrolle vers Elena, peut-être les destinations. Ça l'intéresse mais pas assez pour agir. Pas de doute précis — juste pas le bon moment. Il ferme l'onglet.

**Ce qui se passe :** Le site n'a aucun moyen de le recontacter — pas d'email capturé, pas de compte. Il est perdu pour le site.

**Mécanismes de rattrapage (hors site) :**
- **Instagram** = retargeting organique. Elena publie régulièrement. Si le visiteur suit déjà le compte SA, le contenu continue de nourrir le rêve dans son feed
- **Bouche-à-oreille** — l'empreinte émotionnelle persiste. Si une amie parle de voyage, il pourrait dire "j'ai vu un truc cool"
- **Google** — si le SEO fonctionne, il pourrait revenir via une recherche "voyage Colombie slow travel"

**Ce que ça implique pour le produit :**
- L'email capture est le dernier filet avant la perte définitive — son positionnement et sa formulation doivent maximiser la capture
- Le contenu Instagram est le vrai moteur de rattrapage — le site ne peut pas tout faire seul
- Le tracking GA (scroll depth, sections vues avant départ) identifie où le site perd les visiteurs

**Capabilities révélées :** Google Analytics scroll depth tracking, email capture positionnée stratégiquement, SEO de base pour retour organique.

### Journey Requirements Summary

| Capability | Journeys concernés | Priorité |
|------------|-------------------|----------|
| Hero vidéo immersif + scroll storytelling | Camille, Antoine, Nathalie | MVP Core |
| CTA sticky mobile + modale Calendly | Tous | MVP Core |
| Blocs destination par pays | Antoine, Camille | MVP Core |
| Section Elena (authenticité + expertise) | Tous | MVP Core |
| Pricing transparent | Antoine, Camille | MVP Core |
| Email capture Brevo | Nathalie, Non-conversion | MVP Core |
| Détection visiteur retour (localStorage) | Nathalie | MVP |
| Séquence email nurturing (Brevo) | Nathalie | MVP |
| Email confirmation post-booking | Tous (post-CTA) | MVP |
| Google Analytics + scroll depth tracking | Non-conversion, Tous | MVP |
| Back-office contenu (Elena admin) | — | Post-MVP |
| Pages destination détaillées par pays | Antoine (approfondissement) | Post-MVP |

## Exigences Techniques Web App

### Architecture

**Stack technique :**

| Couche | Technologie | Justification |
|--------|------------|---------------|
| Framework | Astro SSG | Pages statiques ultra-rapides, islands architecture pour interactivité ciblée |
| Langage | TypeScript | Type safety, maintenabilité, DX |
| Styles | Tailwind CSS | Design tokens personnalisés, utility-first, purge CSS automatique |
| Animations | GSAP + ScrollTrigger | Animations scroll performantes, parallax, stagger — budget JS maîtrisé |
| Hébergement | Netlify | Déploiement statique, CDN global, preview deploys |

**Approche :** Site statique (SSG) — pas de serveur, pas de base de données. Les intégrations tierces (Calendly, Brevo, GA) fonctionnent via embed/API côté client. Architecture islands : 7 composants statiques (Astro) + 6 îlots interactifs (scripts hydratés).

### Matrice Navigateurs

| Navigateur | Version min | Priorité | Notes |
|-----------|-------------|----------|-------|
| Safari iOS | 15+ | Critique | 80%+ du trafic via Instagram Stories |
| Chrome Mobile | Dernières 2 versions | Haute | Android, trafic secondaire |
| Chrome Desktop | Dernières 2 versions | Moyenne | Consultation desktop secondaire |
| Firefox | Dernières 2 versions | Basse | Support standard |
| Edge | Dernières 2 versions | Basse | Support standard |
| Safari Desktop | 15+ | Moyenne | macOS, cohérence écosystème Apple |

**Pas de support :** IE11, navigateurs legacy. Dégradation gracieuse pour navigateurs sans JS (contenu lisible, CTA lien direct Calendly).

### Design Responsive

**Approche mobile-first** — le site est conçu pour mobile d'abord, puis enrichi pour les écrans plus larges.

| Breakpoint | Taille | Cible |
|-----------|--------|-------|
| sm (défaut) | < 768px | Mobile — expérience principale |
| md | 768-1024px | Tablette — layout adapté |
| lg | > 1024px | Desktop — layout enrichi |

**Adaptations clés par breakpoint :**
- **Mobile :** CTA sticky en bas (zone du pouce), navigation scroll, hero vidéo plein écran, sections empilées
- **Tablette :** Grille 2 colonnes pour destinations, CTA sticky maintenu, marges élargies
- **Desktop :** Grille 3 colonnes pour destinations, CTA dans le header, hero avec parallax horizontal, sections avec plus d'espace

### Cibles de Performance

| Métrique | Cible | Outil de mesure |
|----------|-------|-----------------|
| Lighthouse Performance | 90+ | Lighthouse CI |
| LCP (Largest Contentful Paint) | < 2.5s | Web Vitals |
| FID (First Input Delay) | < 100ms | Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Web Vitals |
| Temps de chargement total | < 2s | Lighthouse |
| Budget JS (gzippé) | ~20kb | Bundle analyzer |
| Budget CSS (gzippé) | ~10kb | Bundle analyzer |
| Budget images hero | < 200kb (WebP/AVIF) | ImageOptim |

**Stratégie performance :**
- Astro SSG = zéro JS par défaut, hydratation sélective des îlots
- Images : formats modernes (WebP/AVIF), lazy loading, srcset responsive
- Fonts : 2 familles max (Lora + Plus Jakarta Sans), preload, font-display: swap
- Vidéo hero : poster image immédiat, chargement vidéo différé, autoplay muted playsinline
- Anti-FOUC : contenu visible par défaut en CSS, GSAP applique les animations après hydratation (pas d'opacity: 0 initial en HTML)
- Cache CDN : assets hashés avec `Cache-Control: immutable`, HTML avec `max-age` court + revalidation

### Stratégie SEO

**SEO de base (MVP) :**
- Meta tags (title, description, og:image) par section
- Schema.org : LocalBusiness + TravelAgency
- Sitemap XML automatique (Astro)
- Robots.txt configuré
- URLs propres et canoniques
- Alt text sur toutes les images
- Balises sémantiques HTML5 (header, main, section, footer)

**SEO avancé (Post-MVP) :**
- Pages destination par pays (contenu indexable par pays)
- Blog / contenu éditorial (mots-clés longue traîne)
- Backlinks, annuaires voyage, articles invités

### Accessibilité

**Niveau cible : WCAG 2.1 AA**

| Critère | Implémentation |
|---------|---------------|
| Navigation clavier | Tab order logique hero → footer, focus visible |
| Lecteur d'écran | ARIA labels, rôles sémantiques, alt text |
| Contrastes | Ratio 4.5:1 minimum (vérifié sur palette terracotta/crème/bleu) |
| Animations | Respect prefers-reduced-motion, pause/stop possible |
| Formulaires | Labels explicites, messages d'erreur accessibles |
| Vidéo | Hero muette (ambiance visuelle) — aria-label descriptif, poster image |
| Touch targets | Minimum 44x44px pour toutes les zones interactives (CTA, liens, boutons) |
| Tests | 0 violations axe critical/serious, navigation clavier complète |

### Intégrations Tierces

| Service | Usage | Méthode d'intégration |
|---------|-------|----------------------|
| Calendly | Prise de RDV discovery call | Embed iframe dans modale (popup API), fallback lien direct |
| Brevo | Email capture + nurturing | API formulaire, webhook confirmation, séquences automatiques |
| Google Analytics 4 | Tracking engagement + conversion | Script GA4, événements personnalisés (CTA clic, scroll depth, email capture) |
| Google Fonts | Typographies Lora + Plus Jakarta Sans | Preload + font-display: swap |
| Netlify | Hébergement + CDN | Déploiement automatique depuis Git, headers cache configurables |

## Functional Requirements

### Expérience Immersive & Storytelling

- **FR1:** Le visiteur peut visionner une vidéo hero immersive en arrivant sur le site
- **FR2:** Le visiteur voit un contenu visuel immédiat pendant le chargement de la vidéo hero
- **FR3:** Le visiteur peut scroller à travers les sections du site avec des animations de transition
- **FR4:** Le visiteur ayant activé la préférence de mouvement réduit peut naviguer sur le site sans animations
- **FR5:** Le visiteur peut découvrir l'histoire et l'expertise d'Elena dans une section dédiée
- **FR6:** Le visiteur peut explorer les destinations par pays dans des blocs visuels immersifs
- **FR7:** Le visiteur peut consulter le processus de création de voyage étape par étape
- **FR8:** Le visiteur peut lire des témoignages de clients précédents
- **FR9:** Le visiteur peut consulter le pricing de manière transparente

### Conversion & Prise de Contact

- **FR10:** Le visiteur peut accéder au CTA principal depuis n'importe quel point du site (sticky mobile)
- **FR11:** Le visiteur peut accéder à la prise de rendez-vous depuis une section de fermeture émotionnelle en fin de parcours
- **FR12:** Le visiteur peut réserver une discovery call via une modale intégrée sans quitter le site
- **FR13:** Le visiteur peut choisir un créneau horaire pour sa discovery call
- **FR14:** Le visiteur peut fermer la modale de réservation et revenir au site
- **FR15:** Le visiteur peut accéder au booking Calendly même sans JavaScript activé (fallback lien direct)

### Capture & Nurturing Email

- **FR16:** Le visiteur peut s'inscrire à la newsletter via un formulaire email
- **FR17:** Le visiteur inscrit reçoit un email de bienvenue automatique *(config Brevo, pas de dev custom)*
- **FR18:** Le visiteur inscrit reçoit une newsletter hebdomadaire automatique *(config Brevo, pas de dev custom)*
- **FR19:** Le visiteur ayant réservé une discovery call reçoit un email de confirmation automatique *(natif Calendly, pas de dev custom)*

### Engagement & Rétention

- **FR20:** Le visiteur de retour est reconnu et reçoit un message de bienvenue personnalisé
- **FR21:** Le visiteur peut utiliser le site entièrement au clavier
- **FR22:** Le visiteur utilisant un lecteur d'écran peut accéder à tout le contenu

### Tracking & Analytics

- **FR23:** Le système enregistre les clics sur le CTA principal
- **FR24:** Le système enregistre la profondeur de scroll par section
- **FR25:** Le système enregistre les inscriptions email
- **FR26:** Le système enregistre les paramètres UTM des visiteurs
- **FR27:** Le système enregistre les réservations Calendly complétées

### SEO & Découvrabilité

- **FR28:** Les moteurs de recherche peuvent indexer le contenu du site avec des métadonnées structurées
- **FR29:** Les réseaux sociaux affichent un aperçu riche lors du partage du lien du site
- **FR30:** Le site génère automatiquement un sitemap

### Conformité & Légal

- **FR31:** Le visiteur peut accéder aux mentions légales
- **FR32:** Le visiteur peut consulter la politique de confidentialité (RGPD)
- **FR33:** Le visiteur est informé de l'utilisation des cookies et peut les accepter/refuser
- **FR34:** Le visiteur peut accéder aux coordonnées de contact d'Elena depuis le footer

## Non-Functional Requirements

### Performance

- **NFR1:** Le LCP est inférieur à 2.5 secondes sur une connexion 4G mobile (Safari iOS)
- **NFR2:** Le CLS reste inférieur à 0.1 pendant toute la navigation
- **NFR3:** Les animations scroll ne provoquent pas de jank visible sur les appareils cibles *(test : validation manuelle iPhone réel + Chrome DevTools Performance)*
- **NFR4:** Le site est navigable de manière fluide sur mobile, tablette et desktop
- **NFR5:** Chaque image de section (hors hero) pèse moins de 100kb en format WebP/AVIF

### Accessibilité

- **NFR6:** Le site atteint un score Lighthouse Accessibility de 95+
- **NFR7:** Zéro violation axe critical ou serious
- **NFR8:** Les contrastes de couleur respectent le ratio 4.5:1 minimum sur toute la palette
- **NFR9:** Les animations respectent la préférence `prefers-reduced-motion` du système

### Sécurité & Confidentialité

- **NFR10:** Toutes les connexions utilisent HTTPS
- **NFR11:** Les emails collectés sont traités conformément au RGPD
- **NFR12:** Aucune donnée personnelle n'est stockée sur l'infrastructure Netlify — les emails sont envoyés directement à l'API Brevo côté client

### Résilience des Intégrations

- **NFR13:** Si Calendly est indisponible, le visiteur peut accéder à un lien direct de fallback *(test : DevTools Network blocking du domaine Calendly)*
- **NFR14:** Si Brevo est indisponible, le formulaire email affiche un message d'erreur clair *(test : DevTools Network blocking du domaine Brevo)*
- **NFR15:** Si Google Analytics est indisponible, le site fonctionne normalement sans dégradation *(test : DevTools Network blocking GA)*
- **NFR16:** Le contenu du site reste accessible même sans JavaScript (dégradation gracieuse)

### Maintenabilité

- **NFR17:** Le contenu textuel et les images sont isolés dans des fichiers dédiés, permettant une modification sans toucher à la logique des composants
- **NFR18:** Le code respecte TypeScript strict mode et les règles ESLint du projet sans erreur ni warning
- **NFR19:** Le build Netlify se complète en moins de 2 minutes
- **NFR20:** Les composants interactifs (îlots) ont une couverture de test couvrant les comportements critiques (CTA, modale Calendly, formulaire Brevo, détection retour visiteur)
