import * as React from 'react';
import { PostRequestPayload } from 'constants/payloads/images';
import { PostResponsePayload } from 'constants/payloads/images';
import { useInsertThreadWithCommentMutation } from 'types/generated/client';
import { useApiGateway } from 'hooks/useApi';
import CloseIcon from 'svg/CloseIcon';
import LoadSpinner from 'svg/LoadSpinner';
import Photograph from 'svg/Photograph';
import Modal from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  userId?: string | null;
  groupId?: string | null;
  isGroupMember?: boolean;
  isGroupLoaded?: boolean;
  handleCommentSubmit?: () => void | Promise<void>;
}

export default function ModalCreateThread({
  isOpen,
  closeModal,
  userId,
  groupId,
  isGroupMember,
  isGroupLoaded,
  handleCommentSubmit,
}: Props) {
  const [commentText, setCommentText] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const {
    post: postUploadImage,
    data: imageUploadData,
    isLoading: isImageUploadLoading,
    resetInitialState: resetImageUploadState,
  } = useApiGateway<PostRequestPayload, PostResponsePayload>('/v1/images/group-comments');
  const [insertThreadWithCommentMutation, { loading: isInsertThreadWithCommentMutationLoading }] =
    useInsertThreadWithCommentMutation();
  const isLoading = !userId || !isGroupMember || !isGroupLoaded || isImageUploadLoading;
  const isDisabled = !commentText || isLoading;

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isInsertThreadWithCommentMutationLoading || !isGroupMember || !isGroupLoaded || !userId) {
      return;
    }

    const files = [];

    if (imageUploadData) {
      files.push({
        fileName: imageUploadData.fileName,
        fileType: imageUploadData.fileType,
        host: imageUploadData.host,
        originalFileName: imageUploadData.originalFileName || '',
        path: imageUploadData.path,
        provider: imageUploadData.provider,
        providerUrl: imageUploadData.providerUrl,
        url: imageUploadData.url,
        userId: userId,
      });
    }

    await insertThreadWithCommentMutation({
      variables: {
        groupId: groupId,
        content: commentText,
        userId: userId,
        files: files,
      },
    });

    if (handleCommentSubmit) {
      await handleCommentSubmit();
    }

    setCommentText('');
    setFile(null);
    resetImageUploadState();
    closeModal();
  };

  const handleUploadImage = async (file?: File | null) => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    resetImageUploadState();
    setFile(file);

    const formData: PostRequestPayload = new FormData();
    formData.append('file', file);
    // formData.append('type', file.type);

    console.log(file, formData);

    try {
      const response = await postUploadImage({ payload: formData });
      setFile(null);

      console.log('File uploaded successfully:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      handleClose={closeModal}
      classNameMaxWidth="max-w-2xl"
      classNamePosition="fixed bottom-0 sm:relative h-full"
      classNameHeight="h-full sm:py-6"
      classNameRounded="rounded-none sm:rounded-2xl"
      className={classNames('max-h-full sm:max-h-[720px]')}
    >
      <div className="safearea-pad-top flex h-full flex-col">
        <form className="flex h-full flex-col" onSubmit={handleSubmitComment} tabIndex={0}>
          <div className="relative flex items-center justify-between px-4 py-4 shadow-mobile-top-nav md:px-10">
            <h2 className="absolute bottom-0 left-0 right-0 top-0 m-auto flex items-center justify-center text-xl font-bold">
              Create a post
            </h2>
            <button className="relative" type="button" onClick={() => closeModal()}>
              <CloseIcon className="h-6 w-6" />
            </button>
            <button
              className="relative rounded-2xl bg-color-brand-primary px-4 py-1 font-medium text-color-text-darkmode-primary disabled:bg-transparent disabled:text-color-text-lightmode-tertiary disabled:opacity-60 dark:disabled:text-color-text-darkmode-tertiary"
              type="submit"
              disabled={isDisabled}
            >
              Publish
            </button>
          </div>
          <div className="flex grow flex-col overflow-auto p-4 md:px-10 md:pb-10">
            <textarea
              disabled={isLoading}
              className="mb-2 min-h-[120px] flex-1 resize-none overflow-auto rounded-xl border-none bg-color-bg-lightmode-primary text-color-text-lightmode-primary outline-none focus:outline-none disabled:opacity-80 dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary"
              placeholder="What would you like to say?"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            {!!file && !imageUploadData?.url && (
              <div className="relative">
                <img src={URL.createObjectURL(file)} className="rounded-lg opacity-50" />
                <LoadSpinner className="absolute bottom-0 left-0 right-0 top-0 m-auto h-8 w-8 animate-spin text-color-brand-primary" />
              </div>
            )}
            {!!imageUploadData?.url && (
              <div className="relative">
                <img src={imageUploadData.url} className="rounded-lg" />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    resetImageUploadState();
                  }}
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-color-bg-lightmode-primary shadow-fab dark:bg-color-bg-darkmode-primary"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
          {!imageUploadData && (
            <div className="shrink-0 px-4 pb-8 pt-4 md:px-10">
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center font-medium md:text-lg"
              >
                <Photograph className="mr-2 h-4 w-4 md:h-6 md:w-6" /> Add a photo
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                className="background-none border-none outline-none focus:outline-none"
                disabled={isLoading}
                onChange={(event) => {
                  const selectedFile = event.target.files ? event.target.files[0] : null;
                  handleUploadImage(selectedFile);
                }}
              />
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}
