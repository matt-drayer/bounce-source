import * as Sentry from '@sentry/nextjs';
import { getCommunicationPreferencesForReceivers } from './getCommunicationPreferencesForReceivers';
import { PipelineInputParams } from './params';
import { runEmailNotificationPipeline } from './runEmailNotificationPipeline';
import { runInAppNotificationPipeline } from './runInAppNotificationPipeline';

const notificationChannels = [runInAppNotificationPipeline, runEmailNotificationPipeline];

export const triggerPlaySessionParticipantLeftNotification = async (
  params: PipelineInputParams,
) => {
  console.log('-- IN PIPELINE --', params);
  try {
    const communicationPreferences = await getCommunicationPreferencesForReceivers(params);
    console.log('-- communicationPreferences = ', communicationPreferences);
    const channelRequests = notificationChannels.map((channel) =>
      channel({ data: params, communicationPreferences }),
    );
    await Promise.all(channelRequests);
  } catch (error) {
    console.log('ERROR IN PIPELINE', error);
    Sentry.captureException(error);
  }
};
