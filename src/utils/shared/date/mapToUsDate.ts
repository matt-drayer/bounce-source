import { mapMonthToName } from './mapMonthToName';

export const mapToUsDate = (date: string, options: { nd?: boolean } = {}) => {
  if (!date) return '';

  const [year, month, day] = date.split('-');

  const nd = options.nd ? 'th' : '';

  return `${mapMonthToName(parseInt(month, 10))} ${day}${nd}, ${year}`;
};
