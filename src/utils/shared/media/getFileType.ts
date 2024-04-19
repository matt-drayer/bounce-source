export const getFileType = (file: File) => {
  return file.type.split('/')[1];
};
