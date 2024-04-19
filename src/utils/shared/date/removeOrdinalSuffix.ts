export const removeOrdinalSuffix = (dateString: string) =>
  dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');
