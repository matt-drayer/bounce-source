import { Round, RoundRobinMatch, SchedulerConfig } from 'constants/tournaments';

export { type Round, type RoundRobinMatch, type SchedulerConfig };

const MAX_POSSIBLE_MATCHES = 9999999;
const IS_LOGGING = false;

/**
 * @note I added things like an array shuffle and sorting games to get the most least-played to the top. This broke the algorithm. The algorithm is quite robust and any transformations seem like they should happen outside this module.
 */

/**
 * @todo
 * - Remove the "initialMatches"?
 * - Should we ignore time for now and assume min games is the main driver?
 * - Add a "shouldPlayAllTeamsExactlyOnce" flag to generate all matches and return them
 */

export function generateAllMatches({
  numTeams,
  shouldPreventDuplicateMatches,
  existingMatches,
}: {
  numTeams: number;
  shouldPreventDuplicateMatches?: boolean;
  existingMatches?: RoundRobinMatch[];
  isNoShuffle?: boolean;
}): RoundRobinMatch[] {
  const matches: RoundRobinMatch[] = [];
  const isOdd = numTeams % 2 !== 0;
  let totalNumTeams = numTeams + (isOdd ? 1 : 0); // Adjust for odd number of teams
  let teamsList = Array.from({ length: totalNumTeams }, (_, i) => i);

  for (let round = 0; round < totalNumTeams - 1; round++) {
    for (let match = 0; match < totalNumTeams / 2; match++) {
      const team1 = match === 0 ? teamsList[0] : teamsList[match];
      const team2 = teamsList[totalNumTeams - match - 1];

      if (team1 >= numTeams || team2 >= numTeams) continue; // Skip if one is a "bye"

      const isExistingMatch = existingMatches?.some(
        ({ teamA, teamB }) =>
          (teamA === team1 && teamB === team2) || (teamA === team2 && teamB === team1),
      );

      if (shouldPreventDuplicateMatches && isExistingMatch) continue;

      matches.push({ teamA: team1, teamB: team2, court: 0, time: 0 });
    }

    teamsList.splice(1, 0, teamsList.pop()!); // Rotate teams for next round
  }

  return matches;
}

const shouldMakeMoreMatches = ({
  config,
  gameCount,
  currentTime,
  shouldPlayAllTeamsExactlyOnce,
}: {
  config: SchedulerConfig;
  gameCount: number;
  currentTime: number;
  shouldPlayAllTeamsExactlyOnce?: boolean;
}) => {
  /**
   * @note We generate all the matches, so we assume it keeps going until all matches are played
   */
  if (shouldPlayAllTeamsExactlyOnce) {
  }

  if (config.totalTime && config.minimumGamesPerTeam) {
    return currentTime < config.totalTime || gameCount < config.minimumGamesPerTeam;
  }

  if (config.totalTime) {
    return currentTime < config.totalTime;
  }

  if (config.minimumGamesPerTeam) {
    return gameCount < config.minimumGamesPerTeam;
  }

  return false;
};

const INFINITE_MAX_LOOPS = 5000;

