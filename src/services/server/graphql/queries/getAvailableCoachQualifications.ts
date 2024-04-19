import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetAvailableCoachQualificationsQuery } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getAvailableCoachQualifications {
    coachQualifications(orderBy: { order: ASC }) {
      id
      name
      order
      groupId
      displayKey
    }
  }
`;

export const getAvailableCoachQualifications = async () => {
  const data = await client.request<GetAvailableCoachQualificationsQuery>(print(QUERY));
  return data;
};
