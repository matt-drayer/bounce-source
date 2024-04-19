import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetAllCityVenuePathsQuery } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getAllCityVenuePaths {
    cities(where: { deletedAt: { _isNull: true }, isActive: { _eq: true } }) {
      id
      slug
      venues(limit: 1) {
        id
      }
    }
  }
`;

export const getAllCityVenuePaths = async () => {
  const data = await client.request<GetAllCityVenuePathsQuery>(print(QUERY));
  return data;
};
