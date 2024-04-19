import { API_URL } from 'constants/api';
import { getViewerToken } from 'services/client/token';
import ApiService from './ApiService';

const api = new ApiService({
  baseUrl: API_URL,
  injectHeaders: async () => {
    const token = await getViewerToken();

    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  },
});

export default api;
