import { CompetitionGenderEnum } from 'types/generated/server';

export const buildTournamentEventName = (opts: {
  gender: CompetitionGenderEnum;
  eventType: string;
  minRating: number;
  maxRating: number;
}) => {
  const gender = opts.gender === CompetitionGenderEnum.Male ? "Men's" : "Women's";

  return `${gender} ${opts.eventType} ${opts.minRating}-${opts.maxRating}`;
};
