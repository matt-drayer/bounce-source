import api from 'services/client/api';
import { getAuthHeaders } from 'services/client/token';

type Payload = {
  duprId: string;
  tournamentId: string;
  amount: number;
  events: { email: string; eventType: string; price: number, eventId: string }[];
  providerCardId: string;
};

export const createTournamentV2Payment = async (payload: Payload) => {
  const headers = await getAuthHeaders();

  return api.post(`v2/tournaments/${payload.tournamentId}/pay`, {
    ...headers,
    payload,
  });
};
