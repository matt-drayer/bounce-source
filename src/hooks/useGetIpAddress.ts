import * as React from 'react';
import { CurrentUserContext } from 'context/CurrentUserContext';

export const useGetIpAddress = () => {
  const response = React.useContext(CurrentUserContext);
  return { ipResponse: response.ipResponse, ipRequestStatus: response.ipRequestStatus };
};