function distributeMatches(initialMatches: RoundRobinMatch[], config: SchedulerConfig): Round[] {
  const { numCourts, timePerMatch, totalTime, ensureEqualMatches, minimumGamesPerTeam } = config;
  const rounds: Round[] = [];
  const teamMatchesCount: { [key: number]: number } = {};
  const totalMatches = minimumGamesPerTeam || Math.floor((totalTime || 0) / timePerMatch);
  let currentTime = 0;
  let minimumMatchCount = 0;
  let loops = 0;

  let matches = [...initialMatches];

  while (
    shouldMakeMoreMatches({ config, gameCount: minimumMatchCount, currentTime }) &&
    loops < INFINITE_MAX_LOOPS
  ) {
    const currentRound: Round = { matches: [], byes: [] };
    const teamsPlayingThisRound: Set<number> = new Set();
    let court = 0;

    /**
     * @note this actually made the ordering worse in some cases, but keeping it here in case we want to expend on the thinking
     */
    // matches = matches.sort((a, b) => {
    //   // Sort matches by the sum of games of both teams, ascending. Prioritize teams with fewer games played so far.
    //   const sumAGames = (teamMatchesCount[a.teamA] || 0) + (teamMatchesCount[a.teamB] || 0);
    //   const sumBGames = (teamMatchesCount[b.teamA] || 0) + (teamMatchesCount[b.teamB] || 0);
    //   return sumAGames - sumBGames;
    // });

    // Set matches within a round
    while (
      court < numCourts &&
      loops < INFINITE_MAX_LOOPS &&
      shouldMakeMoreMatches({ config, gameCount: minimumMatchCount, currentTime })
    ) {
      // Get full list of possible matches
      if (matches.length === 0) {
        if (config.shouldPlayAllTeamsExactlyOnce) {
          const totalPossibleMatches = (config.numTeams * (config.numTeams - 1)) / 2;
          if (initialMatches.length >= totalPossibleMatches) {
            return rounds;
          }
        }
        matches = generateAllMatches({
          numTeams: config.numTeams,
          shouldPreventDuplicateMatches: config.shouldPlayAllTeamsExactlyOnce,
          existingMatches: initialMatches,
        });
      }

      /**
       * @note this actually made the ordering worse in some cases, but keeping it here in case we want to expend on the thinking
       */
      // Prioritize teams that have played the least number of games
      // matches = matches.sort((a, b) => {
      //   const totalGamesA = (teamMatchesCount[a.teamA] || 0) + (teamMatchesCount[a.teamB] || 0);
      //   const totalGamesB = (teamMatchesCount[b.teamA] || 0) + (teamMatchesCount[b.teamB] || 0);
      //   return totalGamesA - totalGamesB;
      // });

      loops++;

      const match = matches.shift()!;

      if (
        // Teams can only play once in a given round
        teamsPlayingThisRound.has(match.teamA) ||
        teamsPlayingThisRound.has(match.teamB) ||
        // Both teams have played the minimum number of games
        (!!minimumGamesPerTeam &&
          (teamMatchesCount[match.teamA] || 0) >= minimumGamesPerTeam &&
          (teamMatchesCount[match.teamB] || 0) >= minimumGamesPerTeam) ||
        // Prevent teams from having too many matches
        (ensureEqualMatches &&
          (teamMatchesCount[match.teamA] || 0) >= Math.floor(totalMatches) &&
          (teamMatchesCount[match.teamB] || 0) >= Math.floor(totalMatches))
      ) {
        matches.push(match);
        continue;
      }

      // Add the match and increment the teams' play count
      match.time = currentTime;
      match.court = court;
      currentRound.matches.push(match);
      teamsPlayingThisRound.add(match.teamA);
      teamsPlayingThisRound.add(match.teamB);

      teamMatchesCount[match.teamA] = (teamMatchesCount[match.teamA] || 0) + 1;
      teamMatchesCount[match.teamB] = (teamMatchesCount[match.teamB] || 0) + 1;

      // Update the minimum match count
      let smallestCurrentMatchCount = MAX_POSSIBLE_MATCHES;
      Object.values(teamMatchesCount).forEach((count) => {
        if (count < smallestCurrentMatchCount) {
          smallestCurrentMatchCount = count;
        }
      });

      minimumMatchCount = smallestCurrentMatchCount;

      court++;
    }

    // Fill in byes for teams that didn't play for the current round
    for (let i = 0; i < config.numTeams; i++) {
      if (!teamsPlayingThisRound.has(i)) {
        currentRound.byes.push(i);
      }
    }

    // Add current round to schedule of play
    rounds.push(currentRound);

    // Update the minimum match count
    let smallestCurrentMatchCount = MAX_POSSIBLE_MATCHES;
    Object.values(teamMatchesCount).forEach((count) => {
      if (count < smallestCurrentMatchCount) {
        smallestCurrentMatchCount = count;
      }
    });

    minimumMatchCount = smallestCurrentMatchCount;

    // Increment time it took, assuming all matches in a round are simultaneous and take the same amount of time
    currentTime += timePerMatch;
  }

  // ------------------------------------------------------------------------------------

  return rounds;
}

function scheduler(config: SchedulerConfig): Round[] {
  const numCourts =
    config.numCourts > Math.floor(config.numTeams / 2)
      ? Math.floor(config.numTeams / 2)
      : config.numCourts;

  if (config.numTeams < 2 || numCourts < 1 || config.timePerMatch <= 0) {
    throw new Error('Invalid configuration values');
  }

  if (!config.totalTime && !config.minimumGamesPerTeam) {
    throw new Error('Must specify a max time or minimum games per team');
  }

  const allMatches = generateAllMatches(config);
  return distributeMatches(allMatches, { ...config, numCourts });
}

export default scheduler;
