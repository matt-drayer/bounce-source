import { type GetVenueBySlugQuery } from 'types/generated/server';

export const PLAY_SESSIONS_ID = 'play-sessions';

export interface Props {
  venue: GetVenueBySlugQuery['venues'][0];
  faqs: { question: string; answer: string }[];
  jsonLd: string;
}
