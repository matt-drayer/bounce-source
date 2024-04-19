import { Tournament } from 'constants/tournaments';

export interface PostRequestPayload {
  name: string;
  email: string;
  member1: string;
  member2: string;
  member3: string;
  tournamentId: string;
}

export interface GetResponsePayload {
  tournament: Tournament;
}
