import * as React from 'react';
import { CurrentUserContext, CurrentUserResponse } from 'context/CurrentUserContext';

export const useGetCurrentUser = () => {
  const response = React.useContext(CurrentUserContext);
  return response.currentUser || { user: null, loading: false, called: false };
};

// import { useViewer } from 'hooks/useViewer';
// import { useGetCurrentUserLazyQuery } from 'types/generated/client';

// export const useGetCurrentUser = () => {
//   const viewer = useViewer();
//   const [queryFetch, queryResult] = useGetCurrentUserLazyQuery();
//   const { data, refetch, loading, called } = queryResult;

//   React.useEffect(() => {
//     if (!loading && !called && !!viewer.userId) {
//       queryFetch({ variables: { id: viewer.userId } });
//     }
//   }, [viewer.status, viewer.userId, loading, called, queryFetch, refetch]);

//   return { ...queryResult, user: data?.usersByPk };
// };
