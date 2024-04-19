import * as Sentry from '@sentry/nextjs';
import { getCommunicationPreferencesForReceivers } from './getCommunicationPreferencesForReceivers';
import { InputParams } from './params';
import { runEmailNotificationPipeline } from './runEmailNotificationPipeline';
import { runInAppNotificationPipeline } from './runInAppNotificationPipeline';

const notificationChannels = [runInAppNotificationPipeline, runEmailNotificationPipeline];

export const triggerLessonCanceledNotification = async (params: InputParams) => {
  try {
    const communicationPreferences = await getCommunicationPreferencesForReceivers(params);
    const channelRequests = notificationChannels.map((channel) =>
      channel({ ...params, communicationPreferences }),
    );
    await Promise.all(channelRequests);
  } catch (error) {
    Sentry.captureException(error);
  }
};
