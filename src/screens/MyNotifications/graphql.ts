import { gql } from '@apollo/client';

export const GET_USER_NOTIFICATIONS = gql`
  query getUserNotifications($limit: Int!, $offset: Int!, $userId: uuid!) {
    userNotifications(
      limit: $limit
      offset: $offset
      orderBy: { createdAt: DESC_NULLS_LAST }
      where: { userId: { _eq: $userId } }
    ) {
      id
      status
      notificationDetails {
        actionType
        id
        primaryEntity {
          actingUserProfile {
            id
            fullName
            coachStatus
          }
          lesson {
            id
            ownerUserId
            ownerProfile {
              username
              preferredName
              fullName
              coachStatus
              id
            }
            startDateTime
            endDateTime
            title
            status
          }
          playSession {
            id
            startDateTime
            endDateTime
            title
            status
            organizerUserId
            organizerProfile {
              username
              preferredName
              fullName
              coachStatus
              id
            }
            format
            sport
            targetSkillLevel
          }
          group {
            id
            title
            slug
          }
          groupThread {
            groupId
            id
            comments(where: { isOriginalThreadComment: { _eq: true } }) {
              id
              content
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_NOTIFICATIONS_COUNT = gql`
  query getUserNotificationsCount($userId: uuid!) {
    userNotificationsAggregate(where: { userId: { _eq: $userId } }) {
      aggregate {
        count
      }
    }
  }
`;

export const UPDATE_NOTIFICATIONS_AS_READ = gql`
  mutation updateNotificationsAsRead($updates: [UserNotificationsUpdates!]!) {
    updateUserNotificationsMany(updates: $updates) {
      returning {
        id
        status
      }
    }
  }
`;
