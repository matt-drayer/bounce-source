import { Match } from 'constants/dupr';
import { getClient } from 'services/server/airtable/base';
import { CONFIG } from 'services/server/airtable/config';
import { matchToModel } from 'services/server/airtable/mappers';

export const createMatch = async (match: Omit<Match, 'id'>): Promise<void> => {
  const client = getClient();

  await client(CONFIG.tables.matches).create({
    Bracket: match.bracket,
    'Club id': match.clubId.toString(),
    Event: match.event,
    Format: match.format,
    Identifier: match.identifier,
    Location: match.location,
    'Match date': match.matchDate,
    Source: match.matchSource,
    Type: match.matchType,
    Teams: JSON.stringify(match.teams),
  });
};

export const fetchMatches = async (): Promise<Match[]> => {
  const client = getClient();

  return client(CONFIG.tables.matches)
    .select()
    .all()
    .then((records) => records.map((record) => matchToModel(record.fields)));
};
