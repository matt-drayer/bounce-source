export const combineJsonLdSchemas = (schemas: any[]): object => {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
};
