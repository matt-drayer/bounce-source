import * as React from 'react';
import { AuthStatus } from 'constants/auth';
import { CoachStatusEnum } from 'types/generated/client';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import AuthSelectType from 'screens/AuthSelectType';
import CoachLessons from 'screens/CoachLessons';
import PlayerExplorePage from 'screens/PlayerExplorePage';

const Home = () => {
  const viewer = useViewer();
  const isUser = viewer.status === AuthStatus.User;
  const shouldShowAuth = !isUser;
  const isLoading = viewer.status === AuthStatus.Loading;
  const { user, loading, called } = useGetCurrentUser();

  // NOTE: Is this right, send everything to /home and figure out the account type, or should we have separate URLs for what would be the coach's and player's home?
  // Test:
  // - player
  // - coach
  // - anonymous
  // - mobile

  if (getIsNativePlatform() && (shouldShowAuth || !user)) {
    return <AuthSelectType />;
  } else if (isLoading || (isUser && (loading || !called))) {
    // TODO: Create an empty home page? Something so it's not just a white screen.
    return null;
  } else if (user?.coachStatus === CoachStatusEnum.Active) {
    return <CoachLessons />;
  } else {
    return <PlayerExplorePage />;
  }
};

export default Home;
