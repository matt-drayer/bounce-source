const fs = require('fs');
const path = require('path');
const countriesRaw = require('../data/countries-states.json');
const insertCountries = require('../graphql/insertCountries');
const toSlug = require('../utils/toSlug');

const run = async () => {
  const countries = countriesRaw.map((country) => {
    const states = country.states;
    const subdivisions = states.map((state) => {
      return {
        code: state.state_code,
        latitude: parseFloat(state.latitude),
        longitude: parseFloat(state.longitude),
        name: state.name,
        type: state.type || '',
      };
    });

    return {
      id: country.iso3,
      name: country.name,
      slug: toSlug(country.name),
      emoji: country.emoji,
      currency: country.currency,
      iso2: country.iso2,
      iso3: country.iso3,
      latitude: parseFloat(country.latitude),
      longitude: parseFloat(country.longitude),
      numericCode: country.numeric_code,
      phoneCode: country.phone_code || '',
      subdivisions: {
        data: subdivisions,
      },
    };
  });
  try {
    await insertCountries({ objects: countries });
  } catch (error) {
    fs.writeFileSync(path.resolve(__dirname, './output.json'), error.message);
  }
};

run();
