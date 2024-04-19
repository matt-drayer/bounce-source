import { CommunicationPreferencesUserMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export interface PipelineInputParams {
  waitlist: { userId: string; email: string; fullName: string; preferredName: string }[];
  coachId: string;
  lessonId: string;
  lessonName: string;
  isoDateString: string;
  timezoneOffsetMinutes: number;
  timezoneName: string;
  timezoneAbbreviation: string;
  locale: string;
}

export interface CommunicationParams {
  communicationPreferences: CommunicationPreferencesUserMap;
  data: PipelineInputParams;
}
