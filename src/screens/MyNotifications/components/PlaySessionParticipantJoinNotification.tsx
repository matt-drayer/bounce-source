import * as React from 'react';
import PlaySessionNotificationTemplate from './PlaySessionNotificationTemplate';
import { PlaySessionNotificationProps } from '../props';

const PlaySessionParticipantJoinNotification: React.FC<PlaySessionNotificationProps> = ({
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
        <div className="rounded-xl bg-color-success px-2 text-xs leading-5 text-green-50">
          Player Joined
        </div>
      }
      message="A player joined your open play"
    />
  );
};

export default PlaySessionParticipantJoinNotification;
