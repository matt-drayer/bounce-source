import { NotificationActionTypesEnum, NotificationStatusesEnum } from 'types/generated/server';
import { insertInAppUserNotificationEntityWithReceivers } from 'services/server/graphql/mutations/insertInAppUserNotificationEntityWithReceivers';
import { CommunicationParams } from './params';
import { InAppNotificationTemplate } from '../helpers/types';

type NotificationDataOrNull = InAppNotificationTemplate[] | null;

// TODO: Move to a transforms.ts file
const transform = async ({
  participants,
}: CommunicationParams): Promise<NotificationDataOrNull> => {
  const notifications: NotificationDataOrNull = [];

  participants.forEach((lessonParticipant) => {
    if (
      lessonParticipant.userId &&
      lessonParticipant.lessonId &&
      lessonParticipant.lesson.owner?.id
    ) {
      notifications.push({
        payload: {
          actingUserId: lessonParticipant.userId,
          lessonId: lessonParticipant.lessonId,
          actionType: NotificationActionTypesEnum.LessonParticipantJoin,
          userNotificationsData: [
            {
              userId: lessonParticipant.lesson.owner.id,
              status: NotificationStatusesEnum.Unread,
            },
          ],
        },
      });
    }
  });

  return notifications;
};

const filterActiveSubscribers = async (notificationData: NotificationDataOrNull) => {
  // NOTE: No preferences currently (2022/26/09) for notications received in the application.
  // Assume every user will receive the notification when applicable
  return notificationData;
};

const send = async (notificationData: NotificationDataOrNull) => {
  if (!notificationData) {
    return;
  }

  for (let i = 0; i < notificationData.length; i++) {
    const itemsToInsert = notificationData[i];
    await insertInAppUserNotificationEntityWithReceivers(itemsToInsert.payload);
  }

  return;
};

export const runInAppNotificationPipeline = async (params: CommunicationParams) => {
  const payload = await transform(params);
  const notificationsToSend = await filterActiveSubscribers(payload);

  if (notificationsToSend && notificationsToSend.length > 0) {
    await send(notificationsToSend);
  }

  return;
};
