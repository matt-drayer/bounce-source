import { GetLessonParticipantByLessonIdAndUserIdQuery } from 'types/generated/server';
import { CommunicationPreferencesUserMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export type LessonParticipant =
  GetLessonParticipantByLessonIdAndUserIdQuery['lessonParticipants'][0];

export interface InputParams {
  lessonParticipant: LessonParticipant;
}

export interface CommunicationParams extends InputParams {
  communicationPreferences: CommunicationPreferencesUserMap;
}
