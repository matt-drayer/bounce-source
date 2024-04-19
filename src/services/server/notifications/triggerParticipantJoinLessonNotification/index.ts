import * as Sentry from '@sentry/nextjs';
import { getCommunicationPreferencesForReceivers } from './getCommunicationPreferencesForReceivers';
import { InputParams } from './params';
import { runEmailNotificationPipeline } from './runEmailNotificationPipeline';
import { runInAppNotificationPipeline } from './runInAppNotificationPipeline';

const notificationChannels = [runInAppNotificationPipeline, runEmailNotificationPipeline];

export const triggerParticipantJoinLessonNotification = async ({ participants }: InputParams) => {
  try {
    const communicationPreferences = await getCommunicationPreferencesForReceivers({
      participants,
    });
    const channelRequests = notificationChannels.map((channel) =>
      channel({ participants, communicationPreferences }),
    );
    await Promise.all(channelRequests);
  } catch (error) {
    Sentry.captureException(error);
  }
};
