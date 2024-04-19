import * as React from 'react';
import { COUNTRY_USA } from 'constants/countries';
import { getCountries } from 'services/server/graphql/queries/getCountries';
import { getSubdivisionsForCountry } from 'services/server/graphql/queries/getSubdivisionsForCountry';
import { getOrderedCountries } from 'utils/shared/countries/getOrderedCountries';
import OnboardLocation from 'screens/OnboardLocation';
import { StaticProps } from 'screens/OnboardLocation/props';

export const getStaticProps = async () => {
  const countryData = await getCountries();
  const usaStateData = await getSubdivisionsForCountry({ countryId: COUNTRY_USA });
  const countries = countryData.countries;
  const usaStates = usaStateData.countrySubdivisions;

  const props: StaticProps = {
    countries: getOrderedCountries(countries),
    subdivisionsByCountry: {
      [COUNTRY_USA]: usaStates,
    },
  };

  return {
    props,
  };
};

const PlayerOnboardLocation: React.FC<StaticProps> = ({ countries, subdivisionsByCountry }) => {
  return (
    <OnboardLocation
      isCoach={false}
      countries={countries}
      subdivisionsByCountry={subdivisionsByCountry}
    />
  );
};

export default PlayerOnboardLocation;
