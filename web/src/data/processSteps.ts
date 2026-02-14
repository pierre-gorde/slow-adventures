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
      'Discovery call de 30 minutes gratuit pour faire connaissance et comprendre tes envies de voyage.',
  },
  {
    number: 2,
    title: 'Rêvons ensemble',
    description:
      'On explore tes inspirations, tes rythmes et ce qui fait battre ton cœur pour créer le voyage de tes rêves.',
  },
  {
    number: 3,
    title: 'Créons ensemble',
    description:
      'Ton itinéraire sur mesure, 100 % toi, pensé grâce à ma connaissance du terrain et à mon expérience de Travel Planner.',
  },
  {
    number: 4,
    title: 'Prépare ton sac',
    description:
      'Une fois ton programme validé ensemble, tu recevras un road book (dématérialisé et physique) dans les 2 semaines avant ton départ !',
  },
  {
    number: 5,
    title: 'Vis ton aventure',
    description:
      "Profite de tes vacances l'esprit libre, je suis là sur WhatsApp pour t'assister et te guider tout au long du voyage.",
  },
];
