import { PostRequestPayload as TriplesPostRequestPayload } from 'constants/payloads/tournamentsTriplesTournament';
import { Tournament } from 'constants/tournaments';
import { getClient } from 'services/server/airtable/base';
import { CONFIG } from 'services/server/airtable/config';

export const fetchTripleTournamentBySlug = async (slug: string) => {
  const client = getClient();

  const [tournament] = await client(CONFIG.tables.tripleTournament)
    .select({
      filterByFormula: `{Slug} = "${slug}"`,
    })
    .all();

  return { id: tournament.getId(), ...tournament.fields } as any;
};

export const fetchTripleTournamentById = async (id: string) => {
  const client = getClient();

  const tournament = await client(CONFIG.tables.tripleTournament).find(id);

  return { id: tournament.getId(), ...tournament.fields } as unknown as Tournament;
};

export const createTripleTournamentTeam = async (team: TriplesPostRequestPayload) => {
  const client = getClient();

  await client(CONFIG.tables.tripleTournamentTeams).create({
    'Lead full name': team.name,
    'Lead email': team.email.toLowerCase(),
    'Member 1 full name': team.member1,
    'Member 2 full name': team.member2,
    'Member 3 full name': team.member3,
    Tournament: [team.tournamentId],
  });
};

export const fetchTripleTournamentTeams = async (tournamentId: string) => {
  const client = getClient();

  return client(CONFIG.tables.tripleTournamentTeams)
    .select({
      filterByFormula: `{Tournament} = '${tournamentId}'`,
    })
    .all();
};
