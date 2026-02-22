export interface PricingData {
  label: string;
  price: string;
  description?: string;
}

export const pricingRows: PricingData[] = [
  {
    label: 'Discovery Call',
    price: 'Gratuit',
    description:
      '30 min pour se conna\u00eetre, cerner tes r\u00eaves et ce qui te fait vibrer\u2026 et poser les bases d\u2019un voyage qui sera vraiment le tien.',
  },
  {
    label: 'Cr\u00e9ation de ton itin\u00e9raire',
    price: '\u00c0 partir de 300 \u20ac',
    description:
      'Apr\u00e8s notre Discovery Call gratuit, un acompte de 100 \u20ac permet de lancer la cr\u00e9ation de ton itin\u00e9raire. Cet acompte est bien s\u00fbr d\u00e9duit du prix final.',
  },
];
