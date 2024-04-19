import { GetGroupThreadFromCommentQuery } from 'types/generated/server';
import { CommunicationPreferencesUserMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export interface PipelineInputParams {
  newComment: NonNullable<GetGroupThreadFromCommentQuery['groupThreadCommentsByPk']>;
}

export interface CommunicationParams {
  communicationPreferences: CommunicationPreferencesUserMap;
  data: PipelineInputParams;
}
