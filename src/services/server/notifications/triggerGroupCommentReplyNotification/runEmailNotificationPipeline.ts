import { sendGroupCommentReply } from 'services/server/communications/email/sendGroupCommentReply';
import { EmailParams } from 'services/server/communications/email/sendGroupCommentReply';
import { CommunicationParams } from './params';
import { transformInputToEmail } from './transformers';
import { getIsCommunicationEnabled } from '../helpers/getIsCommunicationEnabled';

const PREFERENCE_KEY = '';

const filterActiveSubscribers = async (
  items: EmailParams[],
  { communicationPreferences }: CommunicationParams,
) => {
  const communicationPrefrencesByIndex = await Promise.all(
    items.map(
      // NOTE: Need to add a preference for this
      (item) => Promise.resolve(true),
      // getIsCommunicationEnabled({
      //   userId: item.to.userId,
      //   preferenceKey: PREFERENCE_KEY,
      //   communicationPreferences,
      // }),
    ),
  );
  return items.filter((_item, index) => communicationPrefrencesByIndex[index]);
};

const send = async (items: EmailParams[]) => {
  const sendPromises = items.map((item) => sendGroupCommentReply(item)); // TODO: GET NEW EMAIL TEMPLATE
  await Promise.all(sendPromises);
  return;
};

export const runEmailNotificationPipeline = async (params: CommunicationParams) => {
  const payload = await transformInputToEmail(params);
  const notificationsToSend = await filterActiveSubscribers(payload, params);

  if (notificationsToSend?.length > 0) {
    await send(notificationsToSend);
  }

  return;
};
