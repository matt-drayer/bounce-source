import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertInAppUserNotificationEntityWithReceiversMutation,
  InsertInAppUserNotificationEntityWithReceiversMutationVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const MUTATION = gql`
  mutation insertInAppUserNotificationEntityWithReceivers(
    $actingUserId: uuid!
    $lessonId: uuid
    $playSessionId: uuid
    $playSessionCommentId: uuid
    $groupId: uuid
    $groupThreadCommentId: uuid
    $groupThreadId: uuid
    $actionType: NotificationActionTypesEnum!
    $userNotificationsData: [UserNotificationsInsertInput!]!
  ) {
    insertUserNotificationEntitiesOne(
      object: {
        actingUserId: $actingUserId
        lessonId: $lessonId
        playSessionId: $playSessionId
        playSessionCommentId: $playSessionCommentId
        groupId: $groupId
        groupThreadCommentId: $groupThreadCommentId
        groupThreadId: $groupThreadId
        notificationDetails: {
          data: { actionType: $actionType, userNotifications: { data: $userNotificationsData } }
        }
      }
    ) {
      id
    }
  }
`;

export const insertInAppUserNotificationEntityWithReceivers = async (
  variables: InsertInAppUserNotificationEntityWithReceiversMutationVariables,
) => {
  const data = await client.request<InsertInAppUserNotificationEntityWithReceiversMutation>(
    print(MUTATION),
    variables,
  );
  return data;
};
