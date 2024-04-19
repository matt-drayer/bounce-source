import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import FormLogin from 'components/forms/FormLogin';
import Modal from 'components/modals/Modal';

export interface Props {
  isOpen: boolean;
  handleClose: (value: boolean) => void;
  isShowSignupLink?: boolean;
  toggleSignup?: () => void;
  isPreventClose?: boolean;
}

export default function ModalLogin({
  isOpen,
  handleClose,
  isShowSignupLink,
  toggleSignup,
  isPreventClose,
}: Props) {
  const [isCloseBlocked, setIsCloseBlocked] = React.useState(false);

  return (
    <Modal
      isOpen={isOpen}
      handleClose={() => {
        if (isCloseBlocked || isPreventClose) {
          return;
        }
        handleClose(true);
      }}
    >
      <FormLogin
        isShowSignupLink={isShowSignupLink}
        setIsCloseBlocked={setIsCloseBlocked}
        toggleSignup={toggleSignup}
      />
      {!isPreventClose && (
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-color-bg-lightmode-primary p-2 text-color-text-lightmode-primary transition-colors hover:bg-brand-gray-50 dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary"
          onClick={() => {
            if (isCloseBlocked) {
              return;
            }
            handleClose(true);
          }}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </Modal>
  );
}
