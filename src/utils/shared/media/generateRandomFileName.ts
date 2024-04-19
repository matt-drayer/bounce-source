import { v4 as uuid } from 'uuid';
import { getFileType } from 'utils/shared/media/getFileType';

export const generateRandomFileName = (file: File) => {
  return `${uuid()}.${getFileType(file)}`;
};
