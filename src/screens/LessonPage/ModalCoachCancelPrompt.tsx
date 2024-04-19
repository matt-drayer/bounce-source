import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import toast from 'react-hot-toast';
import api from 'services/client/api';
import { useViewer } from 'hooks/useViewer';
import ReceiptRefund from 'svg/ReceiptRefund';
import WarnExclamation from 'svg/WarnExclamation';
import Modal from 'components/modals/Modal';
import ModalTitle from 'components/modals/ModalTitle';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  lessonId: string;
  handleCancelComplete: () => void;
}

const ModalCoachCancelPrompt: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  lessonId,
  handleCancelComplete,
}) => {
  const viewer = useViewer();
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <>
      <Modal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <div className="p-6">
          <ModalTitle>Cancellation policy</ModalTitle>
          <div className="mt-6 space-y-6">
            <div className="flex">
              <div className="h-5 w-5 text-color-success">
                <ReceiptRefund className="h-full" />
              </div>
              <div className="ml-3 text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                When you cancel a lesson, all players who have booked that lesson through Bounce
                will receive a full refund immediately. For players that paid you directly, it is up
                to you to refund them outside of Avantage.
              </div>
            </div>
            <div className="flex">
              <div className="h-5 w-5 text-color-error">
                <WarnExclamation className="h-full" />
              </div>
              <div className="ml-3 text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                We encourage you not to cancel lessons as this could damage your reputation as a top
                coach.
              </div>
            </div>
            <div className="text-base font-semibold leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Cancel now and refund all participants.
            </div>
            <div className="flex w-full flex-col space-y-4">
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="button-rounded-full-primary-inverted"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const idToken = await viewer?.viewer?.getIdToken();
                    await api.post(`v1/lessons/${lessonId}/coach/cancel`, {
                      payload: {
                        token: idToken || '',
                        lessonId,
                      },
                    });
                    handleCancelComplete();
                  } catch (error) {
                    // @ts-ignore
                    toast.error(error.message);
                    Sentry.captureException(error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                type="button"
                className="button-rounded-full-primary"
                disabled={isLoading}
              >
                Cancel now
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalCoachCancelPrompt;
