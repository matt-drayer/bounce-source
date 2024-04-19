import { calculateTotalMatches } from '../generateSingleEliminationBracket';

describe('calculateTotalMatches', () => {
  // Basic functionality without byes or third-place match
  it('calculates total matches correctly for a standard tournament', () => {
    const result = calculateTotalMatches({ teamCount: 8, byes: 0 });
    expect(result.totalMatchesWithByes).toBe(7); // 8 teams, 7 matches
    expect(result.totalMatchesExcludeByes).toBe(7);
  });

  // With byes
  it('correctly calculates total matches with byes', () => {
    const result = calculateTotalMatches({ teamCount: 8, byes: 2 });
    expect(result.totalMatchesWithByes).toBe(7); // 8 teams, still 7 matches in total
    expect(result.totalMatchesExcludeByes).toBe(5); // But only 5 matches excluding byes
  });

  // Third-place match
  it('includes third place match in total calculation', () => {
    const result = calculateTotalMatches({ teamCount: 4, byes: 0, hasThirdPlaceMatch: true });
    expect(result.totalMatchesWithByes).toBe(4); // 3 matches for the tournament plus 1 for third place
    expect(result.totalMatchesExcludeByes).toBe(4);
  });

  // Combination of byes and third-place match
  it('calculates correctly with both byes and a third-place match', () => {
    const result = calculateTotalMatches({ teamCount: 8, byes: 1, hasThirdPlaceMatch: true });
    expect(result.totalMatchesWithByes).toBe(8); // 7 matches for the tournament plus 1 for third place
    expect(result.totalMatchesExcludeByes).toBe(7); // 7 matches excluding byes plus 1 for third place
  });

  // Edge cases
  it('handles edge cases correctly', () => {
    const zeroTeams = calculateTotalMatches({ teamCount: 0, byes: 0 });
    expect(zeroTeams.totalMatchesWithByes).toBe(0);
    expect(zeroTeams.totalMatchesExcludeByes).toBe(0);

    const oneTeam = calculateTotalMatches({ teamCount: 1, byes: 0 });
    expect(oneTeam.totalMatchesWithByes).toBe(0);
    expect(oneTeam.totalMatchesExcludeByes).toBe(0);

    expect(() => calculateTotalMatches({ teamCount: 4, byes: -1 })).toThrow();
  });
});
