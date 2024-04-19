import { PostRequestPayload } from 'constants/payloads/tournamentsPay';
import api from 'services/client/api';
import { getAuthHeaders } from 'services/client/token';

export const createTournamentPayment = async ({
  amount,
  tournamentId,
  ...rest
}: PostRequestPayload) => {
  const headers = await getAuthHeaders();
  const payload: PostRequestPayload = {
    tournamentId,
    amount: amount * 100,
    ...rest,
  };

  return api.post(`v1/tournaments/${tournamentId}/pay`, {
    ...headers,
    payload,
  });
};
