import { RoundNames, getRoundNames } from '../getRoundNames';

describe('getRoundNames', () => {
  test('should generate round names for a single round without a third-place match', () => {
    expect(getRoundNames(1)).toEqual([RoundNames.Finals]);
  });

  test('should generate round names for a single round with a third-place match', () => {
    expect(getRoundNames(1, true)).toEqual([RoundNames.ThirdPlace, RoundNames.Finals]);
  });

  test('should generate round names for two rounds without a third-place match', () => {
    expect(getRoundNames(2)).toEqual([RoundNames.Semifinals, RoundNames.Finals]);
  });

  test('should generate round names for two rounds with a third-place match', () => {
    expect(getRoundNames(2, true)).toEqual([
      RoundNames.Semifinals,
      RoundNames.ThirdPlace,
      RoundNames.Finals,
    ]);
  });

  test('should generate round names for four rounds without a third-place match', () => {
    expect(getRoundNames(4)).toEqual([
      'Round 1',
      RoundNames.Quarterfinals,
      RoundNames.Semifinals,
      RoundNames.Finals,
    ]);
  });

  test('should generate round names for four rounds with a third-place match', () => {
    expect(getRoundNames(4, true)).toEqual([
      'Round 1',
      RoundNames.Quarterfinals,
      RoundNames.Semifinals,
      RoundNames.ThirdPlace,
      RoundNames.Finals,
    ]);
  });

  test('should generate round names for six rounds without a third-place match', () => {
    const expectedNames = [
      'Round 1',
      'Round 2',
      'Round 3',
      RoundNames.Quarterfinals,
      RoundNames.Semifinals,
      RoundNames.Finals,
    ];
    expect(getRoundNames(6)).toEqual(expectedNames);
  });

  test('should generate round names for six rounds with a third-place match', () => {
    const expectedNames = [
      'Round 1',
      'Round 2',
      'Round 3',
      RoundNames.Quarterfinals,
      RoundNames.Semifinals,
      RoundNames.ThirdPlace,
      RoundNames.Finals,
    ];
    expect(getRoundNames(6, true)).toEqual(expectedNames);
  });

  test('should handle a large number of rounds correctly', () => {
    const totalRounds = 10;
    const expectedNames = [
      'Round 1',
      'Round 2',
      'Round 3',
      'Round 4',
      'Round 5',
      'Round 6',
      'Round 7',
      RoundNames.Quarterfinals,
      RoundNames.Semifinals,
      RoundNames.ThirdPlace,
      RoundNames.Finals,
    ];
    expect(getRoundNames(totalRounds, true)).toEqual(expectedNames);
  });
});
