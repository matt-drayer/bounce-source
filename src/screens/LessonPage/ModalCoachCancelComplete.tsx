import * as React from 'react';
import { useRouter } from 'next/router';
import { HOME_PAGE } from 'constants/pages';
import CheckCircle from 'svg/CheckCircle';
import Modal from 'components/modals/Modal';
import ModalTitle from 'components/modals/ModalTitle';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ModalCoachCancelComplete: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
      <div className="p-6">
        <ModalTitle>Lesson canceled</ModalTitle>
        <div className="mt-6 space-y-6">
          <div className="flex">
            <div className="h-5 w-5 text-color-success">
              <CheckCircle />
            </div>
            <div className="ml-3 text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              You have successfully canceled your lesson.
            </div>
          </div>
          <div className="text-base font-semibold leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            We have notified all participants.
          </div>
          <div className="text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            Thank you for using Bounce.
          </div>
          <div className="text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            To help improve the Bounce experience we’d love to hear more about why you canceled,
            please reach out by clicking Contact us.
          </div>
          <div className="flex w-full flex-col space-y-4">
            <button
              onClick={() => {
                router.push(HOME_PAGE);
                setIsOpen(false);
              }}
              type="button"
              className="button-rounded-full-primary"
            >
              Back to my lessons
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCoachCancelComplete;
