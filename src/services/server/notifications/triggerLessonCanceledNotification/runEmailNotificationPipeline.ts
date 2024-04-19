import { lessonDisplayName } from 'constants/sports';
import {
  Params,
  sendCoachCanceledLesson,
} from 'services/server/communications/email/sendCoachCanceledLesson';
import { getDisplayDateTimeForTimezone } from 'utils/shared/time/getDisplayDateTimeForTimezone';
import { CommunicationParams } from './params';
import { getIsCommunicationEnabled } from '../helpers/getIsCommunicationEnabled';

const PREFERENCE_KEY = 'lessonCanceledEmail';

interface NotificationTypedTemplate extends Params {}

// TODO: Move to a transforms.ts file
const transform = async ({ lesson }: CommunicationParams): Promise<NotificationTypedTemplate[]> => {
  if (!lesson || !lesson.owner) {
    return [];
  }

  const notifications: NotificationTypedTemplate[] = [
    {
      to: {
        userId: lesson.owner.id,
        email: lesson.owner.email,
        fullName: lesson.owner.fullName,
        preferredName: lesson.owner.preferredName,
      },
      payload: {
        lessonStartDateTime: getDisplayDateTimeForTimezone({
          isoDateString: lesson.startDateTime || '',
          timezoneOffsetMinutes: lesson.timezoneOffsetMinutes,
          timezoneName: lesson.timezoneName,
          timezoneAbbreviation: lesson.timezoneAbbreviation,
          locale: lesson.locale,
        }),
        lessonName: lesson.title,
        lessonType: lessonDisplayName[lesson.type],
      },
    },
  ];

  lesson?.participants.forEach((lessonParticipant) => {
    if (lesson && lesson.owner && lessonParticipant.userId && lessonParticipant.user) {
      notifications.push({
        to: {
          userId: lessonParticipant.user.id,
          email: lessonParticipant.user.email,
          fullName: lessonParticipant.user.fullName,
          preferredName: lessonParticipant.user.preferredName,
        },
        payload: {
          lessonStartDateTime: getDisplayDateTimeForTimezone({
            isoDateString: lesson.startDateTime || '',
            timezoneOffsetMinutes: lesson.timezoneOffsetMinutes,
            timezoneName: lesson.timezoneName,
            timezoneAbbreviation: lesson.timezoneAbbreviation,
            locale: lesson.locale,
          }),
          lessonName: lesson.title,
          lessonType: lessonDisplayName[lesson.type],
        },
      });
    }
  });

  return notifications;
};

const filterActiveSubscribers = async (
  items: NotificationTypedTemplate[],
  { communicationPreferences }: CommunicationParams,
) => {
  const communicationPrefrencesByIndex = await Promise.all(
    items.map((item) =>
      getIsCommunicationEnabled({
        userId: item.to.userId,
        preferenceKey: PREFERENCE_KEY,
        communicationPreferences,
      }),
    ),
  );
  return items.filter((_item, index) => communicationPrefrencesByIndex[index]);
};

const send = async (items: NotificationTypedTemplate[]) => {
  const sendPromises = items.map((item) => sendCoachCanceledLesson(item));
  await Promise.all(sendPromises);
  return;
};

export const runEmailNotificationPipeline = async (params: CommunicationParams) => {
  const payload = await transform(params);
  const notificationsToSend = await filterActiveSubscribers(payload, params);

  if (notificationsToSend?.length > 0) {
    await send(notificationsToSend);
  }

  return;
};
