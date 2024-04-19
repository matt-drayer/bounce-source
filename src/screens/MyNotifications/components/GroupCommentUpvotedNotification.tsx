import React from 'react';
import GroupCommentNotificationTemplate from './GroupCommentNotificationTemplate';
import { GroupCommentNotificationProps } from '../props';

export default function GroupCommentUpvotedNotification({
  status,
  group,
  groupThread,
  notification,
}: GroupCommentNotificationProps) {
  if (!group || !groupThread) {
    return null;
  }

  return (
    <GroupCommentNotificationTemplate
      notification={notification}
      status={status}
      group={group}
      groupThread={groupThread}
      actorFullName={notification?.notificationDetails?.primaryEntity?.actingUserProfile?.fullName}
      badgeComponent={
        <div className="rounded-xl bg-brand-green-200 px-2 text-xs leading-5 text-green-50">
          Comment Liked
        </div>
      }
      message="Someone liked your comment"
    />
  );
}
