export type FaqItem = {
  '@type': 'Question';
  name: string;
  acceptedAnswer: { '@type': 'Answer'; text: string };
};

export const faqItems: FaqItem[] = [
  {
    '@type': 'Question',
    name: "Qu'est-ce que Slow Adventures ?",
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Slow Adventures, c'est ton compagnon de voyage sur mesure. Créé par Elena, Slow Adventures conçoit des voyages immersifs et personnalisés à travers toutes les Amériques — du Canada à la Patagonie, en passant par les Caraïbes et l'Amérique centrale. Ce n'est pas une agence classique : tu es accompagné·e à chaque étape, de la première conversation jusqu'au retour, pour un voyage qui te ressemble vraiment.",
    },
  },
  {
    '@type': 'Question',
    name: 'Sur quelles destinations je peux partir avec Slow Adventures ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Slow Adventures est spécialisé dans tous les pays des Amériques : Costa Rica, Pérou, Patagonie (Argentine et Chili), West Coast USA, Mexique, Colombie, Équateur, Bolivie, Canada, et bien d'autres. Si la destination est sur le continent américain, Elena peut construire ton itinéraire. En effet Haïti et Honduras ne sont pas encore des destinations proposées par SlowAdventures. Cela est lié est risques sécuritaires pour les voyageurs indépendants sur place.",
    },
  },
  {
    '@type': 'Question',
    name: 'Combien coûte la création de mon itinéraire sur mesure ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'La création de ton itinéraire sur mesure commence à partir de 300 €. Un acompte de 100 € permet de lancer la création (déduit du prix final). Le tarif exact dépend de la durée et de la complexité du voyage : il est défini et annoncé lors du Discovery Call gratuit.',
    },
  },
  {
    '@type': 'Question',
    name: 'Comment fonctionne le Discovery Call ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Le Discovery Call est un appel gratuit de 30 minutes avec Elena. C'est l'occasion de se connaître, de cerner tes rêves de voyage, ce qui te fait vibrer, et de poser les bases d'un itinéraire qui te ressemble vraiment. Aucun engagement, aucune obligation.",
    },
  },
  {
    '@type': 'Question',
    name: 'En combien de temps mon itinéraire est-il prêt ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Après le Discovery Call et la confirmation de l'acompte, l'itinéraire est généralement livré sous 1 semaine. Si besoin, des ajustements sont possibles pour qu'il corresponde à 100 % à tes attentes avant la version finale.",
    },
  },
  {
    '@type': 'Question',
    name: 'Quelle est la différence entre Slow Adventures et une agence de voyage ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Slow Adventures n'est pas une agence de voyage. Elena est une travel planner indépendante : elle ne vend pas de packages prédéfinis, ne touche pas de commissions sur les hébergements, et ne travaille pas avec des catalogues. Chaque voyage est construit à partir de zéro selon tes envies, ton budget et ton rythme. L'accompagnement inclut un suivi par WhatsApp pendant tout le séjour.",
    },
  },
  {
    '@type': 'Question',
    name: 'Slow Adventures propose-t-il uniquement les Amériques ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Oui, Slow Adventures est exclusivement spécialisé dans les Amériques (Nord, Centrale et Sud). Cette spécialisation permet à Elena de connaître ces destinations en profondeur : les meilleures adresses, les périodes idéales, les erreurs à éviter, et les expériences hors des sentiers battus que les guides classiques ne mentionnent pas.',
    },
  },
];

export const faqLd = {
  '@context': 'https://schema.org' as const,
  '@type': 'FAQPage' as const,
  mainEntity: faqItems,
};
