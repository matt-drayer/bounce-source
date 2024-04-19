import { InputParams } from './params';
import { getCommunicationPreferencesUserIdMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export const collectReceiverUserIds = ({ followerUserId }: InputParams): string[] => {
  const userIds: string[] = [followerUserId];
  return userIds;
};

export const getCommunicationPreferencesForReceivers = async (params: InputParams) => {
  const userIds = collectReceiverUserIds(params);
  const communicationPreferences = await getCommunicationPreferencesUserIdMap(userIds);

  return communicationPreferences;
};
