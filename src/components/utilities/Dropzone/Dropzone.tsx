import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import AddPhotoV2 from 'svg/AddPhotoV2';

interface Props {
  onSelectFiles(files: File[]): void;

  multiple?: boolean;
}

const Dropzone = ({ multiple = false, onSelectFiles }: Props) => {
  const onDrop = (acceptedFiles: File[]) => {
    onSelectFiles(acceptedFiles);
  };

  const { getRootProps, acceptedFiles, getInputProps } = useDropzone({
    onDrop,
    multiple,
    onFileDialogOpen: () => {
      onSelectFiles([]);
    },
  });

  return (
    <div className="flex w-full flex-col">
      <div
        {...getRootProps()}
        className="flex w-full items-center justify-center bg-color-bg-lightmode-tertiary pb-8 pt-8"
      >
        <input {...getInputProps()} />
        <div className="flex cursor-pointer flex-col items-center text-color-text-lightmode-placeholder">
          <AddPhotoV2 className="h-8 w-8 [&>path]:fill-color-text-lightmode-icon" />
          <div>
            <span className="font-medium text-color-text-brand">Click to upload </span> or drag and
            drop
          </div>
          <span>PNG, or JPG (max. 100 MB)</span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {acceptedFiles.map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt="Sponsor"
            className="h-20 w-20 border border-color-border-input-lightmode dark:border-color-border-input-darkmode"
          />
        ))}
      </div>
    </div>
  );
};

export default Dropzone;
