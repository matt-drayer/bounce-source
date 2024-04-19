import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetAllVenuePathsQuery } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getAllVenuePaths {
    venues(where: { isActive: { _eq: true }, deletedAt: { _isNull: true } }) {
      id
      slug
    }
  }
`;

export const getAllVenuePaths = async () => {
  const data = await client.request<GetAllVenuePathsQuery>(print(QUERY));
  return data;
};
