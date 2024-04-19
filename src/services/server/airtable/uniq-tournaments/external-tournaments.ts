import { DuprInfo, ExternalTournament, MultipleEventTeam } from 'constants/tournaments';
import { getClient } from 'services/server/airtable/base';
import { CONFIG } from 'services/server/airtable/config';
import {
  externalRegistrantToModel,
  externalTournamentToModel,
  multipleEventTeamToModel,
} from 'services/server/airtable/mappers';
import {
  attachDuprInfo,
  createDuprInfo,
  updateDuprInfo,
} from 'services/server/airtable/tournaments';
import { TournamentRequirements } from 'components/tournaments/ExternalTournament/RegisterForm';

type RegistrantDto = {
  viewerId: string;
  chargeId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string | null | undefined;
  tournamentId: string;
  requirements: TournamentRequirements;
  duprInfo?: DuprInfo;
};

type ExternalRegistrantPayload = {
  Gender: string;
  Tournaments: string[];
  Account_ID: string[];
  'DUPR ID': string;
  'Stripe charge id': string;

  'Primary Event': string;
  'Primary Partner Email': string;
  'Secondary Event'?: string;
  'Secondary Partner Email'?: string;
  'DUPR INFO'?: string[];
  'IS PRODUCTION': boolean;
};

export const fetchExternalTournamentBySlug = async (slug: string): Promise<ExternalTournament> => {
  const client = getClient();

  const [tournament] = await client(CONFIG.tables.externalTournaments)
    .select({
      filterByFormula: `{Slug} = "${slug}"`,
    })
    .all();

  return externalTournamentToModel({ id: tournament.getId(), ...tournament.fields });
};

export const createRegistrant = async (data: RegistrantDto): Promise<void> => {
  const client = getClient();

  let [playerAccount] = await client(CONFIG.tables.playerAccount)
    .select({
      filterByFormula: `{Bounce user id} = "${data.viewerId}"`,
    })
    .all();

  if (!playerAccount) {
    playerAccount = await client(CONFIG.tables.playerAccount).create({
      Username: data.username,
      'First Name': data.firstName,
      'Last Name': data.lastName,
      'Bounce user id': data.viewerId,
      Email: data.email.toLowerCase(),
    });
  }

  const registrantPayload: ExternalRegistrantPayload = {
    Gender: data.gender || 'UNKNOWN',
    Tournaments: [data.tournamentId],
    Account_ID: [playerAccount.id],
    // 'DUPR INFO': data.duprInfoId ? [data.duprInfoId] : undefined,
    'DUPR ID': data.requirements.duprId,
    'Stripe charge id': data.chargeId,

    'Primary Event': `${data.requirements.events[0].eventType} ${data.requirements.events[0].rating}`,
    'Primary Partner Email': data.requirements.events[0].email.toLowerCase(),
    'IS PRODUCTION': process.env.APP_STAGE === 'production',
  };

  if (data.requirements.events[1]) {
    registrantPayload[
      'Secondary Event'
    ] = `${data.requirements.events[1].eventType} ${data.requirements.events[1].rating}`;

    registrantPayload['Secondary Partner Email'] = data.requirements.events[1].email.toLowerCase();
  }

  const duprInfo = (playerAccount?.fields?.['DUPR INFO'] as string[])?.[0];
  let duprInfoId;

  if (!duprInfo) {
    if (data.duprInfo) {
      duprInfoId = await createDuprInfo({
        doubles: data.duprInfo.doubles,
        singles: data.duprInfo.singles,
        firstName: data.duprInfo.firstName,
        lastName: data.duprInfo.lastName,
        fullName: data.duprInfo.fullName,
        duprId: data.duprInfo.duprId,
        age: data.duprInfo.age,
        address: data.duprInfo.address,
        gender: data.duprInfo.gender,
      }).then((data) => data.id);
    } else {
      duprInfoId = await createDuprInfo({}).then((data) => data.id);
    }

    await attachDuprInfo(playerAccount.id, duprInfoId as string);
  } else {
    if (data.duprInfo) {
      await updateDuprInfo(duprInfo, data.duprInfo);

      await attachDuprInfo(playerAccount.id, duprInfo);
    }
  }

  await client(CONFIG.tables.externalTournamentsRegistrants).create(registrantPayload);
};

export const fetchExternalTournamentTeamByUserBounceId = async (viewerId: string, slug: string) => {
  const client = getClient();

  const [tournament, [playerAccount]] = await Promise.all([
    fetchExternalTournamentBySlug(slug),
    client(CONFIG.tables.playerAccount)
      .select({
        filterByFormula: `{Bounce user id} = "${viewerId}"`,
      })
      .all(),
  ]);

  if (!playerAccount) {
    return {
      player: null,
      primaryPartner: null,
      secondaryPartner: null,
    };
  }

  const [player] = await client(CONFIG.tables.externalTournamentsRegistrants)
    .select({
      filterByFormula: `AND({Account_ID} = "${playerAccount.fields.ID}", {Tournaments} = "${tournament.id}")`,
    })
    .all();

  if (!player) {
    return {
      player: null,
      primaryPartner: null,
      secondaryPartner: null,
    };
  }

  const [[primaryPartner], [secondaryPartner]] = await Promise.all([
    client(CONFIG.tables.externalTournamentsRegistrants)
      .select({
        filterByFormula: `AND({Email (from Registrant)} = "${player.fields['Primary Partner Email']}", {Tournaments} = "${tournament.id}")`,
      })
      .all(),
    client(CONFIG.tables.externalTournamentsRegistrants)
      .select({
        filterByFormula: `AND({Email (from Registrant)} = "${player.fields['Secondary Partner Email']}", {Tournaments} = "${tournament.id}")`,
      })
      .all(),
  ]);

  return {
    player: externalRegistrantToModel(player.fields),
    primaryPartner: primaryPartner?.fields
      ? externalRegistrantToModel(primaryPartner?.fields)
      : null,
    secondaryPartner: secondaryPartner?.fields
      ? externalRegistrantToModel(secondaryPartner?.fields)
      : null,
  };
};

export const fetchMultipleEventTeamsByTournamentId = async (tournamentId: number) => {
  const client = getClient();

  return client(CONFIG.tables.multipleEventTeams)
    .select({
      filterByFormula: `{Tournament} = "${tournamentId}"`,
    })
    .all()
    .then((data) =>
      data
        .map((item) => multipleEventTeamToModel(item.fields))
        .filter(({ poolName }) => !!poolName && poolName !== 'Not Confirmed'),
    );
};

export const fetchMultipleEventTeams = async (): Promise<MultipleEventTeam[]> => {
  const client = getClient();

  return client(CONFIG.tables.multipleEventTeams)
    .select()
    .all()
    .then((records) => records.map((record) => multipleEventTeamToModel(record.fields)));
};
