import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetEventToPrepareTournamentQuery,
  GetEventToPrepareTournamentQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getEventToPrepareTournament($id: uuid!) {
    eventsByPk(id: $id) {
      id
      title
      hostUserId
      groups(where: { deletedAt: { _isNull: true } }) {
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
        teams(where: { deletedAt: { _isNull: true } }) {
          id
          matches(where: { deletedAt: { _isNull: true } }) {
            id
            match {
              id
              roundId
            }
          }
          members(where: { deletedAt: { _isNull: true }, status: { _eq: ACTIVE } }) {
            id
            userProfile {
              fullName
              id
              preferredName
            }
          }
        }
        pools {
          id
          title
          teams(where: { deletedAt: { _isNull: true } }) {
            id
            team {
              id
              members(where: { deletedAt: { _isNull: true }, status: { _eq: ACTIVE } }) {
                id
                status
                userProfile {
                  fullName
                  id
                  preferredName
                }
              }
            }
          }
        }
        sequences(where: { deletedAt: { _isNull: true } }) {
          id
          nextSequenceId
          order
          groupId
          competitionFormat
          completeReason
        }
        courts(where: { deletedAt: { _isNull: true }, courtStatus: { _eq: ACTIVE } }) {
          id
          courtNumber
          courtStatus
          activeMatch {
            id
            teams(where: { deletedAt: { _isNull: true } }) {
              id
              team {
                members(where: { deletedAt: { _isNull: true }, status: { _eq: ACTIVE } }) {
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
  }
`;

export const getEventToPrepareTournament = async (
  variables: GetEventToPrepareTournamentQueryVariables,
) => {
  const data = await client.request<GetEventToPrepareTournamentQuery>(print(QUERY), variables);
  return data;
};
