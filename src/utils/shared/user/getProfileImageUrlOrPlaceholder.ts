import { EMPTY_AVATAR_SRC } from 'constants/user';
import { getImageOrPlaceholder } from './getImageOrPlaceholder';

interface ImageDetails {
  path: string | null | undefined;
}

export const getProfileImageUrlOrPlaceholder = ({ path }: ImageDetails) => {
  return getImageOrPlaceholder({ path, placeholder: EMPTY_AVATAR_SRC });
};
