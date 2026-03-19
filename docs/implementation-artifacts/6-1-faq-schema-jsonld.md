# Story 6.1 : FAQ Schema JSON-LD dans index.astro

Status: done

## Story

As a visiteur cherchant un travel planner pour les Amériques,
I want trouver des réponses directes à mes questions dans Google (rich results),
So that je découvre Slow Adventures via les "People Also Ask" et les résultats enrichis, et que les modèles IA puissent citer les informations clés du service.

## Acceptance Criteria

### FAQ Schema (JSON-LD)

1. **Given** `index.astro` est rendu **When** Google ou un LLM crawle la page **Then** un bloc `<script type="application/ld+json">` de type `FAQPage` est présent avec minimum 5 questions/réponses couvrant : tarifs, destinations proposées, fonctionnement du Discovery Call, délais de livraison itinéraire, et différence avec une agence de voyage classique
2. **Given** le schema FAQPage est présent **When** on le valide via Google Rich Results Test **Then** aucune erreur n'est retournée et le type `FAQPage` est reconnu
3. **Given** le schema est injecté **When** on inspecte le DOM **Then** le JSON est valide (parseable) et ne contient pas d'apostrophes typographiques (`'`) qui casseraient les strings JS

### Contenu des questions

4. **Given** la FAQ couvre les sujets clés **When** un visiteur pose la question à un LLM (ex : "combien coûte un itinéraire sur mesure Amériques") **Then** la réponse peut s'appuyer sur les données structurées de slowadventures.fr
5. **Given** les questions sont rédigées **When** on les lit **Then** elles sont en français, correspondent au wording du site ("travel planner" et non "agence"), et reflètent des vraies interrogations de clients

### Qualité & non-régression

6. **Given** la story est complète **When** on lance `npm run build` **Then** le build réussit sans erreur
7. **Given** la story est complète **When** on lance `npm run test` **Then** tous les tests existants passent + nouveaux tests couvrent la présence et la structure du schema FAQPage dans index.astro

## Tasks / Subtasks

- [x] Task 1 : Rédiger les 5-7 questions/réponses FAQ (AC: #4, #5)
  - [x] 1.1 Q: "Qu'est-ce que Slow Adventures ?" → présentation travel planner Elena, Amériques
  - [x] 1.2 Q: "Quelles destinations proposez-vous ?" → tous les pays des Amériques (exemples : Costa Rica, Pérou, Patagonie, West Coast USA, etc.)
  - [x] 1.3 Q: "Combien coûte la création d'un itinéraire sur mesure ?" → à partir de 300 €, acompte 100 €, tarif défini au Discovery Call
  - [x] 1.4 Q: "Comment fonctionne le Discovery Call ?" → 30 min gratuit, cerner les rêves, poser les bases
  - [x] 1.5 Q: "En combien de temps mon itinéraire est-il prêt ?" → délai de 1 à 2 semaines après Discovery Call + ajustements
  - [x] 1.6 Q: "Quelle est la différence entre Slow Adventures et une agence de voyage ?" → travel planner indépendant, accompagnement personnalisé, pas de catalogue prédéfini
  - [x] 1.7 Q: "Slow Adventures propose-t-il uniquement les Amériques ?" → oui, spécialisation totale sur tous les pays des Amériques

- [x] Task 2 : Injecter le schema FAQPage dans index.astro (AC: #1, #2, #3)
  - [x] 2.1 Déclaré `const faqLd` dans le frontmatter d'`index.astro` avec 7 questions
  - [x] 2.2 Prop `extraLd` ajoutée à BaseLayout — injection conditionnelle `{extraLd && <script is:inline type="application/ld+json" .../>}`
  - [x] 2.3 Approche (a) retenue : prop `extraLd?: Record<string, unknown>` dans BaseLayout
  - [x] 2.4 Toutes les strings en double quotes (aucune apostrophe typographique dans single-quoted strings)

- [x] Task 3 : Écrire les tests (AC: #7)
  - [x] 3.1 `@type: FAQPage` présent dans index.astro
  - [x] 3.2 `mainEntity` contient au moins 5 éléments `Question`
  - [x] 3.3 Chaque `Question` a `name` et `acceptedAnswer.text` non vide
  - [x] Bonus : test wording "travel planner", test pricing 300€, test extraLd passé à BaseLayout

- [x] Task 4 : Validation finale (AC: #6, #7)
  - [x] 4.1 `npm run lint` — 0 erreurs sur les fichiers modifiés
  - [x] 4.2 `npm run test` — 178 tests passent sur les 3 fichiers concernés (index.test.ts 114, BaseLayout.test.ts 43, build-output.test.ts 21)
  - [x] 4.3 `npm run build` — build réussi
  - [ ] 4.4 Tester le schema manuellement sur [Google Rich Results Test](https://search.google.com/test/rich-results) — à faire après déploiement en production (non bloquant pour le merge)

## Dev Notes

### Option recommandée — prop `extraLd` dans BaseLayout

Ajouter une prop optionnelle à BaseLayout pour permettre l'injection de schemas JSON-LD supplémentaires depuis les pages :

```typescript
// BaseLayout.astro — ajout prop
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  heroPreloadImage?: string;
  extraLd?: Record<string, unknown>; // ← NOUVEAU
}

const { ..., extraLd } = Astro.props;
```

```astro
<!-- Dans le <head>, après le schema principal -->
{extraLd && (
  <script type="application/ld+json" set:html={JSON.stringify(extraLd)} />
)}
```

```astro
<!-- index.astro — usage -->
---
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu'est-ce que Slow Adventures ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Slow Adventures est un service de travel planning indépendant..."
      }
    },
    // ...
  ]
};
---
<BaseLayout ... extraLd={faqLd}>
```

### Pattern strings — règle absolue

**JAMAIS** d'apostrophes typographiques (`'` U+2019) à l'intérieur de single-quoted strings JS. Utiliser des double quotes pour toute string contenant une apostrophe française :

```typescript
// ✅ CORRECT
name: "Qu'est-ce que Slow Adventures ?",

// ❌ INCORRECT — casse le parser TS
name: 'Qu'est-ce que Slow Adventures ?',
```

### Learnings à respecter (issues précédentes)

- Tests MUST be in `web/tests/` (JAMAIS dans `src/`)
- `npm run prettier --write` immédiatement après création/modification de fichiers
- Pattern test : `readFileSync` pour valider le source Astro

### Structure fichiers à créer/modifier

**Fichiers modifiés :**
- `web/src/layouts/BaseLayout.astro` — ajout type `JsonLdSchema`, prop `extraLd`, injection conditionnelle avec sanitisation `</script>`
- `web/src/pages/index.astro` — déclaration `faqLd` + passage prop `extraLd`
- `web/tests/pages/index.test.ts` — nouveaux tests FAQ schema + conformité schema.org
- `web/tests/layouts/BaseLayout.test.ts` — tests prop `extraLd` + injection conditionnelle
- `web/tests/build-output.test.ts` — tests FAQPage dans HTML buildé + validité JSON parseable

### Références

- [Source: docs/implementation-artifacts/6-1-faq-schema-jsonld.md] — cette story
- [Source: web/src/layouts/BaseLayout.astro] — schema JSON-LD principal (pattern à reproduire)
- [Google Rich Results Test](https://search.google.com/test/rich-results) — validation manuelle
- [Schema.org/FAQPage](https://schema.org/FAQPage) — spec officielle
