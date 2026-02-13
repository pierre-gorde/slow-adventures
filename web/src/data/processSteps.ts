export interface ProcessStepData {
  number: number;
  title: string;
  description: string;
  icon?: string;
}

export const processSteps: ProcessStepData[] = [
  {
    number: 1,
    title: 'Faisons connaissance',
    description:
      'Discovery call de 30 minutes gratuite pour faire connaissance et comprendre tes envies de voyage.',
  },
  {
    number: 2,
    title: 'Rêvons ensemble',
    description:
      'On explore tes inspirations, tes rythmes et ce qui fait battre ton cœur pour créer une vision commune.',
  },
  {
    number: 3,
    title: 'Créons ensemble',
    description:
      'Itinéraire sur-mesure construit avec mes contacts locaux et mon expertise terrain aux Amériques.',
  },
  {
    number: 4,
    title: "C'est parti",
    description:
      "Planification détaillée jour par jour, réservations, logistique — tu n'as plus qu'à profiter.",
  },
  {
    number: 5,
    title: 'Vis ton aventure',
    description:
      'Accompagnement pendant ton voyage avec un contact direct pour toute question ou imprévu.',
  },
];
