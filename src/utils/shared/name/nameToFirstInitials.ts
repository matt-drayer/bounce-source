import { splitNameToFirstLast } from 'utils/shared/name/splitNameToFirstLast';

const initialsWithPeriod = (name: string) => {
  return (
    name
      .split(' ')
      .map((name) => name[0])
      .join('.') + '.'
  );
};

export const nameToFirstInitials = (name: string) => {
  const { firstName, lastName } = splitNameToFirstLast(name);
  return `${initialsWithPeriod(firstName || '')}${lastName ? ` ${lastName}` : ''}`;
};
