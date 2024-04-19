export const API_URL = process.env.DUPR_API_URL as string;

export const API_KEY = process.env.DUPR_API_KEY as string;

export type Token = {
  status: Status;
  result: {
    token: string;
    expiry: string;
  };
};

export type BaseUser = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  ratings: {
    singles: string;
    doubles: string;
    isSinglesReliable: boolean;
    isDoublesReliable: boolean;
  };
};

export type User = {
  status: Status;
  result: BaseUser;
};

export type SearchUser = {
  gender: string;
  age: number;
  address: string;
} & BaseUser;

export enum Status {
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

export type MatchGame = {
  game1: string;
  game2: string;
  game3: string;
  game4: string;
  game5: string;
  player1: string;
  player2: string;
};

export type Match = {
  id: string;
  bracket: string;
  clubId: number;
  event: string;
  teams: {
    games: MatchGame;
  }[];
  format: string;
  identifier: string; //automatically generate id
  location: string;
  matchDate: string; // 'yyyy-MM-dd'
  matchSource: string;
  matchType: string;
};

export type MatchDto = {
  payload: {
    duprEvent: string;
    teams: {
      games: MatchGame[];
    }[];
  } & Omit<Match, 'event' | 'identifier' | 'clubId'>;
};

export type DuprMatchDto = {
  teamA: MatchGame;
  teamB: MatchGame;
} & Pick<
  Match,
  | 'bracket'
  | 'matchType'
  | 'matchSource'
  | 'clubId'
  | 'event'
  | 'identifier'
  | 'location'
  | 'format'
  | 'matchDate'
>;
