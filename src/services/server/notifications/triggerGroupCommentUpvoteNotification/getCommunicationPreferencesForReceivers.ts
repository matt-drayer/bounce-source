import { PipelineInputParams } from './params';
import { getCommunicationPreferencesUserIdMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export const collectReceiverUserIds = ({ vote }: PipelineInputParams): string[] => {
  const userIds = new Set<string>();

  const senderId = vote.userId;
  const receiverId = vote.comment.user?.id;

  if (senderId && receiverId && receiverId !== senderId) {
    userIds.add(receiverId);
  }

  return Array.from(userIds);
};

export const getCommunicationPreferencesForReceivers = async (params: PipelineInputParams) => {
  const userIds = collectReceiverUserIds(params);
  const communicationPreferences = await getCommunicationPreferencesUserIdMap(userIds);

  return communicationPreferences;
};
