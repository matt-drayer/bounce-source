import { getNextPowerOfTwo } from './getNextPowerOfTwo';

export const getTotalRounds = (numberOfTeams: number) => {
  return Math.log2(getNextPowerOfTwo(numberOfTeams));
};
