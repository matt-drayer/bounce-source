import { GetGamedayByEventIdQuery, useGetGamedayByEventIdLazyQuery } from 'types/generated/client';

export enum MatchStatus {
  Complete = 'COMPLETE',
  Active = 'ACTIVE',
  UpNext = 'UP_NEXT',
  Upcoming = 'UPCOMING',
}

export type MatchesType = NonNullable<
  NonNullable<NonNullable<GetGamedayByEventIdQuery['eventsByPk']>['groups'][0]>['sequences'][0]
>['pools'][0]['rounds'][0]['matches'];

export type MatchType = MatchesType[0] & { status?: MatchStatus };

export type TeamType = MatchType['team1'];

export type GameType = MatchType['games'][0];

export type ActiveCourtMatchType = NonNullable<
  NonNullable<NonNullable<GetGamedayByEventIdQuery['eventsByPk']>['groups'][0]>['courts'][0]
>['activeMatch'];

export type CourtsType = NonNullable<
  NonNullable<NonNullable<GetGamedayByEventIdQuery['eventsByPk']>['groups'][0]>['courts']
>;

export type Round = NonNullable<
  NonNullable<NonNullable<GetGamedayByEventIdQuery['eventsByPk']>['groups'][0]>['sequences'][0]
>['pools'][0]['rounds'][0];

export type Seeding = NonNullable<
  NonNullable<NonNullable<GetGamedayByEventIdQuery['eventsByPk']>['groups'][0]>['sequences'][0]
>['seeding'];
