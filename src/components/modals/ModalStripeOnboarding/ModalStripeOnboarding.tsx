import * as React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { NEW_LESSON_PAGE } from 'constants/pages';
import { useGetCurrentUserLazyQuery } from 'types/generated/client';
import { initializeConnectOnboarding } from 'services/client/stripe/initializeConnectOnboarding';
import { useViewer } from 'hooks/useViewer';
import Modal from 'components/modals/Modal';

interface Props {
  isOpen: boolean;
  handleClose: (didAddBankInformation: boolean) => void;
}

const ADDED_DETAILS_TEXT = 'I have added my bank details';

const ModalStripeOnboarding: React.FC<Props> = ({ isOpen, handleClose }) => {
  const router = useRouter();
  const viewer = useViewer();
  const [isInitializingOnboarding, setIsInitializingOnboarding] = React.useState(false);
  const [isCompletedFirstAttempt, setIsCompletedFirstAttempt] = React.useState(false);
  const [queryFetch, queryResult] = useGetCurrentUserLazyQuery();
  const [onboardingError, setOnboardingError] = React.useState<null | Error>(null);
  const isDisabled = isInitializingOnboarding || queryResult.loading;

  const handleCreateOnboarding = async () => {
    setIsInitializingOnboarding(true);
    try {
      const idToken = await viewer.viewer?.getIdToken(true);

      if (!idToken) {
        throw new Error('You must be logged in to add payout details');
      }

      const { accountLink } = await initializeConnectOnboarding(idToken);
      setIsCompletedFirstAttempt(true);
      window.location.href = accountLink.url;
      setTimeout(() => {
        setIsInitializingOnboarding(false);
      }, 1000);
    } catch (error) {
      const typedError = error as Error;
      setOnboardingError(typedError);
      setIsInitializingOnboarding(false);
      Sentry.captureException(typedError);
      toast.error(typedError.message);
    }
  };

  const handleRefetchUser = async () => {
    setIsInitializingOnboarding(true);
    const { data } = await queryFetch({
      variables: { id: viewer.userId },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
    });
    setIsInitializingOnboarding(false);
    if (data?.usersByPk?.stripeMerchantDetailsSubmitted) {
      setIsCompletedFirstAttempt(false);
      handleClose(true);
      toast.success("Success! Bank details added. Let's get started");
      router.push(NEW_LESSON_PAGE);
    } else {
      toast.error("It looks like something hasn't been set up yet. Please try again.");
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
              Do you want Bounce to handle payments?
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
          {isCompletedFirstAttempt ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm leading-5">Return here once you've added your bank details</p>
              <p className="text-sm leading-5">
                Click the "{ADDED_DETAILS_TEXT}" button below to continue
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <p className="text-sm leading-5">
                Bounce uses Stripe to make sure you can collect your payments from players safely
                and securely. Alternatively, you can choose to use Bounce to manage scheduling while
                handling payments your own way.
              </p>
            </div>
          )}
          <div className="mt-8 w-full space-y-4">
            {!isInitializingOnboarding &&
              (isCompletedFirstAttempt ? (
                <button
                  type="button"
                  disabled={isDisabled}
                  className="button-rounded-full-primary-inverted"
                  onClick={handleRefetchUser}
                >
                  {ADDED_DETAILS_TEXT}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isDisabled}
                  className="button-rounded-full-primary-inverted"
                  onClick={() => handleClose(false)}
                >
                  I'll handle my own payments & refunds
                </button>
              ))}
            <button
              type="button"
              className="button-rounded-full-primary"
              disabled={isDisabled}
              onClick={handleCreateOnboarding}
            >
              {isInitializingOnboarding
                ? 'Getting started, please wait...'
                : isCompletedFirstAttempt
                ? 'Try adding bank details again'
                : 'Add bank details'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalStripeOnboarding;
