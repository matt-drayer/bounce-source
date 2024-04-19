import { PaymentFulfillmentChannelsEnum } from 'types/generated/client';
import { Params, createLessonPayment } from './createLessonPayment';

type OnPlatformParams = Omit<Params, 'paymentFulfillmentChannel'>;

export const createLessonOnPlatformPayment = async (params: OnPlatformParams) => {
  return createLessonPayment({
    ...params,
    paymentFulfillmentChannel: PaymentFulfillmentChannelsEnum.OnPlatform,
  });
};
