import { differenceInHours } from 'date-fns';

export function is24HoursPassed(dateString: string) {
  const date = new Date(dateString);

  return differenceInHours(new Date(), date) > 24;
}
