import { gql } from '@apollo/client';

export const UPDATE_MATCH_GAME_SCORE = 'TODO';

export const GET_GAMEDAY_BY_EVENT_ID = gql`
  query getGamedayByEventId($id: uuid!) {
    eventsByPk(id: $id) {
      id
      title
      hostUserId
      groups {
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
        numberOfEstimatedCourts
        sequences(orderBy: { order: ASC }) {
          id
          nextSequenceId
          order
          groupId
          competitionFormat
          completeReason
          isSequenceComplete
          pools {
            id
            title
            startsAt
            endsAt
            rounds(orderBy: { roundOrder: ASC }) {
              id
              roundOrder
              title
              matches(orderBy: { matchOrder: ASC }) {
                courtNumber
                id
                matchOrder
                isBye
                winningTeamId
                losingTeamId
                team1Id
                team2Id
                previousMatch1Id
                previousMatch2Id
                selectionCriteriaPreviousMatch1
                selectionCriteriaPreviousMatch2
                losingTeamId
                team1 {
                  id
                  members(orderBy: { createdAt: ASC }) {
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
                  members(orderBy: { createdAt: ASC }) {
                    id
                    status
                    userProfile {
                      id
                      preferredName
                      fullName
                    }
                  }
                }
                games {
                  id
                  scores {
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
          seeding {
            id
            eventTeamId
            seed
          }
        }
        courts {
          id
          updatedAt
          courtNumber
          courtStatus
          activeMatchId
          activeMatch {
            id
            teams {
              id
              team {
                id
                members {
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
      courts {
        id
        updatedAt
        activeMatchId
        courtStatus
        courtNumber
        activeEventGroupId
        activeEventGroupPoolId
      }
    }
  }
`;

export const ASSIGN_COURT_TO_MATCH = gql`
  mutation assignCourtToMatch($matchId: uuid!, $courtId: uuid!, $courtNumber: Int!) {
    updateEventMatchesByPk(
      pkColumns: { id: $matchId }
      _set: { eventCourtId: $courtId, courtNumber: $courtNumber }
    ) {
      id
      eventCourtId
      courtNumber
    }
    updateEventCourtsByPk(pkColumns: { id: $courtId }, _set: { activeMatchId: $matchId }) {
      id
      updatedAt
      courtNumber
      courtStatus
      activeMatchId
      activeMatch {
        id
        team1 {
          id
          members(orderBy: { createdAt: ASC }) {
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
          members(orderBy: { createdAt: ASC }) {
            id
            status
            userProfile {
              id
              preferredName
              fullName
            }
          }
        }
        teams {
          id
          team {
            members {
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
`;

export const SET_MATCH_SCORES_FREE_COURT = gql`
  mutation setMatchScoresFreeCourt(
    $losingTeamId: uuid!
    $matchId: uuid!
    $team1Id: uuid!
    $team1Score: numeric!
    $team2Id: uuid!
    $team2Score: numeric!
    $winReason: WinReasonsEnum!
    $winningTeamId: uuid!
    $data: [EventGameScoresInsertInput!] = []
    $courtId: uuid!
  ) {
    insertEventMatchGamesOne(
      object: {
        losingTeamId: $losingTeamId
        matchId: $matchId
        team1Id: $team1Id
        team1Score: $team1Score
        team2Id: $team2Id
        team2Score: $team2Score
        winReason: $winReason
        winningTeamId: $winningTeamId
        scores: {
          data: $data
          onConflict: { constraint: event_game_scores_game_id_team_id_key, updateColumns: score }
        }
      }
    ) {
      id
      matchId
      team1Score
      team2Score
      team1Id
      team2Id
      winReason
      winningTeamId
      losingTeamId
    }
    updateEventMatchesByPk(
      pkColumns: { id: $matchId }
      _set: { winningTeamId: $winningTeamId, losingTeamId: $losingTeamId, winReason: $winReason }
    ) {
      id
      losingTeamId
      winReason
      winningTeamId
      courtNumber
    }
    updateEventCourtsByPk(pkColumns: { id: $courtId }, _set: { activeMatchId: null }) {
      id
      activeMatchId
    }
  }
`;

export const SET_MATCH_SCORES_UPDATE_NEXT_MATCH_COURT = gql`
  mutation setMatchScoresUpdateNextMatchCourt(
    $losingTeamId: uuid!
    $matchId: uuid!
    $team1Id: uuid!
    $team1Score: numeric!
    $team2Id: uuid!
    $team2Score: numeric!
    $winReason: WinReasonsEnum!
    $winningTeamId: uuid!
    $data: [EventGameScoresInsertInput!] = []
    $courtId: uuid!
    $courtNumber: Int!
    $nextMatchId: uuid!
  ) {
    insertEventMatchGamesOne(
      object: {
        losingTeamId: $losingTeamId
        matchId: $matchId
        team1Id: $team1Id
        team1Score: $team1Score
        team2Id: $team2Id
        team2Score: $team2Score
        winReason: $winReason
        winningTeamId: $winningTeamId
        scores: {
          data: $data
          onConflict: { constraint: event_game_scores_game_id_team_id_key, updateColumns: score }
        }
      }
    ) {
      id
      matchId
      team1Score
      team2Score
      winReason
      winningTeamId
      losingTeamId
    }
    updatePreviousMatch: updateEventMatchesByPk(
      pkColumns: { id: $matchId }
      _set: { winningTeamId: $winningTeamId, losingTeamId: $losingTeamId, winReason: $winReason }
    ) {
      id
      losingTeamId
      winReason
      winningTeamId
      courtNumber
      eventCourtId
    }
    updateNextMatch: updateEventMatchesByPk(
      pkColumns: { id: $nextMatchId }
      _set: { courtNumber: $courtNumber, eventCourtId: $courtId }
    ) {
      id
      losingTeamId
      winReason
      winningTeamId
      courtNumber
      eventCourtId
    }
    updateEventCourtsByPk(pkColumns: { id: $courtId }, _set: { activeMatchId: $nextMatchId }) {
      id
      activeMatchId
    }
  }
`;

