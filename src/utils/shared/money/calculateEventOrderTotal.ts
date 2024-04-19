export const PROCESSING_FEE = 0.05;

type Registration = {
  groupId: string;
  partnerEmail?: string | null | undefined;
  partnerName?: string | null | undefined;
};

type Event = {
  registrationPriceUnitAmount?: number | null;
  groups: {
    id: string;
    priceUnitAmount: number;
    title: string;
  }[];
};

type Params = {
  registration: Registration[];
  event: Event;
  isFirstTournamentRegistration: boolean;
};

export const calculateEventOrderTotal = ({
  registration,
  event,
  isFirstTournamentRegistration,
}: Params) => {
  if (!registration || !event) {
    return {
      registrationFee: 0,
      registrationGroups: [],
      subtotal: 0,
      processingFee: 0,
      total: 0,
    };
  }

  const registrationFee = isFirstTournamentRegistration
    ? event.registrationPriceUnitAmount || 0
    : 0;
  const registrationGroups: {
    id: string;
    priceUnitAmount: number;
    title: string;
  }[] = [];

  registration.forEach((group) => {
    const matchedGroup = event.groups.find((g) => g.id === group.groupId);
    if (matchedGroup) {
      registrationGroups.push({
        id: group.groupId,
        priceUnitAmount: matchedGroup.priceUnitAmount,
        title: matchedGroup.title,
      });
    }
  });

  const groupTotal = registrationGroups.reduce((acc, group) => {
    return acc + group.priceUnitAmount;
  }, 0);

  const subtotal = registrationFee + groupTotal;

  const processingFee = subtotal * PROCESSING_FEE;

  const total = subtotal + processingFee;

  return {
    registrationFee,
    registrationGroups,
    subtotal,
    processingFee,
    processingFeeDecimal: PROCESSING_FEE,
    processingFeePercentage: PROCESSING_FEE * 100,
    total,
  };
};

export type OrderTotal = ReturnType<typeof calculateEventOrderTotal>;
