import { COUNTRY_USA } from 'constants/countries';
import { CountrySubdivisions } from 'types/generated/client';

export const filterSubdivisionsForCountry = (
  country: string,
  countrySubdivisions: Partial<CountrySubdivisions>[],
) => {
  if (country === COUNTRY_USA) {
    return countrySubdivisions.filter((state) => state.type === 'state');
  }

  return countrySubdivisions;
};
