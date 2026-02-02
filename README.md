# Slow Adventures 🌍

Travel planner moderne développé en TypeScript pour créer des expériences de voyage sur-mesure.

## L'équipe

- **Elena Dolla** - Travel Planner & Expert Voyage
- **Pierre Gordé** - Développeur

## À propos d'Elena

Elena est une travel planner expérimentée, coordinatrice WeRoad et créatrice de contenu voyage.

- Instagram Slow Adventures: [@slow*adventures*](https://instagram.com/slow_adventures_)
- Instagram Voyage: [@faistesvalises\_\_\_](https://instagram.com/faistesvalises___)
- Instagram Personnel: [@pearow](https://instagram.com/pearow)
- LinkedIn: [Elena Dolla](https://www.linkedin.com/in/elena-dolla-433884173/)
- WeRoad: [Profil Coordinatrice](https://www.weroad.fr/coordinateurs/elena-dolla-1)
- Malt: [Profil Freelance](https://www.malt.fr/profile/elenalorquindolla)

## Workflows BMAD recommandés

Séquence de workflows pour développer le site Slow Adventures :

### Phase Conception

1. `/bmad-bmm-create-product-brief` - Formaliser la vision produit (basé sur le brainstorming)
2. `/bmad-bmm-create-prd` - PRD détaillé du site (pages, fonctionnalités)
3. `/bmad-bmm-create-ux-design` - Wireframes et parcours utilisateur
4. `/bmad-bmm-create-architecture` - Stack TypeScript, structure technique

### Phase Implémentation

5. `/bmad-bmm-create-epics-and-stories` - Découper en épics et stories dev-ready
6. `/bmad-bmm-sprint-planning` - Organiser en sprints
7. `/bmad-bmm-dev-story` - Exécuter chaque story

### Raccourci (dev rapide)

- `/bmad-bmm-quick-spec` - Spec conversationnelle → implémentation directe

### Contenu & Marketing

- `/bmad-cis-storytelling` - Structurer le storytelling Instagram

### Documentation projet

- Brainstorming session : `_bmad-output/brainstorming/brainstorming-session-2026-01-31.md`

## Stack Technique

- **TypeScript** - Type safety et maintenabilité
- Architecture modulaire et scalable
- Base de données relationnelle

## Contraintes & Best Practices

### Performance

- Code splitting et lazy loading
- Optimisation des images (WebP, compression)
- Caching stratégique (Redis, CDN)
- SSR/SSG pour le temps de chargement initial
- Core Web Vitals optimisés (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### SEO & Visibilité

- Meta tags optimisés (Open Graph, Twitter Cards)
- Schema.org markup (LocalBusiness, TravelAgency)
- Sitemap XML dynamique
- URLs sémantiques et structure claire
- Temps de chargement < 3s
- Mobile-first responsive design

### AI & LLM Optimization

- Structured data pour les moteurs de recherche IA
- Content markup sémantique
- API public/privé bien documentée (Swagger)
- Données accessibles et crawlables
- Rich snippets et FAQ schema

### Code Quality

- Linting strict (ESLint, Prettier)
- Tests unitaires et d'intégration
- CI/CD automatisé
- Documentation technique à jour
- Git workflow (feature branches, PR reviews)
- Gestion des secrets et variables d'environnement

### Sécurité

- HTTPS obligatoire
- Headers de sécurité (CSP, HSTS)
- Validation des inputs
- Rate limiting
- RGPD compliant

### Accessibilité

- WCAG 2.1 Level AA minimum
- Navigation clavier
- ARIA labels
- Contraste des couleurs

## Couleurs du projet

Primary : #c0603e
Secondary : #1696ff
Background : #fff9f3

## Installation

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # Développement
npm run build    # Production build
npm run test     # Tests
npm run lint     # Linting
```

## Licence

Propriétaire - Slow Adventures © 2026
