import * as React from 'react';
import LessonNotificationTemplate from './LessonNotificationTemplate';
import { LessonNotificationProps } from '../props';

const LessonCoachCancelNotification: React.FC<LessonNotificationProps> = ({
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
        <div className="rounded-xl bg-color-error px-2 text-xs leading-5 text-red-50">Canceled</div>
      }
      message="A coach canceled your lesson"
    />
  );
};

export default LessonCoachCancelNotification;
