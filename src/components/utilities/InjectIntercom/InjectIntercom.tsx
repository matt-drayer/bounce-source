import * as React from 'react';

// import { useIntercom } from 'react-use-intercom';

/**
 * @todo turn back on if we end up using this
 */
const InjectIntercom = ({ children }: React.PropsWithChildren) => {
  // const { boot, shutdown } = useIntercom();

  // React.useEffect(() => {
  //   boot();

  //   return () => {
  //     shutdown();
  //   };
  // }, []);

  return <>{children}</>;
};

export default InjectIntercom;
