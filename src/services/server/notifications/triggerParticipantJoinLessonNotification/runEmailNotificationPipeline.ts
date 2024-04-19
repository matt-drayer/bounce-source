import { lessonDisplayName } from 'constants/sports';
import {
  Params,
  sendParticipantJoinLesson,
} from 'services/server/communications/email/sendParticipantJoinLesson';
import { getDisplayDateTimeForTimezone } from 'utils/shared/time/getDisplayDateTimeForTimezone';
import { CommunicationParams } from './params';
import { getIsCommunicationEnabled } from '../helpers/getIsCommunicationEnabled';

const PREFERENCE_KEY = 'lessonBookedEmail';

interface NotificationTypedTemplate extends Params {}

// TODO: Move to a transforms.ts file
const transform = async ({
  participants,
}: CommunicationParams): Promise<NotificationTypedTemplate[]> => {
  const notifications: NotificationTypedTemplate[] = [];

  participants.forEach((lessonParticipant) => {
    if (
      lessonParticipant.userId &&
      lessonParticipant.lessonId &&
      lessonParticipant.lesson.owner?.id
    ) {
      notifications.push({
        to: {
          userId: lessonParticipant.lesson.owner.id,
          email: lessonParticipant.lesson.owner.email,
          fullName: lessonParticipant.lesson.owner.fullName,
          preferredName: lessonParticipant.lesson.owner.preferredName,
        },
        payload: {
          lessonStartDateTime: getDisplayDateTimeForTimezone({
            isoDateString: lessonParticipant.lesson.startDateTime || '',
            timezoneOffsetMinutes: lessonParticipant.lesson.timezoneOffsetMinutes,
            timezoneName: lessonParticipant.lesson.timezoneName,
            timezoneAbbreviation: lessonParticipant.lesson.timezoneAbbreviation,
            locale: lessonParticipant.lesson.locale,
          }),
          lessonName: lessonParticipant.lesson.title,
          lessonType: lessonDisplayName[lessonParticipant.lesson.type],
          participantFullName: lessonParticipant.user.fullName,
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
  const sendPromises = items.map((item) => sendParticipantJoinLesson(item));
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
