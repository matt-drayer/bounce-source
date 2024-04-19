import { RunnerConfig } from 'constants/tournaments';
import roundRobinScheduler, { generateAllMatches } from './scheduler';

export { type RunnerConfig };

export const generateSchedule = (scheduleConfig: RunnerConfig) => {
  const schedule = roundRobinScheduler(scheduleConfig);

  const teams = scheduleConfig.teams;
  const courts = scheduleConfig.courts
    ? scheduleConfig.courts.map((court) => `Court ${court}`)
    : new Array(Math.min(scheduleConfig.numCourts, Math.floor(teams.length / 2)))
        .fill(null)
        .map((_, index) => `Court ${index + 1}`);

  // Translating the result for better clarity:
  const translatedSchedule = schedule.map((round) => {
    return {
      matches: round.matches.map((match) => ({
        teamAIndex: match.teamA,
        teamBIndex: match.teamB,
        teamA: teams[match.teamA],
        teamB: teams[match.teamB],
        courtIndex: match.court,
        court: courts[match.court],
        time: match.time,
        teamAScore: 0,
        teamBScore: 0,
      })),
      byes: round.byes.map((teamIndex) => ({ team: teams[teamIndex], teamIndex })),
    };
  });

  const matchesByCourt = translatedSchedule.reduce((acc, round) => {
    round.matches.forEach((match) => {
      if (!acc[match.courtIndex]) {
        acc[match.courtIndex] = { name: match.court, matches: [] };
      }
      acc[match.courtIndex].matches.push({
        teamAIndex: match.teamAIndex,
        teamBIndex: match.teamBIndex,
        teamA: match.teamA,
        teamB: match.teamB,
      });
    });
    return acc;
  }, {} as { [key: number]: { name: string; matches: { teamA: string; teamB: string; teamAIndex: number; teamBIndex: number }[] } });

  const matchesByTeam = translatedSchedule.reduce((acc, round) => {
    round.matches.forEach((match) => {
      if (!acc[match.teamAIndex]) {
        acc[match.teamAIndex] = { name: match.teamA, matches: [] };
      }
      if (!acc[match.teamBIndex]) {
        acc[match.teamBIndex] = { name: match.teamB, matches: [] };
      }
      acc[match.teamAIndex].matches.push({
        courtIndex: match.courtIndex,
        court: match.court,
        opponentIndex: match.teamBIndex,
        opponent: match.teamB,
      });
      acc[match.teamBIndex].matches.push({
        courtIndex: match.courtIndex,
        court: match.court,
        opponentIndex: match.teamAIndex,
        opponent: match.teamA,
      });
    });
    round.byes.forEach((bye) => {
      if (!acc[bye.teamIndex]) {
        acc[bye.teamIndex] = { name: teams[bye.teamIndex], matches: [] };
      }
      acc[bye.teamIndex].matches.push({
        courtIndex: -1,
        court: 'BYE',
        opponentIndex: -1,
        opponent: 'BYE',
      });
    });
    return acc;
  }, {} as { [key: number]: { name: string; matches: { court: string; opponent?: string; courtIndex: number; opponentIndex: number }[] } });

  const matchSummary: {
    [key: string]: {
      matches: {
        count: number;
        opponents: { [teamIndex: number]: string };
        didNotPlay: { [teamIndex: number]: string };
      };
      byes: { count: number };
    };
  } = {};

  Object.entries(matchesByTeam).forEach(([teamIndex, matches]) => {
    const playedOpponents = new Set(
      matches.matches.filter((m) => m.opponentIndex !== -1).map((m) => m.opponentIndex),
    );
    const allOpponents = new Set(Object.keys(teams).map((index) => parseInt(index)));
    const didNotPlayOpponents = new Set(
      // @ts-ignore
      [...allOpponents].filter((index) => !playedOpponents.has(index)),
    );

    matchSummary[teamIndex] = {
      matches: {
        count: matches.matches.filter((m) => m.opponentIndex !== -1).length,
        opponents: Array.from(playedOpponents).reduce((acc, index) => {
          acc[index] = teams[index];
          return acc;
        }, {} as { [key: number]: string }),
        didNotPlay: Array.from(didNotPlayOpponents).reduce((acc, index) => {
          acc[index] = teams[index];
          return acc;
        }, {} as { [key: number]: string }),
      },
      byes: {
        count: matches.matches.filter((m) => m.opponentIndex === -1).length,
      },
    };
  });

  const output = {
    input: {
      teams,
      courts,
      scheduleConfig,
    },
    output: schedule,
    teams,
    courts,
    schedule: translatedSchedule,
    matchSummary,
    matchesByCourt,
    matchesByTeam,
  };

  const courtNames: Set<string> = new Set();

  translatedSchedule.forEach((round) => {
    round.matches.forEach((match) => {
      courtNames.add(match.court);
    });
  });

  // @ts-ignore
  const courtNamesArray: string[] = [...courtNames];

  // Create 2D array for CSV
  const scheduleByRound: string[][] = [];
  scheduleByRound.push([
    'Round',
    ...courtNamesArray.map((name) => [name, 'Team 1 Score', 'Team 2 Score', 'Winner']).flat(),
    'Byes',
  ]);

  translatedSchedule.forEach((round, index) => {
    const roundRow: string[] = [];
    roundRow.push(`Round ${index + 1}`);

    courtNamesArray.forEach((court) => {
      const match = round.matches.find((m) => m.court === court);
      if (match) {
        roundRow.push(`${match.teamA} vs. ${match.teamB}`);
      } else {
        roundRow.push('<NONE>'); // No match for this court in this round
      }
      roundRow.push(''); // Empty column for Team A Score
      roundRow.push(''); // Empty column for Team B Score
      roundRow.push(''); // Empty column for winner
    });

    // Add byes
    if (round.byes && round.byes.length > 0) {
      roundRow.push(round.byes.map((bye) => bye.team).join(' / '));
    } else {
      roundRow.push(''); // No byes for this round
    }

    scheduleByRound.push(roundRow);
  });

  // Convert 2D array to CSV format
  const scheduleByRoundCsv = scheduleByRound.map((row) => row.join(',')).join('\n');

  const totalRounds = Math.max(...Object.values(matchesByTeam).map((team) => team.matches.length));
  const teamNames = Object.values(matchesByTeam).map((team) => team.name);

  // Create the grid
  const grid: { [key: string]: string[] } = {};

  // Initialize grid with team names
  teamNames.forEach((teamName) => {
    grid[teamName] = new Array(totalRounds).fill('BYE');
  });

  // Populate the grid with court or 'BYE'
  Object.values(matchesByTeam).forEach((team) => {
    team.matches.forEach((match, roundIndex) => {
      grid[team.name][roundIndex] = match.court;
    });
  });

  // Convert the grid to a 2D array for CSV
  const scheduleByTeam: string[][] = [];
  const header = ['Team', ...Array.from({ length: totalRounds }, (_, i) => `Round ${i + 1}`)];
  scheduleByTeam.push(header);

  teamNames.forEach((teamName) => {
    scheduleByTeam.push([teamName, ...grid[teamName]]);
  });

  // Convert 2D array to CSV format
  const scheduleByTeamCsv = scheduleByTeam.map((row) => row.join(',')).join('\n');

  return {
    allMatches: generateAllMatches(scheduleConfig),
    scheduleConfig,
    output,
    scheduleByRound,
    scheduleByTeam,
    scheduleByTeamCsv,
    scheduleByRoundCsv,
  };
};
