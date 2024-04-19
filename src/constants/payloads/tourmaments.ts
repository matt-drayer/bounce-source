import { Tournament } from 'constants/tournaments';

export interface GetRequestPayload {}
export interface GetResponsePayload {
  tournaments: {
    startDate: string;
    endDate: string;
    title: string;
    id: string;
    slug: string;
    registrationFee: number;
    location: string;
    gender: string;
    appImageUrl: string;
  }[];
}
