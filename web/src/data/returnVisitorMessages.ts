/**
 * Messages du ReturnVisitorBanner — différenciés par nombre de visites.
 * Visites 2-10 : message séquentiel unique par visite.
 * Visites 11+  : message aléatoire parmi rotatingMessages.
 */

/** Messages séquentiels — index 0 = visite 2, index 8 = visite 10 */
export const sequentialMessages: string[] = [
  'Content de te revoir\u00a0!',
  'Te revoilà\u00a0! L\u2019aventure t\u2019appelle, on dirait\u2026',
  'Encore toi\u00a0! Ça fait plaisir.',
  'Le voyage commence dans la tête\u2026 et tu es déjà en route.',
  'On dirait que quelque chose ici te fait rêver\u2026',
  'Fidèle au rendez-vous\u00a0! Ton prochain voyage se dessine\u00a0?',
  'Tu reviens souvent\u2026 c\u2019est un signe, non\u00a0?',
  'À force de revenir, on va finir par devenir amis\u00a0!',
  '10e visite\u00a0! Elena t\u2019attend pour une discussion, sans engagement.',
];

/** Messages en rotation aléatoire pour les visiteurs fidèles (visite 11+) */
export const rotatingMessages: string[] = [
  'Le monde est vaste, ton rêve aussi.',
  'Un café et une carte\u2026 c\u2019est tout ce qu\u2019il faut pour commencer.',
  'Chaque voyage commence par un premier pas. Prêt(e)\u00a0?',
  'Les plus beaux souvenirs commencent par un «\u00a0et si\u2026\u00a0»',
  'Tu mérites cette aventure.',
  'Quelque part, un guide local t\u2019attend déjà.',
  'L\u2019Amérique latine a un secret pour toi.',
  'Pas besoin de tout planifier. C\u2019est pour ça qu\u2019Elena est là.',
  'Le prochain coucher de soleil pourrait être le tien.',
  'Ton prochain voyage ne demande qu\u2019à exister.',
];
