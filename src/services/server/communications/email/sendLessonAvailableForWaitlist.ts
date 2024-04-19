import { CommnuncationTemplate } from 'services/server/notifications/helpers/types';
import {
  DEFAULT_TRANSACTIONAL_FROM_EMAIL,
  DEFAULT_TRANSACTIONAL_FROM_NAME,
  LESSON_AVAILABLE_FOR_WAITLIST_ID,
} from 'services/server/sendgrid/constants';
import { sendTransactionalTemplate } from 'services/server/sendgrid/sendTransactionalTemplate';

interface Payload {
  startDateTime: string;
  lessonName: string;
  lessonId: string;
}

export type EmailParams = CommnuncationTemplate<Payload>;

export const sendLessonAvailableForWaitlist = async (params: EmailParams) => {
  const resp = await sendTransactionalTemplate({
    templateId: LESSON_AVAILABLE_FOR_WAITLIST_ID,
    from: {
      email: DEFAULT_TRANSACTIONAL_FROM_EMAIL,
      name: DEFAULT_TRANSACTIONAL_FROM_NAME,
    },
    to: params.to.email,
    dynamicTemplateData: {
      startDateTime: params.payload.startDateTime,
      lessonName: params.payload.lessonName,
      lessonId: params.payload.lessonId,
    },
  });

  console.log('-- sendLessonAvailableForWaitlist --', resp);
  return resp;
};
