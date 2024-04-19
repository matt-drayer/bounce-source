import { getClient } from 'services/server/airtable/tournaments/base';
import { TABLES } from 'services/server/airtable/tournaments/base';

export const fetchVenueByTournamentId = async (tournamentId: number): Promise<Venue> => {
  const client = getClient();

  return client(TABLES.VENUES)
    .select({
      filterByFormula: `FIND("${tournamentId}", {tournaments})`,
    })
    .all()
    .then((records) =>
      records.map((record) => ({
        ...record.fields,
        airtableId: record.id,
        surfaceTypes: JSON.parse(record.fields.surfaceTypes as any),
      })),
    )
    .then((venues) => venues?.[0]) as unknown as Venue;
};
