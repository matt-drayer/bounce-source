import { v4 as uuid } from 'uuid';
import { ENFORCE_THIRD_PLACE_MATCH } from 'constants/brackets';
import {
  CompetitionFormatsEnum,
  GetGroupRankBracketQuery,
  InsertInitializeSingleEliminationMutationVariables,
  InsertSingleEliminationMatchesMutationVariables,
  MatchSelectionCriteriaEnum,
  UpdateCourtsForSingleEliminationMutationVariables,
} from 'types/generated/server';
import { insertInitializeSingleElimination } from 'services/server/graphql/mutations/insertInitializeSingleElimination';
import { insertSingleEliminationMatches } from 'services/server/graphql/mutations/insertSingleEliminationMatches';
import { updateCourtsForSingleElimination } from 'services/server/graphql/mutations/updateCourtsForSingleElimination';
import { getGroupRankBracket } from 'services/server/graphql/queries/getGroupRankBracket';
import {
  response400BadRequestError,
  response403ForbiddenError,
  responseJson200Success,
} from 'utils/server/edge/http';
import { HttpMethods, withHttpMethods } from 'utils/server/edge/middleware/withHttpMethods';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/edge/middleware/withViewerDataRequired';
import { generateSingleEliminationBracket } from 'utils/shared/brackets/generateSingleEliminationBracket';
import { rankTeams } from 'utils/shared/brackets/rankTeams';

export const config = {
  runtime: 'edge',
};

type Pools = NonNullable<
  NonNullable<NonNullable<GetGroupRankBracketQuery['eventGroupsByPk']>['sequences'][0]>['pools']
>;

type Match = NonNullable<Pools>[0]['rounds'][0]['matches'][0];

type Court = NonNullable<GetGroupRankBracketQuery['eventGroupsByPk']>['courts'][0];

