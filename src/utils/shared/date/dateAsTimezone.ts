export function dateAsTimezone(dateString: string, timeZone: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dateFormatted = date.toLocaleString('en-US', {
    timeZone: timeZone,
  });
  const dateObjectInTimezone = new Date(dateFormatted);
  const dateInTimezone = dateObjectInTimezone.toISOString().split('T')[0];

  return dateObjectInTimezone;
}
