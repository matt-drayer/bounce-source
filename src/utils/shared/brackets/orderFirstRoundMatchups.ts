const tournamentMappings = {
  2: [[0, 1]],
  4: [
    [0, 3],
    [1, 2],
  ],
  8: [
    [0, 7],
    [3, 4],
    [2, 5],
    [1, 6],
  ],
  16: [
    [0, 15],
    [7, 8],
    [4, 11],
    [3, 12],
    [5, 10],
    [2, 13],
    [6, 9],
    [1, 14],
  ],
};

/**
 * @note This function assume teams are already matched up, so we can use the index of the first team to generate the first round list
 */
const disperseCompetitionOfPreviouslyMatchedTeams = (rankedMatchups: any[]): any[] => {
  const numberOfTeams = rankedMatchups.length * 2;
  // @ts-ignore - mapping validated
  const mapping = tournamentMappings[numberOfTeams];
  const matchedTeams: any[] = [];

  mapping.forEach(([indexOfMatched]: number[]) => {
    matchedTeams.push(rankedMatchups[indexOfMatched]);
  });

  return matchedTeams;
};

export const orderFirstRoundMatchups = (rankedMatchups: any[]): any[] => {
  const numberOfMatchups = rankedMatchups.length;
  const isPowerOfTwo = (numberOfMatchups & (numberOfMatchups - 1)) === 0;
  const numberOfTeams = numberOfMatchups * 2;

  if (!isPowerOfTwo) {
    throw new Error('Number of teams must be a power of two');
  }

  if (numberOfTeams < 2) {
    throw new Error('Must have at least 2 teams');
  }

  if (numberOfTeams <= 16) {
    return disperseCompetitionOfPreviouslyMatchedTeams(rankedMatchups);
  }

  /**
   * @todo Write a test to confirm this makes groups of 16 teams, 8 matchups
   */
  const numberOfValidGroupings = Math.floor(numberOfMatchups / 8); // 16 teams is 8 matchups
  const regroupedMatchups: any[][] = new Array(numberOfValidGroupings).fill(null).map(() => []);

  /**
   * @note This is more of a heuristic than a strict single elim algorithm, but once it gets this large, you're splitting hairs anyway
   */
  let groupingIndex = 0;
  let isMovingRight = true;
  let pauseAtEdge = true;

  for (let i = 0; i <= rankedMatchups.length - 1; i++) {
    regroupedMatchups[groupingIndex].push(rankedMatchups[i]);

    // Check if we're at the last grouping and if we should pause here.
    if (groupingIndex === numberOfValidGroupings - 1 && !pauseAtEdge) {
      pauseAtEdge = true; // Set to pause and stay on this edge for one more iteration.
    } else if (groupingIndex === 0 && !pauseAtEdge) {
      // Same for the first grouping.
      pauseAtEdge = true;
    } else {
      // If not pausing or after pausing, proceed to change direction.
      groupingIndex += isMovingRight ? 1 : -1;
      // Check if we need to switch the direction after pausing.
      if (pauseAtEdge && (groupingIndex === 0 || groupingIndex === numberOfValidGroupings - 1)) {
        isMovingRight = !isMovingRight; // Switch direction.
        pauseAtEdge = false; // Reset the pause flag.
      }
    }
  }

  let orderedSubgroups: any[] = [];
  if (numberOfValidGroupings <= 16) {
    // @ts-ignore should be correct
    const mapping = tournamentMappings[numberOfValidGroupings];
    mapping.forEach(([firstIndex, secondIndex]: number[]) => {
      orderedSubgroups.push(regroupedMatchups[firstIndex]);
      orderedSubgroups.push(regroupedMatchups[secondIndex]);
    });
  } else {
    /**
     * @note this won't guarantee full/perfect distribution for very large tournaments.
     * We need a smarter recursive solution.
     * However, given the rarity of events so large, this can be considered good enough for now
     */
    for (let i = 0; i < regroupedMatchups.length; i += 16) {
      const matchupsForSlice = regroupedMatchups.slice(i, i + 16);
      // @ts-ignore should be correct
      const mapping = tournamentMappings[matchupsForSlice.length];
      mapping.forEach(([firstIndex, secondIndex]: number[]) => {
        orderedSubgroups.push(regroupedMatchups[firstIndex]);
        orderedSubgroups.push(regroupedMatchups[secondIndex]);
      });
    }
  }

  const orderedMatches: any[] = [];
  orderedSubgroups.forEach((subgroup: any[]) => {
    orderedMatches.push(disperseCompetitionOfPreviouslyMatchedTeams(subgroup));
  });

  return orderedMatches.flatMap((match: any[]) => match);
};