const POST = async (request: NextApiRequestWithViewerRequired) => {
  const payload: { groupId: string } = await request.json();
  console.log('--- PAYLOAD = ', payload);
  const viewer = request.viewer;

  const groupResponse = await getGroupRankBracket({ id: payload.groupId });
  const group = groupResponse?.eventGroupsByPk;

  if (!group) {
    return response400BadRequestError(request, 'Group not found');
  }

  if (!group.event?.hostUserId || group.event.hostUserId !== viewer.id) {
    return response403ForbiddenError(
      request,
      'You do not have permission to generate a bracket for this group',
    );
  }

  /**
   * @todo return error if single elimination still is going on
   */

  /**
   * @todo check if single elimination has already been created. Do we recreate or just return a 201?
   */

  const roundRobinSequenceId = group?.sequences.find(
    (sequence) => sequence.competitionFormat === CompetitionFormatsEnum.RoundRobin,
  )?.id;
  const singleEliminationSequenceId = group?.sequences.find(
    (sequence) => sequence.competitionFormat === CompetitionFormatsEnum.SingleElimination,
  )?.id;
  /**
   * @todo return error if either of these id's not truthy
   */

  const roundRobinPools = group?.sequences
    .find((sequence) => !!roundRobinSequenceId && sequence.id === roundRobinSequenceId)
    ?.pools.reduce((acc, pool) => {
      acc.push(pool);
      return acc;
    }, [] as NonNullable<NonNullable<NonNullable<GetGroupRankBracketQuery['eventGroupsByPk']>['sequences'][0]>['pools']>);
  const roundRobinMatches: Match[] = [];

  roundRobinPools?.forEach((pool) => {
    pool.rounds.forEach((round) => {
      round.matches.forEach((match) => {
        roundRobinMatches.push(match);
      });
    });
  });

  const rankedTeams = rankTeams(roundRobinMatches);
  const singleEliminationBracket = generateSingleEliminationBracket({
    rankedTeams: rankedTeams,
    numberOfQualifyingTeams: group.numberOfEliminationTeams || rankedTeams.length,
    hasThirdPlaceMatch: ENFORCE_THIRD_PLACE_MATCH,
  });
  const matchesByRound = singleEliminationBracket.matchesByRound;

  const teamsInBracket = rankedTeams.slice(0, singleEliminationBracket.numberOfTeamsInBracket);
  const seeding = teamsInBracket.map((team, i) => {
    return {
      eventGroupSequenceId: singleEliminationSequenceId,
      eventTeamId: team.id,
      seed: i + 1,
    };
  });

  const singleEliminationPool: InsertInitializeSingleEliminationMutationVariables = {
    groupId: group.id,
    roundRobinSequenceId,
    nextSequenceId: singleEliminationSequenceId,
    seedingObjects: seeding,
    teamsData: teamsInBracket.map((team, i) => {
      return {
        teamId: team.id,
      };
    }),
    startsAt: group.startsAt,
    endsAt: group.endsAt,
  };

  const poolResponse = await insertInitializeSingleElimination(singleEliminationPool);
  const poolId = poolResponse.insertEventGroupPoolsOne?.id;

  const courts = group.courts.map((court) => {
    return {
      ...court,
      activeMatchId: null,
    };
  });
  const assignedCourts: {
    id: string;
    activeMatchId: string | null;
    activeEventPoolId: string;
  }[] = [];

  const rounds: InsertSingleEliminationMatchesMutationVariables['objects'] = [];
  matchesByRound.forEach((matches, roundIndex) => {
    const round: InsertSingleEliminationMatchesMutationVariables['objects'] = {
      roundOrder: roundIndex,
      poolId,
      title: singleEliminationBracket.roundNames[roundIndex],
      matches: {
        data: matches.map((match, matchIndex) => {
          const isBye =
            (match.team1Index === -1 || match.team2Index === -1) &&
            !(match.team1Index === -1 && match.team2Index === -1);
          let team1ForMatch;
          let team2ForMatch;

          /**
           * @note MAKE SURE THIS STILL WORKS
           */
          if (typeof match.team1Index === 'number' && match.team1Index !== -1) {
            team1ForMatch = {
              id: rankedTeams[match.team1Index].id,
            };
          }
          if (typeof match.team2Index === 'number' && match.team2Index !== -1) {
            team2ForMatch = {
              id: rankedTeams[match.team2Index].id,
            };
          }

          let previousMatch1Id: string | undefined;
          let previousMatch2Id: string | undefined;

          if (typeof match.previousRoundIndex === 'number' && match.previousRoundIndex !== -1) {
            if (typeof match.previousMatch1Index === 'number' && match.previousMatch1Index !== -1) {
              previousMatch1Id =
                rounds[match.previousRoundIndex]?.matches?.data?.[match.previousMatch1Index]?.id ||
                undefined;

              const isPreviousBye =
                rounds[match.previousRoundIndex]?.matches?.data?.[match.previousMatch1Index]?.isBye;
              const teamWithByeId =
                rounds[match.previousRoundIndex]?.matches?.data?.[match.previousMatch1Index]
                  ?.team1Id;

              if (isPreviousBye && !team1ForMatch) {
                team1ForMatch = {
                  id: teamWithByeId,
                };
              }
            }

            if (typeof match.previousMatch2Index === 'number' && match.previousMatch2Index !== -1) {
              previousMatch2Id =
                rounds[match.previousRoundIndex]?.matches?.data?.[match.previousMatch2Index]?.id ||
                undefined;

              const isPreviousBye =
                rounds[match.previousRoundIndex]?.matches?.data?.[match.previousMatch2Index]?.isBye;
              const teamWithByeId =
                rounds[match.previousRoundIndex]?.matches?.data?.[match.previousMatch2Index]
                  ?.team1Id;

              if (isPreviousBye && !team2ForMatch && teamWithByeId) {
                team2ForMatch = {
                  id: teamWithByeId,
                };
              }
            }
          }

          const matchId = uuid();

          let nextAvailableCourt;
          if (!isBye && roundIndex === 0) {
            nextAvailableCourt = courts[assignedCourts.length];

            if (nextAvailableCourt) {
              assignedCourts.push({
                id: nextAvailableCourt.id,
                activeMatchId: matchId,
                activeEventPoolId: poolId,
              });
            }
          }

          const teamsForMatch = [];
          if (team1ForMatch) {
            teamsForMatch.push({
              teamId: team1ForMatch.id,
              order: teamsForMatch.length,
            });
          }
          if (team2ForMatch) {
            teamsForMatch.push({
              teamId: team2ForMatch.id,
              order: teamsForMatch.length,
            });
          }

          return {
            id: matchId,
            matchOrder: matchIndex,
            isBye,
            previousMatch1Id,
            previousMatch2Id,
            selectionCriteriaPreviousMatch1: match.selectionCriteriaPreviousMatch1,
            selectionCriteriaPreviousMatch2: match.selectionCriteriaPreviousMatch2,
            eventCourtId: nextAvailableCourt?.id,
            courtNumber: nextAvailableCourt?.courtNumber,
            team1Id: team1ForMatch?.id,
            team2Id: team2ForMatch?.id,
            poolId: poolId,
            teams: {
              data: teamsForMatch,
            },
          };
        }),
      },
    };

    rounds.push(round);
  });

  await insertSingleEliminationMatches({ objects: rounds });

  const freeCourts: {
    id: string;
    activeMatchId: string | null;
    activeEventPoolId: string;
  }[] = [];

  courts.forEach((court) => {
    if (!assignedCourts.find((assignedCourt) => assignedCourt.id === court.id)) {
      freeCourts.push({
        ...court,
        activeMatchId: null,
        activeEventPoolId: poolId,
      });
    }
  });

  const mergedCourts = [...assignedCourts, ...freeCourts];
  const courtUpdates: UpdateCourtsForSingleEliminationMutationVariables['updates'] = [];

  mergedCourts.forEach((court) => {
    courtUpdates.push({
      _set: {
        activeEventGroupPoolId: court.activeEventPoolId,
        activeMatchId: court.activeMatchId,
      },
      where: {
        id: { _eq: court.id },
      },
    });
  });

  await updateCourtsForSingleElimination({
    updates: courtUpdates,
  });

  /**
   * Do we need to insert one round at a time since it may not have FKs yet inserted for the matches?
   * Need to update matches to point to the sequence since it's nested under rounds
   * Swap courts to the new pool. Make sure courts aren't assigned to a bye.
   * Move bye teams to the next round?
   */

  return responseJson200Success(request, {
    rounds,
    seeding,
    mergedCourts,
    singleEliminationBracket,
  });
};

export default withHttpMethods({
  [HttpMethods.Post]: withViewerDataRequired(POST),
});
