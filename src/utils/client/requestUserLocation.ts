export const requestUserLocation = () => {
  return new Promise((resolve: (position: GeolocationPosition) => void, reject) => {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition((position) => resolve(position), reject);
    } else {
      return reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};
