/**
 * @todo Don't hardcode en-US in these formattings
 */

export const formatDate = (date: Date): string => {
  // First, format the time part (e.g., "6:00 PM")
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  const timePart = timeFormatter.format(date);

  // Then, format the day part (e.g., "Saturday")
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  });
  const dayPart = dayFormatter.format(date);

  // Finally, format the month and day part (e.g., "May 21")
  const monthDayFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  });
  const monthDayPart = monthDayFormatter.format(date);

  // Combine all parts
  return `${timePart} on ${dayPart} ${monthDayPart}`;
};

export function formatDateTimeShort(isoTimestamp: string): string {
  // Convert ISO string to Date object
  const date = new Date(isoTimestamp);

  // Use Intl.DateTimeFormat to format the date part
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', // "Sat"
    month: 'numeric', // "3"
    day: 'numeric', // "29"
  });
  const formattedDate = dateFormatter.format(date); // "Sat, 3/29"

  // Manually format the time part
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12; // the hour '0' should be '12'
  const formattedTime =
    hours + (minutes > 0 ? `:${minutes < 10 ? '0' + minutes : minutes}` : '') + ampm; // "6AM" or "6:30AM"

  // Combine the formatted date and time with custom format
  return `${formattedTime} on ${formattedDate.replace(',', '')}`;
}

export const preventNumberChangeOnWheel = (event: React.WheelEvent<HTMLInputElement>): void => {
  event.preventDefault();
  event.currentTarget.blur();
};

const PERCENT_RESERVED_FOR_FUTURE_SEQUENCE = 25;
export const calculateGroupCompletion = ({
  totalMatchesCount,
  completedMatchesCount,
  upcomingSequenceCount,
}: {
  totalMatchesCount: number;
  completedMatchesCount: number;
  upcomingSequenceCount: number;
}): number => {
  /**
   * @note This should be scaling it instead of subsctracting it so that matches just count for less
   */
  const percentage =
    (completedMatchesCount / totalMatchesCount) * 100 -
    upcomingSequenceCount * PERCENT_RESERVED_FOR_FUTURE_SEQUENCE;

  return Math.max(Math.round(percentage), 0);
};

/**
 * @note this is a hack to launch a tournament. Replace.
 */
const HIDE_COURTS_FOR_EVENT_IDS: string[] = [
  // '149dfdec-2a0b-44c4-b715-febd3bc4f1d0', // DEMO TEST
  'ae45c039-7a1a-41f8-b382-968cd6bb2cc5',
];

const _deprecated_isHiddenCourtForEventId = (eventId: string): boolean =>
  HIDE_COURTS_FOR_EVENT_IDS.includes(eventId);

export const shouldHideCourtAssigmnet = (eventId: string): boolean => {
  return _deprecated_isHiddenCourtForEventId(eventId);
};
