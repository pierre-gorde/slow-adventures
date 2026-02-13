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
      '30 min pour faire connaissance et comprendre tes envies (et aussi ce que tu ne veux pas)',
  },
  {
    label: 'Création de ton itinéraire',
    price: 'À partir de 300 €',
    description:
      'Je crée ton voyage 100% sur mesure et personnalisé en relation avec mes contacts locaux',
  },
  {
    label: 'Une demande spéciale ?',
    price: 'Sur devis',
    description: 'Voyages de noce, groupes, événements — on en discute ensemble',
  },
];
