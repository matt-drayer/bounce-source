import { generatePlaceJsonLd } from './place';
import { EventInput } from './types';

export interface SportsEventInput extends EventInput {
  sport?: string;
}

export const generateSportsEventJsonLd = (input: SportsEventInput): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    sport: input.sport || undefined,
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    location: generatePlaceJsonLd(input.location),
    ...(input.description && { description: input.description }),
    ...(input.image && { image: input.image }),
    ...(input.offers && {
      offers: {
        '@type': 'Offer',
        price: input.offers.price,
        priceCurrency: input.offers.priceCurrency,
        ...(input.offers.availability && { availability: input.offers.availability }),
        ...(input.offers.validFrom && { validFrom: input.offers.validFrom }),
        ...(input.offers.url && { url: input.offers.url }),
      },
    }),
    ...(input.performer && { performer: input.performer }),
    ...(input.organizer && { organizer: input.organizer }),
  };
};
