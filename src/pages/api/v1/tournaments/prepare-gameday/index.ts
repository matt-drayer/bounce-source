import * as Sentry from '@sentry/nextjs';
import {
  CompetitionFormatsEnum,
  EventGroupFormatsEnum,
  EventGroupSequencesConstraint,
  EventGroupSequencesUpdateColumn,
  EventMatchesTeamsConstraint,
  EventMatchesTeamsUpdateColumn,
  EventPoolRoundsConstraint,
  EventPoolRoundsInsertInput,
  EventPoolRoundsUpdateColumn,
  EventPoolsTeamsConstraint,
  EventPoolsTeamsUpdateColumn,
  EventSequenceCompleteReasonsEnum,
  GetEventToPrepareTournamentQuery,
  InsertInitializeGamedayMutationVariables,
} from 'types/generated/server';
import { insertEventCourts } from 'services/server/graphql/mutations/insertEventCourts';
import { insertInitializeGameday } from 'services/server/graphql/mutations/insertInitializeGameday';
import { updatePoolsForMatches } from 'services/server/graphql/mutations/updatePoolsForMatches';
import { getEventToPrepareTournament } from 'services/server/graphql/queries/getEventToPrepareTournament';
import {
  response400BadRequestError,
  response403ForbiddenError,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/edge/http';
import { HttpMethods, withHttpMethods } from 'utils/server/edge/middleware/withHttpMethods';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/edge/middleware/withViewerDataRequired';
import roundRobinScheduler, { Round, SchedulerConfig } from 'utils/shared/roundRobin/scheduler';

export const config = {
  runtime: 'edge',
};

/**
 * @note for MVP we are assuming that all teams are in a single pool for round robin
 * We will also use one pool for
 */
/**
 * @todo handle different types other than RR + SE
 * @todo Break functions out into smaller pieces and test the output
 */

const DEMO_NUMBER_OF_COURTS = 4;
const IS_SINGLE_POOL_ROUND_ROBIN = true;
const DEFAULT_TIME_PER_MATCH = 20;
const SHOULD_SHUFFLE_TEAMS_WHEN_SCHEDULING = false;

const getSequenceFormats = (groupFormat: EventGroupFormatsEnum) => {
  if (groupFormat === EventGroupFormatsEnum.RoundRobin) {
    return {
      competitionFormat: CompetitionFormatsEnum.RoundRobin,
      nextSequenceCompetionFormat: null,
    };
  } else if (groupFormat === EventGroupFormatsEnum.SingleElimination) {
    return {
      competitionFormat: CompetitionFormatsEnum.SingleElimination,
      nextSequenceCompetionFormat: null,
    };
  } else if (groupFormat === EventGroupFormatsEnum.RoundRobinSingleElimination) {
    return {
      competitionFormat: CompetitionFormatsEnum.RoundRobin,
      nextSequenceCompetionFormat: CompetitionFormatsEnum.SingleElimination,
    };
  } else {
    return {
      competitionFormat: CompetitionFormatsEnum.Custom,
      nextSequenceCompetionFormat: null,
    };
  }
};

function shuffleArray(array: any[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const buildCourtObjects = (eventId: string) => {
  return Array.from({ length: DEMO_NUMBER_OF_COURTS }, (_, index) => ({
    eventId,
    courtNumber: index + 1,
  }));
};

const isAllowedToPrepareTournament = (
  event: GetEventToPrepareTournamentQuery['eventsByPk'],
  viewerUserId: string,
) => {
  return event?.hostUserId === viewerUserId;
};

const POST = async (request: NextApiRequestWithViewerRequired) => {
  const { id } = await request.json();
  const viewer = request.viewer;
  const eventResponse = await getEventToPrepareTournament({ id });
  const event = eventResponse?.eventsByPk;

  if (!event) {
    return response400BadRequestError(request, 'Event not found');
  }

  if (!isAllowedToPrepareTournament(event, viewer.id)) {
    return response403ForbiddenError(request, 'You do not have permission to manage this event');
  }

  console.log({ id });

  const courtObjects = buildCourtObjects(id);

  const insertCourtsResponse = await insertEventCourts({ objects: courtObjects });
  const courts = insertCourtsResponse?.insertEventCourts?.returning;

  // - Run round robin scheduler (how to handle courts, should know # for pool). Will build out the rounds and matches. Make sure I also fill out the event_matches_teams. How do we order these so it doesn't jump around on top vs. bottom teams and players?
  // - Make everything 1 pool for the group. All teams in group go into events
  // - Single elimination will be another pool. Make now?
  // - Sequence entered here or done at tournament create? Seems fine here
  // - For rounds, do I need the next round ID? May need to do some weird nesting if so when inserting.
  // - Number of single elimination teams is known here? What if they decide to reshuffle it later? Could get weird on the rounds as it may add more.
  // - Where is my logic for single elimination? I know I built this out at some point through ChatGPT. May just need to do it again. Like what I used for Nashville, like with assigning byes and such.
  // - When do courts get assigned to new events? I may need a many-to-many table and do it ahead of time.

  /**
   * @todo loop through groups
   */
  const schedules: Record<string, Round[]> = {};
  const matchCount: Record<string, Record<number, number>> = {};
  const teamsInPool: Record<string, { teamId: string }[]> = {};
  const poolRoundsData: Record<
    string,
    EventPoolRoundsInsertInput[]
    // {
    //   roundOrder: number;
    //   matches: {
    //     data: {
    //       teams: {
    //         data: {
    //           teamId: string;
    //         }[];
    //       };
    //     }[];
    //   };
    // }[]
  > = {};

  event.groups.forEach((group) => {
    const schedule = roundRobinScheduler({
      numCourts: DEMO_NUMBER_OF_COURTS,
      numTeams: group.teams.length,
      timePerMatch: DEFAULT_TIME_PER_MATCH,
      ensureEqualMatches: true,
      shouldPreventDuplicateMatches: true,
      minimumGamesPerTeam: group.minimumNumberOfGames,
    });
    const teams = SHOULD_SHUFFLE_TEAMS_WHEN_SCHEDULING
      ? shuffleArray(group.teams.map((team) => team.id))
      : group.teams.map((team) => team.id);
    teamsInPool[group.id] = teams.map((teamId) => ({ teamId }));

    schedules[group.id] = schedule.map((round, i) => {
      const teamIndexesInRound = round.matches.reduce((acc, match) => {
        acc.push(match.teamA);
        acc.push(match.teamB);
        return acc;
      }, [] as number[]);
      const schedule = {
        ...round,
        round: i + 1,
        teamIndexesInRound,
        byesIndexesInRound: round.byes,
        matches: round.matches.map((match) => {
          return {
            ...match,
            teamA: match.teamA,
            teamB: match.teamB,
            teamAId: teams[match.teamA],
            teamBId: teams[match.teamB],
            teamAMembers: group.teams.find((team) => team.id === teams[match.teamA])?.members || [],
            teamBMembers: group.teams.find((team) => team.id === teams[match.teamB])?.members || [],
          };
        }),
      };
      return schedule;
    });

    poolRoundsData[group.id] = [];

    schedules[group.id].forEach((round, roundOrder) => {
      poolRoundsData[group.id].push({
        roundOrder: roundOrder,
        matches: {
          data: round.matches.map((match, matchOrder) => ({
            matchOrder: matchOrder,
            team1Id: teams[match.teamA],
            team2Id: teams[match.teamB],
            teams: {
              data: [
                {
                  teamId: teams[match.teamA],
                  order: 0,
                },
                {
                  teamId: teams[match.teamB],
                  order: 1,
                },
              ],
              onConflict: {
                constraint: EventMatchesTeamsConstraint.EventMatchesTeamsMatchIdTeamIdKey,
                updateColumns: [EventMatchesTeamsUpdateColumn.UpdatedAt],
              },
            },
          })),
        },
      });
    });

    // FOR TEST LOGGING
    const matchesPerTeam: Record<number, number> = {};
    schedules[group.id].forEach((round) => {
      round.matches.forEach((match) => {
        matchesPerTeam[match.teamA] = (matchesPerTeam[match.teamA] || 0) + 1;
        matchesPerTeam[match.teamB] = (matchesPerTeam[match.teamB] || 0) + 1;
      });
    });
    matchCount[group.id] = matchesPerTeam;
  });

  const insertPoolsPromises = event.groups.map((group, i) => {
    const groupId = group.id;
    const startsAt = group.startsAt;
    const endsAt = group.endsAt;

    const poolData: InsertInitializeGamedayMutationVariables['poolData'] = {
      groupId,
      startsAt,
      endsAt,
      teams: {
        data: teamsInPool[groupId],
        onConflict: {
          constraint: EventPoolsTeamsConstraint.EventPoolsTeamsPkey,
          updateColumns: [EventPoolsTeamsUpdateColumn.UpdatedAt],
        },
      },
      rounds: {
        data: poolRoundsData[groupId],
        onConflict: {
          constraint: EventPoolRoundsConstraint.EventPoolRoundsPkey,
          updateColumns: [EventPoolRoundsUpdateColumn.UpdatedAt],
        },
      },
    };

    const { competitionFormat, nextSequenceCompetionFormat } = getSequenceFormats(group.format);

    const eventGroupSequeceVariables: InsertInitializeGamedayMutationVariables = {
      competitionFormat: competitionFormat,
      groupId,
      nextSequence: nextSequenceCompetionFormat
        ? {
            data: {
              competitionFormat: nextSequenceCompetionFormat,
              groupId,
              isSequenceComplete: false,
              order: 1,
              completeReason: EventSequenceCompleteReasonsEnum.Pending,
            },
            onConflict: {
              constraint: EventGroupSequencesConstraint.EventGroupSequencesGroupIdOrderKey,
              updateColumns: [
                EventGroupSequencesUpdateColumn.CompetitionFormat,
                EventGroupSequencesUpdateColumn.CompleteReason,
                EventGroupSequencesUpdateColumn.IsSequenceComplete,
                EventGroupSequencesUpdateColumn.NextSequenceId,
              ],
            },
          }
        : undefined,
      poolData: poolData,
    };

    return insertInitializeGameday(eventGroupSequeceVariables);
  });

  const resp = await Promise.all(insertPoolsPromises);

  const setPoolIdPromises: Promise<any>[] = [];
  resp.forEach((r) => {
    r.insertEventGroupSequencesOne?.pools.forEach((pool) => {
      pool.rounds.forEach((round) => {
        if (pool.id && round.id) {
          setPoolIdPromises.push(
            updatePoolsForMatches({
              poolId: pool.id,
              roundId: round.id,
            }),
          );
        }
      });
    });
  });

  await Promise.all(setPoolIdPromises).catch((e) => {
    Sentry.captureException(e);
    console.error(e);
  });

  return responseJson200Success(request, {
    id,
    insertPoolsPromises,
    // teamsInPool,
    // poolRoundsData,
    // matchCount,
    // schedules,
    viewer,
    event,
    courts,
    todo: true,
  });
};

export default withHttpMethods({
  [HttpMethods.Post]: withViewerDataRequired(POST),
});
