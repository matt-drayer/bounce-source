import { DEFAULT_LOCALE } from 'constants/user';

export const getNavigatorLanguage = (preferredLanguage?: string): string => {
  if (preferredLanguage) {
    return preferredLanguage;
  }

  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE;
  }

  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return (
      // @ts-ignore
      navigator.userLanguage || navigator.language || navigator.browserLanguage || DEFAULT_LOCALE
    );
  }
};
