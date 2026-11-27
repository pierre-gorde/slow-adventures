/**
 * Les circuits Slow Adventures.
 * Pour ajouter un circuit : ajouter une entrée dans `circuits` (la page,
 * le menu, le carrousel et le formulaire sont générés automatiquement).
 */
import type { ImageMetadata } from 'astro';

import parcsHero from '../assets/images/destinations/west-coast-usa.webp';
import parcsSlide from '../assets/images/destinations/gallery/west-coast/wc-2.webp';
import parcsCarte from '../assets/images/circuits/carte-parcs-nationaux-us.webp';
import wc1 from '../assets/images/destinations/gallery/west-coast/wc-1.webp';
import wc2 from '../assets/images/destinations/gallery/west-coast/wc-2.webp';
import wc3 from '../assets/images/destinations/gallery/west-coast/wc-3.webp';
import wc4 from '../assets/images/destinations/gallery/west-coast/wc-4.webp';
import wc5 from '../assets/images/destinations/gallery/west-coast/wc-5.webp';
import wc6 from '../assets/images/destinations/gallery/west-coast/wc-6.webp';
import wc7 from '../assets/images/destinations/gallery/west-coast/wc-7.webp';

import rocheusesHero from '../assets/homepage-carousel/bow-lake.webp';
import rocheusesSlide from '../assets/images/destinations/gallery/canada/02.webp';
import rocheusesCarte from '../assets/images/circuits/carte-rocheuses-canadiennes.webp';
import ca1 from '../assets/images/destinations/gallery/canada/01.webp';
import ca2 from '../assets/images/destinations/gallery/canada/02.webp';
import ca3 from '../assets/images/destinations/gallery/canada/03.webp';
import ca4 from '../assets/images/destinations/gallery/canada/04.webp';
import ca5 from '../assets/images/destinations/gallery/canada/05.webp';
import ca6 from '../assets/images/destinations/gallery/canada/06.webp';

import nycCoucherSoleil from '../assets/images/circuits/new-york/01-coucher-soleil-hudson.webp';
import nycArchitecture from '../assets/images/circuits/new-york/02-architecture-lower-manhattan.webp';
import nycMemorial from '../assets/images/circuits/new-york/03-memorial-911.webp';
import nycSkyline from '../assets/images/circuits/new-york/04-skyline-manhattan.webp';
import nycCarte from '../assets/images/circuits/carte-new-york-essentials.webp';
import nycStatue from '../assets/images/circuits/new-york/05-statue-de-la-liberte.webp';
import nycCentralParkAutomne from '../assets/images/circuits/new-york/06-central-park-automne.webp';
import nycMoma from '../assets/images/circuits/new-york/07-moma-nuit-etoilee.webp';
import nycCentralParkElena from '../assets/images/circuits/new-york/08-central-park-elena.webp';
import nycTopOfTheRock from '../assets/images/circuits/new-york/09-top-of-the-rock-nuit.webp';
import nycDumbo from '../assets/images/circuits/new-york/10-dumbo-manhattan-bridge.webp';

/** Partie d'une journée détaillée (« Matin », « Le soir »…). */
export interface CircuitEtapeBloc {
  titre?: string;
  texte?: string;
  items?: string[];
}

export interface CircuitEtape {
  jours: string;
  lieu: string;
  route?: string;
  texte: string;
  /** Programme détaillé de la journée (circuits en ville). */
  blocs?: CircuitEtapeBloc[];
  /** Encadré « Mon conseil » sous la journée. */
  conseil?: string;
}

export interface CircuitInfo {
  label: string;
  valeur: string;
}

export interface CircuitEvenements {
  titre: string;
  intro: string;
  lignes: { nom: string; quand: string; ou: string }[];
  note: string;
}

export interface CircuitOption {
  label: string;
  texte: string;
}

export interface CircuitFormulaire {
  hebergements: string[];
  /** Laisser vide si le circuit n'a pas de véhicule (city trip). */
  vehicules: string[];
  /** Option supplémentaire (Oui / Non), propre au circuit. */
  extra?: string;
}

