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

export interface CircuitEtape {
  jours: string;
  lieu: string;
  route?: string;
  texte: string;
}

export interface CircuitOption {
  label: string;
  texte: string;
}

export interface CircuitFormulaire {
  hebergements: string[];
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
  carte: ImageMetadata;
  carteAlt: string;
  metaTitle: string;
  metaDescription: string;
}

export const circuits: Circuit[] = [
  {
    slug: 'parcs-nationaux-us',
    nom: 'Les parcs nationaux US',
    duree: '16 jours',
    trajet: 'Boucle Los Angeles → Los Angeles',
    tags: ['Grands espaces', 'Road trip', 'En famille', 'Rythme équilibré'],
    accroche:
      'Grand Canyon, Zion, Bryce, Death Valley… L’Ouest américain dans ce qu’il a de plus spectaculaire, à ton rythme.',
    pourquoi:
      'L’Ouest américain dans ce qu’il a de plus spectaculaire, en une boucle pensée pour en profiter vraiment. On part des palmiers de Los Angeles pour traverser les déserts de Californie, on rejoint les roches rouges de l’Arizona et le vertige du Grand Canyon, puis les canyons sculptés de l’Utah. Une soirée dans les lumières du Nevada à Las Vegas, une dernière nuit au cœur de la Vallée de la Mort, et retour au Pacifique. Deux semaines de paysages qui semblent venir d’une autre planète, sans jamais avoir l’impression de courir.',
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
        route: 'environ 4 h 30',
        texte:
          'Des randonnées au milieu des roches rouges, une petite ville à l’énergie unique et des couchers de soleil incandescents.',
      },
      {
        jours: 'Jours 6 et 7',
        lieu: 'Grand Canyon',
        route: 'environ 2 h',
        texte:
          'Deux jours sur la rive sud pour vivre le canyon à différentes heures, du lever du soleil aux sentiers qui plongent dans la roche.',
      },
      {
        jours: 'Jours 8 et 9',
        lieu: 'Page',
        route: 'environ 2 h 30',
        texte:
          'Antelope Canyon et ses jeux de lumière, Horseshoe Bend et les eaux bleues du lac Powell.',
      },
      {
        jours: 'Jour 10',
        lieu: 'Bryce Canyon',
        route: 'environ 2 h 30',
        texte:
          'Un amphithéâtre de cheminées de fées orange et rose, à couper le souffle.',
      },
      {
        jours: 'Jours 11 et 12',
        lieu: 'Zion',
        route: 'environ 1 h 30',
        texte:
          'Les falaises monumentales, la rivière Virgin et quelques-unes des plus belles randonnées de l’Ouest.',
      },
      {
        jours: 'Jours 13 et 14',
        lieu: 'Las Vegas',
        route: 'environ 2 h 30',
        texte: 'Une soirée pour le contraste, entre néons et démesure.',
      },
      {
        jours: 'Jour 15',
        lieu: 'Death Valley',
        route: 'environ 2 h',
        texte:
          'Les dunes de Mesquite, Badwater Basin et Zabriskie Point : le point le plus bas d’Amérique du Nord, et des paysages lunaires.',
      },
      {
        jours: 'Jour 16',
        lieu: 'Retour à Los Angeles',
        route: 'environ 4 h 30',
        texte: 'Restitution du véhicule et vol retour.',
      },
    ],
    options: [
      {
        label: 'Hébergement',
        texte: 'camping, lodges et motels de charme, ou hôtels supérieurs',
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
      ],
      vehicules: ['SUV', 'Van aménagé', 'Tente de toit', 'Camping-car'],
    },
    hero: parcsHero,
    heroAlt: 'Route droite à travers le désert de l’Ouest américain',
    slide: parcsSlide,
    slideAlt: 'Voyageuse sur les roches ondulées de l’Ouest américain',
    gallery: [wc1, wc2, wc3, wc4, wc5, wc6, wc7],
    carte: parcsCarte,
    carteAlt:
      'Carte du circuit Les parcs nationaux US : Los Angeles, Joshua Tree, Sedona, Grand Canyon, Page, Bryce Canyon, Zion, Las Vegas, Death Valley, retour à Los Angeles',
    metaTitle: 'Les parcs nationaux US — Circuit 16 jours | Slow Adventures',
    metaDescription:
      'Circuit de 16 jours en boucle depuis Los Angeles : Grand Canyon, Zion, Bryce, Death Valley. Un road trip imaginé par Elena, à ton rythme.',
  },
  {
    slug: 'rocheuses-canadiennes',
    nom: 'Les Rocheuses canadiennes',
    duree: '15 jours',
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
      'Quinze jours entièrement consacrés aux Rocheuses, pour enfin prendre le temps. Des lacs d’un turquoise irréel, des glaciers que l’on touche presque, des sources chaudes au milieu des montagnes, et des ours, des wapitis et des mouflons au bord des routes. On sillonne l’Alberta et la Colombie-Britannique, de Banff à Jasper par l’Icefields Parkway, l’une des plus belles routes du monde. Et pour finir, un détour par Abraham Lake, un lac sauvage que peu de voyageurs connaissent. Un circuit pour ceux qui aiment marcher, respirer et se sentir tout petits face à la nature.',
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
        route: 'environ 1 h 30',
        texte:
          'La traversée du parc de Kootenay, entre Marble Canyon et les Paint Pots, des bassins d’argile ocre. Puis deux jours au calme dans une petite ville de montagne, réputée pour ses sources chaudes et ses mouflons.',
      },
      {
        jours: 'Jours 7 à 9',
        lieu: 'Lake Louise',
        route: 'environ 1 h 45',
        texte:
          'Le lac Louise, Moraine Lake (accessible en navette) et deux escapades dans le parc de Yoho : Emerald Lake et les chutes Takakkaw.',
      },
      {
        jours: 'Jours 10 à 12',
        lieu: 'Jasper',
        route: 'environ 4 h par l’Icefields Parkway',
        texte:
          'Une journée entière sur l’Icefields Parkway, entre Bow Lake, Peyto Lake et le glacier Athabasca. Puis le plus sauvage des parcs des Rocheuses : le lac Maligne et Spirit Island, le Maligne Canyon et des ciels étoilés exceptionnels.',
      },
      {
        jours: 'Jours 13 et 14',
        lieu: 'Abraham Lake',
        route: 'environ 3 h',
        texte:
          'Un lac turquoise immense, bordé de montagnes, loin de la foule. Deux jours pour randonner, pagayer et profiter du silence.',
      },
      {
        jours: 'Jour 15',
        lieu: 'Calgary',
        route: 'environ 3 h',
        texte: 'Restitution du véhicule et vol retour.',
      },
    ],
    options: [
      {
        label: 'Hébergement',
        texte: 'camping, lodges et chalets de montagne, ou hôtels supérieurs',
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
    metaTitle: 'Les Rocheuses canadiennes — Circuit 15 jours | Slow Adventures',
    metaDescription:
      'Circuit de 15 jours en boucle depuis Calgary : Banff, Lake Louise, l’Icefields Parkway, Jasper et Abraham Lake. Un road trip imaginé par Elena.',
  },
];

export const circuitHref = (c: Circuit): string => `/circuits/${c.slug}/`;
