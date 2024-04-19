import { generateSportsActivityLocationJsonLd } from './sports';
import { GeoCoordinates, PostalAddress } from './types';
import { buildAddressField } from './utils';

export interface PlaceInput {
  name: string;
  description?: string;
  image?: string;
  address?: string | PostalAddress;
  geo?: GeoCoordinates;
  url?: string;
  containsPlace?: (
    | ReturnType<typeof generateSportsActivityLocationJsonLd>
    | ReturnType<typeof generatePlaceJsonLd>
  )[]; // Array of places contained within this place
  // Additional fields as needed
}

export const generatePlaceJsonLd = (input: PlaceInput): object => {
  const context = 'https://schema.org';

  const buildPlaceObject = (place: PlaceInput): object => ({
    '@context': context,
    '@type': 'Place',
    name: place.name,
    ...(place.description && { description: place.description }),
    ...(place.image && { image: place.image }),
    ...(place.url && { url: place.url }),
    ...(place.address && { address: buildAddressField(place.address) }),
    ...(place.geo && { geo: { '@type': 'GeoCoordinates', ...place.geo } }),
    ...(place.containsPlace &&
      place.containsPlace.length > 0 && { containsPlace: place.containsPlace }),
  });

  return buildPlaceObject(input);
};
