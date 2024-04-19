import { sendPlaySessionParticipantJoin } from 'services/server/communications/email/sendPlaySessionParticipantJoin';
import { EmailParams } from 'services/server/communications/email/sendPlaySessionParticipantJoin';
import { CommunicationParams } from './params';
import { transformInputToEmail } from './transformers';
import { getIsCommunicationEnabled } from '../helpers/getIsCommunicationEnabled';

const PREFERENCE_KEY = 'playSessionParticipantJoinedEmail';

const filterActiveSubscribers = async (
  items: EmailParams[],
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

const send = async (items: EmailParams[]) => {
  console.log('+++++ ABOUT TO SEND EMAIL +++++', items);
  const sendPromises = items.map((item) => sendPlaySessionParticipantJoin(item)); // TODO: GET NEW EMAIL TEMPLATE
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
