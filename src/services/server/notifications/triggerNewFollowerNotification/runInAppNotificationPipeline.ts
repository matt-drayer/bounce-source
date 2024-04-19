import { NotificationActionTypesEnum, NotificationStatusesEnum } from 'types/generated/server';
import { insertInAppUserNotificationEntityWithReceivers } from 'services/server/graphql/mutations/insertInAppUserNotificationEntityWithReceivers';
import { CommunicationParams } from './params';
import { InAppNotificationTemplate } from '../helpers/types';

type NotificationDataOrNull = InAppNotificationTemplate | null;

// TODO: Move to a transforms.ts file
const transform = async ({
  followedUserId,
  followerUserId,
}: CommunicationParams): Promise<NotificationDataOrNull> => {
  return {
    payload: {
      actingUserId: followerUserId,
      lessonId: null,
      actionType: NotificationActionTypesEnum.FollowerUserNew,
      userNotificationsData: [
        {
          userId: followedUserId,
          status: NotificationStatusesEnum.Unread,
        },
      ],
    },
  };
};

const filterActiveSubscribers = async (notificationData: NotificationDataOrNull) => {
  // NOTE: No preferences currently (2022/26/09) for notications received in the application.
  // Assume every user will receive the notification when applicable
  return notificationData;
};

const send = async (notificationData: InAppNotificationTemplate) => {
  await insertInAppUserNotificationEntityWithReceivers(notificationData.payload);

  return;
};

export const runInAppNotificationPipeline = async (params: CommunicationParams) => {
  const payload = await transform(params);
  const notificationsToSend = await filterActiveSubscribers(payload);

  if (notificationsToSend) {
    await send(notificationsToSend);
  }

  return;
};
