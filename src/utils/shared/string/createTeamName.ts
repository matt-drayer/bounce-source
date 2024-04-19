export const createTeamName = (opts: {
  firstName: string;
  lastName: string;
  partnerFirstName?: string;
  partnerLastName?: string;
}) => {
  return `${opts.firstName}${buildLastName(opts.lastName)} ${buildPartner(
    opts.partnerFirstName,
    opts.partnerLastName,
  )}`;
};

const buildLastName = (lastName?: string) => {
  if (!lastName) return '';

  return ` ${lastName[0][0]}.`;
};

const buildPartner = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return " & Partner hasn't registered";

  return ` & ${firstName} ${buildLastName(lastName)}`;
};
