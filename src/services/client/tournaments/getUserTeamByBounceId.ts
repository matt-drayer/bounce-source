import api from 'services/client/api';
import { getAuthHeaders } from 'services/client/token';

export const getUserTeamByBounceId = async (tournamentId?: string, teamApiUrl?: string) => {
  const headers = await getAuthHeaders();

  const url = teamApiUrl || `${tournamentId}/team`;

  return api.get(`v1/tournaments/${url}`, {
    ...headers,
  });
};
