import { generateSingleEliminationBracket } from '../generateSingleEliminationBracket';

describe('generateSingleEliminationBracket', () => {
  // Basic functionality with a power of two teams
  it('generates a bracket for 8 rankedTeams: teams, no byes, with a third-place match', () => {
    const teamCount = 8;

    const teams = new Array(teamCount).fill(null).map((_, index) => `Team ${index + 1}`);
    const bracket = generateSingleEliminationBracket({
      rankedTeams: teams,
      numberOfQualifyingTeams: teamCount,
      hasThirdPlaceMatch: true,
    });

    expect(bracket.teamsInBracket.length).toBe(teamCount);
    expect(bracket.numberOfTeamsWithByes).toBe(teamCount);
    expect(bracket.totalRounds).toBe(4); // Log2(8) = 3 + 1 third place
    expect(bracket.firstRoundByeCount).toBe(0);
    expect(bracket.totalMatchesWithByes).toBe(teamCount); // 7 matches + 1 third-place match
    expect(bracket.totalMatchesExcludeByes).toBe(teamCount);
    expect(bracket.matchCountByRound).toEqual([
      { matchCount: 4 },
      { matchCount: 2 },
      { matchCount: 1, isThirdPlaceMatch: true },
      { matchCount: 1 },
    ]);

    // Check for correct setup in the first round
    const firstRoundMatches = bracket.matchesByRound[0];
    expect(firstRoundMatches.length).toBe(4); // Should be 4 matches in the first round for 8 teams

    firstRoundMatches.forEach((match, index) => {
      expect(match.previousMatch1Index).toBeUndefined();
      expect(match.previousMatch2Index).toBeUndefined();
    });

    // Check for dispersed competition
    expect(firstRoundMatches[0].team1Index).toBe(0);
    expect(firstRoundMatches[0].team2Index).toBe(7);
    expect(firstRoundMatches[0].team1Rank).toBe(1);
    expect(firstRoundMatches[0].team2Rank).toBe(8);

    expect(firstRoundMatches[1].team1Index).toBe(3);
    expect(firstRoundMatches[1].team2Index).toBe(4);
    expect(firstRoundMatches[1].team1Rank).toBe(4);
    expect(firstRoundMatches[1].team2Rank).toBe(5);

    expect(firstRoundMatches[2].team1Index).toBe(2);
    expect(firstRoundMatches[2].team2Index).toBe(5);
    expect(firstRoundMatches[2].team1Rank).toBe(3);
    expect(firstRoundMatches[2].team2Rank).toBe(6);

    expect(firstRoundMatches[3].team1Index).toBe(1);
    expect(firstRoundMatches[3].team2Index).toBe(6);
    expect(firstRoundMatches[3].team1Rank).toBe(2);
    expect(firstRoundMatches[3].team2Rank).toBe(7);

    // Later rounds
    expect(bracket.matchesByRound[0][0].previousMatch1Index).toBeUndefined();
    expect(bracket.matchesByRound[0][0].previousMatch2Index).toBeUndefined();
    expect(bracket.matchesByRound[0][1].previousMatch1Index).toBeUndefined();
    expect(bracket.matchesByRound[0][1].previousMatch2Index).toBeUndefined();
    expect(bracket.matchesByRound[0][2].previousMatch1Index).toBeUndefined();
    expect(bracket.matchesByRound[0][2].previousMatch2Index).toBeUndefined();
    expect(bracket.matchesByRound[0][3].previousMatch1Index).toBeUndefined();
    expect(bracket.matchesByRound[0][3].previousMatch2Index).toBeUndefined();
    expect(bracket.matchesByRound[0][0].previousRoundIndex).toBeUndefined();
    expect(bracket.matchesByRound[0][0].previousRoundIndex).toBeUndefined();
    expect(bracket.matchesByRound[0][1].previousRoundIndex).toBeUndefined();
    expect(bracket.matchesByRound[0][1].previousRoundIndex).toBeUndefined();
    expect(bracket.matchesByRound[0][2].previousRoundIndex).toBeUndefined();
    expect(bracket.matchesByRound[0][2].previousRoundIndex).toBeUndefined();
    expect(bracket.matchesByRound[0][3].previousRoundIndex).toBeUndefined();
    expect(bracket.matchesByRound[0][3].previousRoundIndex).toBeUndefined();

    expect(bracket.matchesByRound[1][0].previousMatch1Index).toBe(0);
    expect(bracket.matchesByRound[1][0].previousMatch2Index).toBe(1);
    expect(bracket.matchesByRound[1][1].previousMatch1Index).toBe(2);
    expect(bracket.matchesByRound[1][1].previousMatch2Index).toBe(3);

    expect(bracket.matchesByRound[1][0].previousRoundIndex).toBe(0);
    expect(bracket.matchesByRound[1][0].previousRoundIndex).toBe(0);
    expect(bracket.matchesByRound[1][1].previousRoundIndex).toBe(0);
    expect(bracket.matchesByRound[1][1].previousRoundIndex).toBe(0);

    expect(bracket.matchesByRound[2][0].previousRoundIndex).toBe(1);
    expect(bracket.matchesByRound[2][0].previousRoundIndex).toBe(1);
    // ---
    expect(bracket.matchesByRound[2][0].previousMatch1Index).toBe(0);
    expect(bracket.matchesByRound[2][0].previousMatch2Index).toBe(1);
    // ---
    expect(bracket.matchesByRound[2][0].previousMatch1Id).toBe(bracket.matchesByRound[1][0].id);
    expect(bracket.matchesByRound[2][0].previousMatch2Id).toBe(bracket.matchesByRound[1][1].id);
    ///// ----------
    ///// ----------
    expect(bracket.matchesByRound[3][0].previousRoundIndex).toBe(1);
    expect(bracket.matchesByRound[3][0].previousRoundIndex).toBe(1);
    // ---
    expect(bracket.matchesByRound[3][0].previousMatch1Index).toBe(0);
    expect(bracket.matchesByRound[3][0].previousMatch2Index).toBe(1);
    // ---
    expect(bracket.matchesByRound[3][0].previousMatch1Id).toBe(bracket.matchesByRound[1][0].id);
    expect(bracket.matchesByRound[3][0].previousMatch2Id).toBe(bracket.matchesByRound[1][1].id);
  });

  // Handling byes when teams are not a power of two
  it('handles byes correctly for 7 teams', () => {
    const teams = new Array(7).fill(null).map((_, index) => `Team ${index + 1}`);
    const bracket = generateSingleEliminationBracket({
      rankedTeams: teams,
      numberOfQualifyingTeams: 7,
    });

    expect(bracket.teamsInBracket.length).toBe(7);
    expect(bracket.numberOfTeamsWithByes).toBe(8); // Rounded up to the next power of two
    expect(bracket.totalRounds).toBe(4);
    expect(bracket.firstRoundByeCount).toBe(1);
    expect(bracket.totalMatchesWithByes).toBe(8); // 7 matches + 1 third-place match
    expect(bracket.totalMatchesExcludeByes).toBe(7);
    // Includes third-place match by default
    expect(bracket.matchCountByRound).toEqual([
      { matchCount: 4 },
      { matchCount: 2 },
      { matchCount: 1, isThirdPlaceMatch: true },
      { matchCount: 1 },
    ]);
  });

  // Testing third-place match exclusion
  it('excludes third-place match correctly', () => {
    const teams = ['Team 1', 'Team 2', 'Team 3', 'Team 4'];
    const bracket = generateSingleEliminationBracket({
      rankedTeams: teams,
      numberOfQualifyingTeams: 4,
      hasThirdPlaceMatch: false,
    });

    expect(bracket.totalMatchesWithByes).toBe(3); // 3 matches, no third-place match
    expect(bracket.totalMatchesExcludeByes).toBe(3);
    expect(bracket.matchCountByRound).toEqual([{ matchCount: 2 }, { matchCount: 1 }]);
  });

  // Edge cases: Not enough teams
  it('throws an error when not enough teams are provided', () => {
    const teams = ['Team 1']; // Only one team provided
    expect(() =>
      generateSingleEliminationBracket({
        rankedTeams: teams,
        numberOfQualifyingTeams: 1,
      }),
    ).toThrow('Not enough teams to run tournament');
  });

  // Exceeding the specified number of qualifying teams
  it('limits the teams to the specified number of qualifying teams', () => {
    const teams = new Array(16).fill(null).map((_, index) => `Team ${index + 1}`);
    const bracket = generateSingleEliminationBracket({
      rankedTeams: teams,
      numberOfQualifyingTeams: 8, // Only 8 qualify out of 16
      hasThirdPlaceMatch: true,
    });

    expect(bracket.teamsInBracket.length).toBe(8);
    expect(bracket.numberOfTeamsWithByes).toBe(8);
    expect(bracket.totalRounds).toBe(4);
    expect(bracket.firstRoundByeCount).toBe(0);
    expect(bracket.totalMatchesWithByes).toBe(8); // 7 matches + 1 third-place match
    expect(bracket.totalMatchesExcludeByes).toBe(8);
  });

  it('handles when everyone qualifies', () => {
    const NUMBER_OF_TEAMS = 25;
    const teams = new Array(NUMBER_OF_TEAMS).fill(null).map((_, index) => `Team ${index + 1}`);
    const bracket = generateSingleEliminationBracket({
      rankedTeams: teams,
      numberOfQualifyingTeams: NUMBER_OF_TEAMS,
      hasThirdPlaceMatch: true,
    });

    expect(bracket.teamsInBracket.length).toBe(NUMBER_OF_TEAMS);
    expect(bracket.numberOfTeamsWithByes).toBe(32);
    expect(bracket.totalRounds).toBe(6);
    expect(bracket.firstRoundByeCount).toBe(32 - NUMBER_OF_TEAMS);
    expect(bracket.totalMatchesWithByes).toBe(32); // 16 + 8 + 4 + 2 + 1 + 1 third-place match
    expect(bracket.totalMatchesExcludeByes).toBe(32 - (32 - NUMBER_OF_TEAMS));
    expect(bracket.matchCountByRound).toEqual([
      { matchCount: 16 },
      { matchCount: 8 },
      { matchCount: 4 },
      { matchCount: 2 },
      { matchCount: 1, isThirdPlaceMatch: true },
      { matchCount: 1 },
    ]);
  });
});
