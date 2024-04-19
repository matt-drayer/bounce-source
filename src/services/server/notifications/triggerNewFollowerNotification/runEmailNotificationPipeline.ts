import { UserNotificationsInsertInput } from 'types/generated/server';
import { CommunicationParams } from './params';
import { getIsCommunicationEnabled } from '../helpers/getIsCommunicationEnabled';
import { CommnuncationTemplate } from '../helpers/types';

interface NotificationPayload extends UserNotificationsInsertInput {}

type NotificationTypedTemplate = CommnuncationTemplate<NotificationPayload>;

const PREFERENCE_KEY = 'newFollowerEmail';

// TODO: Move to a transforms.ts file
const transform = async (_params: CommunicationParams): Promise<NotificationTypedTemplate[]> => {
  return [
    {
      to: {
        userId: '',
        email: '',
        fullName: '',
        preferredName: '',
      },
      payload: {},
    },
  ];
};

const filterActiveSubscribers = async (
  items: NotificationTypedTemplate[],
  { communicationPreferences }: CommunicationParams,
) => {
  const communicationPrefrencesByIndex = await Promise.all(
    items.map((item) =>
      getIsCommunicationEnabled({
        userId: item.to.userId,
        preferenceKey: PREFERENCE_KEY,
        communicationPreferences,
      }),
    ),
  );
  return items.filter((_item, index) => communicationPrefrencesByIndex[index]);
};

const send = async (items: NotificationTypedTemplate[]) => {
  // NOTE: Stub for now, need email provider;
  return;
};

export const runEmailNotificationPipeline = async (params: CommunicationParams) => {
  const payload = await transform(params);
  const notificationsToSend = await filterActiveSubscribers(payload, params);

  if (notificationsToSend?.length > 0) {
    await send(notificationsToSend);
  }

  return;
};
