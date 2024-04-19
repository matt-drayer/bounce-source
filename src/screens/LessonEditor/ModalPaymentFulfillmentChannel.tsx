import * as React from 'react';
import { RadioGroup } from '@headlessui/react';
import { paymentFulfillChannelsCoach } from 'constants/payments';
import { PaymentFulfillmentChannelsEnum } from 'types/generated/client';
import CloseIcon from 'svg/CloseIcon';
import Modal from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';

const paymentFulfillmentChannelsOrder = [
  PaymentFulfillmentChannelsEnum.OnPlatform,
  PaymentFulfillmentChannelsEnum.OffPlatform,
  PaymentFulfillmentChannelsEnum.ParticipantsChoice,
];

const paymentFulfillmentChannels = [
  paymentFulfillChannelsCoach[PaymentFulfillmentChannelsEnum.OnPlatform],
  paymentFulfillChannelsCoach[PaymentFulfillmentChannelsEnum.OffPlatform],
  paymentFulfillChannelsCoach[PaymentFulfillmentChannelsEnum.ParticipantsChoice],
];

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  paymentFulfillmentChannel: PaymentFulfillmentChannelsEnum;
  setPaymentFulfillmentChannel: (paymentFulfillmentChannel: PaymentFulfillmentChannelsEnum) => void;
}

const ModalPaymentFulfillmentChannel: React.FC<Props> = ({
  isOpen,
  handleClose,
  paymentFulfillmentChannel,
  setPaymentFulfillmentChannel,
}) => {
  const [selectedPaymentIndex, setSelectedPaymentIndex] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      const indexOfPreviousSelection =
        paymentFulfillmentChannelsOrder.indexOf(paymentFulfillmentChannel);

      if (indexOfPreviousSelection > -1) {
        setSelectedPaymentIndex(indexOfPreviousSelection);
      }
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} handleClose={() => handleClose()}>
      <div className="p-6">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            Payment options
          </h3>
          <button
            className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            type="button"
            onClick={() => handleClose()}
          >
            <CloseIcon />
          </button>
        </div>
        <div>
          <RadioGroup value={selectedPaymentIndex} onChange={setSelectedPaymentIndex}>
            <div className="space-y-3">
              {paymentFulfillmentChannels.map((option, index) => {
                const { name, Logo, description } = option;
                const title = name ? name : Logo ? <Logo /> : '';

                return (
                  <RadioGroup.Option
                    key={index}
                    value={index}
                    className={({ checked }) =>
                      classNames(
                        checked
                          ? 'border-color-brand-primary bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary'
                          : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                        'mt-6 flex cursor-pointer flex-col rounded-md border px-4 py-3 focus:outline-none',
                      )
                    }
                  >
                    {({ active, checked }) => (
                      <div className="flex w-full">
                        <div className="flex">
                          <span
                            className={classNames(
                              checked
                                ? 'border-transparent bg-color-brand-primary'
                                : 'border-gray-300 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                              active ? 'ring-2 ring-color-brand-primary ring-offset-2' : '',
                              'flex h-5 w-5 items-center justify-center rounded-full border',
                            )}
                            aria-hidden="true"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                          </span>
                        </div>
                        <div className="ml-4">
                          <RadioGroup.Label className="block text-base leading-none">
                            {title}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="div"
                            className="mt-2 text-xs leading-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
                          >
                            {description}
                          </RadioGroup.Description>
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                );
              })}
            </div>
          </RadioGroup>
          <div className="mt-8">
            <button
              onClick={() => {
                const selectedChannel = paymentFulfillmentChannelsOrder[selectedPaymentIndex];
                setPaymentFulfillmentChannel(selectedChannel);
                handleClose();
              }}
              className="button-rounded-full-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPaymentFulfillmentChannel;
