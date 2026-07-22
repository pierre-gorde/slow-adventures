# Pages projet client

Comptes rendus de brief privés, un par client, présentés en page immersive
(hero, compte à rebours, profils voyageurs, envies, points de vigilance,
galerie). Servent de base de validation avant la construction de l'itinéraire.

## Fonctionnement

- **Rendu serveur** (`prerender = false`, adapter Netlify) : le contenu n'est
  jamais présent dans le HTML tant que le mot de passe n'est pas validé.
- **Protection** : formulaire POST, mot de passe normalisé (casse, accents,
  espaces → tirets), cookie httpOnly posé sur `/projet` après succès.
- **Non référencé** : `X-Robots-Tag` + meta `noindex, nofollow`, exclu du
  sitemap via le filtre dans `astro.config.mjs`. Pas d'entrée `robots.txt`
  (elle révèlerait le chemin).
- **Pas d'analytics** sur ces pages (Clarity/GA volontairement absents).

## Arborescence

- `jennifer-goncalves.astro` — page du projet, layout standalone (sans
  TopBar/Footer), mdp : `jennifer-goncalves`.
- Contenu et constantes (mot de passe, cookie, date de départ, voyageurs…)
  dans `src/data/projets/<slug>.ts`.

## Ajouter un client

Dupliquer la page et le fichier de données, adapter slug, mot de passe et
contenu. Si un troisième client arrive, factoriser en `[slug].astro` +
lookup dans `src/data/projets/`.
