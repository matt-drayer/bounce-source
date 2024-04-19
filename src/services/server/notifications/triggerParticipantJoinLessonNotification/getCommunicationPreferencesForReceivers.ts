import { InputParams } from './params';
import { getCommunicationPreferencesUserIdMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export const collectReceiverUserIds = ({ participants }: InputParams): string[] => {
  const userIds: string[] = [];

  participants.forEach((participant) => {
    const ownerId = participant.lesson.owner?.id;

    if (ownerId) {
      userIds.push(ownerId);
    }
  });

  return userIds;
};

export const getCommunicationPreferencesForReceivers = async ({ participants }: InputParams) => {
  const userIds = collectReceiverUserIds({ participants });
  const communicationPreferences = await getCommunicationPreferencesUserIdMap(userIds);

  return communicationPreferences;
};
