import { PlaySessionParticipants, PlaySessions, Users } from 'types/generated/server';
import { CommunicationPreferencesUserMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export type ParticipantUser = Pick<Users, 'id' | 'fullName' | 'email' | 'preferredName'>;
export type Organizer = Pick<
  Users,
  'id' | 'email' | 'preferredName' | 'fullName' | 'preferredName'
> | null;
export type Participants = Pick<PlaySessionParticipants, 'status' | 'userId' | 'playSessionId'> & {
  user: ParticipantUser;
};
export type PlaySession = Pick<
  PlaySessions,
  | 'id'
  | 'status'
  | 'startDateTime'
  | 'title'
  | 'format'
  | 'targetSkillLevel'
  | 'competitiveness'
  | 'courtBookingStatus'
  | 'locale'
  | 'timezoneName'
  | 'timezoneAbbreviation'
  | 'timezoneOffsetMinutes'
> & { participants: Participants[] } & { organizer?: Organizer };

export interface PipelineInputParams {
  playSession: PlaySession;
}

export interface CommunicationParams {
  communicationPreferences: CommunicationPreferencesUserMap;
  data: PipelineInputParams;
}
