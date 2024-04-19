import { LessonParticipants, Lessons, Users } from 'types/generated/server';
import { CommunicationPreferencesUserMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export type Participants = Pick<LessonParticipants, 'id' | 'status' | 'userId' | 'lessonId'> & {
  user: Pick<Users, 'id' | 'fullName'>;
} & {
  lesson: Pick<
    Lessons,
    | 'id'
    | 'status'
    | 'startDateTime'
    | 'title'
    | 'type'
    | 'locale'
    | 'timezoneName'
    | 'timezoneAbbreviation'
    | 'timezoneOffsetMinutes'
  > & { owner?: Pick<Users, 'id' | 'email' | 'preferredName' | 'fullName'> | null };
};

export interface InputParams {
  participants: Participants[];
}

export interface CommunicationParams extends InputParams {
  communicationPreferences: CommunicationPreferencesUserMap;
}
