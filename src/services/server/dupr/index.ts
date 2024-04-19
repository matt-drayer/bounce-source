import axios from 'axios';
import delay from 'delay';
import { API_KEY, API_URL, BaseUser, SearchUser, Token, User } from 'constants/dupr';
import { DuprInfo, PlayerAccount } from 'constants/tournaments';
import ApiService from 'services/server/ApiService';
import {
  attachDuprInfo,
  createDuprInfo,
  fetchAllPlayerAccounts,
} from 'services/server/airtable/tournaments';

export const api = new ApiService({
  baseUrl: API_URL,
  headers: {
    'x-authorization': API_KEY,
    'Content-Type': 'application/json',
  },
});

export const authorize = (): Promise<Token> => {
  return api.post(`/auth/v1.0/token`);
};

export const findUserByDuprId = (id: string, token: string): Promise<User> => {
  return api.get(`/user/v1.0/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchFullUserInfo = async ({
  fullName,
  token,
}: Pick<BaseUser, 'fullName'> & { token: string }): Promise<SearchUser> => {
  const {
    data: { result },
  } = await axios.post(
    `${API_URL}/user/v1.0/search`,
    {
      query: fullName,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return result.hits?.[0];
};

export const fetchDuprInfo = async (duprId: string): Promise<DuprInfo | undefined> => {
  const {
    result: { token },
  } = await authorize();

  try {
    const { result } = await findUserByDuprId(duprId, token);

    const fullUser = await fetchFullUserInfo({
      token,
      fullName: result.fullName,
    });

    const doubles = result.ratings.doubles;
    const singles = result.ratings.singles;

    return {
      doubles: doubles ? +doubles : undefined,
      singles: singles ? +singles : undefined,
      firstName: result.firstName,
      lastName: result.lastName,
      fullName: result.fullName,
      duprId,
      age: fullUser.age,
      address: fullUser.address,
      gender: fullUser.gender,
    };
  } catch (e) {
    return;
  }
};

export const reindexDuprInfo = async (): Promise<void> => {
  const accounts = await fetchAllPlayerAccounts();

  const accountsWithDuprId = accounts.filter(
    (acc) => (acc.registerDuprId || acc.externalRegisterDuprId) && !acc.duprInfo,
  );

  const internalAccounts = accountsWithDuprId.filter((acc) => !!acc.registerDuprId);
  const externalAccounts = accountsWithDuprId.filter((acc) => !!acc.externalRegisterDuprId);

  await createDuprInfoForReindex(internalAccounts, false);
  await createDuprInfoForReindex(externalAccounts, true);
};

const createDuprInfoForReindex = async (accounts: PlayerAccount[], isExternal: boolean) => {
  for (const acc of accounts) {
    const duprInfo = (await fetchDuprInfo(
      isExternal ? acc.externalRegisterDuprId : acc.registerDuprId,
    )) as DuprInfo;

    let duprInfoId;

    if (duprInfo) {
      duprInfoId = await createDuprInfo({
        doubles: duprInfo.doubles,
        singles: duprInfo.singles,
        firstName: duprInfo.firstName,
        lastName: duprInfo.lastName,
        fullName: duprInfo.fullName,
        duprId: duprInfo.duprId,
        age: duprInfo.age,
        address: duprInfo.address,
        gender: duprInfo.gender,
      }).then(({ id }: any) => id);
    } else {
      duprInfoId = await createDuprInfo({}).then(({ id }: any) => id);
    }

    await attachDuprInfo(acc.airtableId, duprInfoId as string);

    await delay(2000);
  }
};
