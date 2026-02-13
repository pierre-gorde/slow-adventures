export interface TestimonialData {
  quote: string;
  name: string;
  tripContext: string;
}

export const testimonials: TestimonialData[] = [
  {
    quote:
      "Un voyage qui m'a transformée. Elena a su comprendre exactement ce que je cherchais et m'a emmenée dans des endroits que je n'aurais jamais trouvés seule.",
    name: 'Camille',
    tripContext: 'Pérou, 2 semaines',
  },
  {
    quote:
      "Elena a tout organisé au-delà de nos attentes. Chaque jour était une nouvelle découverte, et les contacts locaux qu'elle a sur place font toute la différence.",
    name: 'Antoine et Sophie',
    tripContext: 'Costa Rica, 12 jours',
  },
  {
    quote:
      'Le meilleur investissement voyage de ma vie. Un itinéraire parfaitement équilibré entre aventure et détente, avec des moments inoubliables.',
    name: 'Richard',
    tripContext: 'New-York, 6 jours',
  },
];
