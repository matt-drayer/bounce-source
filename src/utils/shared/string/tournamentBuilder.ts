import { Faq } from 'constants/payloads/events';
import { BallTypesEnum } from 'types/generated/client';
import { GetVenueBySlugQuery } from 'types/generated/server';
import { CompetitionGenderEnum } from 'types/generated/server';
import { TeamTypesEnum } from 'types/generated/server';
import { EventGroupFormatsEnum } from 'types/generated/server';
import { ScoringFormatEnum } from 'types/generated/server';
import { getBallName } from 'utils/shared/sports/getBallName';

export type BasicForm = {
  registrationDeadline: Date;
  from: Date;
  to: Date;
  faqs: Faq[];
  private: boolean;
  sanctioned: boolean;
  hasPrizes: boolean;
  title: string;
  overview: string;
  registrationFee: number;
  ball: BallTypesEnum;
  venue: GetVenueBySlugQuery['venues'][0];
  banner: File;
  sponsors: {
    name: string;
    sponsorUrl: string;
    isFeatured: boolean;
    file: File;
  }[];
};

export type EventFormItem = {
  gender: CompetitionGenderEnum;
  minRating: number;
  maxRating: number;
  eventType: TeamTypesEnum;
  timeSlotDate: Date;
  filled: boolean;
  isNew: boolean;
  timeSlotFrom: Date;
  timeSlotTo: Date;
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
  title: string;
};

export type EventGroupsForm = {
  events: EventFormItem[];
};

export const EVENT_FORMAT_OPTIONS = [
  { value: EventGroupFormatsEnum.RoundRobin, label: 'Round Robin' },
  { value: EventGroupFormatsEnum.Custom, label: 'Custom' },

  { value: EventGroupFormatsEnum.SingleElimination, label: 'Single Elimination' },
  {
    value: EventGroupFormatsEnum.RoundRobinSingleElimination,
    label: 'Round Robin & Single Elimination',
  },
];

export const SCORING_TYPE_OPTIONS = [
  { value: ScoringFormatEnum.Traditional, label: 'Traditional' },
  { value: ScoringFormatEnum.Rally, label: 'Rally' },
];

export const GENDER_OPTIONS = [
  { value: CompetitionGenderEnum.Male, label: 'Male' },
  { value: CompetitionGenderEnum.Female, label: 'Female' },
  { value: CompetitionGenderEnum.Mixed, label: 'Mixed' },
];

export const BALL_OPTIONS = [
  {
    value: BallTypesEnum.FranklinX_40Pickleball,
    label: getBallName({ ballType: BallTypesEnum.FranklinX_40Pickleball }),
  },
  {
    value: BallTypesEnum.GammaPhotonPickleball,
    label: getBallName({ ballType: BallTypesEnum.GammaPhotonPickleball }),
  },
  {
    value: BallTypesEnum.OnixDuraFast_40Pickleball,
    label: getBallName({ ballType: BallTypesEnum.OnixDuraFast_40Pickleball }),
  },
  {
    value: BallTypesEnum.OnixFuseG2Pickleball,
    label: getBallName({ ballType: BallTypesEnum.OnixFuseG2Pickleball }),
  },
  {
    value: BallTypesEnum.SelkirkProS1Pickleball,
    label: getBallName({ ballType: BallTypesEnum.SelkirkProS1Pickleball }),
  },
];

export const eventTypeEnumToString = (value: TeamTypesEnum): string => {
  if (value === TeamTypesEnum.Doubles) return 'Doubles';

  return 'Singles';
};

export const eventFormatEnumToString = (enumValue: EventGroupFormatsEnum): string => {
  return EVENT_FORMAT_OPTIONS.find(({ value }) => enumValue === value)?.label as string;
};

export const scoringTypeEnumToString = (enumValue: ScoringFormatEnum): string => {
  return SCORING_TYPE_OPTIONS.find(({ value }) => value === enumValue)?.label as string;
};
