import { MatchSelectionCriteriaEnum } from 'types/generated/server';
import { getNextPowerOfTwo } from './getNextPowerOfTwo';
import { getRoundNames } from './getRoundNames';
import { getTotalRounds } from './getTotalRounds';
import { orderFirstRoundMatchups } from './orderFirstRoundMatchups';

interface Match {
  id: string;
  round: number;
  roundName?: string;
  team1Index?: number;
  team2Index?: number;
  team1Rank?: number;
  team2Rank?: number;
  previousMatch1Id?: string;
  previousMatch2Id?: string;
  previousMatch1Index?: number;
  previousMatch2Index?: number;
  isThirdPlaceMatch?: boolean;
  previousRoundIndex?: number;
  selectionCriteriaPreviousMatch1?: MatchSelectionCriteriaEnum;
  selectionCriteriaPreviousMatch2?: MatchSelectionCriteriaEnum;
  /**
   * @note was trying to map out a data structure, but I think it's better to do it through indexes
   */
  // previousMatch1?: Match;
  // previousMatch2?: Match;
  // previousMatches?: Match[];
}

interface Params {
  rankedTeams: any[];
  numberOfQualifyingTeams?: number;
  hasThirdPlaceMatch?: boolean;
}

export const calculateTotalMatches = ({
  teamCount,
  byes,
  hasThirdPlaceMatch,
}: {
  teamCount: number;
  byes: number;
  hasThirdPlaceMatch?: boolean;
}): { totalMatchesWithByes: number; totalMatchesExcludeByes: number } => {
  if (teamCount < 2) {
    return {
      totalMatchesWithByes: 0,
      totalMatchesExcludeByes: 0,
    };
  }

  if (byes < 0) {
    throw new Error('Byes cannot be negative');
  }

  const totalMatchesWithByes = teamCount - 1;
  const totalMatchesWithoutByes = totalMatchesWithByes - byes;
  const incrementForThirdPlace = hasThirdPlaceMatch ? 1 : 0;

  return {
    totalMatchesWithByes: totalMatchesWithByes + incrementForThirdPlace,
    totalMatchesExcludeByes: totalMatchesWithoutByes + incrementForThirdPlace,
  };
};

