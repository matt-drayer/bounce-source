import { CommnuncationTemplate } from 'services/server/notifications/helpers/types';
import {
  DEFAULT_TRANSACTIONAL_FROM_EMAIL,
  DEFAULT_TRANSACTIONAL_FROM_NAME,
  PLAY_SESSION_START_REMINDER_ID,
} from 'services/server/sendgrid/constants';
import { sendTransactionalTemplate } from 'services/server/sendgrid/sendTransactionalTemplate';

interface Payload {
  playSessionStartDateTime: string;
  playSessionName: string;
  playSessionType: string;
}

export type EmailParams = CommnuncationTemplate<Payload>;

export const sendPlaySessionStartReminder = (params: EmailParams) => {
  return sendTransactionalTemplate({
    templateId: PLAY_SESSION_START_REMINDER_ID,
    from: {
      email: DEFAULT_TRANSACTIONAL_FROM_EMAIL,
      name: DEFAULT_TRANSACTIONAL_FROM_NAME,
    },
    to: params.to.email,
    dynamicTemplateData: {
      playSessionStartDateTime: params.payload.playSessionStartDateTime,
      playSessionName: params.payload.playSessionName,
      playSessionType: params.payload.playSessionType,
    },
  });
};
