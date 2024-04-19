import { VenueAccessTypesEnum } from 'types/generated/client';
import Lock from 'svg/Lock';
import Membership from 'svg/Membership';
import Public from 'svg/Public';

export const getAccessParamters = (accessType?: VenueAccessTypesEnum | null) => {
  if (!accessType || accessType === VenueAccessTypesEnum.NeedsAudit) {
    return null;
  }

  if (
    accessType === VenueAccessTypesEnum.Membership ||
    accessType === VenueAccessTypesEnum.Private
  ) {
    return {
      name: 'Membership',
      Icon: Lock,
    };
  } else if (accessType === VenueAccessTypesEnum.OneTime) {
    return {
      name: 'One-time fee',
      Icon: Membership,
    };
  } else {
    return {
      name: 'Free',
      Icon: Public,
    };
  }
};
