import { PostRequestPayload } from 'constants/payloads/tournamentsPay';
import api from 'services/client/api';
import { getAuthHeaders } from 'services/client/token';

export const createExternalTournamentPayment = async <T>(payload: T, tournamentUrl: string) => {
  const headers = await getAuthHeaders();

  return api.post(`v1/tournaments/${tournamentUrl}`, {
    ...headers,
    payload: payload || {},
  });
};
