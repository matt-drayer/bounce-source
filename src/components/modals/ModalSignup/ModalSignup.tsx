import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { AccountType } from 'constants/user';
import FormSignup from 'components/forms/FormSignup';
import Modal from 'components/modals/Modal';

export interface Props {
  isOpen: boolean;
  handleClose: (value: boolean) => void;
  isShowLoginLink?: boolean;
  setAccountTypeParent?: (accountType: AccountType) => void;
  handleSignupSuccess?: ({ userId }: { userId: string }) => void | Promise<void>;
  toggleLogin?: () => void;
  defaultEmail?: string;
  defaultName?: string;
  title?: string;
  cta?: string;
  ignoreText?: string;
  ignoreAction?: () => void;
  isPreventClose?: boolean;
}

export default function ModalSignup({
  isOpen,
  handleClose,
  isShowLoginLink,
  handleSignupSuccess,
  toggleLogin,
  defaultEmail = '',
  defaultName = '',
  title,
  cta,
  ignoreText,
  ignoreAction,
  isPreventClose,
}: Props) {
  const [isCloseBlocked, setIsCloseBlocked] = React.useState(false);

  return (
    <Modal
      isOpen={isOpen}
      classNameMaxWidth="max-w-[37.5rem]"
      handleClose={() => {
        if (isCloseBlocked || isPreventClose) {
          return;
        }
        handleClose(true);
      }}
    >
      <FormSignup
        isShowLoginLink={isShowLoginLink}
        setIsCloseBlocked={setIsCloseBlocked}
        handleSignupSuccess={handleSignupSuccess}
        toggleLogin={toggleLogin}
        defaultEmail={defaultEmail}
        defaultName={defaultName}
        title={title}
        cta={cta}
        ignoreText={ignoreText}
        ignoreAction={ignoreAction}
      />
      {!isPreventClose && (
        <button
          type="button"
          className="absolute right-8 top-8 rounded-full bg-color-bg-lightmode-primary p-2 text-color-text-lightmode-primary transition-colors hover:bg-brand-gray-50 dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary"
          onClick={() => {
            if (isCloseBlocked) {
              return;
            }
            handleClose(true);
          }}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
    </Modal>
  );
}
