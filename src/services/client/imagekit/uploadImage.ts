import ImageKit from 'imagekit-javascript';
import { DEV_IMAGE_KEY, IMAGE_PATH } from 'constants/media';
import client from './client';

const IS_REWRITABLE = false;
const IS_PRIVATE_FILE = false;

type UploadParameters = Parameters<ImageKit['upload']>;
type UploadOptions = UploadParameters[0];

interface Params {
  file: UploadOptions['file'];
  fileName: UploadOptions['fileName'];
  useUniqueFileName: UploadOptions['useUniqueFileName'];
  tags: UploadOptions['tags'];
  folder: UploadOptions['folder'];
}

export const uploadImage = ({ file, fileName, useUniqueFileName, tags, folder }: Params) => {
  const uploadFolder =
    process.env.APP_STAGE !== 'production'
      ? `${IMAGE_PATH}-${DEV_IMAGE_KEY}/${folder}`
      : `${IMAGE_PATH}/${folder}`;

  const data = {
    file,
    fileName,
    useUniqueFileName,
    tags,
    folder: uploadFolder,
    isPrivateFile: IS_PRIVATE_FILE,
    overwriteFile: IS_REWRITABLE,
  };

  console.log(data);

  return client.upload(data);
};
