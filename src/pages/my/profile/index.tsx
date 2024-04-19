import * as React from 'react';
import { useGetUserProfileByIdLazyQuery } from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import ProfilePage from 'screens/ProfilePage';

const MyProfile = () => {
  const viewer = useViewer();
  const [getUserProfileByIdQuery, { data, loading, called, refetch }] =
    useGetUserProfileByIdLazyQuery();

  React.useEffect(() => {
    if (viewer.userId) {
      getUserProfileByIdQuery({
        variables: {
          id: viewer.userId,
        },
      });
    }
  }, [viewer.userId]);

  return (
    <ProfilePage
      isViewerProfile
      profile={data?.userProfiles[0]}
      isLoading={loading || !called}
      refetchProfile={() => refetch({ id: viewer.userId })}
    />
  );
};

export default MyProfile;
