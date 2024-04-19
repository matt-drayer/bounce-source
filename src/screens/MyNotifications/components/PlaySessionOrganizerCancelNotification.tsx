import * as React from 'react';
import PlaySessionNotificationTemplate from './PlaySessionNotificationTemplate';
import { PlaySessionNotificationProps } from '../props';

const PlaySessionOrganizerCancelNotification: React.FC<PlaySessionNotificationProps> = ({
  notification,
  playSession,
  status,
}) => {
  if (!playSession) {
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
        <div className="rounded-xl bg-color-error px-2 text-xs leading-5 text-red-50">Canceled</div>
      }
      message="The organizer canceled your open play"
    />
  );
};

export default PlaySessionOrganizerCancelNotification;
