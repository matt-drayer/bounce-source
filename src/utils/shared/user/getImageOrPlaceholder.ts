import { getImageUrl } from 'services/client/imagekit/getImageUrl';

interface ImageDetails {
  path: string | null | undefined;
  placeholder: string;
}

export const getImageOrPlaceholder = ({ path, placeholder }: ImageDetails) => {
  const url = path ? getImageUrl(path) : '';
  return url || placeholder;
};
