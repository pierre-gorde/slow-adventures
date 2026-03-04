export interface PricingData {
  label: string;
  price: string;
  descriptions?: string[];
}

export const pricingRows: PricingData[] = [
  {
    label: 'Discovery Call',
    price: 'Gratuit',
    descriptions: [
      '30 min pour se connaître, cerner tes rêves et ce qui te fait vibrer… et poser les bases d\u2019un voyage qui sera vraiment le tien.',
    ],
  },
  {
    label: 'Création de ton itinéraire',
    price: 'À partir de 300 €',
    descriptions: [
      'Après notre Discovery Call gratuit, un acompte de 100 € permet de lancer la création de ton voyage (déduit du prix final).',
      'Dès réception, je commence les recherches. La version complète de ton itinéraire (road book détaillé, liens de réservation et recommandations finales) est envoyée après le règlement du solde.',
      'Le tarif total dépend de la durée et de la complexité de ton voyage\u00a0; il est défini et annoncé lors du Discovery Call.',
    ],
  },
];
