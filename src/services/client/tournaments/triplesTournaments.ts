import {
  GetResponsePayload,
  PostRequestPayload,
} from 'constants/payloads/tournamentsTriplesTournament';
import api from 'services/client/api';

export const getTournamentDetails = async (tournamentId: string) => {
  const payload: GetResponsePayload = await api.get(
    `v1/tournaments/triples-tournament/${tournamentId}`,
  );
  return payload;
};

export const registerTeamForTripleTournament = async (payload: PostRequestPayload) => {
  return api.post(`v1/tournaments/triples-tournament/${payload.tournamentId}`, {
    payload,
  });
};
