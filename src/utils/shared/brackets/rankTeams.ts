export type Match = {
  courtNumber?: number | null | undefined;
  id: string;
  matchOrder: number;
  winningTeamId?: string;
  losingTeamId?: string;
  // teams: {
  //   __typename?: 'EventMatchesTeams' | undefined;
  //   id: string;
  //   team: {
  //     id: string;
  //     members: any[];
  //   };
  // }[];
  team1?: null | {
    id: string;
    members: any[];
  };
  team2?: null | {
    id: string;
    members: any[];
  };
  games: {
    id: string;
    losingTeamId: string;
    team1Id: string;
    team1Score: number;
    team2Id: string;
    team2Score: number;
    winningTeamId: string;
  }[];
};

interface TeamResults {
  id: string;
  members: any[];
  matchWins: number;
  matchLosses: number;
  gameWins: number;
  gameLosses: number;
  pointsFor: number;
  pointsAgainst: number;
  matches: Match[];
}

export const rankTeams = (matches: Match[]) => {
  const teamResults: Record<string, TeamResults> = {};

  matches.forEach((match) => {
    // match.teams.forEach(({ team }) => {
    //   if (!teamResults[team.id]) {
    //     teamResults[team.id] = {
    //       id: team.id,
    //       members: team.members,
    //       matchWins: 0,
    //       matchLosses: 0,
    //       gameWins: 0,
    //       gameLosses: 0,
    //       pointsFor: 0,
    //       pointsAgainst: 0,
    //       matches: [],
    //     };
    //   }
    // });

    if (match.team1?.id && !teamResults[match.team1.id]) {
      if (!teamResults[match.team1.id]) {
        teamResults[match.team1.id] = {
          id: match.team1.id,
          members: match.team1.members,
          matchWins: 0,
          matchLosses: 0,
          gameWins: 0,
          gameLosses: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          matches: [],
        };
      }
    }
    if (match.team2?.id && !teamResults[match.team2.id]) {
      teamResults[match.team2.id] = {
        id: match.team2.id,
        members: match.team2.members,
        matchWins: 0,
        matchLosses: 0,
        gameWins: 0,
        gameLosses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        matches: [],
      };
    }

    if (match.winningTeamId) {
      teamResults[match.winningTeamId].matchWins = teamResults[match.winningTeamId].matchWins + 1;
      teamResults[match.winningTeamId].matches.push(match);
    }
    if (match.losingTeamId) {
      teamResults[match.losingTeamId].matchLosses = teamResults[match.losingTeamId].matchLosses + 1;
      teamResults[match.losingTeamId].matches.push(match);
    }

    match.games.forEach((game) => {
      const team1Id = game.team1Id;
      const team2Id = game.team2Id;
      const team1Score = game.team1Score;
      const team2Score = game.team2Score;

      teamResults[team1Id].pointsFor = teamResults[team1Id].pointsFor + team1Score;
      teamResults[team1Id].pointsAgainst = teamResults[team1Id].pointsAgainst + team2Score;
      teamResults[team2Id].pointsFor = teamResults[team2Id].pointsFor + team2Score;
      teamResults[team2Id].pointsAgainst = teamResults[team2Id].pointsAgainst + team1Score;

      if (game.winningTeamId === team1Id) {
        teamResults[team1Id].gameWins = teamResults[team1Id].gameWins + 1;
        teamResults[team2Id].gameLosses = teamResults[team2Id].gameLosses + 1;
      } else if (game.winningTeamId === team2Id) {
        teamResults[team2Id].gameWins = teamResults[team2Id].gameWins + 1;
        teamResults[team1Id].gameLosses = teamResults[team1Id].gameLosses + 1;
      }
    });
  });

  const rankedTeams = Object.values(teamResults).sort((a, b) => {
    const aWinPercentage = a.matchWins / (a.matchWins + a.matchLosses);
    const bWinPercentage = b.matchWins / (b.matchWins + b.matchLosses);
    if (aWinPercentage !== bWinPercentage) {
      return bWinPercentage - aWinPercentage;
    }

    const aPointDifferential = a.pointsFor - a.pointsAgainst;
    const bPointDifferential = b.pointsFor - b.pointsAgainst;
    if (aPointDifferential !== bPointDifferential) {
      return bPointDifferential - aPointDifferential;
    }

    const aHeadToHead = a.matches.filter((match) => {
      return match.winningTeamId === b.id || match.losingTeamId === b.id;
    });
    const bHeadToHead = b.matches.filter((match) => {
      return match.winningTeamId === a.id || match.losingTeamId === a.id;
    });
    const aWins = aHeadToHead.filter((match) => match.winningTeamId === a.id);
    const bWins = bHeadToHead.filter((match) => match.winningTeamId === b.id);
    if (aWins.length !== bWins.length) {
      return bWins.length - aWins.length;
    }

    return 0;
  });

  return rankedTeams;
};
