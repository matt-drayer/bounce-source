import Airtable from 'airtable';
import { CONFIG } from 'services/server/airtable/config';

export const getClient = (
  options = {
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_SECRET_KEY,
  },
) => {
  Airtable.configure(options);

  return Airtable.base(CONFIG.base);
};

export const baseFetchAll = async (table: string) => {
  const client = getClient();

  return client(table).select().all();
};

export const fetchById = async (table: string, id: string) => {
  const client = getClient();

  return client(table).find(id);
};
