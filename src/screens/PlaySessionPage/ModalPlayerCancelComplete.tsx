import * as React from 'react';
import { PLAY_PAGE } from 'constants/pages';
import CheckCircle from 'svg/CheckCircle';
import Link from 'components/Link';
import Modal from 'components/modals/Modal';
import ModalTitle from 'components/modals/ModalTitle';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleCancelComplete: () => void;
}

const ModalPlayerCancelComplete: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  handleCancelComplete,
}) => {
  return (
    <Modal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
      <div className="p-6">
        <ModalTitle>Play session canceled</ModalTitle>
        <div className="mt-6 space-y-6">
          <div className="flex">
            <div className="h-5 w-5 text-color-success">
              <CheckCircle />
            </div>
            <div className="ml-3 text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              You have successfully left your play session.
            </div>
          </div>
          <div className="text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            Thank you for using Bounce. You can book another play session by clicking the button
            below.
          </div>
          <div className="flex w-full flex-col space-y-4">
            <button
              onClick={() => {
                setIsOpen(false);

                if (handleCancelComplete) {
                  handleCancelComplete();
                }
              }}
              className="button-rounded-full-primary"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPlayerCancelComplete;
