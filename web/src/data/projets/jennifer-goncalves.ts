export const PROJET_SLUG = 'jennifer-goncalves';
export const PROJET_PASSWORD = 'jennifer-goncalves';
export const PROJET_COOKIE_NAME = 'sa_projet_jennifer_goncalves';
export const PROJET_COOKIE_MAX_AGE_DAYS = 90;
export const DEPARTURE_DATE_ISO = '2027-08-01T00:00:00+02:00';
export const DEPARTURE_LABEL = 'Août 2027';

export interface Traveler {
  name: string;
  role: string;
  age?: number;
  notes?: string[];
  toComplete?: boolean;
}

export interface VigilancePoint {
  title: string;
  detail: string;
}

export interface Deliverable {
  title: string;
  detail: string;
}

export const ESSENTIALS = [
  { value: '5', label: 'voyageurs', detail: 'toute la tribu embarque' },
  { value: '21', label: 'jours', detail: '3 semaines pour prendre le temps' },
  {
    value: '3',
    label: 'villes mythiques',
    detail: 'Los Angeles · Las Vegas · San Francisco',
  },
  {
    value: '~30 000 €',
    label: 'tout inclus',
    detail: 'vols, RV, hébergements, activités',
  },
];

export interface RouteStep {
  name: string;
  kind: 'city' | 'parks';
  caption: string;
}

export const ROUTE_STEPS: RouteStep[] = [
  {
    name: 'Los Angeles',
    kind: 'city',
    caption: "Le point de départ — l'arrivée en Californie, l'océan Pacifique",
  },
  {
    name: 'Les premiers parcs',
    kind: 'parks',
    caption: 'Déserts, canyons, décors de western',
  },
  {
    name: 'Las Vegas',
    kind: 'city',
    caption: "L'étape charnière — la démesure, et une vraie pause piscine",
  },
  {
    name: 'Les grands parcs',
    kind: 'parks',
    caption: "Les merveilles de l'Ouest, choisies pour vous cinq",
  },
  {
    name: 'San Francisco',
    kind: 'city',
    caption: "Le final — la baie, le Golden Gate, l'envol du retour",
  },
];

export const TRAVELERS: Traveler[] = [
  {
    name: 'Jennifer',
    role: "L'initiatrice du voyage",
    notes: [
      'Franco-américaine, de la famille à Washington et Chicago',
      "Veut en prendre plein les yeux : l'immensité, la beauté brute des paysages",
      'Curieuse de découvrir des réserves natives américaines',
      'Attend des spots cachés, hors des sentiers battus',
    ],
  },
  {
    name: 'Ton mari',
    role: 'Le sportif de la tribu',
    notes: [
      'VTT, marche : il aime bouger',
      'Mais aussi le farniente : piscine, plage, ne rien faire',
      'Tout ce qui est ludique lui parle — water parks en tête',
    ],
    toComplete: false,
  },
  {
    name: 'Les enfants',
    role: "Trois regards sur l'Ouest — 19, 16 et 12 ans",
    notes: [
      'Petits randonneurs, mais pas trop : moins de 4 h de rando par jour',
      'Des activités ludiques à chaque étape',
      "Des parcs d'attraction au programme",
      'Et des feux de camp le soir',
    ],
  },
];

export const ENVIES = [
  "En prendre plein les yeux : l'immensité et la beauté des paysages de l'Ouest",
  'Découvrir des réserves natives américaines',
  'Des activités ludiques pour les enfants — et pour le papa',
  "Des spots cachés, loin de la foule : « let's go »",
  'Des randonnées niveau moyen, tranquilles',
  'Du confort : plutôt hôtels que camping — et si camping, du standing',
  'Des vraies pauses farniente : motels avec piscine pour souffler',
];

export const A_EVITER = [
  'Les journées marathon : jamais une demi-journée entière sur la route',
  'Le programme surchargé qui épuise tout le monde',
  'Les focus gastronomie ou musique : pas vos priorités',
];

export const VIGILANCE: VigilancePoint[] = [
  {
    title: 'Envie de tout voir vs énergie réelle',
    detail:
      "Trois semaines, c'est long et court à la fois. La tentation sera de tout caser — et la fatigue s'accumulera.",
  },
  {
    title: 'Le temps passé sur la route',
    detail:
      "C'est LA crainte de ton mari, et elle est légitime : l'Ouest est immense, les distances peuvent piéger.",
  },
  {
    title: 'Premier road trip en famille',
    detail:
      "Vous n'avez jamais voyagé en itinérance : tout est nouveau, du RV aux check-ins qui s'enchaînent.",
  },
  {
    title: 'Août dans les parcs : haute saison',
    detail:
      "Certains parcs limitent l'accès en été et refusent l'entrée sans réservation.",
  },
];

export const INCLUSIONS = [
  "Réalisation de l'itinéraire de A à Z selon vos goûts, vos envies, et selon mes conseils d'experte",
  'Accompagnement avant, pendant et après le voyage',
  'Disponible sur WhatsApp 24h/24 pendant toute votre aventure',
  'Road book que vous recevrez dans le mois avant le départ : un véritable compagnon de voyage !',
];

export const INCLUSIONS_HIGHLIGHT =
  'Et surtout : une charge mentale en moins pour vous. Un voyage clé en main, 100 % sur mesure, fait pour votre tribu.';

export const DELIVERABLES: Deliverable[] = [
  {
    title: "L'itinéraire idéal, argumenté",
    detail:
      'Pour chaque spot conseillé : pourquoi ce lieu, pourquoi il est fait pour vous. De quoi te projeter vraiment.',
  },
  {
    title: 'Les randonnées à votre rythme',
    detail:
      'Une sélection niveau moyen, praticable à cinq, avec les panoramas qui valent chaque pas.',
  },
  {
    title: 'Les spots cachés',
    detail:
      'Les coins hors des sentiers battus, loin de la foule — ceux qui font les meilleurs souvenirs.',
  },
  {
    title: 'Les activités de la tribu',
    detail:
      'Water parks, VTT, réserves natives américaines : de quoi combler les sportifs comme les contemplatifs.',
  },
  {
    title: 'Le RV',
    detail:
      "L'agence de location adaptée à une tribu de 5 et à trois semaines de route.",
  },
  {
    title: 'Les nuits',
    detail:
      'Hôtels confort en priorité, campings avec standing quand ça vaut le coup, motels avec piscine pour les pauses. Emplacements réservés.',
  },
  {
    title: "L'enveloppe budgétaire",
    detail:
      'Tout inclus, vols compris, dans la fourchette des 30 000 € évoquée ensemble.',
  },
];
