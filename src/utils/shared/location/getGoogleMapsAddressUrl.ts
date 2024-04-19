export const getGoogleMapsAddressUrl = (address: string) => {
  return address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : '';
};
