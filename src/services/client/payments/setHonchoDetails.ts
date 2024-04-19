import { HONCHO_TOURNAMENT_SLUG } from 'constants/tournaments';
import api from 'services/client/api';
import { getAuthHeaders } from 'services/client/token';

type Payload = {
  phoneNumber: string;
  age: number;
  teamName: string;
  duprId: string;
  instagram: string;
};

export const setHonchoDetails = async (registrantId: string, payload: Payload) => {
  const headers = await getAuthHeaders();

  return api.post(`v1/tournaments/${HONCHO_TOURNAMENT_SLUG}/info`, {
    ...headers,
    payload: {
      ...payload,
      registrantId,
    },
  });
};
