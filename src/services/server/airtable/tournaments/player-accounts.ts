import { format } from 'date-fns';
import { getClient } from 'services/server/airtable/tournaments/base';
import { TABLES } from 'services/server/airtable/tournaments/base';

export const fetchPlayerAccountByBounceId = async (bounceId: string): Promise<PlayerAccount> => {
  const client = getClient();

  const [playerAccount] = await client<PlayerAccount>(TABLES.PLAYER_ACCOUNTS)
    .select({
      filterByFormula: `{bounceId} = '${bounceId}'`,
    })
    .all()
    .then((records) => records.map((record) => ({ ...record.fields, airtableId: record.id })));

  return playerAccount;
};

export const createPlayerAccount = async (data: Partial<PlayerAccount>): Promise<PlayerAccount> => {
  const client = getClient();

  return client<PlayerAccount>(TABLES.PLAYER_ACCOUNTS)
    .create({
      bounceId: data.bounceId,
      userName: data.userName,
      fullName: data.fullName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      gender: data.gender,
      duprId: data.duprId,
      duprFullName: data.duprFullName,
      duprDoublesRating: data.duprDoublesRating,
      duprSinglesRating: data.duprSinglesRating,
    })
    .then((record) => ({ ...record.fields, airtableId: record.id }));
};

export const updateAccountDetails = async (data: Partial<PlayerAccount>): Promise<void> => {
  const client = getClient();

  await client(TABLES.PLAYER_ACCOUNTS).update([
    {
      id: data.airtableId as string,
      fields: {
        birthDate: format(new Date(data.birthDate as string), 'MM-dd-yyyy'),
        phoneNumber: data.phoneNumber,
        instagramHandle: data.instagramHandle,
        shirtSize: data.shirtSize,
      },
    },
  ]);
};