export const generateSingleEliminationBracket = ({
  rankedTeams,
  numberOfQualifyingTeams,
  hasThirdPlaceMatch = true,
}: Params) => {
  const safeNumberOfQualifyingTeams = Math.min(
    rankedTeams.length,
    numberOfQualifyingTeams || Infinity,
  );

  if (safeNumberOfQualifyingTeams < 2) {
    throw new Error('Not enough teams to run tournament');
  }

  const teamsInBracket = rankedTeams.slice(0, safeNumberOfQualifyingTeams).map((team, i) => {
    return {
      ...team,
      seed: i + 1,
    };
  });
  const numberOfTeamsInBracket = teamsInBracket.length;
  const nextPowerOfTwo = getNextPowerOfTwo(teamsInBracket.length);
  const numberOfTeamsWithByes = nextPowerOfTwo;
  const thirdPlaceRoundIncrement = hasThirdPlaceMatch ? 1 : 0;
  const totalRounds = getTotalRounds(numberOfTeamsWithByes);
  const firstRoundByeCount = nextPowerOfTwo - teamsInBracket.length;
  const { totalMatchesWithByes, totalMatchesExcludeByes } = calculateTotalMatches({
    teamCount: numberOfTeamsWithByes,
    byes: firstRoundByeCount,
    hasThirdPlaceMatch,
  });

  const matchCountByRound = [];
  let matchCount = numberOfTeamsWithByes / 2;
  while (matchCount >= 1) {
    if (hasThirdPlaceMatch && matchCount === 1 && numberOfTeamsWithByes > 2) {
      /**
       * @todo Should it have its own round or two matches in the finals round?
       */
      matchCountByRound.push({ matchCount, isThirdPlaceMatch: true });
    }

    matchCountByRound.push({ matchCount });
    matchCount = matchCount / 2;
  }

  const roundNames = getRoundNames(totalRounds, hasThirdPlaceMatch);
  const matchesByRound: Match[][] = [];
  let currentRoundMatches: Match[] = [];
  let nextRoundMatches: Match[] = [];
  let round = 1;

  for (
    let matchCount = numberOfTeamsWithByes / 2, currentRound = 0;
    matchCount >= 1;
    matchCount /= 2, round++, currentRound++
  ) {
    currentRoundMatches = [];
    for (let i = 0; i < matchCount; i++) {
      const match: Match = {
        id: `match-${i + 1}-round-${round}`,
        round,
      };
      // Add team indices for the first round
      if (round === 1) {
        match.team1Index = i;
        match.team1Rank = i + 1;
        match.team2Index = firstRoundByeCount > i ? -1 : numberOfTeamsWithByes - 1 - i;
        match.team2Rank = numberOfTeamsWithByes - i;
      }
      // Linking with previous matches for subsequent rounds
      if (round > 1) {
        const previousMatch1Index = i * 2;
        const previousMatch2Index = i * 2 + 1;
        const previousMatch1 = nextRoundMatches[previousMatch1Index];
        const previousMatch2 = nextRoundMatches[previousMatch2Index];

        match.previousMatch1Index = previousMatch1Index;
        match.previousMatch2Index = previousMatch2Index;
        match.previousMatch1Id = previousMatch1.id;
        match.previousMatch2Id = previousMatch2.id;
        match.selectionCriteriaPreviousMatch1 = MatchSelectionCriteriaEnum.Winner;
        match.selectionCriteriaPreviousMatch2 = MatchSelectionCriteriaEnum.Winner;

        match.previousRoundIndex = currentRound - 1;

        /**
         * @note was trying to map out a data structure, but I think it's better to do it through indexes
         */
        // match.previousMatches = [previousMatch1, previousMatch2];
        // match.previousMatch1 = previousMatch1;
        // match.previousMatch2 = previousMatch2;
      }
      currentRoundMatches.push(match);
    }
    /**
     * @note We reorder the first round matches to disperse the competition
     */
    const finalMatchesForRound =
      round === 1 ? orderFirstRoundMatchups(currentRoundMatches) : currentRoundMatches;
    matchesByRound.push(finalMatchesForRound);
    nextRoundMatches = finalMatchesForRound;
  }

  // Handle third place match if required
  if (hasThirdPlaceMatch && numberOfTeamsWithByes > 2) {
    const finalsRound = matchesByRound.pop()?.[0];

    if (finalsRound) {
      const thirdPlaceMatch: Match = {
        ...finalsRound,
        round: finalsRound.round,
        isThirdPlaceMatch: true,
        selectionCriteriaPreviousMatch1: MatchSelectionCriteriaEnum.Loser,
        selectionCriteriaPreviousMatch2: MatchSelectionCriteriaEnum.Loser,
      };
      matchesByRound.push([thirdPlaceMatch]);

      finalsRound.round = finalsRound.round + 1;
      finalsRound.id = `match-1-round-${finalsRound.round}`;

      matchesByRound.push([finalsRound]);
    }
  }

  matchesByRound.forEach((matches, i) => {
    const roundName = roundNames[i];

    matches.forEach((match) => {
      match.roundName = roundName;
    });
  });

  return {
    teamsInBracket,
    numberOfTeamsInBracket,
    numberOfTeamsWithByes,
    totalRounds: totalRounds + thirdPlaceRoundIncrement,
    isThirdPlaceIncludedInRoundCount: hasThirdPlaceMatch,
    firstRoundByeCount,
    totalMatchesWithByes,
    totalMatchesExcludeByes,
    matchCountByRound,
    matchesByRound,
    roundNames,
  };
};
