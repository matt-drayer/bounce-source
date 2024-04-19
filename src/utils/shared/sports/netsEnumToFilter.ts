import { VenueNetsEnum } from 'types/generated/client';

const netsTypeToName = {
  [VenueNetsEnum.Portable]: 'Portable',
  [VenueNetsEnum.Tennis]: 'Permanent',
  [VenueNetsEnum.Permanent]: 'Permanent',
  [VenueNetsEnum.BringYourOwn]: 'BYO',
};

export const netsEnumToFilter = (nets: VenueNetsEnum) => {
  return netsTypeToName[nets] || '';
};
