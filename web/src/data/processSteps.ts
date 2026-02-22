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
      'Discovery Call gratuit de 30 minutes pour parler de toi, de ton projet et de ce qui ferait vraiment battre ton cœur.',
  },
  {
    number: 2,
    title: 'Ton rêve prend vie',
    description:
      "Création complète de ton itinéraire personnalisé\u00A0: recherches, sélection des hébergements, recommandations d'expériences, conseils pratiques et élaboration de ton road book.",
  },
  {
    number: 3,
    title: 'Prépare ton sac',
    description:
      'Une fois ton programme validé ensemble, tu recevras ton road book (dématérialisé et physique) quelques semaines avant ton départ\u00A0!',
  },
  {
    number: 4,
    title: 'Vis ton aventure',
    description:
      "Profite de tes vacances l'esprit libre, je reste disponible sur WhatsApp pour t'assister et te guider tout au long du voyage.",
  },
];
