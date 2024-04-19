import * as React from 'react';
import { isFuture } from 'date-fns';
import { PlaySessionStatusesEnum } from 'types/generated/client';
import PlaySessionNotificationTemplate from './PlaySessionNotificationTemplate';
import { PlaySessionNotificationProps } from '../props';

const PlaySessionStartReminderNotification: React.FC<PlaySessionNotificationProps> = ({
  notification,
  playSession,
  status,
}) => {
  if (!playSession) {
    return null;
  }

  if (playSession.status !== PlaySessionStatusesEnum.Active) {
    return null;
  }

  return (
    <PlaySessionNotificationTemplate
      notification={notification}
      status={status}
      playSession={playSession}
      actorFullName={notification?.notificationDetails?.primaryEntity?.actingUserProfile?.fullName}
      actorCoachStatus={
        notification?.notificationDetails?.primaryEntity?.actingUserProfile?.coachStatus
      }
      badgeComponent={
        <div className="rounded-xl bg-color-brand-primary px-2 text-xs leading-5 text-color-success-background">
          {!!playSession.startDateTime && isFuture(new Date(playSession.startDateTime))
            ? 'Starting Soon'
            : 'Play Session Reminder'}
        </div>
      }
      message="You have an open play starting soon"
    />
  );
};

export default PlaySessionStartReminderNotification;
