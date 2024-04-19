import {
  GetLessonParticipantByLessonIdAndUserIdQuery,
  NotificationActionTypesEnum,
  NotificationStatusesEnum,
} from 'types/generated/server';
import { EmailParams } from 'services/server/communications/email/sendLessonAvailableForWaitlist';
import { getDisplayDateTimeForTimezone } from 'utils/shared/time/getDisplayDateTimeForTimezone';
import { CommunicationParams, PipelineInputParams } from './params';
import { InAppNotificationTemplate } from '../helpers/types';

// NOTE: My thinking was backwards on this.
// The file I copied from only sent NEW participants as a notification the organizer.
// In this new version, I want to send a notification to the organizer and ALL participants that a new participant has joined.
export const transformInputToEmail = ({
  data: {
    lessonId,
    lessonName,
    isoDateString,
    timezoneOffsetMinutes,
    timezoneName,
    timezoneAbbreviation,
    locale,
    waitlist,
  },
}: CommunicationParams) => {
  const notifications: EmailParams[] = [];

  waitlist.forEach(({ userId, email, fullName, preferredName }) => {
    if (userId && email && lessonId) {
      notifications.push({
        to: {
          userId: userId,
          email: email,
          fullName: fullName,
          preferredName: preferredName,
        },
        payload: {
          startDateTime: getDisplayDateTimeForTimezone({
            isoDateString: isoDateString || '',
            timezoneOffsetMinutes: timezoneOffsetMinutes,
            timezoneName: timezoneName,
            timezoneAbbreviation: timezoneAbbreviation,
            locale: locale,
          }),
          lessonName: lessonName,
          lessonId,
        },
      });
    }
  });

  return notifications;
};

export const transformInputToInAppNotification = ({
  data: { lessonId, coachId, waitlist },
}: CommunicationParams): InAppNotificationTemplate[] => {
  const inAppNotifications: InAppNotificationTemplate[] = [];

  inAppNotifications.push({
    payload: {
      actingUserId: coachId,
      lessonId: lessonId,
      actionType: NotificationActionTypesEnum.PlaySessionParticipantLeave,
      userNotificationsData: [
        ...waitlist.map((userId) => ({
          userId,
          status: NotificationStatusesEnum.Unread,
        })),
      ],
    },
  });

  return inAppNotifications;
};

export const adapterParticipantLeftApi = ({
  lesson,
}: {
  lesson: NonNullable<
    GetLessonParticipantByLessonIdAndUserIdQuery['lessonParticipants'][0]['lesson']
  >;
}): PipelineInputParams => {
  return {
    lessonId: lesson.id,
    lessonName: lesson.title,
    coachId: lesson.owner?.id || '',
    isoDateString: lesson.startDateTime || '',
    timezoneOffsetMinutes: lesson.timezoneOffsetMinutes,
    timezoneName: lesson.timezoneName,
    timezoneAbbreviation: lesson.timezoneAbbreviation,
    locale: lesson.locale,
    waitlist: lesson.waitlist.map((waitlist) => ({
      userId: waitlist.userId,
      email: waitlist.user?.email || '',
      fullName: waitlist.user?.fullName || '',
      preferredName: waitlist.user?.preferredName || '',
    })),
  };
};
