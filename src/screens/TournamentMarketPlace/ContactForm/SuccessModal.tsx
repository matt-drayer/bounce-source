import React from 'react';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import CloseIcon from 'svg/CloseIcon';
import SuccessIcon from 'svg/SuccessIcon';
import { ButtonText } from 'components/Button';
import Modal from 'components/modals/Modal/Modal';

interface Props {
  isOpen: boolean;
  setRequestStatus: React.Dispatch<React.SetStateAction<RequestStatus>>;
  closeModal: () => void;
}

export default function SuccessModal({ isOpen, setRequestStatus, closeModal }: Props) {
  const handleClose = () => {
    closeModal();
    setRequestStatus(RequestStatus.Idle);
  };
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      classNameRounded="rounded-t-3xl sm:rounded-2xl"
      classNamePosition="relative"
      classNameMaxWidth="max-w-xl"
    >
      <div className="border-radius-20 relative flex h-[320px] grow flex-col items-center justify-center bg-white shadow-lg">
        <div className="absolute right-0 top-0 mr-4 mt-4">
          <ButtonText onClick={handleClose} className="p-2">
            <CloseIcon className="h-6 w-6" />
          </ButtonText>
        </div>
        <SuccessIcon className="h-32 w-32" />
        <p className="typography-product-display text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Received!
        </p>
        <p className=" typography-product-body text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          Our team has received your request. We'll be in touch shortly.
        </p>
      </div>
    </Modal>
  );
}
