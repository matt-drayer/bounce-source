interface Params {
  isoDateString: string;
  timezoneName: string;
  locale: string;
  timezoneOffsetMinutes?: number;
  timezoneAbbreviation?: string;
}

export const getDisplayDateTimeForTimezone = ({ isoDateString, timezoneName, locale }: Params) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: timezoneName,
  } as const;
  const dateTimeFormat = new Intl.DateTimeFormat(locale, options);
  const date = new Date(isoDateString);

  return dateTimeFormat.format(date);
};
