import { orderedCountries } from 'constants/countries';

export const getOrderedCountries = (countries: { id: string }[]) => {
  const topOfList: any[] = [];

  orderedCountries.forEach((countryId) => {
    const country = countries.find(({ id }) => id === countryId);
    topOfList.push(country);
  });

  const filteredCountries = countries.filter(({ id }) => !orderedCountries.includes(id));

  return [...topOfList, ...filteredCountries];
};
