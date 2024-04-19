import axios from 'axios';
import { API_URL, DuprMatchDto } from 'constants/dupr';

export const createMatch = async (payload: DuprMatchDto, token: string) => {
  return axios.post(`${API_URL}/match/v1.0/create`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
