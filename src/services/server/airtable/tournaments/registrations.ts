import { getClient } from 'services/server/airtable/tournaments/base';
import { TABLES } from 'services/server/airtable/tournaments/base';

export const createRegistration = async (data: any): Promise<Registration> => {
  const client = getClient();

  let payload = {
    playerAccountId: [data.playerAccountId as string],
    tournamentId: [data.tournamentId as string],
    primaryEvent: [data.primaryEvent],
    primaryPartnerEmail: data.primaryPartnerEmail,
  };

  if (data.secondaryEvent && data.secondaryPartnerEmail) {
    payload = {
      ...payload,
      // @ts-ignore
      secondaryEvent: [data.secondaryEvent as string],
      secondaryPartnerEmail: data.secondaryPartnerEmail,
    };
  }

  return client(TABLES.REGISTRATIONS)
    .create(payload)
    .then((record) => ({ ...record.fields, airtableId: record.id })) as unknown as Registration;
};

export const fetchRegistrationsByTournamentId = async (
  tournamentId: number,
): Promise<Registration[]> => {
  const client = getClient();

  return client<Registration>(TABLES.REGISTRATIONS)
    .select({
      filterByFormula: `{tournamentId} = '${tournamentId}'`,
    })
    .all()
    .then((records) => records.map((record) => ({ ...record.fields, airtableId: record.id })));
};
