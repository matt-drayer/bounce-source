import { getClient } from 'services/server/airtable/tournaments/base';
import { TABLES } from 'services/server/airtable/tournaments/base';

export const fetchEventsByTournamentId = async (
  tournamentId: number,
): Promise<TournamentEvent[]> => {
  const client = getClient();

  return client<TournamentEvent>(TABLES.EVENTS)
    .select({
      filterByFormula: `{tournamentId} = '${tournamentId}'`,
    })
    .all()
    .then((records) => records.map((record) => ({ ...record.fields, airtableId: record.id })));
};
