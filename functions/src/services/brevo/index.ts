import * as SibApiV3Sdk from '@sendinblue/client';

const ACCOUNT_CREATE_TEMPLATE_ID = 38;
enum ListIds {
  AllUsers = 7,
  RegisteredUsers = 8,
}

const getContactsApiInstance = () => {
  const apiInstance = new SibApiV3Sdk.ContactsApi();

  apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);
  apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.partnerKey, process.env.BREVO_API_KEY!);

  return apiInstance;
};

const getTransactionalApiInstance = () => {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY!,
  );
  apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.partnerKey,
    process.env.BREVO_API_KEY!,
  );

  return apiInstance;
};

export const addUserEmailToProvider = async (email: string) => {
  const apiInstance = getContactsApiInstance();

  await apiInstance.createContact({
    email: email,
    listIds: [ListIds.AllUsers, ListIds.RegisteredUsers],
    updateEnabled: true,
    emailBlacklisted: false,
    smsBlacklisted: false,
    attributes: {},
    smtpBlacklistSender: [],
  });

  return;
};

export const sendWelcomeEmail = async (email: string, name?: string) => {
  const apiInstance = getTransactionalApiInstance();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.templateId = ACCOUNT_CREATE_TEMPLATE_ID;
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.params = {
    name,
  };

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};
