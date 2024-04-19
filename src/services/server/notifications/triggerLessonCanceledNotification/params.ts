import { GetLessonWithParticipantsByIdQuery } from 'types/generated/server';
import { CommunicationPreferencesUserMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export interface InputParams {
  lesson: GetLessonWithParticipantsByIdQuery['lessonsByPk'];
}

export interface CommunicationParams extends InputParams {
  communicationPreferences: CommunicationPreferencesUserMap;
}
