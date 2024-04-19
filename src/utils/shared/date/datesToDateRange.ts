import { parse } from 'date-fns';
import { format } from 'date-fns';
import { removeOrdinalSuffix } from 'utils/shared/date/removeOrdinalSuffix';

export const datesToDateRange = (startDateString: string, endDateString: string): string => {
  const formattedStartDateString = removeOrdinalSuffix(startDateString);
  const formattedEndDateString = removeOrdinalSuffix(endDateString);

  const startDate = parse(formattedStartDateString, 'MMMM d, yyyy', new Date());
  const endDate = parse(formattedEndDateString, 'MMMM d, yyyy', new Date());

  const formattedStartDate = format(startDate, "MMMM d'th'");
  const formattedEndDate = format(endDate, "MMMM d'th', yyyy");

  return `${formattedStartDate} - ${formattedEndDate}`;
};
