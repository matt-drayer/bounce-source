import * as React from 'react';
import LessonNotificationTemplate from './LessonNotificationTemplate';
import { LessonNotificationProps } from '../props';

const LessonParticipantJoinNotification: React.FC<LessonNotificationProps> = ({
  notification,
  lesson,
  status,
}) => {
  if (!lesson) {
    return null;
  }

  return (
    <LessonNotificationTemplate
      notification={notification}
      status={status}
      lesson={lesson}
      actorFullName={notification?.notificationDetails?.primaryEntity?.actingUserProfile?.fullName}
      actorCoachStatus={
        notification?.notificationDetails?.primaryEntity?.actingUserProfile?.coachStatus
      }
      badgeComponent={
        <div className="rounded-xl bg-color-success px-2 text-xs leading-5 text-green-50">
          Player Joined
        </div>
      }
      message="A participant joined your lesson"
    />
  );
};

export default LessonParticipantJoinNotification;
