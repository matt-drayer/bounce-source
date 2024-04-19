import { GetGroupThreadFromUpvoteQuery } from 'types/generated/server';
import { CommunicationPreferencesUserMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export interface PipelineInputParams {
  vote: NonNullable<GetGroupThreadFromUpvoteQuery['groupCommentVotesByPk']>;
}

export interface CommunicationParams {
  communicationPreferences: CommunicationPreferencesUserMap;
  data: PipelineInputParams;
}
