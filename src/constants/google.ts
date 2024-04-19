// import { Credentials } from 'google-auth-library';

// https://developers.google.com/identity/protocols/oauth2/openid-connect
export interface GoogleResponse {
  err: object | null;
  result: {
    provider: string;
    tokens: object; // NOTE: Use Credentials and install library above if needed
    info: {
      id: string;
      email: string;
      email_verified?: boolean;
      picture?: string;
      name?: string;
      family_name?: string;
      given_name?: string;
      locale?: string;
    };
  };
}
