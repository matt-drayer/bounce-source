import * as React from 'react';
import { ViewerContext } from 'context/ViewerContext';

export const useViewer = () => {
  const viewer = React.useContext(ViewerContext);
  return viewer;
};
