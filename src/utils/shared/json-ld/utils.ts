// src/utils/addressUtils.ts
import { PostalAddress } from './types';

// Assuming PostalAddress type is defined here

export const buildAddressField = (address: string | PostalAddress): object | string => {
  if (typeof address === 'string') {
    return address;
  }
  return {
    '@type': 'PostalAddress',
    ...address,
  };
};
