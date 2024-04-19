import { PaymentFulfillmentChannelsEnum } from 'types/generated/client';

interface Params {
  paymentFulfillmentChannel?: PaymentFulfillmentChannelsEnum | null;
  availableChannel?: PaymentFulfillmentChannelsEnum;
}

export const getIsFulfillmentChannelAllowed = async ({
  paymentFulfillmentChannel,
  availableChannel,
}: Params) => {
  // NOTE: Below assumes that if a channel isn't selected, it is meant to be on platform since the ability to use was added later and assumed to be the default
  if (!paymentFulfillmentChannel && !availableChannel) {
    return true;
  } else if (availableChannel === PaymentFulfillmentChannelsEnum.ParticipantsChoice) {
    return true;
  } else if (paymentFulfillmentChannel === availableChannel) {
    return true;
  } else {
    return false;
  }
};
