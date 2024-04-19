import * as React from 'react';
import { AuthStatus } from 'constants/auth';
import { Viewer } from 'constants/user';
import { watchViewerTokenChanges } from 'services/client/token';

const DEFAULT_USER: Viewer = {
  status: AuthStatus.Loading,
  viewer: null,
  config: null,
  claims: null,
  userId: null,
};

export const ViewerContext = React.createContext({
  ...DEFAULT_USER,
  checkIsSessionViewer: (_userId: string): boolean => false,
  isSessionLoading: true,
  isUserSession: false,
  isAnonymousSession: false,
});

export const ViewerProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [viewer, setViewer] = React.useState(DEFAULT_USER);

  React.useEffect(() => {
    watchViewerTokenChanges(({ user, claims, userId }) => {
      if (user) {
        setViewer({
          status: AuthStatus.User,
          viewer: user,
          config: null,
          userId,
          claims,
        });
      } else {
        setViewer({
          status: AuthStatus.Anonymous,
          viewer: null,
          config: null,
          userId: null,
          claims: null,
        });
      }
    });
  }, []);

  return (
    <ViewerContext.Provider
      value={{
        ...viewer,
        checkIsSessionViewer: (userId: string) => userId === viewer.userId,
        isSessionLoading: viewer.status === AuthStatus.Loading,
        isUserSession: viewer.status === AuthStatus.User,
        isAnonymousSession: viewer.status === AuthStatus.Anonymous,
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
};
