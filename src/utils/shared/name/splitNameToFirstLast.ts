export const splitNameToFirstLast = (name: string) => {
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');

  return { firstName, lastName };
};
