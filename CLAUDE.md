# Slow Adventures

## Métier

Site vitrine de Slow Adventures (slowadventures.fr), activité de slow travel portée par Elena. Le site vend des circuits en Amérique du Nord (parcs nationaux US, Rocheuses canadiennes) via une demande de devis ; réservations, paiement et assistance sont gérés par une agence de voyage partenaire. Public : particuliers, trafic surtout mobile venant d'Instagram.
Le site comprend aussi des pages destinations (SEO), une page philosophie, une inscription newsletter Brevo, un rapport analytics hebdo envoyé par email et des pages privées de brief client (`/projet/*`).

## Stack

Monorepo, une seule partie active : `web/`.

- `web/` : Astro 5 (pages statiques + adapter `@astrojs/netlify` pour les routes serveur), TypeScript strict (`astro/tsconfigs/strict`), Tailwind CSS v4 via `@tailwindcss/vite` (config CSS-only dans `@theme`, pas de `tailwind.config`), GSAP 3 + ScrollTrigger, `marked`, `@astrojs/sitemap`, `astro-robots-txt`. Aucun framework UI (pas de React/Vue) : le JS client est dans des `<script>` des composants `.astro`.
- Qualité : ESLint 9 flat config (`typescript-eslint` strict, `eslint-plugin-astro`), Prettier 3 + `prettier-plugin-astro`, Vitest 3 (jsdom).
- `web/scripts/weekly-report/` : script Node sans dépendance npm, TypeScript exécuté nativement (imports avec extension `.ts`), GA4 Data API + API Brevo.
- `api/` : aucun backend, uniquement des types Astro générés (`api/.astro/`).

## Commandes

Gestionnaire : npm (`web/package-lock.json`). Pas de `package.json` à la racine : tout se lance depuis `web/`.

```bash
cd web
npm ci                  # install (CI) ; npm install en local
npm run dev             # astro dev (localhost:4321)
npm run build           # astro build -> dist/
npm run preview         # preview du build
npm run lint            # eslint . && prettier --check .
npm run format          # prettier --write .
npm run test            # vitest run (inclut un build complet, voir Pièges)
npm run report:sample   # aperçu HTML du rapport hebdo, données factices, sans réseau
npm run report:dry-run  # rapport avec vraies données GA4, sans envoi (lit .env)
npm run report:weekly   # envoi réel du rapport (lit .env)
```

Pas de base de données ni de migrations. Les scripts `report:*` demandent Node >= 22.9 en local.

## Architecture

- `web/src/pages/` : routes.
  - `index.astro` : accueil.
  - `circuits/` : liste + `[slug].astro`, générés depuis `src/data/circuits.ts`.
  - `destinations/[slug].astro` : fiches pays (content collection), gardées pour le SEO ; `/destinations` redirige vers `/circuits/` (`astro.config.mjs`).
  - `philosophie.astro`, `mentions-legales.astro`, `politique-confidentialite.astro`.
  - `decouvrir.astro` : landing autonome (son propre `<head>`), noindex, exclue du sitemap.
  - `api/subscribe.ts` : route serveur d'inscription newsletter Brevo.
  - `projet/` : briefs clients privés protégés par mot de passe (voir `projet/README.md`).
