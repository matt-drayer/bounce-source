import { playSessionFormatDisplayName } from 'constants/sports';
import {
  GetGroupThreadFromUpvoteQuery,
  NotificationActionTypesEnum,
  NotificationStatusesEnum,
} from 'types/generated/server';
import { CommunicationParams, PipelineInputParams } from './params';
import { InAppNotificationTemplate } from '../helpers/types';

export const transformInputToInAppNotification = ({
  data: { vote },
}: CommunicationParams): InAppNotificationTemplate[] => {
  const inAppNotifications: InAppNotificationTemplate[] = [];

  const senderId = vote.userId;
  const receiverId = vote.comment.user?.id;

  inAppNotifications.push({
    payload: {
      actingUserId: senderId,
      groupId: vote.comment.thread.group.id,
      groupThreadId: vote.comment.thread.id,
      groupThreadCommentId: vote.comment.id,
      actionType: NotificationActionTypesEnum.GroupCommentReply,
      userNotificationsData: [
        {
          userId: receiverId,
          status: NotificationStatusesEnum.Unread,
        },
      ],
    },
  });

  return inAppNotifications;
};

export const adapterInsertVoteWebhook = ({
  vote,
}: {
  vote: NonNullable<GetGroupThreadFromUpvoteQuery['groupCommentVotesByPk']>;
}): PipelineInputParams => {
  return {
    vote,
  };
};
