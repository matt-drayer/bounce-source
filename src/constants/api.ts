import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';

const API_ROOT = getIsNativePlatform() ? process.env.REMOTE_API_URL : process.env.APP_URL;
export const API_URL = `${API_ROOT}/api`;
