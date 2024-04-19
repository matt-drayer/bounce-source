import api from 'services/client/api';
import { getAuthHeaders } from 'services/client/token';

type Payload = {
  phoneNumber: string;
  birthDate: string;
  shirtSize: string;
  teamName: string;
  instagram: string;
  tournamentId: string;
};

export const setAdditionalInfo = async (payload: Payload) => {
  const headers = await getAuthHeaders();

  return api.post(`v2/tournaments/${payload.tournamentId}/info`, {
    ...headers,
    payload,
  });
};
