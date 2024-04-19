import { Tournament } from 'constants/tournaments';
import { TABLES, getClient } from './base';

const mapTournament = (record: any): Tournament => {
  return {
    ...record.fields,
    airtableId: record.id,
    format: JSON.parse(record.fields.format),
    eventTypes: JSON.parse(record.fields.eventTypes),
    prizes: JSON.parse(record.fields.prizes),
    faq: JSON.parse(record.fields.faq),
    fee: JSON.parse(record.fields.fee),
  };
};

export const fetchTournaments = async (): Promise<Tournament[]> => {
  const client = getClient();

  return client(TABLES.TOURNAMENTS)
    .select()
    .all()
    .then((records) => records.map(mapTournament));
};

export const fetchTournamentBySlug = async (slug: string): Promise<Tournament> => {
  const client = getClient();

  return client(TABLES.TOURNAMENTS)
    .select({
      filterByFormula: `{slug} = '${slug}'`,
    })
    .all()
    .then((records) => records.map(mapTournament))
    .then((tours) => tours?.[0]);
};

export const fetchTournamentByAirtableId = async (id: string): Promise<Tournament> => {
  const client = getClient();

  return client(TABLES.TOURNAMENTS).find(id).then(mapTournament);
};
