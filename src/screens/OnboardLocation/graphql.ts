import { gql } from '@apollo/client';

export const SET_USER_LOCATION = gql`
  mutation setUserLocation(
    $id: uuid!
    $countryId: String!
    $countrySubdivisionId: uuid
    $cityName: String!
  ) {
    updateUsersByPk(
      pkColumns: { id: $id }
      _set: {
        countryId: $countryId
        countrySubdivisionId: $countrySubdivisionId
        cityName: $cityName
      }
    ) {
      id
      countrySubdivisionId
      countryId
    }
  }
`;