export const SET_MATCH_SCORES = gql`
  mutation setMatchScores(
    $losingTeamId: uuid!
    $matchId: uuid!
    $team1Id: uuid!
    $team1Score: numeric!
    $team2Id: uuid!
    $team2Score: numeric!
    $winReason: WinReasonsEnum!
    $winningTeamId: uuid!
    $data: [EventGameScoresInsertInput!] = []
  ) {
    insertEventMatchGamesOne(
      object: {
        losingTeamId: $losingTeamId
        matchId: $matchId
        team1Id: $team1Id
        team1Score: $team1Score
        team2Id: $team2Id
        team2Score: $team2Score
        winReason: $winReason
        winningTeamId: $winningTeamId
        scores: {
          data: $data
          onConflict: { constraint: event_game_scores_game_id_team_id_key, updateColumns: score }
        }
      }
    ) {
      id
      matchId
      team1Score
      team2Score
      winReason
      winningTeamId
      losingTeamId
    }
    updatePreviousMatch: updateEventMatchesByPk(
      pkColumns: { id: $matchId }
      _set: { winningTeamId: $winningTeamId, losingTeamId: $losingTeamId, winReason: $winReason }
    ) {
      id
      losingTeamId
      winReason
      winningTeamId
      courtNumber
      eventCourtId
    }
  }
`;

export const UPDATE_GAME_SCORE = gql`
  mutation updateGameScore(
    $gameId: uuid!
    $team1Score: numeric!
    $team2Score: numeric!
    $losingTeamId: uuid!
    $winningTeamId: uuid!
    $matchId: uuid!
    $matchWinningTeamId: uuid!
    $matchLosingTeamId: uuid!
    $updates: [EventGameScoresUpdates!] = []
  ) {
    updateEventMatchGamesByPk(
      pkColumns: { id: $gameId }
      _set: {
        team1Score: $team1Score
        team2Score: $team2Score
        losingTeamId: $losingTeamId
        winningTeamId: $winningTeamId
      }
    ) {
      id
      team2Id
      team2Score
      team1Id
      team1Score
      losingTeamId
    }
    updateEventMatchesByPk(
      pkColumns: { id: $matchId }
      _set: { winningTeamId: $matchWinningTeamId, losingTeamId: $matchLosingTeamId }
    ) {
      id
      losingTeamId
      winningTeamId
    }
    updateEventGameScoresMany(updates: $updates) {
      returning {
        id
        score
      }
    }
  }
`;

export const UPDATE_SINGLE_ELIMINATION_MATCH_PROGRESSION = gql`
  mutation updateSingleEliminationMatchProgression($updates: [EventMatchesUpdates!] = []) {
    updateEventMatchesMany(updates: $updates) {
      returning {
        team1Id
        team2Id
      }
    }
  }
`;

export const UPDATE_UNASSIGN_COURT = gql`
  mutation updatedUnassignCourt($id: uuid!) {
    updateEventCourtsByPk(
      pkColumns: { id: $id }
      _set: { activeEventGroupId: null, activeEventGroupPoolId: null, activeMatchId: null }
    ) {
      id
      courtNumber
      courtStatus
      activeMatchId
      activeEventGroupId
      activeEventGroupPoolId
    }
  }
`;

export const UPDATE_COURTS_START = gql`
  mutation updateCourtsStartGroup(
    $courtUpdates: [EventCourtsUpdates!] = []
    $matchUpdates: [EventMatchesUpdates!] = []
  ) {
    updateEventCourtsMany(updates: $courtUpdates) {
      returning {
        id
        updatedAt
        courtNumber
        courtStatus
        activeMatchId
        activeMatch {
          id
          teams {
            id
            team {
              id
              members {
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
    updateEventMatchesMany(updates: $matchUpdates) {
      returning {
        id
        isBye
        matchOrder
        courtNumber
        eventCourtId
      }
    }
  }
`;

export const UPDATE_REMOVE_COURT_FROM_MATCH = gql`
  mutation updateRemoveCourtFromMatch($matchId: uuid!, $courtId: uuid!) {
    updateEventMatchesByPk(
      pkColumns: { id: $matchId }
      _set: { courtNumber: null, eventCourtId: null }
    ) {
      id
      eventCourtId
      courtNumber
    }
    updateEventCourtsByPk(pkColumns: { id: $courtId }, _set: { activeMatchId: null }) {
      activeMatchId
      id
    }
  }
`;

export const UPDATE_RELEASE_COURTS_FROM_GROUP = gql`
  mutation updateReleaseCourtsFromGroup($activeEventGroupId: uuid!) {
    updateEventCourts(
      where: { activeEventGroupId: { _eq: $activeEventGroupId } }
      _set: { activeEventGroupId: null, activeEventGroupPoolId: null, activeMatchId: null }
    ) {
      returning {
        id
        activeEventGroupId
        activeEventGroupPoolId
        activeMatchId
      }
    }
  }
`;

export const UPDATE_COMPLETE_SEQUENCE = gql`
  mutation updateCompleteSequence($id: uuid!) {
    updateEventGroupSequencesByPk(
      pkColumns: { id: $id }
      _set: { completeReason: ALL_SCORES, isSequenceComplete: true }
    ) {
      id
      isSequenceComplete
      completeReason
    }
  }
`;
