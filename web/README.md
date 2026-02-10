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
├── astro.config.mjs         # Config Astro + Sitemap + robots.txt + Tailwind Vite
├── eslint.config.mjs        # ESLint 9 flat config
├── netlify.toml             # Headers sécurité + cache
├── vitest.config.ts         # Config tests (jsdom)
└── .env.example             # Variables d'environnement documentées
```

## Variables d'environnement

Copier `.env.example` vers `.env` et remplir les valeurs :

| Variable                    | Description                       |
| --------------------------- | --------------------------------- |
| `PUBLIC_BREVO_API_KEY`      | Clé API Brevo (newsletter)        |
| `PUBLIC_CALENDLY_URL`       | URL de booking Calendly           |
| `PUBLIC_GA4_MEASUREMENT_ID` | Google Analytics 4 Measurement ID |
| `SITE_URL`                  | URL du site (sitemap, canonical)  |

## Deployment

Le deploy se fait via **GitHub Actions** ([deploy.yml](../.github/workflows/deploy.yml)) :

- Trigger : push sur `main` modifiant `web/**`
- Steps : install > lint > test > build > deploy Netlify CLI
- Secrets requis : `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`

## Documentation

| Document                                                             | Description                           |
| -------------------------------------------------------------------- | ------------------------------------- |
| [Architecture](../docs/planning-artifacts/architecture.md)           | Decisions techniques, stack, patterns |
| [PRD](../docs/planning-artifacts/prd.md)                             | Product Requirements                  |
| [UX Spec](../docs/planning-artifacts/ux-design-specification.md)     | Design, composants, parcours          |
| [Epics & Stories](../docs/planning-artifacts/epics.md)               | Backlog de dev                        |
| [Sprint Status](../docs/implementation-artifacts/sprint-status.yaml) | Avancement                            |
