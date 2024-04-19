import { GetCountriesQuery, GetSubdivisionsForCountryQuery } from 'types/generated/server';

export interface StaticProps {
  countries: GetCountriesQuery['countries'];
  subdivisionsByCountry: { [key: string]: GetSubdivisionsForCountryQuery['countrySubdivisions'] };
}

export interface Props extends StaticProps {
  isCoach: boolean;
}
