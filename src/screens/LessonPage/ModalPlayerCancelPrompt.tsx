import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import toast from 'react-hot-toast';
import { GetLessonParticipantOrderDetailsQuery } from 'types/generated/client';
import { PaymentFulfillmentChannelsEnum } from 'types/generated/client';
import api from 'services/client/api';
import { convertMinutesToHours } from 'utils/shared/time/convertMinutesToHours';
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
  participantOrderDetails?: GetLessonParticipantOrderDetailsQuery;
  participantOrderDetailsLoading: boolean;
  participantOrderDetailsCalled: boolean;
  displayRefundPrice: string;
  isPlayerCancelRefundable: boolean;
  startTimeDifferenceMinutes: number;
  paymentFulfillmentChannel?: PaymentFulfillmentChannelsEnum;
}

const ModalPlayerCancelPrompt: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  lessonId,
  handleCancelComplete,
  displayRefundPrice,
  isPlayerCancelRefundable,
  startTimeDifferenceMinutes,
  paymentFulfillmentChannel,
}) => {
  const viewer = useViewer();
  const [isLoading, setIsLoading] = React.useState(false);
  const timeDifferenceDisplay = convertMinutesToHours(startTimeDifferenceMinutes).toFixed(1);
  const isOnPlatform =
    !paymentFulfillmentChannel ||
    paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.OnPlatform;

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
              {isOnPlatform ? (
                <div className="ml-3 text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  Cancel 24 hours before the lesson and receive a full refund
                  {!!displayRefundPrice && ` (${displayRefundPrice})`}.
                </div>
              ) : (
                <div className="ml-3 text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  You must request a refund with a coach since the payment was not processed through
                  Bounce.
                </div>
              )}
            </div>
            <div className="flex">
              <div className="h-5 w-5 text-color-error">
                <WarnExclamation className="h-full" />
              </div>
              {isOnPlatform ? (
                <div className="ml-3 text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  No refund if you cancel within 24hrs of the lesson.
                </div>
              ) : (
                <div className="ml-3 text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  Bounce is not responsible for refunds on payments made outside the platform or to
                  the coach directly.
                </div>
              )}
            </div>
            <div className="text-base font-semibold leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              There are {timeDifferenceDisplay} hours until your lesson.{' '}
              {isPlayerCancelRefundable &&
                isOnPlatform &&
                `Cancel now and receive a full refund${
                  !!displayRefundPrice && ` (${displayRefundPrice})`
                }.`}
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
                    await api.post(`v1/lessons/${lessonId}/participant/leave`, {
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

export default ModalPlayerCancelPrompt;
