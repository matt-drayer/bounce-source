import { gql } from '@apollo/client';

export const GET_USER_UNREAD_NOTIFICATION_COUNT = gql`
  query getUserUnreadNotificationCount($userId: uuid!) {
    userNotificationsAggregate(where: { userId: { _eq: $userId }, status: { _eq: UNREAD } }) {
      aggregate {
        count
      }
    }
  }
`;
