import { splitNameToFirstLast } from 'utils/shared/name/splitNameToFirstLast';

const initialsWithPeriod = (lastName: string) => {
  return (
    lastName
      .split(' ')
      .map((name) => name[0])
      .join('.') + '.'
  );
};

export const nameToLastInitials = (name: string) => {
  const { firstName, lastName } = splitNameToFirstLast(name);
  return `${firstName}${lastName ? ` ${initialsWithPeriod(lastName)}` : ''}`;
};
