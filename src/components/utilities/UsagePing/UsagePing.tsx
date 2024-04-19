import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { RequestStatus } from 'constants/requests';
import { useInsertUsagePingMutation } from 'types/generated/client';
import { getPlatform } from 'utils/mobile/getPlatform';
import { useGetIpAddress } from 'hooks/useGetIpAddress';
import { useViewer } from 'hooks/useViewer';

interface Props {
  children: React.ReactNode;
}

// NOTE: Will this cause uneccesarry renders and should it instead be performed in watching for route changes with events (or as a hook) and not as a component that has children?
export default function UsagePing({ children }: Props) {
  const router = useRouter();
  const viewer = useViewer();
  const firebaseId = viewer.viewer?.uid;
  const userId = viewer.userId;
  const isReady = router.isReady;
  const pathname = router.pathname;
  const query = router.query;
  const [insert] = useInsertUsagePingMutation();
  const { ipResponse, ipRequestStatus } = useGetIpAddress();

  React.useEffect(() => {
    const appPringFetch = async () => {
      if (
        isReady &&
        viewer.status !== AuthStatus.Loading &&
        (ipRequestStatus === RequestStatus.Success || ipRequestStatus === RequestStatus.Error)
      ) {
        const queryString = (window.location.search || '').replace('?', '');
        insert({
          variables: {
            userId: userId || null,
            firebaseId: firebaseId || null,
            pathname,
            queryString,
            platform: getPlatform(),
            ip: ipResponse?.ip,
            country: ipResponse?.country,
            region: ipResponse?.region,
            city: ipResponse?.city,
            ipResponse: ipResponse,
            // NOTE: These fields were from a previously paid API
            timezone: '',
            zip: '',
          },
        }).catch((error) => Sentry.captureException(error));
      }
    };
    appPringFetch();
  }, [
    firebaseId,
    userId,
    pathname,
    isReady,
    insert,
    query,
    ipResponse,
    ipRequestStatus,
    viewer.status,
  ]);

  return <>{children}</>;
}
