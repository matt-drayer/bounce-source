export enum RoundNames {
  Quarterfinals = 'Quarterfinals',
  Semifinals = 'Semifinals',
  Finals = 'Finals',
  ThirdPlace = '3rd Place',
}

export const getRoundNames = (totalRounds: number, hasThirdPlaceMatch?: boolean) => {
  const roundNames: string[] = [];
  const roundsBeforeFinals = totalRounds - 1;
  for (let i = 0; i < totalRounds; i++) {
    if (i < roundsBeforeFinals - 2) roundNames.push(`Round ${i + 1}`);
    else if (i === roundsBeforeFinals - 2) roundNames.push(RoundNames.Quarterfinals);
    else if (i === roundsBeforeFinals - 1) roundNames.push(RoundNames.Semifinals);
    else if (i === roundsBeforeFinals) {
      if (hasThirdPlaceMatch) {
        roundNames.push(RoundNames.ThirdPlace);
      }

      roundNames.push(RoundNames.Finals);
    }
  }

  return roundNames;
};
