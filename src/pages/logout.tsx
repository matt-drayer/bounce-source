import * as React from 'react';
import { useApolloClient } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { LOGIN_PAGE } from 'constants/pages';
import { reset } from 'services/client/analytics';
import { auth } from 'services/client/firebase';
import { useViewer } from 'hooks/useViewer';
import Head from 'components/utilities/Head';

const Logout = () => {
  const router = useRouter();
  const viewer = useViewer();
  const client = useApolloClient();

  React.useEffect(() => {
    if (router.isReady && viewer.status === AuthStatus.Anonymous) {
      router.push(LOGIN_PAGE);
    }
  }, [router.isReady, viewer.status]);

  React.useEffect(() => {
    if (router.isReady && viewer.status === AuthStatus.User) {
      client
        .resetStore()
        .then(() => {
          auth.signOut();
          reset();
        })
        // .then(() => client.resetStore())
        // .then(() => {
        //   router.push(LOGIN_PAGE);
        // })
        .catch((error) => Sentry.captureException(error));
    }
  }, [router.isReady, viewer, client]);

  return (
    <>
      <Head noIndex title="Log Out" description="Log out of your Bounce account." />
      <div>&nbsp;</div>
    </>
  );
};

export default Logout;
