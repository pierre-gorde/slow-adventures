/**
 * Messages du ReturnVisitorBanner — différenciés par nombre de visites.
 * Visites 2-11 : message séquentiel unique par visite.
 * Visites 12+  : message aléatoire parmi rotatingMessages.
 */

/** Messages séquentiels — index 0 = visite 2, index 9 = visite 11 */
export const sequentialMessages: string[] = [
  'Tiens, te revoilà\u00a0! 👀',
  'Encore toi, curieux(se)\u00a0? 😊',
  'On se retrouve en visio\u00a0? 💻',
  'Tu passes encore par là\u00a0! 🔄',
  'Prêt(e) à parler de ton voyage\u00a0? ✈️',
  'De retour pour un tour\u00a0? 🎢',
  'On continue de faire du repérage\u00a0? 🗺️',
  'Toujours intéressé(e)\u00a0? 💡',
  'Et si on bloquait une date pour en discuter\u00a0? 📅',
  'Tu reviens souvent… ne laisse pas ton voyage attendre\u00a0! ⏳',
];

/** Messages en rotation aléatoire pour les visiteurs fidèles (visite 12+) */
export const rotatingMessages: string[] = [
  'Tiens, un(e) habitué(e)\u00a0! 🏡',
  'On réserve ensemble ton moment\u00a0? 💛',
  'Ton rêve de voyage mérite qu\u2019on en parle\u00a0! 🌍',
  'Tu hésites encore\u00a0? On peut en parler maintenant\u00a0! 🕒',
  'Alors, prêt(e) à réaliser ton voyage de rêve\u00a0? 🚀',
  'Ça fait plusieurs visites… il est temps de passer à l\u2019action\u00a0! 🔥',
  'Ne laisse pas ton projet de côté, bloquons un créneau\u00a0! 💚',
  'Plus que quelques clics et ton voyage prend vie\u00a0! ✨',
  'Dernière chance avant que ton créneau se remplisse\u00a0! ⚡',
  'Allez, on confirme ton rendez-vous et on fait avancer ton rêve\u00a0! 🏁',
];
