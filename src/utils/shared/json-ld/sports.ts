import { GeoCoordinates, OpeningHoursSpecification, PostalAddress } from './types';

export interface SportsActivityLocationInput {
  name: string;
  description?: string;
  image?: string | string[];
  telephone?: string;
  address?: string | PostalAddress;
  geo?: GeoCoordinates;
  openingHoursSpecification?: OpeningHoursSpecification[];
  url?: string;
  // Additional fields can be added here as needed
}

export const generateSportsActivityLocationJsonLd = (
  input: SportsActivityLocationInput,
): object => {
  const context = 'https://schema.org';

  const buildAddressField = (address: string | PostalAddress) => {
    if (typeof address === 'string') {
      return address;
    }
    return {
      '@type': 'PostalAddress',
      ...address,
    };
  };

  const sportsActivityLocation = {
    '@context': context,
    '@type': 'SportsActivityLocation',
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.image && { image: input.image }),
    ...(input.telephone && { telephone: input.telephone }),
    ...(input.url && { url: input.url }),
    ...(input.address && { address: buildAddressField(input.address) }),
    ...(input.geo && { geo: { '@type': 'GeoCoordinates', ...input.geo } }),
    ...(input.openingHoursSpecification && {
      openingHoursSpecification: input.openingHoursSpecification.map((spec) => ({
        '@type': 'OpeningHoursSpecification',
        ...spec,
      })),
    }),
    // Additional optional fields can be handled similarly
  };

  return sportsActivityLocation;
};
