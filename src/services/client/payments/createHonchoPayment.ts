import { PostRequestPayload } from 'constants/payloads/tournamentsPay';
import { HONCHO_TOURNAMENT_SLUG } from 'constants/tournaments';
import api from 'services/client/api';
import { getAuthHeaders } from 'services/client/token';

type Payload = Omit<PostRequestPayload, 'brevoListId' | 'partnerEmail' | 'duprId'> & {
  leagueRegistration: {
    city: string;
    division: string;
    partnerEmail: string;
  };
  promoCode: string;
};

export const createHonchoPayment = async ({
  amount,
  tournamentId,
  providerCardId,
  leagueRegistration,
  promoCode,
}: Payload) => {
  const headers = await getAuthHeaders();
  const payload = {
    tournamentId,
    amount: amount * 100,
    leagueRegistration,
    providerCardId,
    promoCode,
  };

  return api.post(`v1/tournaments/${HONCHO_TOURNAMENT_SLUG}/pay`, {
    ...headers,
    payload,
  });
};
