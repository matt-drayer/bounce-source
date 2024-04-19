import { AirtableBase } from 'airtable/lib/airtable_base';
import { forIn, groupBy } from 'lodash';
import { DuprInfo, MappedPool, PlayerAccount, Registrant, Tournament } from 'constants/tournaments';
import { baseFetchAll, fetchById, getClient } from 'services/server/airtable/base';
import {
  playerAccountToModel,
  registrantToModel,
  tournamentPreviewToModel,
  tournamentToModel,
} from 'services/server/airtable/mappers';
import { CONFIG } from './config';

export const fetchTournamentById = async (id: string): Promise<Tournament> => {
  const tournament = await fetchById(CONFIG.tables.tournaments, id);

  const tournamentFields = tournament.fields as unknown as Tournament;

  return tournamentToModel({
    ...tournamentFields,
    id: tournament.id,
  });
};

type RegistrantDto = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  tournamentId: string;
  gender: string | null | undefined;
  duprId: string;
  partnerEmail: string;
  duprConfirmation: boolean;
  viewerId: string;
  chargeId: string;
  duprInfo?: DuprInfo;
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

  await client(CONFIG.tables.registrants).create({
    Gender: data.gender || 'UNKNOWN',
    Tournaments: [data.tournamentId],
    Registrant_ID: [playerAccount.id],
    'DUPR ID': data.duprId,
    Partner: !!data.partnerEmail,
    'Partner Email': data.partnerEmail.toLowerCase(),
    'DUPR Confirmation': data.duprConfirmation,
    'Stripe charge id': data.chargeId,
    // 'DUPR INFO': data.duprInfoId ? [data.duprInfoId] : undefined,
    'IS PRODUCTION': process.env.APP_STAGE === 'production',
  });

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
};

export const fetchTournamentBySlug = async (slug: string): Promise<Tournament | null> => {
  const client = getClient();

  const [tournament] = await client(CONFIG.tables.tournaments)
    .select({
      filterByFormula: `{Slug} = "${slug}"`,
    })
    .all();

  if (!tournament) return null;

  const tournamentFields = tournament.fields as unknown as Tournament;

  return tournamentToModel({
    ...tournamentFields,
    id: tournament.id,
  });
};

export const fetchRegistrantsByTournamentId = async (
  tournamentId: number,
): Promise<Registrant[]> => {
  const client = getClient();

  return client(CONFIG.tables.registrants)
    .select({
      filterByFormula: `{Tournaments} = '${tournamentId}'`,
    })
    .all()
    .then((data) =>
      data
        .map((item) => registrantToModel(item.fields))
        .filter((item) => item.poolAssignment && item.teamId),
    );
};

export const groupRegistrantsByPools = (registrants: Registrant[]): Record<string, Registrant[]> =>
  groupBy(registrants, 'poolAssignment');

export const groupRegistrantsByTeams = (registrants: Registrant[]): MappedPool[] => {
  const pools = groupRegistrantsByPools(registrants);

  const poolsWithTeams: MappedPool[] = [];

  forIn(pools, (poolRegistrants, pool) => {
    poolsWithTeams.push({
      name: pool,
      poolTime: poolRegistrants[0].poolTime,
      teams: groupBy(poolRegistrants, 'teamId'),
    });
  });

  return poolsWithTeams;
};

export const fetchTeamByUserBounceId = async (viewerId: string, tournamentId: string) => {
  const client = getClient();

  const tournament = await fetchTournamentById(tournamentId);

  let [playerAccount] = await client(CONFIG.tables.playerAccount)
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

  const [player] = await client(CONFIG.tables.registrants)
    .select({
      filterByFormula: `AND({Registrant_ID} = "${playerAccount.fields.ID}", {Tournaments} = "${tournament.id}")`,
    })
    .all();

  if (!player) {
    return {
      player: null,
      partner: null,
    };
  }

  const [partner] = await client(CONFIG.tables.registrants)
    .select({
      filterByFormula: `AND({Email (from Registrant)} = "${player.fields['Partner Email']}", {Tournaments} = "${tournament.id}")`,
    })
    .all();

  return {
    player: registrantToModel(player.fields),
    partner: partner?.fields ? registrantToModel(partner?.fields) : null,
  };
};

export const fetchTournamentsPreviewList = async () => {
  const tournaments = await baseFetchAll(CONFIG.tables.tournamentsListView);

  return tournaments.map((record) => {
    const tournament = record.fields as unknown as Tournament;

    return tournamentPreviewToModel({
      ...tournament,
      id: record.id,
    });
  });
};

export const baseCreateDuprInfo = async (
  client: AirtableBase,
  data: Partial<DuprInfo>,
  table: string,
) => {
  return client(table).create({
    'Full Name': data.fullName,
    'First Name': data.firstName,
    'Last Name': data.lastName,
    Doubles: data.doubles,
    Singles: data.singles,
    'DUPR ID': data.duprId,
    Age: data.age,
    Address: data.address,
    Gender: data.gender,
  });
};

export const baseAttachDuprInfo = (opts: {
  playerAccountId: string;
  duprInfoId: string;
  client: AirtableBase;
}) => {
  const { playerAccountId, duprInfoId, client } = opts;

  return client(CONFIG.tables.playerAccount).update([
    {
      id: playerAccountId,
      fields: {
        'DUPR INFO': [duprInfoId],
      },
    },
  ]);
};

export const createDuprInfo = async (data: Partial<DuprInfo>): Promise<{ id: string }> => {
  const client = getClient();

  return baseCreateDuprInfo(client, data, CONFIG.tables.duprInfo);
};

export const attachDuprInfo = (playerAccountId: string, duprInfoId: string) => {
  const client = getClient();

  return baseAttachDuprInfo({
    playerAccountId,
    client,
    duprInfoId,
  });
};

export const updateDuprInfo = (duprInfoId: string, duprInfo: DuprInfo) => {
  const client = getClient();

  return client(CONFIG.tables.duprInfo).update([
    {
      id: duprInfoId,
      fields: {
        'Full Name': duprInfo.fullName,
        'First Name': duprInfo.firstName,
        'Last Name': duprInfo.lastName,
        Doubles: duprInfo.doubles,
        Singles: duprInfo.singles,
        'DUPR ID': duprInfo.duprId,
        Age: duprInfo.age,
        Address: duprInfo.address,
        Gender: duprInfo.gender,
      },
    },
  ]);
};

export const fetchAllPlayerAccounts = (): Promise<PlayerAccount[]> => {
  const client = getClient();

  return client(CONFIG.tables.playerAccount)
    .select()
    .all()
    .then((records) =>
      records.map((record) =>
        playerAccountToModel({
          ...record.fields,
          id: record.id,
        }),
      ),
    );
};

export const fetchRegistrants = async <T>(
  table: string,
  mapperFn: (item: Record<string, any>) => T,
): Promise<T[]> => {
  const client = getClient();

  return client(table)
    .select({
      filterByFormula: `NOT({DUPR ID} = "")`,
    })
    .all()
    .then((records) => records.map((record) => mapperFn(record.fields)));
};

export const fetchAllTournaments = <T>(
  table: string,
  mapperFn: (item: Record<string, any>) => T,
): Promise<T[]> => {
  return baseFetchAll(table).then((records) => records.map((record) => mapperFn(record.fields)));
};
