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
      text: "SlowAdventures est un service de travel planning, qui s'inspire des valeurs du slow travel. Pas forcément voyager moins vite, mais autrement. Ici, on ne coche pas des cases. On prend le temps de comprendre un lieu, de rencontrer les habitants, de s'imprégner vraiment. Chaque voyage est pensé comme une expérience immersive : des itinéraires construits avec sens, des hébergements choisis avec soin, et des activités qui ont un impact positif, pour toi comme pour les destinations. L'idée n'est pas de voir plus, mais de voir mieux et de ressentir la destination. Parce qu'au fond, les plus beaux souvenirs ne viennent pas de ce qu'on a vu, mais de ce qu'on a ressenti.",
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
      text: "Contrairement à une agence de voyage, SlowAdventures ne vend pas de séjours tout faits, et Elena n'effectue aucune réservation à ta place. Ici, chaque voyage est imaginé sur-mesure, à partir de zéro, selon tes envies, ton budget et ton rythme. Pas de catalogue, pas de circuits standardisés, pas d'itinéraires copiés-collés. En tant que travel planner indépendante, Elena conçoit ton voyage avec toi, mais tu restes libre de réserver directement chaque prestation. Résultat : plus de flexibilité, plus de transparence, et un voyage qui te ressemble vraiment. Et surtout, tu n'es jamais seul : un accompagnement personnalisé est prévu avant et pendant le voyage, avec un suivi sur WhatsApp si besoin.",
    },
  },
  {
    '@type': 'Question',
    name: 'Pourquoi tu ne réserves pas à ma place ?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Slow Adventures est un service de travel planning, pas une agence de voyage. En effet seules les agences de voyage sont éligibles à procéder à des réservations. Elena conçoit ton voyage et te donne toutes les clés pour le réserver facilement, ce qui est un gain de temps énorme et une charge mentale en moins pour toi.",
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
