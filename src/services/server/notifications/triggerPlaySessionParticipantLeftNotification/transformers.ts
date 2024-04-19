import { playSessionFormatDisplayName } from 'constants/sports';
import {
  GetPlaySessionByIdQuery,
  NotificationActionTypesEnum,
  NotificationStatusesEnum,
  UpsertPlaySessionParticipantLeaveMutation,
} from 'types/generated/server';
import { EmailParams } from 'services/server/communications/email/sendPlaySessionParticipantLeft';
import { getDisplayDateTimeForTimezone } from 'utils/shared/time/getDisplayDateTimeForTimezone';
import { CommunicationParams, PipelineInputParams } from './params';
import { InAppNotificationTemplate } from '../helpers/types';

// NOTE: My thinking was backwards on this.
// The file I copied from only sent NEW participants as a notification the organizer.
// In this new version, I want to send a notification to the organizer and ALL participants that a new participant has joined.
export const transformInputToEmail = ({ data: { playSession } }: CommunicationParams) => {
  const notifications: EmailParams[] = [
    {
      to: {
        userId: playSession.organizer!.id,
        email: playSession.organizer!.email,
        fullName: playSession.organizer!.fullName,
        preferredName: playSession.organizer!.preferredName,
      },
      payload: {
        playSessionStartDateTime: getDisplayDateTimeForTimezone({
          isoDateString: playSession.startDateTime || '',
          timezoneOffsetMinutes: playSession.timezoneOffsetMinutes,
          timezoneName: playSession.timezoneName,
          timezoneAbbreviation: playSession.timezoneAbbreviation,
          locale: playSession.locale,
        }),
        playSessionName: playSession.title,
        playSessionType: playSessionFormatDisplayName[playSession.format],
      },
    },
  ];

  playSession.participants.forEach((playSessionParticipant) => {
    if (
      playSessionParticipant.userId &&
      playSessionParticipant.playSessionId &&
      playSession.organizer?.id
    ) {
      notifications.push({
        to: {
          userId: playSessionParticipant.user.id,
          email: playSessionParticipant.user.email,
          fullName: playSessionParticipant.user.fullName,
          preferredName: playSessionParticipant.user.preferredName,
        },
        payload: {
          playSessionStartDateTime: getDisplayDateTimeForTimezone({
            isoDateString: playSession.startDateTime || '',
            timezoneOffsetMinutes: playSession.timezoneOffsetMinutes,
            timezoneName: playSession.timezoneName,
            timezoneAbbreviation: playSession.timezoneAbbreviation,
            locale: playSession.locale,
          }),
          playSessionName: playSession.title,
          playSessionType: playSessionFormatDisplayName[playSession.format],
        },
      });
    }
  });

  return notifications;
};

export const transformInputToInAppNotification = ({
  data: { playSession, leavingParticipants },
}: CommunicationParams): InAppNotificationTemplate[] => {
  const inAppNotifications: InAppNotificationTemplate[] = [];

  const participantIds = playSession.participants.map((participant) => participant.userId);

  leavingParticipants.forEach((leavingParticipant) => {
    inAppNotifications.push({
      payload: {
        actingUserId: leavingParticipant.userId,
        playSessionId: playSession.id,
        actionType: NotificationActionTypesEnum.PlaySessionParticipantLeave,
        userNotificationsData: [
          { userId: playSession.organizer!.id, status: NotificationStatusesEnum.Unread },
          ...participantIds.map((userId) => ({
            userId,
            status: NotificationStatusesEnum.Unread,
          })),
        ],
      },
    });
  });

  return inAppNotifications;
};

export const adapterParticipantLeftApi = ({
  playSession,
  insertParticipantResponse,
}: {
  playSession: NonNullable<GetPlaySessionByIdQuery['playSessionsByPk']>;
  insertParticipantResponse: NonNullable<UpsertPlaySessionParticipantLeaveMutation>;
}): PipelineInputParams => {
  const leavingPariticpants = insertParticipantResponse.insertPlaySessionParticipantsOne
    ? [insertParticipantResponse.insertPlaySessionParticipantsOne]
    : [];

  return {
    playSession,
    leavingParticipants: leavingPariticpants.map((participant) => ({
      playSessionId: playSession.id,
      ...participant,
    })),
  };
};
