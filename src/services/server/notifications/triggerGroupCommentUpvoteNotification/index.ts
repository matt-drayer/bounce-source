import * as Sentry from '@sentry/nextjs';
import { getCommunicationPreferencesForReceivers } from './getCommunicationPreferencesForReceivers';
import { PipelineInputParams } from './params';
import { runInAppNotificationPipeline } from './runInAppNotificationPipeline';

const notificationChannels = [runInAppNotificationPipeline];

export const triggerGroupCommentUpvoteNotification = async (params: PipelineInputParams) => {
  try {
    const communicationPreferences = await getCommunicationPreferencesForReceivers(params);
    const channelRequests = notificationChannels.map((channel) =>
      channel({ data: params, communicationPreferences }),
    );
    await Promise.all(channelRequests);
  } catch (error) {
    console.log('ERROR IN PIPELINE', error);
    Sentry.captureException(error);
  }
};
