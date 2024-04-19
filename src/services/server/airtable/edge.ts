import { Tournament } from 'constants/tournaments';
import ApiService from 'services/server/ApiService';
import { baseTournamentToModel } from 'services/server/airtable/edge-mappers';
import { CONFIG } from './config';

const AIRTABLE_API_KEY = process.env.AIRTABLE_SECRET_KEY; // replace with your API key
const AIRTABLE_BASE_ID = CONFIG.base; // replace with your Base ID

const api = new ApiService({
  baseUrl: 'https://api.airtable.com/v0/',
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const fetchTournamentById = async (id: string) => {
  const record = await api.get(`/${AIRTABLE_BASE_ID}/${CONFIG.tables.tournaments}/${id}`);
  return { id: record.id, ...record.fields } as Tournament;
};

export const fetchTriplesTournamentById = async (id: string) => {
  const record = await api.get(`/${AIRTABLE_BASE_ID}/${CONFIG.tables.tripleTournament}/${id}`);
  return { id: record.id, ...record.fields } as Tournament;
};

export const fetchTournaments = async () => {
  const tournamentRecords = await api.get(`/${AIRTABLE_BASE_ID}/${CONFIG.tables.tournaments}`);

  const tournaments = tournamentRecords.records.map((record: any) => ({
    ...record.fields,
    id: record.id,
  })) as Tournament[];

  return tournaments.map((tournament) => baseTournamentToModel(tournament));
};
