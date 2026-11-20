/**
 * Liens de contact centralisés — un seul endroit à modifier.
 */

/** Rendez-vous Calendly de 15 minutes avec Elena. */
export const CALENDLY_URL = 'https://calendly.com/elena-slowadventures/15min';

/** Conversation WhatsApp avec Elena. */
export const WHATSAPP_URL = 'https://wa.me/33652949913';

/** Message pré-écrit quand le visiteur ne regarde pas un circuit précis. */
export const WHATSAPP_MESSAGE_GENERAL =
  'Bonjour Elena ! Je découvre tes circuits et j’aimerais te poser quelques questions.';

/** Message pré-écrit depuis la fiche d'un circuit. */
export const whatsappMessageCircuit = (nomCircuit: string): string =>
  `Bonjour Elena ! Je suis intéressé(e) par le circuit « ${nomCircuit} » et j’aimerais te poser quelques questions.`;

/** Lien WhatsApp qui ouvre la conversation avec un message déjà écrit. */
export const whatsappLink = (
  message: string = WHATSAPP_MESSAGE_GENERAL
): string => `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

/** Page qui liste tous les circuits. */
export const CIRCUITS_URL = '/circuits/';

export const CONTACT_EMAIL = 'elena@slowadventures.fr';
