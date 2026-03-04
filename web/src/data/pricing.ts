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
      '30 min pour se conna\u00eetre, cerner tes r\u00eaves et ce qui te fait vibrer\u2026 et poser les bases d\u2019un voyage qui sera vraiment le tien.',
    ],
  },
  {
    label: 'Cr\u00e9ation de ton itin\u00e9raire',
    price: '\u00c0 partir de 300 \u20ac',
    descriptions: [
      'Apr\u00e8s notre Discovery Call gratuit, un acompte de 100 \u20ac permet de lancer la cr\u00e9ation de ton voyage (d\u00e9duit du prix final).',
      'La version compl\u00e8te de ton itin\u00e9raire est envoy\u00e9e apr\u00e8s le r\u00e8glement du solde. Le tarif total d\u00e9pend de la dur\u00e9e et de la complexit\u00e9 de ton voyage\u00a0; il est d\u00e9fini et annonc\u00e9 lors du Discovery Call gratuit.',
      'Si besoin, l\u2019itin\u00e9raire est ajust\u00e9 avec toi pour qu\u2019il te corresponde \u00e0 100\u00a0%.',
    ],
  },
];
