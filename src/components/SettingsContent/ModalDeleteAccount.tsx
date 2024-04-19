import * as React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import * as Sentry from '@sentry/nextjs';
import toast from 'react-hot-toast';
import { useViewer } from 'hooks/useViewer';
import Modal from 'components/modals/Modal';

interface Props {
  isOpen: boolean;
  handleClose: (value: boolean) => void;
  handleConfirm: () => void;
}

const ModalDeleteAccount: React.FC<Props> = ({ isOpen, handleClose, handleConfirm }) => {
  const viewer = useViewer();
  const [isInitializingOnboarding, setIsInitializingOnboarding] = React.useState(false);
  const [isCompletedFirstAttempt, setIsCompletedFirstAttempt] = React.useState(false);
  const [onboardingError, setOnboardingError] = React.useState<null | Error>(null);
  const isDisabled = isInitializingOnboarding;

  const handleCancelAccount = async () => {
    setIsInitializingOnboarding(true);
    try {
      const idToken = await viewer.viewer?.getIdToken(true);

      if (!idToken) {
        throw new Error('You must be logged in to add payout details');
      }

      setIsInitializingOnboarding(false);
      setIsCompletedFirstAttempt(false);

      handleConfirm();
    } catch (error) {
      const typedError = error as Error;
      setOnboardingError(typedError);
      setIsInitializingOnboarding(false);
      Sentry.captureException(typedError);
      toast.error(typedError.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen || isDisabled}
      handleClose={() => {
        if (!isInitializingOnboarding) {
          setIsInitializingOnboarding(false);
          setIsCompletedFirstAttempt(false);
          handleClose(false);
        }
      }}
    >
      <div className="h-full p-6">
        <div className="flex flex-col items-start justify-between">
          <div className="flex w-full items-start justify-between">
            <Dialog.Title
              as="h3"
              tabIndex={0}
              className="text-2xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            >
              Sorry to see you go!
            </Dialog.Title>
            <button
              type="button"
              className="rounded-md bg-color-bg-lightmode-primary text-color-text-lightmode-primary focus:outline-none focus:ring-2 focus:ring-color-checkbox-active focus:ring-offset-2 dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary"
              onClick={() => {
                if (!isInitializingOnboarding) {
                  setIsInitializingOnboarding(false);
                  setIsCompletedFirstAttempt(false);
                  handleClose(false);
                }
              }}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <p className="text-sm leading-5">
              The process to delete your account and all associated data can take up to 48 hours.
              You will receive a confirmation email once it is complete.
            </p>
            <p className="text-sm leading-5">You will be logged out once you submit the request.</p>
          </div>
          <div className="mt-8 w-full space-y-4">
            <button
              type="button"
              disabled={isDisabled}
              className="button-rounded-full-primary-inverted"
              onClick={() => handleClose(false)}
            >
              Nevermind, I want to stay
            </button>
            <button
              type="button"
              className="button-rounded-full-primary"
              disabled={isDisabled}
              onClick={handleCancelAccount}
            >
              {isInitializingOnboarding ? 'Sending request...' : 'Delete my account and data'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeleteAccount;
