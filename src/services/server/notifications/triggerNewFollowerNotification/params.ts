import { CommunicationPreferencesUserMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export interface InputParams {
  followerUserId: string;
  followedUserId: string;
}

export interface CommunicationParams extends InputParams {
  communicationPreferences: CommunicationPreferencesUserMap;
}
