import ImageKit from 'imagekit-javascript';
import { API_URL } from 'constants/api';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL!,
  authenticationEndpoint: `${API_URL}/v1/images/sign`,
});

export default imagekit;
