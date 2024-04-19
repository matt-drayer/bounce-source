import { PostResponsePayload } from 'constants/payloads/images';
import { BallTypesEnum } from 'types/generated/client';
import { CompetitionGenderEnum, EventGroupFormatsEnum } from 'types/generated/server';
import { TeamTypesEnum } from 'types/generated/server';
import { ScoringFormatEnum } from 'types/generated/server';
import { GetVenueBySlugQuery } from 'types/generated/server';

export interface SponsorCreatePayload extends PostResponsePayload {
  name: string;
  sponsorUrl: string;
  isFeatured: boolean;
}

export interface EventCreatePayload {
  registrationDeadline: string;
  from: string;
  to: string;
  faqs: Faq[];
  private: boolean;
  sanctioned: boolean;
  hasPrizes: boolean;
  title: string;
  overview: string;
  registrationFee: number;
  ball: BallTypesEnum;
  sponsors: SponsorCreatePayload[];
  venue: GetVenueBySlugQuery['venues'][0];
  banner: PostResponsePayload;

  startDateTime: Date;
  endDateTime: Date;

  eventGroups: {
    gender: CompetitionGenderEnum;
    minRating: number;
    maxRating: number;
    eventType: TeamTypesEnum;
    timeSlotDate: string;
    filled: boolean;
    isNew: boolean;
    timeSlotFrom: string;
    timeSlotTo: string;
    ageRestriction: boolean;
    rating: string;
    minNumOfTeams: number;
    minAge: number;
    maxAge: number;
    maxNumOfTeams: number;
    eventFee: number;
    eventFormat: EventGroupFormatsEnum;
    minGamesNumber: number;
    scoringType: ScoringFormatEnum;
    gamePerMatch: number;
    totalPoints: number;
    winBy: number;
  }[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface EventCreateResponse {}
