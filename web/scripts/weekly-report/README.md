# Rapport hebdo analytics

Envoie chaque lundi matin un email récapitulatif des stats GA4 de la semaine
écoulée : visites, visiteurs, pages vues, taux de rebond, durée moyenne, top
pages, sources de trafic et clics (events), avec comparaison vs semaine précédente.

Déclenché par [`.github/workflows/weekly-report.yml`](../../../.github/workflows/weekly-report.yml)
(cron lundi 7h17 UTC, soit 9h17 à Paris en été et 8h17 en hiver ; GitHub peut
retarder le déclenchement de plusieurs heures). Données via la **Google Analytics
Data API** (compte de service, JWT signé avec `node:crypto`), envoi via l'API
transactionnelle **Brevo**. Zéro dépendance npm : le workflow exécute le
TypeScript nativement avec Node 24.

## Fichiers

```
weekly-report/
├── index.ts          Orchestration : fenêtre de la semaine → GA4 → mail
├── week.ts           Dernière semaine complète Lun→Dim en heure de Paris + S-1
├── ga4.ts            Client GA4 Data API : JWT, token, runReport, mapping
├── format.ts         Construction du sujet et du HTML du mail
├── email.ts          Envoi via l'API Brevo
├── report.const.ts   URLs, métriques, events exclus, timezone, couleurs
└── sample.const.ts   Données factices pour le mode --sample
```

Les tests sont dans [`tests/scripts/weekly-report/`](../../tests/scripts/weekly-report/).

## Variables d'environnement

| Variable                   | Rôle                                                                 |
| -------------------------- | -------------------------------------------------------------------- |
| `GA4_PROPERTY_ID`          | ID **numérique** de la propriété GA4 (Admin > Détails), pas le `G-…` |
| `GA4_SERVICE_ACCOUNT_JSON` | Contenu intégral de la clé JSON du compte de service                 |
| `BREVO_API_KEY`            | Clé API Brevo (la même que pour `/api/subscribe`)                    |
| `REPORT_EMAIL_FROM`        | Expéditeur vérifié dans Brevo (`rapport@slowadventures.fr`)          |
| `REPORT_EMAIL_TO`          | Destinataire(s), séparés par des virgules                            |
| `REPORT_EMAIL_CC`          | Optionnel : destinataire(s) en copie, séparés par des virgules       |

Toutes sont attendues en secrets GitHub Actions (repo > Settings > Secrets and
variables > Actions). En local, elles vont dans `web/.env` (git-ignoré) ; le JSON
tient sur une ligne entre quotes simples.

## Mise en place (une fois)

1. **GA4** — Admin > Détails de la propriété : noter l'ID numérique et vérifier que
   le fuseau horaire est `Europe/Paris` (les bornes Lun→Dim en dépendent).
2. **Google Cloud** — activer **Google Analytics Data API**, créer un compte de
   service, télécharger sa clé JSON.
3. **GA4** — Admin > Gestion des accès à la propriété : ajouter l'email du compte
   de service avec le rôle **Lecteur**.
4. **Brevo** — Expéditeurs & IP : authentifier le domaine `slowadventures.fr`
   (DNS chez Gandi : DKIM + SPF + code Brevo) et ajouter l'expéditeur
   `rapport@slowadventures.fr`.
5. Créer les 5 secrets GitHub, pousser sur `main`, puis tester via
   **Actions > Rapport hebdo analytics > Run workflow**.

## Commandes

| Commande                | Action                                                                     |
| ----------------------- | -------------------------------------------------------------------------- |
| `npm run report:sample` | Génère `weekly-report-preview.html` avec des données factices, sans réseau |
| `npm run report:weekly` | Envoi réel (lit `.env` si présent, nécessite les 5 variables obligatoires) |

En local, Node ≥ 22.9 suffit (`--experimental-strip-types`, `--env-file-if-exists`) ;
le workflow CI utilise Node 24 qui exécute le TypeScript nativement.

## Points d'attention

- **Fraîcheur GA4** : les données d'une propriété standard sont finalisées sous
  24 à 48 h, le dimanche peut donc être légèrement sous-estimé le lundi matin.
  Passer le cron au mardi (`17 7 * * 2`) si c'est gênant.
- **Visiteurs** = `totalUsers` ; l'interface GA4 affiche par défaut `activeUsers`,
  un léger écart est normal.
- **Clics (events)** n'affiche que les events maison qui sont des clics
  (`cta_click`, `email_capture`, `calendly_complete`), voir `EXCLUDED_EVENTS`.
- Sur un repo public, GitHub désactive les workflows planifiés après 60 jours
  sans activité.
