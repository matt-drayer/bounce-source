import { PaymentFulfillmentChannelsEnum } from 'types/generated/client';
import { Params, createLessonPayment } from './createLessonPayment';

type OffPlatformParams = Omit<Params, 'paymentFulfillmentChannel'>;

export const createLessonOffPlatformPayment = async (params: OffPlatformParams) => {
  return createLessonPayment({
    ...params,
    paymentFulfillmentChannel: PaymentFulfillmentChannelsEnum.OffPlatform,
  });
};
