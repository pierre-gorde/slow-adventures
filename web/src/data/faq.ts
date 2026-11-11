import { CALENDLY_URL, WHATSAPP_URL } from './contact';

export type FaqLink = { label: string; href: string; calendly?: boolean };

export type FaqItem = {
  '@type': 'Question';
  name: string;
  acceptedAnswer: { '@type': 'Answer'; text: string };
};

export const faqItems: FaqItem[] = [
  {
    '@type': 'Question',
    name: 'Qu’est-ce que Slow Adventures ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'SlowAdventures propose des circuits en Amérique du Nord, imaginés par Elena et inspirés des valeurs du slow travel. Pas forcément voyager moins vite, mais autrement. Ici, on ne coche pas des cases. On prend le temps de comprendre un lieu, de rencontrer les habitants, de s’imprégner vraiment. Chaque circuit est pensé comme une expérience immersive : des itinéraires construits avec sens, des hébergements choisis avec soin, et des activités qui ont un impact positif, pour toi comme pour les destinations. L’idée n’est pas de voir plus, mais de voir mieux et de ressentir la destination. Parce qu’au fond, les plus beaux souvenirs ne viennent pas de ce qu’on a vu, mais de ce qu’on a ressenti.',
    },
  },
  {
    '@type': 'Question',
    name: 'Sur quelles destinations je peux partir avec Slow Adventures ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'SlowAdventures est spécialisé dans l’Amérique du Nord : tous les circuits se déroulent aux États-Unis et au Canada. De nouveaux circuits arrivent régulièrement : inscris-toi à la newsletter pour être le premier ou la première informé(e).',
    },
  },
  {
    '@type': 'Question',
    name: 'Combien coûte un circuit ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Le prix dépend de tes dates, du nombre de voyageurs et des options que tu choisis (gamme d’hébergement, véhicule, durée). Ton prix exact t’est confirmé dans un devis personnalisé, sans engagement, avant toute réservation.',
    },
  },
  {
    '@type': 'Question',
    name: 'Est-ce que je peux modifier un circuit ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Chaque circuit est pensé comme un tout, pour que tu n’aies rien à construire. Tu peux en revanche l’adapter grâce aux options proposées : gamme d’hébergement, type de véhicule, version courte ou longue selon les circuits.',
    },
  },
  {
    '@type': 'Question',
    name: 'Combien de temps pour recevoir mon devis ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Notre agence partenaire te confirme ton voyage et son prix exact, selon tes dates et les disponibilités, dans la semaine qui suit ta demande.',
    },
  },
  {
    '@type': 'Question',
    name: 'Qui s’occupe des réservations ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'SlowAdventures travaille avec une agence de voyage partenaire, qui prend en charge les réservations, le paiement sécurisé et l’assistance. Toi, tu n’as plus qu’à préparer ta valise.',
    },
  },
  {
    '@type': 'Question',
    name: 'Quelle est la différence entre Slow Adventures et une agence de voyage ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Les circuits SlowAdventures ne sortent pas d’un catalogue d’agence : chacun a été imaginé par Elena, avec l’exigence d’une passionnée de l’Amérique du Nord. Tu profites d’un voyage pensé avec soin et avec du sens, et de la sécurité d’une agence partenaire pour tout ce qui concerne la réservation. Le meilleur des deux mondes, sans l’image de l’agence classique.',
    },
  },
  {
    '@type': 'Question',
    name: 'Est-ce que je peux échanger avec Elena avant de réserver ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Bien sûr ! Si tu as une question sur un circuit, écris-moi sur WhatsApp ou réserve un appel de 15 minutes. C’est gratuit et sans engagement.',
    },
  },
  {
    '@type': 'Question',
    name: 'Slow Adventures propose-t-il uniquement l’Amérique du Nord ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Oui, Slow Adventures est exclusivement spécialisé dans l’Amérique du Nord (États-Unis et Canada). Cette spécialisation permet à Elena de connaître ces destinations en profondeur : les meilleures adresses, les périodes idéales, les erreurs à éviter, et les expériences hors des sentiers battus que les guides classiques ne mentionnent pas.',
    },
  },
];

/**
 * Liens cliquables affichés sous certaines réponses (hors données Google).
 * Clé = question.
 */
export const faqLinks: Record<string, FaqLink[]> = {
  'Est-ce que je peux échanger avec Elena avant de réserver ?': [
    { label: 'Écris-moi sur WhatsApp', href: WHATSAPP_URL },
    { label: 'Réserve 15 min avec Elena', href: CALENDLY_URL, calendly: true },
  ],
};

export const faqLd = {
  '@context': 'https://schema.org' as const,
  '@type': 'FAQPage' as const,
  mainEntity: faqItems,
};
