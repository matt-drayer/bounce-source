import { PlaySessionParticipants, PlaySessions, Users } from 'types/generated/server';
import { CommunicationPreferencesUserMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export type PipelineViewer = Pick<Users, 'id' | 'fullName'>;
export type ParticipantUser = Pick<Users, 'id' | 'fullName'>;
export type Organizer = Pick<Users, 'id' | 'email' | 'preferredName' | 'fullName'> | null;
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
> & { participants: Participants[] };

export interface PipelineInputParams {
  viewer: PipelineViewer;
  organizer: Organizer;
  playSession: PlaySession;
  newParticipants: Participants[];
}

export interface CommunicationParams {
  communicationPreferences: CommunicationPreferencesUserMap;
  data: PipelineInputParams;
}
