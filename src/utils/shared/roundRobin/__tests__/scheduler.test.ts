import scheduler, {
  Round,
  RoundRobinMatch,
  SchedulerConfig,
  generateAllMatches,
} from '../scheduler';

const calculateTotalMatches = (numTeams: number) => (numTeams * (numTeams - 1)) / 2;

/**
 * @todo only testing with minimum number of games since this is MVP. Should test total time as well if it's eventually used
 */

describe('Round Robin Tournament Scheduler', () => {
  describe('generateAllMatches', () => {
    const checkForDuplicateMatches = (matches: RoundRobinMatch[]) => {
      const matchesForTeams = new Map<number, Set<number>>();
      matches.forEach((match, i) => {
        const { teamA, teamB } = match;

        if (!matchesForTeams.has(teamA)) {
          matchesForTeams.set(teamA, new Set());
        }
        if (!matchesForTeams.has(teamB)) {
          matchesForTeams.set(teamB, new Set());
        }

        expect(teamA).not.toBe(teamB);
        expect(matchesForTeams.get(teamA)?.has(teamB)).toBe(false);
        expect(matchesForTeams.get(teamB)?.has(teamA)).toBe(false);

        matchesForTeams.get(teamA)?.add(teamB);
        matchesForTeams.get(teamB)?.add(teamA);
      });
    };

    it('should generate all matches for the given number of teams', () => {
      const numTeams = 4;
      const matches = generateAllMatches({ numTeams });
      expect(matches.length).toBe(calculateTotalMatches(numTeams));
      checkForDuplicateMatches(matches);
    });

    it('should prevent duplicate matches if shouldPreventDuplicateMatches is true', () => {
      const numTeams = 23;
      const matches = generateAllMatches({
        numTeams,
        shouldPreventDuplicateMatches: true,
      });
      expect(matches.length).toBe(calculateTotalMatches(numTeams));
      checkForDuplicateMatches(matches);
    });
  });

  describe('Core Scheduler Functionality', () => {
    const getFewestMatches = (matchesForTeams: Map<number, number>) => {
      return Math.min(...Array.from(matchesForTeams.values()));
    };

    const getLargestGameCountDifference = (schedule: Map<number, number>) => {
      const gameCounts = Array.from(schedule.values());
      return Math.max(...gameCounts) - Math.min(...gameCounts);
    };

    const getGameCountPerTeam = (schedule: Round[]) => {
      const gameCount = new Map<number, number>();
      schedule.forEach((round) => {
        round.matches.forEach((match) => {
          if (!gameCount.has(match.teamA)) {
            gameCount.set(match.teamA, 0);
          }
          if (!gameCount.has(match.teamB)) {
            gameCount.set(match.teamB, 0);
          }
          gameCount.set(match.teamA, gameCount.get(match.teamA)! + 1);
          gameCount.set(match.teamB, gameCount.get(match.teamB)! + 1);
        });
      });
      return gameCount;
    };

    const getByeCount = (schedule: Round[]) => {
      let byeCount = 0;
      schedule.forEach((round) => {
        byeCount += round.byes.length;
      });
      return byeCount;
    };

    const checkForMatchupValidity = (schedule: Round[]) => {
      const matchesForTeams = new Map<number, Set<number>>();
      schedule.forEach((round) => {
        round.matches.forEach((match, i) => {
          const { teamA, teamB } = match;

          if (!matchesForTeams.has(teamA)) {
            matchesForTeams.set(teamA, new Set());
          }
          if (!matchesForTeams.has(teamB)) {
            matchesForTeams.set(teamB, new Set());
          }

          // Can't play yourself
          expect(teamA).not.toBe(teamB);

          // Can't play the same team twice
          expect(matchesForTeams.get(teamA)?.has(teamB)).toBe(false);
          expect(matchesForTeams.get(teamB)?.has(teamA)).toBe(false);

          matchesForTeams.get(teamA)?.add(teamB);
          matchesForTeams.get(teamB)?.add(teamA);
        });
      });
    };

    const checkCourtUsageIsMaximized = (schedule: Round[], config: SchedulerConfig) => {
      schedule.forEach((round, i) => {
        if (i !== schedule.length - 1) {
          expect(round.matches.length).toBe(
            Math.min(config.numCourts, Math.floor(config.numTeams / 2)),
          );
        }
      });
    };

    const checkTeamsAreScheduledOncePerRound = (schedule: Round[]) => {
      schedule.forEach((round) => {
        const teams = new Set<number>();

        round.matches.forEach((match) => {
          teams.add(match.teamA);
          teams.add(match.teamB);
        });

        expect(teams.size).toBe(round.matches.length * 2);
      });
    };

    const checkOnlyOneTeamGreaterThanMinimumGames = (
      schedule: Round[],
      config: SchedulerConfig,
    ) => {
      const gameCount = getGameCountPerTeam(schedule);
      const minimumGames = config.minimumGamesPerTeam!;
      let teamsAboveMinimumGames = 0;
      gameCount.forEach((games) => {
        if (games > minimumGames) {
          teamsAboveMinimumGames++;
        }
      });
      expect(teamsAboveMinimumGames).toBeLessThanOrEqual(1);
    };

    it('works for 1 court', () => {
      const numTeams = 73;
      const numCourts = 1;
      const minimumGamesPerTeam = numTeams - 1;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      expect(schedule.length).toBe(calculateTotalMatches(numTeams));
      expect(getLargestGameCountDifference(getGameCountPerTeam(schedule))).toBe(0);
      expect(getFewestMatches(getGameCountPerTeam(schedule))).toBeGreaterThanOrEqual(
        minimumGamesPerTeam,
      );
      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('works in a simple case: for 4 teams and 2 courts', () => {
      const numTeams = 4;
      const numCourts = 2;
      const minimumGamesPerTeam = numTeams - 1;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      expect(schedule.length).toBe(numTeams - 1);
      expect(getByeCount(schedule)).toBe(0);
      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('works in a simple case: for 8 teams and 2 courts', () => {
      const numTeams = 8;
      const numCourts = 2;
      const minimumGamesPerTeam = numTeams - 1;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('works in a simple case: for 10 teams and 3 courts', () => {
      const numTeams = 10;
      const numCourts = 3;
      const minimumGamesPerTeam = 7;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('works for a standard event size of 8', () => {
      const numTeams = 8;
      const numCourts = 1;
      const minimumGamesPerTeam = numTeams - 1;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('works for 16 teams, 4 courts, 6 games', () => {
      const numTeams = 16;
      const numCourts = 4;
      const minimumGamesPerTeam = 6;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('works for 16 teams, 3 courts, 5 games', () => {
      const numTeams = 16;
      const numCourts = 3;
      const minimumGamesPerTeam = 5;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('works for 11 teams, 3 courts, 5 games', () => {
      const numTeams = 11;
      const numCourts = 3;
      const minimumGamesPerTeam = 5;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('handles more courts than needed: 13 teams, 16 courts, 7 games', () => {
      const numTeams = 13;
      const numCourts = 16;
      const minimumGamesPerTeam = 7;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('handles exact number of courts needed: 22 teams, 11 courts, 5 games', () => {
      const numTeams = 22;
      const numCourts = 11;
      const minimumGamesPerTeam = 5;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('handles exact number of courts needed with odd teams: 23 teams, 11 courts, 6 games', () => {
      const numTeams = 22;
      const numCourts = 11;
      const minimumGamesPerTeam = 6;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });

    it('works for 37 teams, 7 courts, 7 games', () => {
      const numTeams = 37;
      const numCourts = 9;
      const minimumGamesPerTeam = 7;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });
    it('works for and absurdly high number of teams 111 teams, 16 courts, 10 games', () => {
      const numTeams = 111;
      const numCourts = 16;
      const minimumGamesPerTeam = 10;

      const config: SchedulerConfig = {
        numTeams: numTeams,
        numCourts: numCourts,
        timePerMatch: 30,
        minimumGamesPerTeam: minimumGamesPerTeam,
      };

      const schedule = scheduler(config);

      checkForMatchupValidity(schedule);
      checkCourtUsageIsMaximized(schedule, config);
      checkTeamsAreScheduledOncePerRound(schedule);
      checkOnlyOneTeamGreaterThanMinimumGames(schedule, config);
    });
  });

  describe('Validation', () => {
    it('throws error for invalid number of teams', () => {
      expect(() => {
        scheduler({
          numTeams: 1, // Invalid number of teams
          numCourts: 1,
          timePerMatch: 30,
          totalTime: 120,
        });
      }).toThrow();
    });
    it('throws error for invalid number of teams', () => {
      expect(() => {
        scheduler({
          numTeams: 1, // Invalid number of teams
          numCourts: 1,
          timePerMatch: 30,
          minimumGamesPerTeam: 4,
        });
      }).toThrow();
    });
    it('throws error for invalid number of courts', () => {
      expect(() => {
        scheduler({
          numTeams: 2,
          numCourts: 0,
          timePerMatch: 30,
          totalTime: 120,
          minimumGamesPerTeam: 1,
        });
      }).toThrow();
    });
    it('throws error for invalid match time', () => {
      expect(() => {
        scheduler({
          numTeams: 2,
          numCourts: 1,
          timePerMatch: 0,
          totalTime: 120,
          minimumGamesPerTeam: 1,
        });
      }).toThrow();
    });
    it('throws error for minimumNumberOfGames and totalTime do not exist', () => {
      expect(() => {
        scheduler({
          numTeams: 2,
          numCourts: 1,
          timePerMatch: 10,
          totalTime: 0,
          minimumGamesPerTeam: 0,
        });
      }).toThrow();
    });
  });
});
