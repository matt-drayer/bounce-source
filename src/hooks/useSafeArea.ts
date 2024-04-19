import * as React from 'react';

const NO_SAFE_AREA = 0;

export const useSafeArea = () => {
  const [safeArea, setSafeArea] = React.useState({
    top: NO_SAFE_AREA,
    right: NO_SAFE_AREA,
    bottom: NO_SAFE_AREA,
    left: NO_SAFE_AREA,
  });

  React.useEffect(() => {
    try {
      // TODO: Fix! This will contain 'px'
      const top = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sat') || NO_SAFE_AREA + '',
        10,
      );
      const right = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sar') || NO_SAFE_AREA + '',
        10,
      );
      const bottom = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sab') || NO_SAFE_AREA + '',
        10,
      );
      const left = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sal') || NO_SAFE_AREA + '',
        10,
      );

      setSafeArea({ top, right, bottom, left });
    } catch (error) {}
  }, []);

  return safeArea;
};
