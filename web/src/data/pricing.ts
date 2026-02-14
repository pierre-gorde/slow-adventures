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
      '30 min pour se connaître, cerner tes rêves et ce qui te fait vibrer\u2026 et poser les bases d\u2019un voyage qui sera vraiment le tien.',
  },
  {
    label: 'Création de ton itinéraire',
    price: 'À partir de 300 \u20AC',
    description:
      'Après notre rencontre et le versement de ton acompte de 100 \u20AC (déductible du prix final), je conçois ton voyage 100 % sur mesure et entièrement personnalisé.',
  },
  {
    label: 'Une demande spéciale ?',
    price: 'Sur devis',
    description:
      'Voyages de noce, groupes, événements \u2014 on en discute ensemble.',
  },
];
