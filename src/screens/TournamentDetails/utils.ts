import { isSameDay } from 'date-fns';
import { EventGroupFormatsEnum, ScoringFormatEnum } from 'types/generated/client';
import { getGroupFormatName } from 'utils/shared/sports/getGroupFormatName';

export { getGroupFormatName };

export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_TIMEZONE = 'America/Denver';

/**
 * @todo use src/utils/shared/time/getNavigatorLanguage.ts instead
 */
export const getLocaleForTimeZone = (locale?: string) => {
  if (locale) {
    return locale;
  }

  if (typeof navigator !== 'undefined') {
    if (navigator.language) {
      return navigator.language;
    }

    if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0];
    }
  }

  return DEFAULT_LOCALE;
};

export function formatDateRange({
  startDate,
  endDate,
  timeZone,
  locale,
}: {
  startDate: string;
  endDate: string;
  timeZone?: string;
  locale?: string;
}) {
  const localeForDisplay = getLocaleForTimeZone(locale);
  const optionsMonthDay: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone };
  const startDateFormat = new Intl.DateTimeFormat(localeForDisplay, optionsMonthDay);
  const endDateFormat = new Intl.DateTimeFormat(localeForDisplay, optionsMonthDay);

  const startDateObject = new Date(startDate);
  const endDateObject = new Date(endDate);

  const formattedStartDate = startDateFormat.format(startDateObject);
  const formattedEndDate = endDateFormat.format(endDateObject);

  if (isSameDay(startDateObject, endDateObject)) {
    return `${formattedStartDate}, ${startDateObject.getFullYear()}`;
  }

  return `${formattedStartDate} - ${formattedEndDate}, ${startDateObject.getFullYear()}`;
}

export function formatDate({
  date,
  timeZone,
  locale,
}: {
  date: string;
  timeZone?: string;
  locale?: string;
}) {
  const localeForDisplay = getLocaleForTimeZone(locale);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  };
  const formatter = new Intl.DateTimeFormat(localeForDisplay, options);

  return formatter.format(new Date(date));
}

// Define an interface for the function parameters to ensure type safety
interface FormatTimeParams {
  date: Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}

export function formatTime({ date, locale = 'default', options = {} }: FormatTimeParams): string {
  // Define options to achieve the "8:00AM" format
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // "numeric" for no leading zero
    minute: '2-digit',
    hour12: true, // Ensure 12-hour format
    // Not including second as it's not needed for the desired format
  };

  const dateTimeFormatOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat(locale, dateTimeFormatOptions).format(date);
}

export const isShowGroupFormat = (groupFormat?: EventGroupFormatsEnum) => {
  return !!groupFormat && groupFormat !== EventGroupFormatsEnum.Custom;
};

export const isShowScoringFormat = (scoringFormat?: ScoringFormatEnum) => {
  return !!scoringFormat;
};

const scoringFormatToName = {
  [ScoringFormatEnum.Rally]: 'Rally scoring',
  [ScoringFormatEnum.Traditional]: 'Traditional scoring',
};

export const getScoringFormatName = (scoringFormat: ScoringFormatEnum) => {
  return scoringFormatToName[scoringFormat];
};
