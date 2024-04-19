export const extensions = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/tiff': '.tiff',
  'image/bmp': '.bmp',
};

export const mimeTypes = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  tiff: 'image/tiff',
  bmp: 'image/bmp',
};

export type MimeType = keyof typeof extensions;

const getFileExtensionForMimeType = (mimeType: MimeType) => {
  const extension = extensions[mimeType] || '';

  return extension;
};

export const getFileExtension = ({
  fileName,
  mimeType,
}: {
  fileName: string;
  mimeType: MimeType;
}) => {
  const fileExtension = fileName.split('.').pop() || '';
  if (fileExtension) {
    return fileExtension;
  }

  return getFileExtensionForMimeType(mimeType);
};
