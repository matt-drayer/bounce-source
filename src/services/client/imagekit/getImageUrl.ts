import ImageKit from 'imagekit-javascript';
import client from './client';

type Options = Parameters<ImageKit['url']>;

export const getImageUrl = (path: string, options?: Options) => {
  return client.url({
    path,
    urlEndpoint: process.env.IMAGEKIT_URL!,
    ...options,
  });
};
