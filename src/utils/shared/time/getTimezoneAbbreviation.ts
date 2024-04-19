export const getTimezoneAbbreviation = (timezone: string): string => {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  });
  const parts = formatter.formatToParts(date);
  const abbreviationPart = parts.find((part) => part.type === 'timeZoneName');
  return abbreviationPart ? abbreviationPart.value : '';
};
