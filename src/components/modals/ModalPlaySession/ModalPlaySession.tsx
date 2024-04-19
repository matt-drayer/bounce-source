import * as React from 'react';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';
import { useModal } from 'hooks/useModal';
import { useSafeArea } from 'hooks/useSafeArea';
import PlaySessionPage from 'screens/PlaySessionPage';
import Modal from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';

interface Props {
  playSessionId: string | null;
  closeModal: () => void;
  fetchPlaySessions: () => void;
}

export default function ModalPlaySession({ playSessionId, closeModal, fetchPlaySessions }: Props) {
  const isOpen = !!playSessionId;
  return (
    <Modal
      isOpen={isOpen}
      handleClose={closeModal}
      classNameMaxWidth="max-w-2xl"
      classNamePosition="fixed bottom-0 sm:relative h-full"
      classNameHeight="h-full sm:py-6"
      className={classNames(
        'sm:max-h-[720px]',
        getIsNativePlatform()
          ? 'max-h-[calc(100vh_-_56px_-_var(--sat))]'
          : 'max-h-[calc(100%_-_56px)]', // NOTE: For mobile, assuming a good height of the phone browser input
      )}
    >
      {/**
       * @note using isOpen here so it forces a render of the page
       */}
      {isOpen && (
        <PlaySessionPage
          isModal
          isNewPlaySession={false}
          injectedPlaySessionId={playSessionId}
          closeModal={closeModal}
          fetchPlaySessions={fetchPlaySessions}
        />
      )}
    </Modal>
  );
}
