import { CommnuncationTemplate } from 'services/server/notifications/helpers/types';
import {
  DEFAULT_TRANSACTIONAL_FROM_EMAIL,
  DEFAULT_TRANSACTIONAL_FROM_NAME,
  LESSON_PARTICIPANT_JOIN_ID,
} from 'services/server/sendgrid/constants';
import { sendTransactionalTemplate } from 'services/server/sendgrid/sendTransactionalTemplate';

interface Payload {
  lessonStartDateTime: string;
  lessonName: string;
  lessonType: string;
  participantFullName: string;
}

export type Params = CommnuncationTemplate<Payload>;

export const sendParticipantJoinLesson = (params: Params) => {
  return sendTransactionalTemplate({
    templateId: LESSON_PARTICIPANT_JOIN_ID,
    from: {
      email: DEFAULT_TRANSACTIONAL_FROM_EMAIL,
      name: DEFAULT_TRANSACTIONAL_FROM_NAME,
    },
    to: params.to.email,
    dynamicTemplateData: {
      lessonStartDateTime: params.payload.lessonStartDateTime,
      lessonName: params.payload.lessonName,
      lessonType: params.payload.lessonType,
      participantFullName: params.payload.participantFullName,
    },
  });
};
