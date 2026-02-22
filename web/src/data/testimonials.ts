export interface TestimonialData {
  quote: string;
  name: string;
  tripContext: string;
}

export const testimonials: TestimonialData[] = [
  {
    quote:
      "Elena a tout organisé au-delà de nos attentes. Chaque jour était une nouvelle découverte, et le fait qu'elle nous assiste par WhatsApp pendant tout le séjour est une vraie valeur ajoutée\u00A0!",
    name: 'Antoine et Sophie',
    tripContext: 'Costa Rica, 12 jours',
  },
  {
    quote:
      "6 jours à NYC incroyables\u00A0! Entre la vue depuis l'Empire State Building, la balade dans Central Park et le coucher de soleil sur le Brooklyn Bridge, chaque moment était magique. Merci encore à Elena d'avoir su répondre à mes attentes\u00A0!",
    name: 'Richard',
    tripContext: 'New-York, 6 jours',
  },
];
