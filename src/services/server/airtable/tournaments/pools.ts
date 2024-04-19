import { TABLES, getClient } from './base';

export const fetchPools = async (): Promise<Pool[]> => {
  const client = getClient();

  return client(TABLES.POOLS)
    .select()
    .all()
    .then((records) =>
      records.map((record) => ({ ...record.fields, airtableId: record.id })),
    ) as unknown as Pool[];
};

export const fetchPoolsByTournamentId = async (tournamentId: number): Promise<Pool[]> => {
  const client = getClient();

  return client(TABLES.POOLS)
    .select({
      filterByFormula: `{tournamentId} = '${tournamentId}'`,
    })
    .all()
    .then((records) =>
      records.map((record) => ({ ...record.fields, airtableId: record.id })),
    ) as unknown as Pool[];
};
