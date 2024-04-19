type ITeam = {
  id: number;
  gamesPlayed: number;
  opponentsPlayed: Set<number>;
};

type IMatch = {
  team1: number;
  team2: number;
};

class TournamentScheduler {
  teams: ITeam[] = [];
  matches: IMatch[] = [];
  rounds: IMatch[][] = [];
  numberOfAvailableCourts: number;
  numberOfTeams: number;
  minimumNumberOfGames: number;

  constructor(
    numberOfAvailableCourts: number,
    numberOfTeams: number,
    minimumNumberOfGames: number,
  ) {
    this.numberOfAvailableCourts = numberOfAvailableCourts;
    this.numberOfTeams = numberOfTeams;
    this.minimumNumberOfGames = minimumNumberOfGames;

    for (let i = 0; i < numberOfTeams; i++) {
      this.teams.push({
        id: i,
        gamesPlayed: 0,
        opponentsPlayed: new Set(),
      });
    }
  }

  generateTournament() {
    while (!this.allTeamsReachedMinimumGames()) {
      console.log('- loop +');
      const roundMatches: IMatch[] = [];
      const sortedTeams = this.sortTeamsByGamesPlayed();

      for (const team of sortedTeams) {
        if (roundMatches.length >= this.numberOfAvailableCourts) break;

        const opponent = this.findOpponent(team, sortedTeams, roundMatches);
        if (opponent !== null) {
          roundMatches.push({ team1: team.id, team2: opponent.id });
          team.gamesPlayed++;
          opponent.gamesPlayed++;
          team.opponentsPlayed.add(opponent.id);
          opponent.opponentsPlayed.add(team.id);
        }
      }

      /**
       * @todo Implement backtracing
       */
      this.optimizeRound(roundMatches);
      this.matches.push(...roundMatches);
      this.rounds.push(roundMatches);
    }
  }

  allTeamsReachedMinimumGames(): boolean {
    return this.teams.every((team) => team.gamesPlayed >= this.minimumNumberOfGames);
  }

  sortTeamsByGamesPlayed(): ITeam[] {
    return [...this.teams].sort((a, b) => a.gamesPlayed - b.gamesPlayed);
  }

  findOpponent(team: ITeam, sortedTeams: ITeam[], roundMatches: IMatch[]): ITeam | null {
    for (const potentialOpponent of sortedTeams) {
      if (
        team.id !== potentialOpponent.id &&
        !team.opponentsPlayed.has(potentialOpponent.id) &&
        !this.isMatchInRound(team.id, potentialOpponent.id, roundMatches)
      ) {
        return potentialOpponent;
      }
    }

    return null;
  }

  isMatchInRound(team1Id: number, team2Id: number, roundMatches: IMatch[]): boolean {
    return roundMatches.some(
      (match) =>
        match.team1 === team1Id ||
        match.team2 === team2Id ||
        match.team1 === team2Id ||
        match.team2 === team1Id,
    );
  }

  optimizeRound(roundMatches: IMatch[]) {
    /**
     * @todo Implement backtracing
     */
  }

  printMatches() {
    console.log('Tournament Matches:');
    for (const match of this.matches) {
      console.log(`ITeam ${match.team1} vs ITeam ${match.team2}`);
    }
  }

  printGamesByTeam() {
    console.log('Games by team:');
    for (const team of this.teams) {
      console.log(`ITeam ${team.id}: ${Array.from(team.opponentsPlayed)}`);
    }
  }
}

export default TournamentScheduler;
