import imagekit from './client';

export const getAuthenticationParameters = () => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  return authenticationParameters;
};
