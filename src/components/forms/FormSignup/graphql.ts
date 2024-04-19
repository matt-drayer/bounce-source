import { gql } from '@apollo/client';

export const INSERT_USER_GROUP_MEMBERSHIP = gql`
  mutation insertUserGroupMembership($groupId: uuid!, $userId: uuid!) {
    insertGroupMembersOne(object: { groupId: $groupId, userId: $userId, isActive: true }) {
      id
    }
  }
`;

export const GET_CLOSEST_CITIES = gql`
  query getClosestCities($distance: Float!, $from: geography!) {
    cities(where: { geometry: { _stDWithin: { distance: $distance, from: $from } } }) {
      id
      name
      geometry
      latitude
      longitude
    }
  }
`;
