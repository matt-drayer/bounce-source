import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { Geo } from '@vercel/edge';
import { AuthStatus } from 'constants/auth';
import { RequestStatus } from 'constants/requests';
import { GetCurrentUserQuery, useGetCurrentUserLazyQuery } from 'types/generated/client';
import { identify } from 'services/client/analytics';
import api from 'services/client/api';
import { useViewer } from 'hooks/useViewer';

const IP_PATH = 'v1/ip';

interface IpResponse extends Geo {
  ip: string;
}

export type CurrentUserResponse =
  | (ReturnType<typeof useGetCurrentUserLazyQuery>[1] & {
      user?: GetCurrentUserQuery['usersByPk'] | null;
    })
  | null;
interface CurrentUser {
  currentUser: CurrentUserResponse;
  ipResponse: null | IpResponse;
  ipRequestStatus: RequestStatus;
}

const DEFAULT_USER: CurrentUser = {
  currentUser: null,
  ipResponse: null,
  ipRequestStatus: RequestStatus.Idle,
};

export const CurrentUserContext = React.createContext(DEFAULT_USER);

export const CurrentUserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const viewer = useViewer();
  const [ipResponse, setIpResponse] = React.useState<IpResponse | null>(null);
  const [ipRequestStatus, setIpRequestStatus] = React.useState(RequestStatus.Idle);
  const [queryFetch, queryResult] = useGetCurrentUserLazyQuery();
  const [hasIdentifiedUser, setHasIdentifiedUser] = React.useState(false);
  const { data } = queryResult;

  React.useEffect(() => {
    if (data?.usersByPk?.id && !hasIdentifiedUser) {
      setHasIdentifiedUser(true);
      try {
        const user = data.usersByPk;
        const {
          followingCoachesAggregate,
          groups,
          pickleballSkillLevel,
          tennisSkillLevel,
          tennisRatingScaleId,
          ...userAttributes
        } = user;
        identify({
          ...userAttributes,
          email: user.email,
          name: user.fullName,
          userId: user.id,
          additionalUserParams: {
            ...userAttributes,
            groupCount: groups?.length || 0,
            followCoachesCount: followingCoachesAggregate?.aggregate?.count || 0,
            pickleballSkillDisplayName: pickleballSkillLevel?.displayName || undefined,
            tennisSkillDisplayName: tennisSkillLevel?.displayName || undefined,
          },
        });
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  }, [data, hasIdentifiedUser]);

  React.useEffect(() => {
    if (!!viewer.userId && viewer.status === AuthStatus.User) {
      // NOTE: Should we check for firebase token here?
      // There are some edge race conditions where it's fetching without a token, but it seems rare and to not effect usability.
      queryFetch({ variables: { id: viewer.userId } });
    }
  }, [viewer.status, viewer.userId, queryFetch]);

  React.useEffect(() => {
    const fetchIp = async () => {
      setIpRequestStatus(RequestStatus.InProgress);
      try {
        const data: IpResponse = await api.get(IP_PATH);
        setIpResponse({
          ...data,
          city: decodeURIComponent(data.city || ''),
          region: decodeURIComponent(data.region || ''),
        });
        setIpRequestStatus(RequestStatus.Success);
      } catch (error) {
        Sentry.captureException(error);
        setIpRequestStatus(RequestStatus.Error);
      }
    };
    fetchIp();
  }, []);

  // NOTE: This ensures we only return the current user if the viewer exists from firebase.
  // It is possible the current user could remain in the apollo cache and won't update until the useEffect above runs.
  const currentUser = { ...queryResult, user: viewer.userId ? data?.usersByPk : null };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        ipResponse: ipResponse,
        ipRequestStatus: ipRequestStatus,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
