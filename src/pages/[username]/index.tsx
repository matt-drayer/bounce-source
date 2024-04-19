import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import {
  useGetUserProfileByUsernameLazyQuery,
  useGetUserPublicProfileByUsernameLazyQuery,
} from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import ProfilePage from 'screens/ProfilePage';

const UserProfilePage = () => {
  const router = useRouter();
  const viewer = useViewer();
  const [getUserProfileByUsernameQuery, { data, loading, called }] =
    useGetUserProfileByUsernameLazyQuery();
  const [
    getUserPublicProfileByUsernameQuery,
    { data: publicData, loading: publicLoading, called: publicCalled },
  ] = useGetUserPublicProfileByUsernameLazyQuery();
  const profile = data?.userProfiles[0] || publicData?.userProfiles[0];
  const followingDetails = data?.userFollows?.[0];
  const username = typeof router?.query?.username === 'string' ? router.query.username : '';
  const isPublicLoading =
    viewer.status === AuthStatus.Anonymous && (publicLoading || !publicCalled);
  const isAuthedLoading = viewer.status === AuthStatus.User && (loading || !called);
  const isLoading = viewer.status === AuthStatus.Loading || isPublicLoading || isAuthedLoading;

  React.useEffect(() => {
    if (router.isReady && router.query.username && typeof router.query.username === 'string') {
      if (viewer.status !== AuthStatus.Loading) {
        if (viewer.status === AuthStatus.User && viewer.userId) {
          getUserProfileByUsernameQuery({
            variables: {
              username: router.query.username.toLowerCase(),
              viewerId: viewer.userId,
            },
          }).catch((error) => Sentry.captureException(error));
        } else {
          getUserPublicProfileByUsernameQuery({
            variables: {
              username: router.query.username.toLowerCase(),
            },
          }).catch((error) => Sentry.captureException(error));
        }
      }
    }
  }, [viewer.userId, viewer.status, router.isReady]);

  if (!loading && called && (!data?.userProfiles || data?.userProfiles.length === 0)) {
    // TODO: 404 this page
  }

  return (
    <ProfilePage
      profile={profile}
      followingDetails={followingDetails}
      isViewerProfile={!!viewer.userId && !!profile?.id && viewer.userId === profile.id}
      isLoading={isLoading}
      username={username}
    />
  );
};

export default UserProfilePage;
