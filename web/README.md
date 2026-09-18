# Slow Adventures — Web (Frontend)

> Site vitrine one-page, mobile-first, propulsé par **Astro 5** + **Tailwind v4** + **GSAP**.

Retour au [README principal](../README.md) | [Documentation projet](../docs/) | [Sprint Status](../docs/implementation-artifacts/sprint-status.yaml)

## Stack

| Technologie                                  | Version    | Usage                       |
| -------------------------------------------- | ---------- | --------------------------- |
| [Astro](https://astro.build)                 | ^5         | SSG, islands architecture   |
| [Tailwind CSS](https://tailwindcss.com)      | v4         | CSS-based config (`@theme`) |
| [GSAP](https://gsap.com)                     | ^3         | Animations scroll           |
| [TypeScript](https://www.typescriptlang.org) | ^5, strict | Typage                      |
| [Vitest](https://vitest.dev)                 | ^3         | Tests unitaires             |
| [ESLint](https://eslint.org)                 | ^9         | Lint (flat config)          |
| [Prettier](https://prettier.io)              | ^3         | Formatage                   |

## Scripts

```bash
npm run dev      # Serveur de dev (localhost:4321)
npm run build    # Build SSG dans dist/
npm run preview  # Preview du build local
npm run lint     # ESLint + Prettier (check)
npm run format   # Prettier (write)
npm run test     # Vitest
npm run report:sample  # Aperçu HTML du rapport hebdo (données factices)
npm run report:dry-run # Rapport hebdo avec vraies données GA4, sans envoi
npm run report:weekly  # Envoi réel du rapport hebdo (lit .env)
```

## Structure

```
web/
├── src/
│   ├── assets/images/      # Images optimisées (WebP)
│   ├── components/          # Composants Astro (statiques + islands)
│   ├── content/destinations/ # Content collections (markdown)
│   ├── data/                # Données statiques
│   ├── layouts/             # Layouts Astro
│   ├── lib/                 # Utilitaires TypeScript
│   ├── pages/               # Routes (index.astro)
│   ├── styles/              # global.css (Tailwind @theme tokens)
│   └── types/               # Types TypeScript
├── public/                  # Assets statiques (vidéos, favicons)
├── scripts/weekly-report/   # Rapport hebdo analytics (GA4 → email Brevo)
├── tests/                   # Tests Vitest (miroir de src/ et scripts/)
├── astro.config.mjs         # Config Astro + Sitemap + robots.txt + Tailwind Vite
├── eslint.config.mjs        # ESLint 9 flat config
├── netlify.toml             # Headers sécurité + cache
├── vitest.config.ts         # Config tests (jsdom)
└── .env.example             # Variables d'environnement documentées
```

## Variables d'environnement

Copier `.env.example` vers `.env` et remplir les valeurs :

| Variable                    | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `BREVO_API_KEY`             | Clé API Brevo (newsletter + rapport hebdo)        |
| `PUBLIC_CALENDLY_URL`       | URL de booking Calendly                           |
| `PUBLIC_GA4_MEASUREMENT_ID` | Google Analytics 4 Measurement ID                 |
| `SITE_URL`                  | URL du site (sitemap, canonical)                  |
| `GA4_PROPERTY_ID`           | ID numérique de la propriété GA4 (rapport hebdo)  |
| `GA4_SERVICE_ACCOUNT_JSON`  | Clé JSON du compte de service GA4 (rapport hebdo) |
| `REPORT_EMAIL_FROM`         | Expéditeur du rapport hebdo (vérifié dans Brevo)  |
| `REPORT_EMAIL_TO`           | Destinataire(s) du rapport hebdo                  |
| `REPORT_EMAIL_CC`           | Copie(s) du rapport hebdo (optionnel)             |

## Deployment

Le deploy se fait via **GitHub Actions** ([deploy.yml](../.github/workflows/deploy.yml)) :

- Trigger : push sur `main` modifiant `web/**`
- Steps : install > lint > test > build > deploy Netlify CLI
- Secrets requis : `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`

## Rapport hebdo analytics

Chaque lundi matin, [weekly-report.yml](../.github/workflows/weekly-report.yml)
envoie par email les stats GA4 de la semaine écoulée (visites, pages, sources,
clics, comparaison S-1). Détails, variables et mise en place dans
[scripts/weekly-report/README.md](scripts/weekly-report/README.md).

## Documentation

| Document                                                             | Description                           |
| -------------------------------------------------------------------- | ------------------------------------- |
| [Architecture](../docs/planning-artifacts/architecture.md)           | Decisions techniques, stack, patterns |
| [PRD](../docs/planning-artifacts/prd.md)                             | Product Requirements                  |
| [UX Spec](../docs/planning-artifacts/ux-design-specification.md)     | Design, composants, parcours          |
| [Epics & Stories](../docs/planning-artifacts/epics.md)               | Backlog de dev                        |
| [Sprint Status](../docs/implementation-artifacts/sprint-status.yaml) | Avancement                            |
