export interface FacebookResponse {
  err: object | null;
  result: {
    provider: string;
    accessToken: string;
    info: {
      id: string;
      email?: string;
      name?: string;
      picture?: {
        url: string;
      };
      first_name?: string;
      middle_name?: string;
      last_name?: string;
      name_format?: string;
      short_name?: string;
    };
  };
}
