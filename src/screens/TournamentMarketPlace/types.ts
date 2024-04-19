import {
  CompetitionGenderEnum,
  EventGroupFormatsEnum,
  TeamTypesEnum,
} from 'types/generated/client';
import { type GetTournamentsForMarketplaceQuery } from 'types/generated/server';

export { type GetTournamentsForMarketplaceQuery };

export const ANY_OPTION = 'Any';
export const MINIMUM_COST = 0;
export const MAXIMUM_COST = 200;
export const MINIMUM_AGE = 0;
export const MAXIMUM_AGE = 99;
export interface FilterProps {
  selectedDate: number | null;
  setSelectedDate: (dateId: number | null) => void;
  isPrizeMoney: boolean;
  setIsPrizeMoney: (isPrizeMoney: boolean) => void;
  costMinimum: number;
  setCostMinimum: (costMinimum: number) => void;
  costMaximum: number;
  setCostMaximum: (costMaximum: number) => void;
  ageMinimum: number;
  setAgeMinimum: (ageMinimum: number) => void;
  ageMaximum: number;
  setAgeMaximum: (ageMaximum: number) => void;
  skillLevelMinimum: number;
  setSkillLevelMinimum: (skillLevelMinimum: number) => void;
  skillLevelMaximum: number;
  setSkillLevelMaximum: (skillLevelMaximum: number) => void;
  teamType: TeamTypesEnum | string | null;
  setTeamType: (teamType: TeamTypesEnum | string | null) => void;
  competitionFormat: EventGroupFormatsEnum | string | null;
  setCompetitionFormat: (competitionFormat: EventGroupFormatsEnum | string | null) => void;
}

export const TOURNAMENT_DATES = [
  {
    name: 'Next 7 Days',
    id: 7,
  },
  {
    name: 'Next 30 Days',
    id: 30,
  },
  {
    name: 'Next 90 Days',
    id: 90,
  },
  {
    name: 'Within a Year',
    id: 370,
  },
  {
    name: 'Any Date',
    id: -1,
  },
];

export const TOURNAMENT_DISTANCE_IMPERIAL_OPTIONS = [
  {
    name: 'Any distance',
    id: 0,
  },
  {
    name: '10 miles',
    id: 10,
  },
  {
    name: '25 miles',
    id: 25,
  },
  {
    name: '50 miles',
    id: 50,
  },
  {
    name: '100 miles',
    id: 100,
  },
  {
    name: '200 miles',
    id: 200,
  },
  {
    name: '500 miles',
    id: 500,
  },
];

export const TOURNAMENT_DISTANCE_METRIC_OPTIONS = [
  {
    name: 'Any distance',
    id: 0,
  },
  {
    name: '10 km',
    id: 10,
  },
  {
    name: '25 km',
    id: 25,
  },
  {
    name: '50 km',
    id: 50,
  },
  {
    name: '100 km',
    id: 100,
  },
  {
    name: '200 km',
    id: 200,
  },
  {
    name: '500 km',
    id: 500,
  },
];

export const TEAM_TYPES = [
  {
    id: TeamTypesEnum.Doubles,
    name: 'Doubles',
  },
  {
    id: TeamTypesEnum.Singles,
    name: 'Singles',
  },
  {
    id: ANY_OPTION,
    name: 'Any',
  },
];

export const COMPETITION_FORMATS = [
  {
    id: EventGroupFormatsEnum.RoundRobin,
    name: 'Round Robin (RR)',
  },
  {
    id: EventGroupFormatsEnum.RoundRobinSingleElimination,
    name: 'RR + Single Elimination',
  },
  {
    id: EventGroupFormatsEnum.Custom,
    name: 'Other',
  },
  {
    id: ANY_OPTION,
    name: 'Any',
  },
];

export const COMPETITION_GENDER_MENU = [
  { id: CompetitionGenderEnum.Male, name: "Men's" },
  {
    id: CompetitionGenderEnum.Female,
    name: "Women's",
  },
  {
    id: CompetitionGenderEnum.Mixed,
    name: 'Mixed',
  },
];
