export const getTimezoneOffsetMinutes = (timezone: string, timestamp?: number): number => {
  const date: Date = timestamp ? new Date(timestamp) : new Date();
  const utcDate: Date = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const targetDate: Date = new Date(date.toLocaleString('en-US', { timeZone: timezone }));

  const offsetMilliseconds: number = utcDate.getTime() - targetDate.getTime();

  return offsetMilliseconds / 60000;
};
