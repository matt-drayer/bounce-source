const gql = require('graphql-tag');
const { print } = require('graphql/language/printer');
const getClient = require('./client');

const QUERY = gql`
  query getCourtLocations {
    cities {
      venuesAggregate(where: { isActive: { _eq: true }, deletedAt: { _isNull: true } }) {
        aggregate {
          count
        }
      }
      id
      name
      latitude
      longitude
      timezone
      slug
      countrySubdivisionId
      countrySubdivision {
        id
        latitude
        longitude
        name
        slug
        countryId
      }
    }
  }
`;

// const QUERY = gql`
//   query getCourtLocations {
//     cities {
//       venuesAggregate(where: { isActive: { _eq: true }, deletedAt: { _isNull: true } }) {
//         aggregate {
//           count
//         }
//       }
//       id
//       name
//       latitude
//       longitude
//       timezone
//       slug
//       countrySubdivision {
//         id
//         latitude
//         longitude
//         name
//         slug
//         countryId
//         country {
//           id
//           iso2
//           iso3
//           latitude
//           longitude
//           name
//           slug
//         }
//       }
//     }
//   }
// `;

const getCourtLocations = (variables) => {
  return getClient().request(print(QUERY), variables);
};

module.exports = getCourtLocations;
