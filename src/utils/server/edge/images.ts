import { v4 as uuid } from 'uuid';
import { PostResponsePayload } from 'constants/payloads/images';
import { uploadUserImage } from 'services/server/cloudflare/s3';
import { getFileExtension } from 'utils/shared/images';
import { MimeType } from 'utils/shared/images';

export const uploadImage = async (file: File): Promise<PostResponsePayload> => {
  const fileType = file.type;

  const extension = getFileExtension({
    fileName: file.name,
    mimeType: fileType as MimeType,
  });

  const uniqueFileName = uuid() + (extension ? `.${extension}` : '');

  const uploadResponse = await uploadUserImage({
    body: file,
    fileName: uniqueFileName,
  });

  return {
    ...uploadResponse.data,
    fileType,
    originalFileName: file.name,
  };
};
