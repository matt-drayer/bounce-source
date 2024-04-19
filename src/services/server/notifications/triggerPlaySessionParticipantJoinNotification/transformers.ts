import { playSessionFormatDisplayName } from 'constants/sports';
import {
  GetPlaySessionByIdQuery,
  NotificationActionTypesEnum,
  NotificationStatusesEnum,
  UpsertPlaySessionParticipantJoinMutation,
} from 'types/generated/server';
import { EmailParams } from 'services/server/communications/email/sendPlaySessionParticipantJoin';
import { getDisplayDateTimeForTimezone } from 'utils/shared/time/getDisplayDateTimeForTimezone';
import { CommunicationParams, PipelineInputParams, PipelineViewer } from './params';
import { InAppNotificationTemplate } from '../helpers/types';

// NOTE: My thinking was backwards on this.
// The file I copied from only sent NEW participants as a notification the organizer.
// In this new version, I want to send a notification to the organizer and ALL participants that a new participant has joined.
export const transformInputToEmail = ({
  data: { newParticipants, playSession, organizer },
}: CommunicationParams) => {
  const notifications: EmailParams[] = [];

  newParticipants.forEach((playSessionParticipant) => {
    if (playSessionParticipant.userId && playSessionParticipant.playSessionId && organizer?.id) {
      notifications.push({
        to: {
          userId: organizer.id,
          email: organizer.email,
          fullName: organizer.fullName,
          preferredName: organizer.preferredName,
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
          participantFullName: playSessionParticipant.user.fullName,
        },
      });
    }
  });

  return notifications;
};

export const transformInputToInAppNotification = ({
  data: { newParticipants, playSession, organizer },
}: CommunicationParams): InAppNotificationTemplate[] => {
  const inAppNotifications: InAppNotificationTemplate[] = [];

  const participantIds = playSession.participants.map((participant) => participant.userId);
  const newParticipantIds = newParticipants.map((participant) => participant.userId);
  const existingParticipantIds = participantIds.filter(
    (participant) => !newParticipantIds.includes(participant.userId),
  );

  newParticipantIds.forEach((participantId) => {
    inAppNotifications.push({
      payload: {
        actingUserId: participantId,
        playSessionId: playSession.id,
        actionType: NotificationActionTypesEnum.PlaySessionParticipantJoin,
        userNotificationsData: [
          { userId: organizer?.id, status: NotificationStatusesEnum.Unread },
          ...existingParticipantIds.map((userId) => ({
            userId,
            status: NotificationStatusesEnum.Unread,
          })),
        ],
      },
    });
  });

  return inAppNotifications;
};

export const adapterJoinPaySessionApi = ({
  viewer,
  playSession,
  insertParticipantResponse,
}: {
  viewer: PipelineViewer;
  playSession: NonNullable<GetPlaySessionByIdQuery['playSessionsByPk']>;
  insertParticipantResponse: NonNullable<UpsertPlaySessionParticipantJoinMutation>;
}): PipelineInputParams => {
  const newParticipants = insertParticipantResponse.insertPlaySessionParticipantsOne
    ? [insertParticipantResponse.insertPlaySessionParticipantsOne]
    : [];

  return {
    viewer,
    playSession,
    newParticipants: newParticipants.map((participant) => ({
      playSessionId: playSession.id,
      ...participant,
    })),
    organizer: playSession.organizer!,
  };
};
