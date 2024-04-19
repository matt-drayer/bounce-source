import * as React from 'react';
import { PLAY_PAGE } from 'constants/pages';
import { PaymentFulfillmentChannelsEnum } from 'types/generated/client';
import CheckCircle from 'svg/CheckCircle';
import Link from 'components/Link';
import Modal from 'components/modals/Modal';
import ModalTitle from 'components/modals/ModalTitle';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  displayRefundPrice: string;
  isPlayerCancelRefundable: boolean;
  paymentFulfillmentChannel?: PaymentFulfillmentChannelsEnum;
}

const ModalPlayerCancelComplete: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  displayRefundPrice,
  isPlayerCancelRefundable,
  paymentFulfillmentChannel,
}) => {
  const isOnPlatform =
    !paymentFulfillmentChannel ||
    paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.OnPlatform;

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
              Your lesson has been canceled. We hope you can make it next time.
            </div>
          </div>
          {isPlayerCancelRefundable && isOnPlatform && (
            <div className="text-base font-semibold leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              You should receive your refund
              {!!displayRefundPrice && ` of (${displayRefundPrice})`} within 7 working days.
            </div>
          )}
          {!isOnPlatform && (
            <div className="text-base font-semibold leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Since your payment for the lesson was not through Bounce, you must request a refund
              from the coach.
            </div>
          )}
          <div className="text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            Thank you for using Bounce. You can book another lesson by clicking below.
          </div>
          <div className="flex w-full flex-col space-y-4">
            <Link href={PLAY_PAGE} className="button-rounded-full-primary">
              Done
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPlayerCancelComplete;
