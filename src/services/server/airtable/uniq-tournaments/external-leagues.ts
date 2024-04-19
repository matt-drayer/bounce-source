import Airtable from 'airtable';
import { DuprInfo, HonchoTournament } from 'constants/tournaments';
import { CONFIG } from 'services/server/airtable/config';
import { honchoLeagueToModel, honchoRegistrantToModel } from 'services/server/airtable/mappers';
import { baseCreateDuprInfo } from 'services/server/airtable/tournaments';

type RegistrantDto = {
  username: string;
  viewerId: string;
  firstName: string;
  lastName: string;
  email: string;
  tournamentId: string;
  partnerEmail: string;
  gender: string;
  chargeId: string;

  promoCode: string;
  city: string;
  division: string;
};

export const getClient = () => {
  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_SECRET_KEY,
  });

  return Airtable.base(CONFIG.leaguesBase);
};

export const fetchLeagueBySlug = async (slug: string): Promise<HonchoTournament> => {
  const client = getClient();

  const [tournament] = await client(CONFIG.tables.leagues)
    .select({
      filterByFormula: `{Slug} = "${slug}"`,
    })
    .all();

  const tournamentFields = tournament.fields;

  return honchoLeagueToModel({
    ...tournamentFields,
    id: tournament.id,
  });
};

export const createRegistrant = async (data: RegistrantDto): Promise<string> => {
  const client = getClient();

  let [playerAccount] = await client(CONFIG.tables.leaguePlayers)
    .select({
      filterByFormula: `{Bounce user id} = "${data.viewerId}"`,
    })
    .all();

  if (!playerAccount) {
    playerAccount = await client(CONFIG.tables.leaguePlayers).create({
      Username: data.username,
      'First Name': data.firstName,
      'Last Name': data.lastName,
      'Bounce user id': data.viewerId,
      Email: data.email.toLowerCase(),
      Gender: data.gender || 'UNKNOWN',
    });
  }

  const registrant = await client(CONFIG.tables.leagueRegisters).create({
    Leagues: [data.tournamentId],
    Account_ID: [playerAccount.id],
    'Partner Email': data.partnerEmail.toLowerCase(),
    // 'DUPR Confirmation': data.duprConfirmation,
    'Stripe charge id': data.chargeId,
    'Referral Code': data.promoCode,
    City: data.city,
    Divisions: data.division,
  });

  return registrant.id;
};

export const setHonchoDetails = async (details: {
  phoneNumber: string;
  age: number;
  teamName: string;
  duprId: string;
  instagram: string;
  registrantId: string;
}) => {
  const client = getClient();

  await client(CONFIG.tables.leagueRegisters).update([
    {
      id: details.registrantId,
      fields: {
        Age: details.age,
        'DUPR ID': details.duprId,
        'Team Name': details.teamName,
        'Phone Number': details.phoneNumber,
        'Instagram Handle': details.instagram,
      },
    },
  ]);
};

export const fetchTeamByUserBounceId = async (viewerId: string, slug: string) => {
  const client = getClient();

  const tournament = (await fetchLeagueBySlug(slug)) as any;

  let [playerAccount] = await client(CONFIG.tables.leaguePlayers)
    .select({
      filterByFormula: `{Bounce user id} = "${viewerId}"`,
    })
    .all();

  if (!playerAccount) {
    return {
      player: null,
      partner: null,
    };
  }

  const [player] = await client(CONFIG.tables.leagueRegisters)
    .select({
      filterByFormula: `AND({Account_ID} = "${playerAccount.fields.ID}", {Leagues} = "${tournament.id}")`,
    })
    .all();

  if (!player) {
    return {
      player: null,
      partner: null,
    };
  }

  const [partner] = await client(CONFIG.tables.leagueRegisters)
    .select({
      filterByFormula: `AND({Email (from Account_ID)} = "${player.fields['Partner Email']}", {Leagues} = "${tournament.id}")`,
    })
    .all();

  return {
    player: honchoRegistrantToModel(player.fields),
    partner: partner?.fields ? honchoRegistrantToModel(partner.fields) : null,
  };
};

export const createDuprInfoForLeague = async (data: Partial<DuprInfo>) => {
  const client = getClient();

  return baseCreateDuprInfo(client, data, CONFIG.tables.leagueDuprInfo);
};

// export const attachDuprInfo = (id: string, duprInfoId: string, registrantTable: string) => {
//   const client = getClient();
//
//   return baseAttachDuprInfo({
//     id,
//     client,
//     duprInfoId,
//     registrantTable,
//   });
// };
