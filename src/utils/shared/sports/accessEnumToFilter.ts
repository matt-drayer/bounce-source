import { VenueAccessTypesEnum } from 'types/generated/client';

const accessToName = {
  [VenueAccessTypesEnum.Free]: 'Free',
  [VenueAccessTypesEnum.Private]: 'Private',
  [VenueAccessTypesEnum.Membership]: 'Membership',
  [VenueAccessTypesEnum.OneTime]: 'One-time Fee',
  [VenueAccessTypesEnum.NeedsAudit]: '',
};

export const accessEnumToFilter = (access: VenueAccessTypesEnum) => {
  return accessToName[access] || '';
};
