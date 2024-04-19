import { PipelineInputParams } from './params';
import { getCommunicationPreferencesUserIdMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export const collectReceiverUserIds = ({ newComment }: PipelineInputParams): string[] => {
  const userIds = new Set<string>();

  const senderId = newComment.userId;

  newComment.thread.comments.forEach((participant) => {
    if (participant.userId && participant.userId !== senderId) {
      userIds.add(participant.userId);
    }
  });

  return Array.from(userIds);
};

export const getCommunicationPreferencesForReceivers = async (params: PipelineInputParams) => {
  const userIds = collectReceiverUserIds(params);
  const communicationPreferences = await getCommunicationPreferencesUserIdMap(userIds);

  return communicationPreferences;
};
