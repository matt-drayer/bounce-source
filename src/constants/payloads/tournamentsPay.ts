import { Tournament } from 'constants/tournaments';

export interface PostRequestPayload {
  tournamentId: string;
  providerCardId: string;
  amount: number;
  partnerEmail: string;
  brevoListId: number;
  duprId: string;
}

export interface GetResponsePayload {
  tournament: Tournament;
}

export interface HonchoInfo {
  phone: string;
  age: number;
  teamName: string;
  duprId: string;
  instagram: string;
}
