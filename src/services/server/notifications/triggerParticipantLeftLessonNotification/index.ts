import * as Sentry from '@sentry/nextjs';
import { getCommunicationPreferencesForReceivers } from './getCommunicationPreferencesForReceivers';
import { InputParams } from './params';
import { runEmailNotificationPipeline } from './runEmailNotificationPipeline';
import { runInAppNotificationPipeline } from './runInAppNotificationPipeline';

const notificationChannels = [runInAppNotificationPipeline, runEmailNotificationPipeline];

export const triggerParticipantLeftLessonNotification = async ({
  lessonParticipant,
}: InputParams) => {
  try {
    const communicationPreferences = await getCommunicationPreferencesForReceivers({
      lessonParticipant,
    });
    const channelRequests = notificationChannels.map((channel) =>
      channel({ lessonParticipant, communicationPreferences }),
    );
    await Promise.all(channelRequests);
  } catch (error) {
    Sentry.captureException(error);
  }
};
