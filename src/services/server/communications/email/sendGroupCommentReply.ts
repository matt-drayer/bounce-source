import { CommnuncationTemplate } from 'services/server/notifications/helpers/types';
import {
  DEFAULT_TRANSACTIONAL_FROM_EMAIL,
  DEFAULT_TRANSACTIONAL_FROM_NAME,
  GROUP_COMMENT_SUBMITTED_ID,
} from 'services/server/sendgrid/constants';
import { sendTransactionalTemplate } from 'services/server/sendgrid/sendTransactionalTemplate';

interface Payload {
  groupTitle: string;
  participantFullName: string;
  newComment: string;
  originalComment: string;
}

export type EmailParams = CommnuncationTemplate<Payload>;

export const sendGroupCommentReply = (params: EmailParams) => {
  const resp = sendTransactionalTemplate({
    templateId: GROUP_COMMENT_SUBMITTED_ID,
    from: {
      email: DEFAULT_TRANSACTIONAL_FROM_EMAIL,
      name: DEFAULT_TRANSACTIONAL_FROM_NAME,
    },
    to: params.to.email,
    dynamicTemplateData: {
      groupTitle: params.payload.groupTitle,
      participantFullName: params.payload.participantFullName,
      newComment: params.payload.newComment,
      originalComment: params.payload.originalComment,
    },
  });

  console.log('-- sendGroupCommentReply --', resp);

  return resp;
};
