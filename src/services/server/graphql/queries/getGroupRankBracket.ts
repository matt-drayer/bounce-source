import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetGroupRankBracketQuery,
  GetGroupRankBracketQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

/**
 * @todo Don't need all this data, and only need to grab the items from the pool play
 */
const QUERY = gql`
  query getGroupRankBracket($id: uuid!) {
    eventGroupsByPk(id: $id) {
      event {
        id
        hostUserId
      }
      id
      title
      winBy
      totalPoints
      teamLimit
      teamType
      startsAt
      endsAt
      scoringFormat
      gamesPerMatch
      format
      minimumNumberOfGames
      numberOfEliminationTeams
      sequences(orderBy: { order: ASC }, where: { deletedAt: { _isNull: true } }) {
        id
        nextSequenceId
        order
        groupId
        competitionFormat
        completeReason
        isSequenceComplete
        pools(where: { deletedAt: { _isNull: true } }) {
          id
          title
          startsAt
          endsAt
          rounds(orderBy: { roundOrder: ASC }, where: { deletedAt: { _isNull: true } }) {
            id
            roundOrder
            title
            matches(orderBy: { matchOrder: ASC }, where: { deletedAt: { _isNull: true } }) {
              courtNumber
              id
              matchOrder
              winningTeamId
              losingTeamId
              team1Id
              team2Id
              previousMatch1Id
              previousMatch2Id
              losingTeamId
              team1 {
                id
                members(
                  orderBy: { createdAt: ASC }
                  where: { status: { _eq: ACTIVE, _isNull: true } }
                ) {
                  id
                  status
                  userProfile {
                    id
                    preferredName
                    fullName
                  }
                }
              }
              team2 {
                id
                members(orderBy: { createdAt: ASC }, where: { deletedAt: { _isNull: true } }) {
                  id
                  status
                  userProfile {
                    id
                    preferredName
                    fullName
                  }
                }
              }
              games(where: { deletedAt: { _isNull: true } }) {
                id
                scores(where: { deletedAt: { _isNull: true } }) {
                  id
                  score
                  teamId
                }
                losingTeamId
                team1Id
                team1Score
                team2Id
                team2Score
                winReason
                winningTeamId
              }
            }
          }
        }
      }
      courts(where: { deletedAt: { _isNull: true } }) {
        id
        updatedAt
        courtNumber
        courtStatus
        activeMatchId
        activeEventGroupPoolId
        activeEventGroupId
        activeMatch {
          id
          teams(where: { deletedAt: { _isNull: true } }) {
            id
            team {
              id
              members(where: { status: { _eq: ACTIVE }, deletedAt: { _isNull: true } }) {
                userProfile {
                  id
                  preferredName
                  fullName
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getGroupRankBracket = async (variables: GetGroupRankBracketQueryVariables) => {
  const data = await client.request<GetGroupRankBracketQuery>(print(QUERY), variables);
  return data;
};
