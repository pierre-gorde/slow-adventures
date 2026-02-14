# Story 4.2: Configuration email confirmation Calendly

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur ayant réservé une discovery call,
I want recevoir un email de confirmation chaleureux,
So that j'aie hâte d'être au call plutôt que de l'oublier ou l'annuler.

## Acceptance Criteria

### AC1 — Email de confirmation Calendly personnalisé

1. **Given** un visiteur a réservé un créneau via Calendly **When** la réservation est confirmée **Then** Calendly envoie automatiquement un email de confirmation (FR19) **And** l'objet de l'email est configuré dans Calendly : "Parlons de ton prochain rêve" (pas "Confirmation RDV") **And** le contenu est chaleureux, tutoiement, explique ce qui l'attend au call (faire connaissance, envies, voyages passés) **And** le message clé est : "c'est un échange, pas un pitch"

### AC2 — Rappel automatique avant le call

2. **Given** le call est dans 1-2h **When** le rappel automatique Calendly se déclenche **Then** le visiteur reçoit un rappel (natif Calendly, pas de dev custom) **And** le rappel reprend le ton chaleureux et le tutoiement

## Tasks / Subtasks

- [ ] Task 1: Configurer l'email de confirmation dans Calendly (AC: #1)
  - [ ] 1.1 Se connecter à Calendly et ouvrir l'Event Type "Discovery Call" (ou équivalent)
  - [ ] 1.2 Naviguer vers **Notifications and Cancellation Policy** (ou **Communications**)
  - [ ] 1.3 Cliquer sur **Personalize** à côté de "Email Confirmations"
  - [ ] 1.4 Modifier l'objet : "Parlons de ton prochain rêve"
  - [ ] 1.5 Remplacer le corps de l'email par le contenu rédigé (voir Dev Notes — Contenu email de confirmation)
  - [ ] 1.6 Sauvegarder les modifications

