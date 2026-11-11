import { CALENDLY_URL, WHATSAPP_URL } from './contact';

export interface ProcessStepLink {
  label: string;
  href: string;
  /** true : ouvre la fenêtre Calendly. */
  calendly?: boolean;
}

export interface ProcessStepData {
  number: number;
  title: string;
  description: string;
  icon?: string;
  /** Liens affichés à la fin de la description, séparés par « ou ». */
  links?: ProcessStepLink[];
}

export const processSteps: ProcessStepData[] = [
  {
    number: 1,
    title: 'Choisis ton rêve.',
    description:
      'Chaque circuit a son itinéraire jour par jour, son rythme et son ambiance. Une question avant de te lancer ? ',
    links: [
      { label: 'Écris-moi sur WhatsApp', href: WHATSAPP_URL },
      { label: 'réserve 15 min avec moi', href: CALENDLY_URL, calendly: true },
    ],
  },
  {
    number: 2,
    title: 'Dis-nous quand et comment.',
    description:
      'Tes dates, le nombre de voyageurs et tes options : gamme d’hébergement, véhicule, version courte ou longue.',
  },
  {
    number: 3,
    title: 'Reçois ton devis.',
    description:
      'Notre agence partenaire te confirme ton voyage et son prix exact, selon tes dates et les disponibilités, dans la semaine qui suit ta demande. Réservations et paiement sécurisé sont pris en charge.',
  },
  {
    number: 4,
    title: 'Vis ton aventure.',
    description:
      'Tu pars l’esprit libre, avec une assistance pendant tout ton voyage.',
  },
];
