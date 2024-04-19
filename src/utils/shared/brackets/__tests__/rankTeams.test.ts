import { type Match, rankTeams } from '../rankTeams';

describe('rankTeams', () => {
  it('should accurately rank teams based on match wins', () => {
    const matches: Match[] = [
      {
        id: 'match1',
        matchOrder: 1,
        winningTeamId: 'team1',
        losingTeamId: 'team2',
        team1: { id: 'team1', members: [] },
        team2: { id: 'team2', members: [] },
        // teams: [
        //   { id: 'team1Match1', team: { id: 'team1', members: [] } },
        //   { id: 'team2Match1', team: { id: 'team2', members: [] } },
        // ],
        games: [
          {
            id: 'game1',
            losingTeamId: 'team2',
            team1Id: 'team1',
            team1Score: 21,
            team2Id: 'team2',
            team2Score: 19,
            // @ts-ignore
            winReason: 'POINTS',
            winningTeamId: 'team1',
          },
        ],
      },
      {
        id: 'match2',
        matchOrder: 2,
        winningTeamId: 'team3',
        losingTeamId: 'team2',
        team1: { id: 'team2', members: [] },
        team2: { id: 'team3', members: [] },
        // teams: [
        //   { id: 'team3Match2', team: { id: 'team3', members: [] } },
        //   { id: 'team2Match2', team: { id: 'team2', members: [] } },
        // ],
        games: [
          {
            id: 'game2',
            losingTeamId: 'team2',
            team1Id: 'team3',
            team1Score: 21,
            team2Id: 'team2',
            team2Score: 18,
            // @ts-ignore
            winReason: 'POINTS',
            winningTeamId: 'team3',
          },
        ],
      },
      {
        id: 'match3',
        matchOrder: 3,
        winningTeamId: 'team1',
        losingTeamId: 'team3',
        team1: { id: 'team3', members: [] },
        team2: { id: 'team1', members: [] },
        // teams: [
        //   { id: 'team3Match3', team: { id: 'team3', members: [] } },
        //   { id: 'team1Match3', team: { id: 'team1', members: [] } },
        // ],
        games: [
          {
            id: 'game3',
            losingTeamId: 'team3',
            team1Id: 'team3',
            team1Score: 0,
            team2Id: 'team1',
            team2Score: 11,
            // @ts-ignore
            winReason: 'POINTS',
            winningTeamId: 'team1',
          },
        ],
      },
    ];

    const rankedTeams = rankTeams(matches);
    expect(rankedTeams[0].id).toBe('team1');
    expect(rankedTeams[1].id).toBe('team3');
    expect(rankedTeams[2].id).toBe('team2');
  });

  it('should break ties with point differential', () => {
    const matches: Match[] = [
      {
        id: 'match1',
        matchOrder: 1,
        winningTeamId: 'team1',
        losingTeamId: 'team2',
        team1: { id: 'team1', members: [] },
        team2: { id: 'team2', members: [] },
        // teams: [
        //   { id: 'team1Match1', team: { id: 'team1', members: [] } },
        //   { id: 'team2Match1', team: { id: 'team2', members: [] } },
        // ],
        games: [
          {
            id: 'game1',
            losingTeamId: 'team2',
            team1Id: 'team1',
            team1Score: 30,
            team2Id: 'team2',
            team2Score: 20,
            // @ts-ignore
            winReason: 'POINTS',
            winningTeamId: 'team1',
          },
        ],
      },
      {
        id: 'match2',
        matchOrder: 2,
        winningTeamId: 'team2',
        losingTeamId: 'team1',
        team1: { id: 'team1', members: [] },
        team2: { id: 'team2', members: [] },
        // teams: [
        //   { id: 'team2Match2', team: { id: 'team2', members: [] } },
        //   { id: 'team1Match2', team: { id: 'team1', members: [] } },
        // ],
        games: [
          {
            id: 'game2',
            losingTeamId: 'team1',
            team1Id: 'team2',
            team1Score: 25,
            team2Id: 'team1',
            team2Score: 20,
            // @ts-ignore
            winReason: 'POINTS',
            winningTeamId: 'team2',
          },
        ],
      },
      {
        id: 'match3',
        matchOrder: 3,
        winningTeamId: 'team3',
        losingTeamId: 'team4',
        team1: { id: 'team3', members: [] },
        team2: { id: 'team4', members: [] },
        // teams: [
        //   { id: 'team3Match3', team: { id: 'team3', members: [] } },
        //   { id: 'team4Match3', team: { id: 'team4', members: [] } },
        // ],
        games: [
          {
            id: 'game3',
            losingTeamId: 'team4',
            team1Id: 'team3',
            team1Score: 22,
            team2Id: 'team4',
            team2Score: 20,
            // @ts-ignore
            winReason: 'POINTS',
            winningTeamId: 'team3',
          },
          {
            id: 'game4',
            losingTeamId: 'team3',
            team1Id: 'team3',
            team1Score: 18,
            team2Id: 'team4',
            team2Score: 21,
            // @ts-ignore
            winReason: 'POINTS',
            winningTeamId: 'team4',
          },
        ],
      },
    ];

    const rankedTeams = rankTeams(matches);

    // Expectations are based on the idea that team1 and team2 each have a win and a loss, but team1 has a better point differential
    // Team3 and team4 should follow based on their performance, assuming similar win/loss but different point differentials
    expect(rankedTeams[0].id).toBe('team3'); // Best win percentage
    expect(rankedTeams[1].id).toBe('team1'); // Best point differential among teams with equal wins
    expect(rankedTeams[2].id).toBe('team2'); // Lower point differential but equal wins to team1
    expect(rankedTeams[3].id).toBe('team4');
  });

  it('TODO: should further break ties using head-to-head results', () => {
    // Similar structure as the first test, but ensure some matches directly compare the tied teams
  });

  it('handles empty matches array', () => {
    const matches: Match[] = [];
    const rankedTeams = rankTeams(matches);
    expect(rankedTeams).toEqual([]);
  });
});
