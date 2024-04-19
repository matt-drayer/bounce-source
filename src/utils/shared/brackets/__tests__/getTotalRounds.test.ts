import { getTotalRounds } from '../getTotalRounds';

describe('getTotalRounds', () => {
  // Basic functionality with numbers not already a power of two
  it('calculates total rounds correctly for various numbers of teams', () => {
    expect(getTotalRounds(3)).toBe(2); // Rounds to 4 teams, which requires 2 rounds
    expect(getTotalRounds(5)).toBe(3); // Rounds to 8 teams, which requires 3 rounds
    expect(getTotalRounds(15)).toBe(4); // Rounds to 16 teams, which requires 4 rounds
  });

  // Numbers that are already a power of two
  it('returns the correct number of rounds for team counts that are powers of two', () => {
    expect(getTotalRounds(2)).toBe(1); // 2 teams require 1 round
    expect(getTotalRounds(8)).toBe(3); // 8 teams require 3 rounds
    expect(getTotalRounds(16)).toBe(4); // 16 teams require 4 rounds
  });

  // Edge cases
  it('handles edge cases correctly', () => {
    expect(getTotalRounds(1)).toBe(0); // 1 team technically requires 0 rounds
    expect(getTotalRounds(0)).toBe(0); // 0 teams, edge case, would also technically require 0 rounds
    expect(getTotalRounds(-1)).toBe(0); // Negative number, adjusted to 1 team, which requires 0 rounds
  });
});
