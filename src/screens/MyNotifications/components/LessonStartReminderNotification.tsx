import * as React from 'react';
import { isFuture } from 'date-fns';
import { LessonStatusesEnum } from 'types/generated/client';
import LessonNotificationTemplate from './LessonNotificationTemplate';
import { LessonNotificationProps } from '../props';

const LessonReminderNotification: React.FC<LessonNotificationProps> = ({
  notification,
  lesson,
  status,
}) => {
  if (!lesson) {
    return null;
  }

  if (lesson.status !== LessonStatusesEnum.Active) {
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
        <div className="rounded-xl bg-color-brand-primary px-2 text-xs leading-5 text-color-success-background">
          {!!lesson.startDateTime && isFuture(new Date(lesson.startDateTime))
            ? 'Starting Soon'
            : 'Lesson Reminder'}
        </div>
      }
      message="You have a lesson starting soon"
    />
  );
};

export default LessonReminderNotification;
