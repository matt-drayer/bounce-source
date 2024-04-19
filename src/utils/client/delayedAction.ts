// https://github.com/tailwindlabs/headlessui/issues/1199
export const delayedAction = (delay: number, callback: () => void): Promise<void> => {
  // console.log('start', Date.now());
  return new Promise((resolve) => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // console.log('end', Date.now());
          callback();
          resolve();
        });
      });
    }, delay);
  });
};