- [ ] Task 2: Configurer le rappel automatique (AC: #2)
  - [ ] 2.1 Dans les paramètres de l'Event Type, vérifier que les rappels sont activés
  - [ ] 2.2 Configurer un rappel email **1 heure avant** le call
  - [ ] 2.3 Personnaliser le rappel avec un ton chaleureux (voir Dev Notes — Contenu rappel)
  - [ ] 2.4 Optionnel : ajouter un rappel **24 heures avant** si le plan Calendly le permet

- [ ] Task 3: Tester la configuration (AC: #1, #2)
  - [ ] 3.1 Faire une réservation test via le site (ou directement sur Calendly)
  - [ ] 3.2 Vérifier la réception de l'email de confirmation avec le bon objet et contenu
  - [ ] 3.3 Vérifier la réception du rappel avant le call (raccourcir le délai pour le test si possible)
  - [ ] 3.4 Vérifier que les variables dynamiques (nom, date, heure) sont correctement remplies
  - [ ] 3.5 Vérifier l'affichage sur mobile (la majorité du trafic vient d'Instagram mobile)

- [ ] Task 4: Documenter la configuration (livrable)
  - [ ] 4.1 Documenter les étapes de configuration dans les Completion Notes de cette story
  - [ ] 4.2 Capturer les réglages finaux (objet, corps de l'email, paramètres de rappel)
  - [ ] 4.3 Documenter les prérequis du plan Calendly (plan payant requis pour personnalisation)

## Dev Notes

### IMPORTANT : Story de configuration — PAS de code custom

Cette story est une **story de configuration pure**. Aucun code custom n'est à écrire. Le travail se fait **entièrement dans le dashboard Calendly**. La story 3-3 (CalendlyModal) a déjà implémenté toute l'intégration technique côté site.

**Aucun fichier à modifier dans le codebase.**

### Prérequis

- **Plan Calendly payant** : La personnalisation des emails de confirmation (objet + corps) et les Workflows nécessitent un plan Standard ou supérieur. Le plan gratuit ne permet pas cette personnalisation.
- **Event Type créé** : Un Event Type "Discovery Call" (ou équivalent) doit exister dans Calendly avec l'URL correspondant à `PUBLIC_CALENDLY_URL` configurée dans le site.
- **CalendlyModal fonctionnel** : L'intégration technique est déjà en place (Story 3-3, commit 3efe778).

### Contenu email de confirmation — Template recommandé

**Objet :** Parlons de ton prochain rêve

**Corps :**

```
Salut {{invitee_first_name}} !

Merci d'avoir réservé un moment avec moi. J'ai vraiment hâte qu'on échange ensemble.

Ton créneau : {{event_date}} à {{event_time}}

Ce qui t'attend :
- On fait connaissance — tu me racontes tes envies, tes voyages passés, ce qui te fait vibrer
- Je te partage mes coups de cœur et mes idées pour ton prochain voyage aux Amériques
- On voit ensemble si c'est le bon moment pour toi

C'est un échange, pas un pitch. Pas de pression, juste une conversation entre passionnés de voyage.

Si tu as des questions avant notre appel, n'hésite pas à me répondre directement à cet email.

À très vite,
Elena

—
Slow Adventures
Voyages immersifs aux Amériques
```

**Note tutoiement :** Tout le contenu utilise le "tu" conformément à la charte de communication du site.

**Note formulation :** Langage inclusif et non genré — pas de "prêt(e)" ou formulations genrées.

### Contenu rappel — Template recommandé

**Objet :** C'est bientôt notre moment — à tout à l'heure !

**Corps :**

```
Hey {{invitee_first_name}} !

Petit rappel : on se retrouve dans environ 1 heure pour parler de ton prochain voyage aux Amériques.

{{event_date}} à {{event_time}}

Prépare-toi juste à rêver un peu. Aucune préparation nécessaire, on discute simplement.

À tout de suite,
Elena
```

### Variables Calendly disponibles

Les variables dynamiques suivantes peuvent être insérées dans les templates :

| Variable | Description |
|----------|-------------|
| `{{invitee_first_name}}` | Prénom de l'invité |
| `{{invitee_last_name}}` | Nom de l'invité |
| `{{invitee_full_name}}` | Nom complet |
| `{{event_date}}` | Date du rendez-vous |
| `{{event_time}}` | Heure du rendez-vous |
| `{{event_name}}` | Nom de l'event type |
| `{{location}}` | Lieu/lien de la visio |

**Note :** Les noms exacts des variables peuvent varier selon la version de Calendly. Vérifier dans l'éditeur les variables disponibles via le bouton `+Variables`.

### Chemin de navigation Calendly (2025-2026)

**Option A — Via Event Type Settings (plus simple) :**
1. Calendly Dashboard → **Event Types**
2. Cliquer sur l'engrenage de l'Event Type Discovery Call
3. **Notifications and Cancellation Policy**
4. **Personalize** à côté de "Email Confirmations"
5. Modifier sujet et corps → **Save and Close**

**Option B — Via Workflows (plus flexible) :**
1. Calendly Dashboard → **Workflows**
2. Créer un nouveau Workflow ou modifier l'existant
3. **Trigger** : "When event is booked"
4. **Action** : "Send email to invitee"
5. Personnaliser sujet et corps avec variables
6. **Save**

L'option A est suffisante pour le MVP. L'option B (Workflows) offre plus de flexibilité (conditions, délais, chaînes d'emails) pour l'avenir.

### Intelligence de la Story 4-1 (précédente)

**Contexte :** La story 4-1 a implémenté le formulaire EmailCapture et l'intégration Brevo. Leçons pertinentes :
- La configuration Brevo (séquences bienvenue + hebdo) est aussi une tâche de configuration hors-code (FR17, FR18)
- Pattern identique : services tiers configurés dans leur dashboard, pas de dev custom
- 684 tests passent — aucune régression à surveiller car cette story ne touche pas au code

### Ce qui est DÉJÀ fait (NE PAS REFAIRE)

- `CalendlyModal.astro` — modale fonctionnelle avec iframe (Story 3-3)
- `CTAButton.astro` avec `data-calendly-trigger` et `href={PUBLIC_CALENDLY_URL}` (Stories 2-3, 3-1)
- `StickyMobileCTA` avec ouverture CalendlyModal (Story 3-2)
- Fallback lien direct Calendly si JS désactivé (FR15)
- Variable `PUBLIC_CALENDLY_URL` dans `.env.example` et Netlify (Story 1-1)

### Project Structure Notes

- **Aucun fichier à créer ou modifier dans le codebase**
- Cette story est entièrement réalisée dans le dashboard Calendly
- Le livrable est la documentation de la configuration (cette story file mise à jour avec les Completion Notes)

### References

- [Source: docs/planning-artifacts/epics.md#Story 4.2] — AC complètes, FR19, note "story de configuration"
- [Source: docs/planning-artifacts/prd.md#FR19] — Email confirmation post-booking (natif Calendly, pas de dev custom)
- [Source: docs/planning-artifacts/architecture.md#Patterns d'Intégration Tierces] — Calendly: iframe embed, fallback lien direct
- [Source: docs/planning-artifacts/architecture.md#Variables d'Environnement] — PUBLIC_CALENDLY_URL
- [Source: docs/planning-artifacts/ux-design-specification.md#Content Strategy] — Tutoiement, formulation positive, langage inclusif
- [Source: docs/implementation-artifacts/3-3-calendlymodal-modale-de-reservation-integree.md] — Intégration technique CalendlyModal déjà complète
- [Source: Calendly Help Center — Customize emails for Workflows](https://help.calendly.com/hc/en-us/articles/4405711728023)
- [Source: Calendly Community — Email confirmations customization](https://community.calendly.com/how-do-i-40/how-do-i-customize-email-sent-on-confirmation-when-booked-267)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

### File List

- Aucun fichier du codebase modifié — story de configuration Calendly uniquement