export interface Circuit {
  slug: string;
  nom: string;
  duree: string;
  trajet: string;
  tags: string[];
  accroche: string;
  pourquoi: string;
  etapes: CircuitEtape[];
  options: CircuitOption[];
  formulaire: CircuitFormulaire;
  hero: ImageMetadata;
  heroAlt: string;
  slide: ImageMetadata;
  slideAlt: string;
  gallery: ImageMetadata[];
  /** Carte du trajet (facultative : pas de carte pour un city trip). */
  carte?: ImageMetadata;
  carteAlt?: string;
  /** Partie de la photo d'en-tête à garder visible (CSS object-position). */
  heroPosition?: string;
  metaTitle: string;
  metaDescription: string;
  /** Section « En bref » : durée, rythme, ambiance… */
  enBref?: CircuitInfo[];
  /** Remplace la liste commune « Ce qui est inclus ». */
  inclus?: string[];
  petitPlus?: { titre: string; texte: string };
  evenements?: CircuitEvenements;
  conseils?: CircuitInfo[];
}

export const circuits: Circuit[] = [
  {
    slug: 'parcs-nationaux-us',
    nom: 'Les parcs nationaux US',
    duree: '2 semaines',
    trajet: 'Boucle Los Angeles → Los Angeles',
    tags: ['Grands espaces', 'Road trip', 'En famille', 'Rythme équilibré'],
    accroche:
      'Grand Canyon, Zion, Bryce, Death Valley… L’Ouest américain dans ce qu’il a de plus spectaculaire, à ton rythme.',
    pourquoi:
      'L’Ouest américain dans ce qu’il a de plus spectaculaire, en une boucle pensée pour en profiter vraiment. On part des palmiers de Los Angeles pour traverser les déserts de Californie, on rejoint les roches rouges de l’Arizona et le vertige du Grand Canyon, puis les canyons sculptés de l’Utah. Deux jours entre les néons de Las Vegas et les roches rouges du Nevada, une dernière nuit au cœur de la Vallée de la Mort, et retour au Pacifique. Deux semaines de paysages qui semblent venir d’une autre planète, sans jamais avoir l’impression de courir.',
    enBref: [
      { label: 'Durée', valeur: '2 semaines, en boucle depuis Los Angeles' },
      {
        label: 'Rythme',
        valeur:
          'Équilibré\u00a0: une à deux nuits par étape, jamais plus de 4\u00a0h\u00a030 de route dans la journée',
      },
      {
        label: 'Ambiance',
        valeur:
          'Road trip dans les grands espaces de l’Ouest, entre déserts, canyons et parcs mythiques',
      },
      {
        label: 'Idéal pour',
        valeur:
          'Un premier road trip dans l’Ouest américain, en couple, en famille ou entre amis',
      },
      {
        label: 'Où dormir',
        valeur:
          'Selon tes envies\u00a0: camping, lodges et motels de charme, hôtels supérieurs, ou un mélange des trois',
      },
      {
        label: 'Quand partir',
        valeur:
          'Au printemps et à l’automne, pour des températures plus douces dans les déserts. L’été est possible, mais très chaud à Death Valley',
      },
    ],
    etapes: [
      {
        jours: 'Jours 1 et 2',
        lieu: 'Los Angeles',
        texte:
          'Arrivée et deux jours pour savourer la ville : Universal Studios, Santa Monica, Venice Beach et Griffith Observatory au coucher du soleil.',
      },
      {
        jours: 'Jour 3',
        lieu: 'Joshua Tree',
        route: 'environ 2 h 30 de route',
        texte:
          'En passant par Palm Springs, les arbres de Josué, les rochers géants et l’un des plus beaux ciels étoilés de Californie.',
      },
      {
        jours: 'Jours 4 et 5',
        lieu: 'Sedona',
        route: 'environ 4 h 30 de route',
        texte:
          'Des randonnées au milieu des roches rouges, une petite ville à l’énergie unique et des couchers de soleil incandescents.',
      },
      {
        jours: 'Jours 6 et 7',
        lieu: 'Grand Canyon',
        route: 'environ 2 h de route',
        texte:
          'Deux jours sur la rive sud pour vivre le canyon à différentes heures, du lever du soleil aux sentiers qui plongent dans la roche.',
      },
      {
        jours: 'Jours 8 et 9',
        lieu: 'Page',
        route: 'environ 2 h 30 de route',
        texte:
          'Antelope Canyon et ses jeux de lumière, Horseshoe Bend et les eaux bleues du lac Powell.',
      },
      {
        jours: 'Jour 10',
        lieu: 'Bryce Canyon',
        route: 'environ 2 h 30 de route',
        texte:
          'Un amphithéâtre de cheminées de fées orange et rose, à couper le souffle.',
      },
      {
        jours: 'Jours 11 et 12',
        lieu: 'Zion',
        route: 'environ 1 h 30 de route',
        texte:
          'Les falaises monumentales, la rivière Virgin et quelques-unes des plus belles randonnées de l’Ouest.',
      },
      {
        jours: 'Jours 13 et 14',
        lieu: 'Las Vegas',
        route: 'environ 2 h 30 de route',
        texte:
          'Deux jours pour le contraste : néons et démesure le soir, et en journée, Red Rock Canyon ou la Valley of Fire, à moins d’une heure de la ville.',
      },
      {
        jours: 'Jour 15',
        lieu: 'Death Valley',
        route: 'environ 2 h de route',
        texte:
          'Les dunes de Mesquite, Badwater Basin et Zabriskie Point : le point le plus bas d’Amérique du Nord, et des paysages lunaires.',
      },
      {
        jours: 'Jour 16',
        lieu: 'Retour à Los Angeles',
        route: 'environ 4 h 30 de route',
        texte: 'Restitution du véhicule et vol retour.',
      },
    ],
    petitPlus: {
      titre: 'Le petit plus\u00a0: une semaine de plus jusqu’à San Francisco',
      texte:
        'Prolonge ton voyage d’une semaine\u00a0: Sequoia, Yosemite et San Francisco, avec retour depuis San Francisco.',
    },
    options: [
      {
        label: 'Hébergement',
        texte:
          'camping, lodges et motels de charme, hôtels supérieurs, ou un mélange des trois',
      },
      {
        label: 'Véhicule',
        texte: 'SUV, van aménagé, tente de toit ou camping-car',
      },
    ],
    formulaire: {
      hebergements: [
        'Camping',
        'Lodges et motels de charme',
        'Hôtels supérieurs',
        'Un mélange',
      ],
      vehicules: ['SUV', 'Van aménagé', 'Tente de toit', 'Camping-car'],
      extra:
        'Prolonger d’une semaine : Sequoia, Yosemite et San Francisco (retour depuis San Francisco)',
    },
    hero: parcsHero,
    heroAlt: 'Route droite à travers le désert de l’Ouest américain',
    slide: parcsSlide,
    slideAlt: 'Voyageuse sur les roches ondulées de l’Ouest américain',
    gallery: [wc1, wc2, wc3, wc4, wc5, wc6, wc7],
    carte: parcsCarte,
    carteAlt:
      'Carte du circuit Les parcs nationaux US : Los Angeles, Joshua Tree, Sedona, Grand Canyon, Page, Bryce Canyon, Zion, Las Vegas, Death Valley, retour à Los Angeles',
    metaTitle:
      'Les parcs nationaux US — Circuit de 2 semaines | Slow Adventures',
    metaDescription:
      'Circuit de 2 semaines en boucle depuis Los Angeles : Grand Canyon, Zion, Bryce, Death Valley. Un road trip imaginé par Elena, à ton rythme.',
  },
  {
    slug: 'rocheuses-canadiennes',
    nom: 'Les Rocheuses canadiennes',
    duree: '2 semaines',
    trajet: 'Boucle Calgary → Calgary',
    tags: [
      'Grands espaces',
      'Nature & faune',
      'Randonnée',
      'Hors des sentiers battus',
      'Rythme équilibré',
    ],
    accroche:
      'Lacs turquoise, glaciers et forêts à perte de vue, entre Banff et Jasper.',
    pourquoi:
      'Deux semaines entièrement consacrées aux Rocheuses, pour enfin prendre le temps. Des lacs d’un turquoise irréel, des glaciers que l’on touche presque, des sources chaudes au milieu des montagnes, et des ours, des wapitis et des mouflons au bord des routes. On sillonne l’Alberta et la Colombie-Britannique, de Banff à Jasper par l’Icefields Parkway, l’une des plus belles routes du monde. Et pour finir, un détour par Abraham Lake, un lac sauvage que peu de voyageurs connaissent. Un circuit pour ceux qui aiment marcher, respirer et se sentir tout petits face à la nature.',
    enBref: [
      { label: 'Durée', valeur: '2 semaines, en boucle depuis Calgary' },
      {
        label: 'Rythme',
        valeur:
          'Équilibré\u00a0: deux à trois nuits par étape pour prendre le temps de randonner, jamais plus de 4\u00a0h de route dans la journée',
      },
      {
        label: 'Ambiance',
        valeur:
          'Road trip nature au cœur des Rocheuses, entre lacs turquoise, glaciers et faune sauvage',
      },
      {
        label: 'Idéal pour',
        valeur:
          'Les amoureux de nature et de randonnée, en couple, en famille ou entre amis',
      },
      {
        label: 'Où dormir',
        valeur:
          'Selon tes envies\u00a0: camping, lodges et chalets de montagne, hôtels supérieurs, ou un mélange des trois',
      },
      {
        label: 'Quand partir',
        valeur:
          'De juin à septembre, quand les journées sont longues, les sentiers ouverts et la faune active. Septembre pour les couleurs d’automne et moins de monde',
      },
    ],
    etapes: [
      {
        jours: 'Jour 1',
        lieu: 'Calgary',
        texte:
          'Arrivée, prise du véhicule et première soirée dans l’Ouest canadien.',
      },
      {
        jours: 'Jours 2 à 4',
        lieu: 'Banff',
        route: 'environ 1 h 30 de route',
        texte:
          'Johnston Canyon et ses passerelles au-dessus des cascades, le lac Minnewanka, la petite ville de Banff et une soirée dans les sources chaudes face aux montagnes.',
      },
      {
        jours: 'Jours 5 et 6',
        lieu: 'Radium Hot Springs',
        route: 'environ 1 h 30 de route',
        texte:
          'La traversée du parc de Kootenay, entre Marble Canyon et les Paint Pots, des bassins d’argile ocre. Puis deux jours au calme dans une petite ville de montagne, réputée pour ses sources chaudes et ses mouflons.',
      },
      {
        jours: 'Jours 7 à 9',
        lieu: 'Lake Louise',
        route: 'environ 1 h 45 de route',
        texte:
          'Le lac Louise, Moraine Lake (accessible en navette) et deux escapades dans le parc de Yoho : Emerald Lake et les chutes Takakkaw.',
      },
      {
        jours: 'Jours 10 à 12',
        lieu: 'Jasper',
        route: 'environ 4 h de route par l’Icefields Parkway',
        texte:
          'Une journée entière sur l’Icefields Parkway, entre Bow Lake, Peyto Lake et le glacier Athabasca. Puis le plus sauvage des parcs des Rocheuses : le lac Maligne et Spirit Island, le Maligne Canyon et des ciels étoilés exceptionnels.',
      },
      {
        jours: 'Jours 13 et 14',
        lieu: 'Abraham Lake',
        route: 'environ 3 h de route',
        texte:
          'Un lac turquoise immense, bordé de montagnes, loin de la foule. Deux jours pour randonner, pagayer et profiter du silence.',
      },
      {
        jours: 'Jour 15',
        lieu: 'Calgary',
        route: 'environ 3 h de route',
        texte: 'Restitution du véhicule et vol retour.',
      },
    ],
    options: [
      {
        label: 'Hébergement',
        texte:
          'camping, lodges et chalets de montagne, hôtels supérieurs, ou un mélange des trois',
      },
      {
        label: 'Véhicule',
        texte: 'SUV, van aménagé ou camping-car',
      },
      {
        label: 'Commence ton voyage par l’océan (4 jours)',
        texte: 'Vancouver et Whistler, avec arrivée à Vancouver',
      },
    ],
    formulaire: {
      hebergements: [
        'Camping',
        'Lodges et chalets de montagne',
        'Hôtels supérieurs',
        'Un mélange',
      ],
      vehicules: ['SUV', 'Van aménagé', 'Camping-car'],
      extra:
        'Commencer par l’océan : Vancouver et Whistler (4 jours, arrivée à Vancouver)',
    },
    hero: rocheusesHero,
    heroAlt: 'Bow Lake et ses eaux turquoise au pied des Rocheuses canadiennes',
    slide: rocheusesSlide,
    slideAlt: 'Peyto Lake, lac turquoise au cœur des Rocheuses canadiennes',
    gallery: [ca1, ca2, ca3, ca4, ca5, ca6],
    carte: rocheusesCarte,
    carteAlt:
      'Carte du circuit Les Rocheuses canadiennes : Calgary, Banff, Radium Hot Springs, Lake Louise, Jasper, Abraham Lake, retour à Calgary',
    metaTitle:
      'Les Rocheuses canadiennes — Circuit de 2 semaines | Slow Adventures',
    metaDescription:
      'Circuit de 2 semaines en boucle depuis Calgary : Banff, Lake Louise, l’Icefields Parkway, Jasper et Abraham Lake. Un road trip imaginé par Elena.',
  },
  {
    slug: 'new-york-essentials',
    nom: 'New York Essentials',
    duree: '6 jours',
    trajet: 'City trip à New York',
    tags: [
      'Incontournables',
      'Friperies',
      'Food',
      'Vues panoramiques',
      'Soirées',
      'Rythme soutenu',
    ],
    accroche:
      'Lever de soleil sur le Brooklyn Bridge, friperies de Williamsburg, ferry au coucher du soleil, jazz club et match NBA.',
    pourquoi:
      'Six jours pour cocher les incontournables de New York sans passer à côté de la ville des New-Yorkais : lever de soleil sur le Brooklyn Bridge, friperies de Williamsburg, ferry au coucher du soleil, jazz club et match NBA. Cet itinéraire, je l’ai fait moi-même. C’est celui que je referais les yeux fermés.',
    enBref: [
      { label: 'Durée', valeur: '6 jours / 5 nuits' },
      {
        label: 'Rythme',
        valeur: 'Soutenu : on marche beaucoup, prévois de bonnes baskets',
      },
      {
        label: 'Ambiance',
        valeur: 'City trip, entre icônes et coins plus locaux',
      },
      {
        label: 'Idéal pour',
        valeur:
          'Un premier voyage à New York, en couple, en famille ou entre amis',
      },
      {
        label: 'Où dormir',
        valeur:
          'Midtown (autour de Times Square), pour tout faire à pied ou en métro',
      },
      {
        label: 'Quand partir',
        valeur:
          'Toute l’année. Coup de cœur pour l’automne et la période des fêtes',
      },
    ],
    etapes: [
      {
        jours: 'Jour 1',
        lieu: 'New York, New York',
        texte:
          'Arrivée en fin de matinée et installation à l’hôtel, puis première balade pour s’acclimater à la ville.',
        blocs: [
          {
            items: [
              'Union Square, le cœur animé du sud de Manhattan',
              'Flatiron Building, l’immeuble en forme de fer à repasser',
              'East Village : Tompkins Square Park, puis le Strand Book Store, librairie mythique où l’on peut passer des heures',
            ],
          },
          {
            titre: 'Le soir',
            texte: 'Times Square illuminé, juste en bas de l’hôtel.',
          },
        ],
      },
      {
        jours: 'Jour 2',
        lieu: 'Brooklyn au lever du soleil & soirée Broadway',
        texte:
          'Réveil aux aurores pour voir le soleil se lever sur Manhattan depuis le pont de Brooklyn.',
        blocs: [
          {
            titre: 'Tôt le matin',
            items: [
              'Arrivée en métro à la station Brooklyn Bridge–City Hall un peu avant le lever du soleil',
              'Traversée du pont de Brooklyn : place-toi au milieu du pont, le soleil se lève côté Brooklyn',
              'DUMBO et sa vue culte sur le Manhattan Bridge',
              'Balade sur la Brooklyn Heights Promenade, puis un café ou un petit-déj dans le quartier',
            ],
          },
          {
            titre: 'Fin de matinée : Williamsburg',
            texte:
              'Direction Williamsburg, le quartier des friperies : plus tu t’enfonces dans ses rues, plus les boutiques vintage se multiplient. Parfait pour chiner la pièce que personne d’autre n’aura.',
          },
          {
            titre: 'Après-midi',
            texte: 'Retour à Manhattan, côté Union Square.',
          },
          {
            titre: 'Le soir',
            texte:
              'Spectacle à Broadway, avec un verre sur un rooftop avant ou après.',
          },
        ],
        conseil:
          'La plupart des théâtres de Broadway sont fermés le lundi, on cale donc le spectacle un autre soir.',
      },
      {
        jours: 'Jour 3',
        lieu: 'Central Park & vues sur la skyline',
        texte:
          'Une journée entre nature en pleine ville, art et la plus belle vue sur Manhattan.',
        blocs: [
          {
            titre: 'Matin',
            items: [
              'Longue balade à Central Park',
              'Petit-déj ou brunch dans un vrai diner new-yorkais, façon luncheonette',
              'Le MoMA (billets à prendre en ligne à l’avance)',
            ],
          },
          {
            titre: 'Après-midi',
            items: [
              'Marche sur la 5th Avenue : cathédrale Saint-Patrick, Rockefeller Center et boutiques',
              'Top of the Rock : arrive avant le coucher du soleil pour voir la ville de jour, puis s’illuminer, avec l’Empire State Building juste en face',
            ],
          },
        ],
      },
      {
        jours: 'Jour 4',
        lieu: 'Statue de la Liberté, Wall Street & Lower Manhattan',
        texte:
          'Petit-déj dans un diner près de l’hôtel avant de descendre vers le sud.',
        blocs: [
          {
            titre: 'Matin',
            items: [
              'Ferry de Staten Island, gratuit, avec une super vue sur la Statue de la Liberté. À l’aller, place-toi côté droit ; au retour, côté gauche',
              'Petit café ou balade à Staten Island, puis retour',
              'Wall Street, le Charging Bull, Ground Zero et l’Oculus',
            ],
          },
          {
            titre: 'Après-midi',
            items: [
              'Chinatown : Mott Street, Canal Street, Doyers Street et Columbus Park, parfait pour déjeuner',
              'Little Italy : Mulberry Street, Ferrara Bakery & Café et l’épicerie Di Palo’s',
            ],
          },
          {
            titre: 'Fin d’après-midi',
            texte:
              'NYC Ferry (ligne East River) depuis Wall St/Pier 11 jusqu’à Hunter’s Point South Park, pour un coucher de soleil sur toute la skyline. Pars bien avant le coucher du soleil. Plan B : un rooftop.',
          },
          {
            titre: 'Le soir',
            texte: 'Jazz club ! Greenwich Village en regorge.',
          },
        ],
      },
      {
        jours: 'Jour 5',
        lieu: 'Midtown, temps libre & soirée NBA',
        texte:
          'Les grands classiques de Midtown le matin, puis un après-midi à ta façon.',
        blocs: [
          {
            titre: 'Matin',
            items: [
              'Grand Central, la New York Public Library et Bryant Park',
              'Pause dans un diner, comme The Comfort Diner',
              'Selon tes envies : le nord de Central Park, ou le Roosevelt Island Tramway pour une vue aérienne sur l’East River',
              'L’Empire State Building',
            ],
          },
          {
            titre: 'Après-midi libre, à composer selon tes envies',
            items: [
              'West Village et la High Line',
              'Chelsea Market',
              'Gantry Plaza State Park',
              'Les bonnes adresses souvenirs, comme Grand Slam',
            ],
          },
          {
            titre: 'Le soir',
            texte:
              'Match NBA (saison d’octobre à avril). Hors saison, place à Broadway ou à un dernier rooftop.',
          },
        ],
      },
      {
        jours: 'Jour 6',
        lieu: 'See you soon, New York',
        texte: 'Check-out, un dernier café, et direction l’aéroport.',
      },
    ],
    petitPlus: {
      titre: 'Le petit plus : un jour de plus pour Harlem',
      texte:
        'Si tu peux rester une journée de plus, file à Harlem : ses rues de brownstones, son histoire musicale et ses adresses soul food. Et si tu as la chance d’y être un dimanche, assiste à une messe gospel sur place.',
    },
    evenements: {
      titre: 'Selon la saison : les parades à ne pas manquer',
      intro:
        'Tomber sur une parade, c’est la cerise sur le gâteau. Si tes dates coïncident, on l’intègre au programme.',
      lignes: [
        {
          nom: 'Village Halloween Parade',
          quand: '31 octobre, en soirée',
          ou: '6th Avenue, Greenwich Village',
        },
        {
          nom: 'Macy’s Thanksgiving Day Parade',
          quand: '4e jeudi de novembre, le matin',
          ou: 'De Central Park West à Herald Square',
        },
        {
          nom: 'Sapin du Rockefeller Center',
          quand: 'De fin novembre à mi-janvier environ',
          ou: 'Rockefeller Center',
        },
        {
          nom: 'St. Patrick’s Day Parade',
          quand: 'Autour du 17 mars',
          ou: '5th Avenue',
        },
        {
          nom: 'NYC Pride March',
          quand: 'Dernier dimanche de juin',
          ou: 'Lower Manhattan',
        },
      ],
      note: 'Les dates exactes changent chaque année : je les vérifie avec toi au moment de ta demande.',
    },
    conseils: [
      {
        label: 'Métro',
        valeur:
          'Paie directement en sans contact (carte bancaire ou téléphone) avec le système OMNY. Le trajet coûte 3 $, et après 12 trajets sur 7 jours, tout le reste est gratuit (35 $ maximum par semaine).',
      },
      {
        label: 'Pourboire',
        valeur: 'Environ 18 à 20 % au restaurant, c’est la norme là-bas.',
      },
      {
        label: 'Formalités',
        valeur: 'L’ESTA est obligatoire.',
      },
    ],
    options: [
      {
        label: 'Hôtel',
        texte:
          'à Midtown, du simple et bien placé au haut de gamme, selon ton budget',
      },
      {
        label: 'Billets',
        texte:
          'Broadway, match NBA, Top of the Rock, MoMA, Empire State Building, à ajouter selon tes envies',
      },
      {
        label: 'Ajoute un jour à Harlem',
        texte: 'brownstones, histoire musicale, soul food et messe gospel',
      },
    ],
    formulaire: {
      hebergements: [
        'Hôtel simple et bien placé',
        'Hôtel de charme',
        'Hôtel haut de gamme',
      ],
      vehicules: [],
      extra: 'Ajouter un jour à Harlem',
    },
    hero: nycSkyline,
    heroAlt:
      'La skyline de Lower Manhattan et le One World Trade Center vus depuis l’eau',
    heroPosition: 'center 68%',
    carte: nycCarte,
    carteAlt:
      'Carte du circuit New York Essentials : Central Park, Times Square, High Line, East Village, Chinatown, Wall Street, Statue de la Liberté, Brooklyn Bridge, Williamsburg, Hunter’s Point',
    slide: nycCoucherSoleil,
    slideAlt:
      'Voyageuse de dos face à la skyline au coucher du soleil, au bord de l’Hudson',
    gallery: [
      nycCoucherSoleil,
      nycCentralParkElena,
      nycDumbo,
      nycTopOfTheRock,
      nycStatue,
      nycSkyline,
      nycCentralParkAutomne,
      nycMoma,
      nycArchitecture,
      nycMemorial,
    ],
    metaTitle: 'New York Essentials — City trip de 6 jours | Slow Adventures',
    metaDescription:
      'Six jours à New York imaginés par Elena : Brooklyn Bridge au lever du soleil, friperies, ferry au coucher du soleil, jazz club et match NBA.',
  },
];

/** Section « Ce qui est inclus », commune à tous les circuits. */
export const circuitInclus: string[] = [
  'Les vols',
  'Les hébergements',
  'La location du véhicule',
  'Les activités prévues au programme',
  'L’itinéraire détaillé et une eSim',
  'Une assistance 24 h/24 pendant ton voyage',
  'Des options d’annulation flexibles et la protection de tes fonds',
  'Un voyage ajusté à tes dates et à tes options',
];

export const circuitInclusNote =
  'Les prestations exactes sont confirmées dans ton devis, selon ta destination, la saison et tes envies.';

/** Section « Combien ça coûte ? », commune à tous les circuits. */
export const circuitPrix =
  'Le prix de ton voyage dépend de tes dates, du nombre de voyageurs et des options choisies. Tu reçois un devis précis et sans engagement dans la semaine qui suit ta demande.';

export const circuitHref = (c: Circuit): string => `/circuits/${c.slug}/`;