- `web/src/components/` : composants Astro à plat, PascalCase.
- `web/src/layouts/BaseLayout.astro` : head SEO (OG, canonical, JSON-LD), TopBar, Footer, CookieConsent, analytics en prod.
- `web/src/data/` : données TS (circuits, FAQ, étapes, contact, projets clients). `contact.ts` centralise Calendly, WhatsApp, email.
- `web/src/content/destinations/` : fiches Markdown, schéma zod dans `src/content/config.ts` ; `draft: true` = page non générée.
- `web/src/lib/` : `gsap.ts` (point d'import unique GSAP), `analytics.ts` (events GA4), `brevo.ts` (client de `/api/subscribe`).
- `web/src/styles/global.css` : tokens `@theme` (couleurs, fonts, radius) et classes custom `sa-*`.
- `web/public/` : vidéos, favicons, `__forms.html` (déclaration Netlify Forms).
- `web/tests/` : tests Vitest, arborescence miroir de `src/` et `scripts/`.
- `web/scripts/weekly-report/` : rapport GA4 hebdo par email (README dédié).
- `docs/` : documentation projet (brainstorming, product brief, PRD, architecture, UX, stories).
- `assets/` (racine) : images sources non optimisées ; `/assets/` est dans `.gitignore`.

## Workflow git

- Branche principale et cible des PR : `main` (les 10 dernières PR mergées visent toutes `main`).
- Branches observées : `claude/<sujet-kebab>` pour les PR mergées, `fix/<sujet-kebab>` pour la PR ouverte.
- Titres de PR en français : gitmoji, puis zone du site, deux-points, description (ex. `<gitmoji> Accueil : masquer la présentation d'Elena`).
- Scopes de commit utilisés : `home`, `circuits`, `analytics`, `ci`, `projet`, `seo`.
- Tout push sur `main` qui touche `web/**` part en production.

## Environnements et déploiement

- Hébergement Netlify, une seule prod (slowadventures.fr). Pas de staging ; les PR ont une deploy preview Netlify.
- `.github/workflows/deploy.yml` : push sur `main` (paths `web/**` ou le workflow), Node 20, `npm ci`, lint, test, build, puis `netlify-cli deploy --prod`. Secrets GitHub : `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.
- `.github/workflows/weekly-report.yml` : cron lundi 7h17 UTC + lancement manuel (input `dry_run`, aperçu HTML en artefact), Node 24. Secrets GitHub : `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_JSON`, `BREVO_API_KEY`, `REPORT_EMAIL_FROM`, `REPORT_EMAIL_TO`, `REPORT_EMAIL_CC`.
- `web/netlify.toml` : headers de sécurité (dont la CSP) et cache.
- Formulaire de demande de circuit : Netlify Forms (`demande-circuit`), aucun backend.
- Variables d'env (`web/.env.example`, à copier en `web/.env`, git-ignoré) : `BREVO_API_KEY`, `PUBLIC_CALENDLY_URL`, `PUBLIC_GA4_MEASUREMENT_ID`, `SITE_URL`, `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_JSON`, `REPORT_EMAIL_FROM`, `REPORT_EMAIL_TO`, `REPORT_EMAIL_CC` (optionnel).
- `BREVO_API_KEY` est lue au runtime par `/api/subscribe` (fonction Netlify) ; `deploy.yml` ne la transmet pas, elle vient donc de la config du site Netlify.

## Conventions du repo

- GSAP : importer uniquement depuis `src/lib/gsap.ts` (contrôlé par `tests/lib/gsap-enforcement.test.ts`). Toute animation respecte `prefers-reduced-motion`.
- Styles : utilitaires Tailwind et tokens `@theme` de `global.css` ; classes custom préfixées `sa-`.
- Événements DOM custom préfixés `sa:` (`sa:modal-open`, `sa:modal-close`).
- Logs préfixés `[slow-adventures]` (`console.error` / `console.warn`).
- Textes du site en français, en tutoyant le visiteur.
- Tracking des CTA : attribut `data-cta="<label>"`, capté par délégation dans `analytics.ts`.
- Nouveau circuit : une entrée dans `src/data/circuits.ts` suffit (page, menu, carrousel et formulaire sont générés).
- Champ ajouté à `CircuitForm.astro` : le déclarer aussi dans `public/__forms.html`, sinon Netlify Forms ne le connaît pas (vérifié par `tests/pages/circuits.test.ts`).
- Section masquée : constante booléenne en tête de page (ex. `showElenaSection` dans `index.astro`) ou bloc commenté (témoignages).
- Pages `/projet` : données et constantes dans `src/data/projets/<slug>.ts`, `prerender = false`, noindex, exclues du sitemap, sans analytics.
- Prettier : quotes simples, point-virgule, 2 espaces, `trailingComma: es5`.

## Pièges et points d'attention

- `npm run test` inclut `tests/build-output.test.ts`, qui exécute `npm run build` (timeout 120 s) : suite lente, et en échec dès que le build casse.
- La plupart des tests lisent le source et vérifient des chaînes exactes (titres, meta, URLs Calendly/WhatsApp, noms de circuits) : modifier un texte ou une URL demande souvent de mettre à jour le test associé.
- Double déploiement prod : d'après la PR #3 ouverte (`fix/single-prod-deploy`), le build Git de Netlify publie aussi `main`, avant que lint et tests du workflow aient tourné. Cette PR remplace `deploy.yml` par un `verification.yml` et déplace lint + tests dans le contexte `production` de `netlify.toml`. Vérifier son état avant de toucher au déploiement.
- Consentement cookies : `CookieConsent` stocke le choix dans `localStorage` (`sa_consent`) mais aucun code ne le relit ; `AnalyticsScripts.astro` charge GA4 et Microsoft Clarity en prod sans condition. L'ID GA4 y est en dur et `PUBLIC_GA4_MEASUREMENT_ID` n'est pas utilisée.
- Calendly : la source de vérité est `CALENDLY_URL` dans `src/data/contact.ts` ; `PUBLIC_CALENDLY_URL` n'apparaît plus que dans la section témoignages commentée d'`index.astro`.
- CSP de `netlify.toml` : tout nouveau domaine tiers (script, iframe, image, fetch, font) doit y être ajouté, sinon il est bloqué en prod.
- Repo public : tout ce qui est versionné est lisible sur GitHub, y compris les données des pages `/projet` ; leur protection ne vaut que sur le site. Ne rien versionner de sensible. GitHub désactive aussi les workflows planifiés d'un repo public après 60 jours sans activité.
- README racine et `docs/` décrivent le MVP initial (voyages sur mesure sur toutes les Amériques, Brevo appelé côté client, tests co-localisés). L'état actuel est dans le code : circuits USA/Canada, route serveur Brevo, tests dans `web/tests/`. Les commandes npm du README racine se lancent dans `web/`.
- L'ID de la liste Brevo est en dur dans `src/pages/api/subscribe.ts` (`BREVO_LIST_ID`).
- Rapport hebdo : semaine Lun-Dim en heure de Paris, la propriété GA4 doit être en `Europe/Paris` ; les données du dimanche peuvent être incomplètes le lundi matin.
- Node : 20 dans `deploy.yml`, 24 dans `weekly-report.yml`, aucune version épinglée en local (ni `.nvmrc` ni `engines`).
