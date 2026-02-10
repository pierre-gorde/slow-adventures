export interface ProcessStepData {
  number: number;
  title: string;
  description: string;
  icon?: string;
}

export const processSteps: ProcessStepData[] = [
  {
    number: 1,
    title: 'Échangeons',
    description:
      'Discovery call de 20 minutes gratuite pour faire connaissance et comprendre vos envies de voyage.',
  },
  {
    number: 2,
    title: 'Rêvons ensemble',
    description:
      'On explore vos inspirations, vos rythmes et ce qui fait battre votre cœur pour créer une vision commune.',
  },
  {
    number: 3,
    title: 'On crée ton voyage',
    description:
      'Itinéraire sur-mesure construit avec mes contacts locaux et mon expertise terrain aux Amériques.',
  },
  {
    number: 4,
    title: 'Tout est carré',
    description:
      'Planification détaillée jour par jour, réservations, logistique — vous n\u0027avez plus qu\u0027à profiter.',
  },
  {
    number: 5,
    title: 'Vis ton aventure',
    description:
      'Accompagnement pendant votre voyage avec un contact direct pour toute question ou imprévu.',
  },
];
