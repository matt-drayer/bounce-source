import { fetchEventsByTournamentId } from 'services/server/airtable/tournaments/events';
import { fetchRegistrationsByTournamentId } from 'services/server/airtable/tournaments/registrations';
import { fetchTournamentByAirtableId } from 'services/server/airtable/tournaments/tournaments';
import { createTeamName } from 'utils/shared/string/createTeamName';
import { TABLES, getClient } from './base';

export const fetchTeams = async (): Promise<Team[]> => {
  const client = getClient();

  return client(TABLES.TEAMS)
    .select()
    .all()
    .then((records) => records.map((record) => record.fields)) as unknown as Team[];
};

export const fetchTeamsByTournamentId = async (tournamentId: number): Promise<Team[]> => {
  const client = getClient();

  return client(TABLES.TEAMS)
    .select({
      filterByFormula: `{tournamentId} = '${tournamentId}'`,
    })
    .all()
    .then((records) =>
      records.map((record) => ({ ...record.fields, airtableId: record.id })),
    ) as unknown as Team[];
};

export const createTeam = async (data: any): Promise<Team> => {
  const client = getClient();

  return client(TABLES.TEAMS)
    .create(data)
    .then((record: any) => ({ ...record.fields, airtableId: record.id })) as unknown as Team;
};

export const createTeams = async (tournamentId: string) => {
  const tournament = await fetchTournamentByAirtableId(tournamentId);
  const events = await fetchEventsByTournamentId(tournament.id);

  const existingTeams = await fetchTeamsByTournamentId(tournament.id);
  const registrations = await fetchRegistrationsByTournamentId(tournament.id);

  await Promise.all(
    registrations.map(async (registration) => {
      const primaryPartner = registrations.find(
        ({ email }) => registration.primaryPartnerEmail === email[0],
      );

      const secondaryPartner = registrations.find(
        ({ email }) => registration.secondaryPartnerEmail === email[0],
      );

      const primaryEvent = events.find(
        ({ airtableId }) => airtableId === registration.primaryEvent[0],
      ) as TournamentEvent;

      await createTeam({
        player1Id: registration.airtableId ? [registration.airtableId] : [],
        player2Id: primaryPartner?.airtableId ? [primaryPartner?.airtableId] : [],
        tournamentId: [tournamentId],
        teamName: createTeamName({
          firstName: registration.firstName,
          lastName: registration.lastName,
          partnerFirstName: primaryPartner?.firstName,
          partnerLastName: primaryPartner?.lastName,
        }),
        eventId: [primaryEvent.airtableId],
      });

      if (secondaryPartner) {
        const secondaryEvent = events.find(
          ({ airtableId }) => airtableId === registration.secondaryEvent[0],
        ) as TournamentEvent;

        await createTeam({
          player1Id: [registration.airtableId],
          player2Id: [secondaryPartner.airtableId],
          tournamentId: [tournamentId],
          teamName: createTeamName({
            firstName: registration.firstName,
            lastName: registration.lastName,
            partnerFirstName: secondaryPartner.firstName,
            partnerLastName: secondaryPartner.lastName,
          }),
          eventId: [secondaryEvent.airtableId],
        });
      }
    }),
  );
};
