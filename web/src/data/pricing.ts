export interface PricingData {
  label: string;
  price: string;
  description?: string;
}

export const pricingRows: PricingData[] = [
  {
    label: 'Discovery Call',
    price: 'Gratuit',
    description: '20 minutes pour faire connaissance et comprendre vos envies',
  },
  {
    label: "Création d'itinéraire",
    price: 'À partir de 300 €',
    description: 'Itinéraire sur-mesure 100% personnalisé avec contacts locaux',
  },
  {
    label: 'Accompagnement complet',
    price: 'Sur devis',
    description:
      'De la planification à l\u0027accompagnement terrain pendant le voyage',
  },
];
