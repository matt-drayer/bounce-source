import { PaymentFulfillmentChannelsEnum } from 'types/generated/client';
import api from 'services/client/api';
import { getAuthHeaders } from 'services/client/token';

export interface Params {
  lessonId: string;
  providerCardId?: string;
  paymentFulfillmentChannel: PaymentFulfillmentChannelsEnum;
}

export const createLessonPayment = async ({
  lessonId,
  providerCardId,
  paymentFulfillmentChannel,
}: Params) => {
  const headers = await getAuthHeaders();
  return api.post(`v1/lessons/${lessonId}/participant/pay`, {
    ...headers,
    payload: {
      providerCardId,
      paymentFulfillmentChannel,
    },
  });
};
