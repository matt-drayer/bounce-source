import { playSessionFormatDisplayName } from 'constants/sports';
import {
  GetGroupThreadFromCommentQuery,
  NotificationActionTypesEnum,
  NotificationStatusesEnum,
} from 'types/generated/server';
import { EmailParams } from 'services/server/communications/email/sendGroupCommentReply';
import { CommunicationParams, PipelineInputParams } from './params';
import { InAppNotificationTemplate } from '../helpers/types';

export const transformInputToEmail = ({ data: { newComment } }: CommunicationParams) => {
  const notifications: EmailParams[] = [];

  const senderId = newComment.userId;
  const groupTitle = newComment.thread.group.title;
  const newCommentContent = newComment.content;
  const originalComment = newComment.thread.comments.find((c) => c.isOriginalThreadComment);

  newComment.thread.comments.forEach((comment) => {
    if (senderId && comment.user && comment.user.id !== senderId) {
      notifications.push({
        to: {
          userId: comment.user.id,
          email: comment.user.email,
          fullName: comment.user.fullName,
          preferredName: comment.user.preferredName,
        },
        payload: {
          originalComment: originalComment?.content || '',
          newComment: newCommentContent,
          groupTitle,
          participantFullName: comment.user.fullName,
        },
      });
    }
  });

  return notifications;
};

export const transformInputToInAppNotification = ({
  data: { newComment },
}: CommunicationParams): InAppNotificationTemplate[] => {
  const inAppNotifications: InAppNotificationTemplate[] = [];

  const senderId = newComment.userId;
  const participantIds = newComment.thread.comments
    .map((participant) => participant.userId)
    .filter((id) => id !== senderId);

  inAppNotifications.push({
    payload: {
      actingUserId: senderId,
      groupId: newComment.thread.group.id,
      groupThreadId: newComment.thread.id,
      groupThreadCommentId: newComment.id,
      actionType: NotificationActionTypesEnum.GroupCommentUpvote,
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

export const adapterInsertCommentWebhook = ({
  newComment,
}: {
  newComment: NonNullable<GetGroupThreadFromCommentQuery['groupThreadCommentsByPk']>;
}): PipelineInputParams => {
  return {
    newComment,
  };
};
