import Airtable from 'airtable';

export enum TABLES {
  TEAMS = 'tblMOiOXDxK8cOSv4',
  TOURNAMENTS = 'tblwaNTVwgVBA9Fk0',
  VENUES = 'tbl5hIc4WK2hdWYSs',
  PLAYER_ACCOUNTS = 'tblW2YWY6aqzS9tDl',
  REGISTRATIONS = 'tbl3f6s9dhliDQNFC',
  EVENTS = 'tblOzBZrBFB4abAxl',
  POOLS = 'tblN9Mz1LPvuW4hEk',
  MATCHES = 'tblBsPPJSFS8pZwHO',
  GAMES = 'tbldQtslF1IgHG7RF',
}

export const BASE = 'app5DOJrTussIGmvQ';

export const getClient = (
  options = {
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.TOURNAMENTS_AIRTABLE_SECRET_KEY,
  },
) => {
  Airtable.configure(options);

  return Airtable.base(BASE);
};
