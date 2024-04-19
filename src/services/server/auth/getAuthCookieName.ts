const getAuthCookieName = (provider: string) => `${process.env.APP_STAGE![0]}-oauth${provider}`;

export default getAuthCookieName;
