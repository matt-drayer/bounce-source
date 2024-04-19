import * as SibApiV3Sdk from '@sendinblue/client';

export const BrevoAttributes = {
  FirstName: 'FIRSTNAME',
  LastName: 'LASTNAME',
};

enum ListIds {
  AllTournaments = 5,
}

const TOURNAMENT_REGISTRATION_TEMPLATE_ID = 57;
const TOURNAMENT_PARTNER_INVITE_TEMPLATE_ID = 58;

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

interface AddToListParams {
  email: string;
  listIds?: number[];
  attributes?: Record<string, string | number>;
}
export const addUserEmailToLists = async ({
  email,
  listIds = [],
  attributes = {},
}: AddToListParams) => {
  const apiInstance = getContactsApiInstance();

  await apiInstance.createContact({
    email: email,
    listIds: listIds,
    updateEnabled: true,
    emailBlacklisted: false,
    smsBlacklisted: false,
    attributes,
    smtpBlacklistSender: [],
  });

  return;
};

export const addUserToTournamentList = async ({
  email,
  listIds = [],
  attributes = {},
}: AddToListParams) => {
  return addUserEmailToLists({
    email: email,
    listIds: [ListIds.AllTournaments, ...listIds],
    attributes,
  });
};

const INTERNAL_NOTIFICATION_TEMPLATE_ID = 9;
const TEAM_EMAIL = 'team@bounce.game';
export const sendInternalNotification = async ({
  subject,
  message,
}: {
  subject: string;
  message: string;
}) => {
  const apiInstance = getTransactionalApiInstance();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.templateId = INTERNAL_NOTIFICATION_TEMPLATE_ID;
  sendSmtpEmail.to = [{ email: TEAM_EMAIL, name: TEAM_EMAIL }];
  sendSmtpEmail.params = {
    subject,
    message,
  };

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const sendChampionSubmissionNotification = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  return sendInternalNotification({
    subject: 'Bounce Champion Submission',
    message: `A new champion has been submitted:\n\n${name}\n\n${email}`,
  });
};

interface TournamentRegistrationParams {
  toEmail: string;
  eventId: string;
  eventUrl: string;
  name: string;
  eventTitle: string;
  groups: {
    eventGroupsTitle: string;
    eventGroupsStartAt: string;
  }[];
  venueTitle: string;
  venueUrl: string;
  venueAddress: string;
  eventGroupsFormat: string;
  eventStartDate: string;
  eventEndDate: string;
}

export const sendTournamentRegistrationEmail = async ({
  toEmail,
  eventId,
  eventUrl,
  name,
  eventTitle,
  groups,
  venueTitle,
  venueUrl,
  venueAddress,
  eventGroupsFormat,
  eventStartDate,
  eventEndDate,
}: TournamentRegistrationParams) => {
  const apiInstance = getTransactionalApiInstance();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.templateId = TOURNAMENT_REGISTRATION_TEMPLATE_ID;
  sendSmtpEmail.to = [{ email: toEmail, name: name }];
  sendSmtpEmail.params = {
    eventId,
    eventUrl,
    name,
    eventTitle,
    groups,
    venueTitle,
    venueUrl,
    venueAddress,
    eventGroupsFormat,
    eventStartDate,
    eventEndDate,
  };

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const sendTournamentPartnerInvite = async ({
  toEmail,
  eventId,
  eventUrl,
  name,
  eventTitle,
  groups,
  venueTitle,
  venueUrl,
  venueAddress,
  eventGroupsFormat,
  eventStartDate,
  eventEndDate,
  inviteUrl,
}: TournamentRegistrationParams & { inviteUrl: string }) => {
  const apiInstance = getTransactionalApiInstance();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.templateId = TOURNAMENT_PARTNER_INVITE_TEMPLATE_ID;
  sendSmtpEmail.to = [{ email: toEmail, name: name }];
  sendSmtpEmail.params = {
    eventId,
    eventUrl,
    name,
    eventTitle,
    groups,
    venueTitle,
    venueUrl,
    venueAddress,
    eventGroupsFormat,
    eventStartDate,
    eventEndDate,
    inviteUrl,
  };

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const changeEmail = async ({
  oldEmail,
  newEmail,
}: {
  oldEmail: string;
  newEmail: string;
}) => {
  const apiInstance = getContactsApiInstance();
  const updateContact = new SibApiV3Sdk.UpdateContact();

  updateContact.attributes = { EMAIL: newEmail };

  return apiInstance.updateContact(oldEmail, updateContact);
};
