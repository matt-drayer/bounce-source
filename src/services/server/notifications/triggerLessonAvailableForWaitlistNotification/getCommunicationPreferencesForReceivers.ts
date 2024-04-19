import { PipelineInputParams } from './params';
import { getCommunicationPreferencesUserIdMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export const collectReceiverUserIds = ({ waitlist }: PipelineInputParams): string[] => {
  const userIds = new Set<string>();

  waitlist.forEach(({ userId }) => {
    if (userId) {
      userIds.add(userId);
    }
  });

  return Array.from(userIds);
};

export const getCommunicationPreferencesForReceivers = async (params: PipelineInputParams) => {
  const userIds = collectReceiverUserIds(params);
  const communicationPreferences = await getCommunicationPreferencesUserIdMap(userIds);

  return communicationPreferences;
};
