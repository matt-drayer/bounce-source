import { getImageUrl } from 'services/client/imagekit/getImageUrl';

interface ImageDetails {
  path: string | null | undefined;
}

export const getLessonImageUrl = ({ path }: ImageDetails) => {
  const url = path ? getImageUrl(path) : '';
  return url;
};
