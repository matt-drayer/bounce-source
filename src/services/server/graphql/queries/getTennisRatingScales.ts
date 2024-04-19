import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetTennisRatingScalesQuery } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getTennisRatingScales {
    tennisRatingScales(orderBy: { order: ASC }) {
      id
      maximum
      minimum
      name
      order
      shortName
    }
  }
`;

export const getTennisRatingScales = async () => {
  const data = await client.request<GetTennisRatingScalesQuery>(print(QUERY));
  return data;
};
