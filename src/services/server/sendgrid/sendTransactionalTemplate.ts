import { BaseTransactionalParams } from './constants';
import mailClient from './mailClient';

interface Params extends BaseTransactionalParams {}

export const sendTransactionalTemplate = ({
  to,
  templateId,
  from,
  dynamicTemplateData,
}: Params) => {
  return mailClient.send({
    to,
    from,
    templateId,
    dynamicTemplateData,
  });
};
