const gql = require('graphql-tag');
const { print } = require('graphql/language/printer');
const getClient = require('./client');

const MUTATION = gql`
  mutation insertCountries($objects: [CountriesInsertInput!] = { subdivisions: { data: {} } }) {
    insertCountries(onConflict: { constraint: countries_pkey }, objects: $objects) {
      returning {
        id
        name
        slug
        emoji
        currency
        iso2
        iso3
        latitude
        longitude
        numericCode
        phoneCode
      }
    }
  }
`;

const insertCountries = (variables) => {
  return getClient().request(print(MUTATION), variables);
};

module.exports = insertCountries;
