import { GetCityVenuesByCitySlugQuery } from 'types/generated/server';

export interface Props {
  city: GetCityVenuesByCitySlugQuery['cities'][0];
  jsonLd: string;
}
