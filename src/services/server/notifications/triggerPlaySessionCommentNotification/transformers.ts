import { playSessionFormatDisplayName } from 'constants/sports';
import {
  GetPlaySessionFromCommentQuery,
  NotificationActionTypesEnum,
  NotificationStatusesEnum,
  PlaySessionParticipantStatusesEnum,
} from 'types/generated/server';
import { EmailParams } from 'services/server/communications/email/sendPlaySessionCommentSubmitted';
import { getDisplayDateTimeForTimezone } from 'utils/shared/time/getDisplayDateTimeForTimezone';
import { CommunicationParams, PipelineInputParams } from './params';
import { InAppNotificationTemplate } from '../helpers/types';

const filterToActiveParticipants = ({
  participants,
  senderId,
}: {
  participants: CommunicationParams['data']['playSession']['participants'];
  senderId: string;
}) => {
  return participants
    .filter((participant) => participant.status === PlaySessionParticipantStatusesEnum.Active)
    .filter((participant) => participant.userId !== senderId);
};

// NOTE: My thinking was backwards on this.
// The file I copied from only sent NEW participants as a notification the organizer.
// In this new version, I want to send a notification to the organizer and ALL participants that a new participant has joined.
export const transformInputToEmail = ({
  data: { playSession, playSessionCommentContent, senderId },
}: CommunicationParams) => {
  const notifications: EmailParams[] = [];

  filterToActiveParticipants({ participants: playSession.participants, senderId }).forEach(
    (playSessionParticipant) => {
      if (
        playSessionParticipant.userId &&
        playSessionParticipant.playSessionId &&
        playSession.organizer?.id &&
        playSessionParticipant.userId !== senderId
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
            participantFullName: playSessionParticipant.user.fullName,
            commentContent: playSessionCommentContent,
          },
        });
      }
    },
  );

  return notifications;
};

export const transformInputToInAppNotification = ({
  data: { senderId, playSession, playSessionCommentId },
}: CommunicationParams): InAppNotificationTemplate[] => {
  const inAppNotifications: InAppNotificationTemplate[] = [];

  const participantIds = filterToActiveParticipants({
    participants: playSession.participants,
    senderId: senderId,
  }).map((participant) => participant.userId);

  inAppNotifications.push({
    payload: {
      actingUserId: senderId,
      playSessionId: playSession.id,
      playSessionCommentId,
      actionType: NotificationActionTypesEnum.PlaySessionCommentSubmit,
      userNotificationsData: [
        ...participantIds.map((userId) => ({
          userId,
          status: NotificationStatusesEnum.Unread,
        })),
      ],
    },
  });

  return inAppNotifications;
};

export const adapterNewCommentWebhook = ({
  playSessionComment,
}: {
  playSessionComment: NonNullable<GetPlaySessionFromCommentQuery['playSessionCommentsByPk']>;
}): PipelineInputParams => {
  const playSession = playSessionComment.playSession!;
  const playSessionCommentId = playSessionComment.id;
  const playSessionCommentContent = playSessionComment.content;

  return {
    senderId: playSessionComment.userId,
    playSessionCommentId,
    playSessionCommentContent,
    playSession,
  };
};
