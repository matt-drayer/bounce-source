import { GeoCoordinates, PostalAddress } from './types';
import { buildAddressField } from './utils';

export interface LocalBusinessInput {
  name: string;
  description?: string;
  image?: string;
  telephone?: string;
  address?: string | PostalAddress;
  geo?: GeoCoordinates;
  openingHours?: string; // Format: "Mo-Fr 09:00-17:00"
  priceRange?: string;
  rating?: {
    ratingValue: number;
    ratingCount?: number;
  };
  sameAs?: string[]; // URLs of the business's presence on other sites
  url?: string;
  // Additional specific fields for LocalBusiness can be included here
}

export const generateLocalBusinessJsonLd = (input: LocalBusinessInput): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.image && { image: input.image }),
    ...(input.telephone && { telephone: input.telephone }),
    ...(input.url && { url: input.url }),
    ...(input.address && { address: buildAddressField(input.address) }),
    ...(input.geo && { geo: { '@type': 'GeoCoordinates', ...input.geo } }),
    ...(input.openingHours && { openingHours: input.openingHours }),
    ...(input.priceRange && { priceRange: input.priceRange }),
    ...(input.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: input.rating.ratingValue,
        ...(input.rating.ratingCount && { ratingCount: input.rating.ratingCount }),
      },
    }),
    ...(input.sameAs && { sameAs: input.sameAs }),
  };
};
