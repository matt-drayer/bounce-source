import { PlaceInput } from './place';

export { type PlaceInput };

export interface PostalAddress {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface OpeningHoursSpecification {
  opens: string;
  closes: string;
  dayOfWeek: string[]; // Could use a specific type or enum for days
  validFrom?: string;
  validThrough?: string;
}

export interface EventInput {
  name: string;
  startDate: string; // ISO 8601 date format
  endDate: string; // ISO 8601 date format
  location: PlaceInput; // Reuse PlaceInput from the Place schema
  description?: string;
  image?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability?: string; // e.g., "InStock", "SoldOut"
    validFrom?: string; // ISO 8601 date format
    url?: string;
  };
  performer?: {
    '@type': string;
    name: string;
    url?: string;
  }[];
  organizer?: {
    '@type': string;
    name: string;
    url?: string;
  };
}
