export const CUSTOMER_MARKUP_PERCENT_DECIMAL = 0.1;
export const COACH_FEE_CENTS = 0; // In cents

interface Params {
  priceUnitAmount: number;
}

export const getLessonApplicationFees = ({ priceUnitAmount }: Params) => {
  const customerApplicationFee = priceUnitAmount * CUSTOMER_MARKUP_PERCENT_DECIMAL;
  const sellerApplicationFee = COACH_FEE_CENTS;

  return {
    customerApplicationFee,
    sellerApplicationFee,
  };
};

// NOTE: Do we need to do anymore to ensure we are only working with integers?
// We should be fine if we round all multiplication if we can trust priceUnitAmount
export const getLessonItemizedTotal = ({ priceUnitAmount }: Params) => {
  const customerApplicationFeeUniteAmount = Math.ceil(
    priceUnitAmount * CUSTOMER_MARKUP_PERCENT_DECIMAL,
  );
  const sellerApplicationFeeUnitAmout = Math.ceil(COACH_FEE_CENTS);
  const orderSubtotalUnitAmount = priceUnitAmount; // Sum of items
  const orderTotalUnitAmount = orderSubtotalUnitAmount + customerApplicationFeeUniteAmount; // Seller fee is deducted from total. This total is what is paid by the customer.
  const coachAmountReceived =
    orderTotalUnitAmount - customerApplicationFeeUniteAmount - sellerApplicationFeeUnitAmout; // The coach receives the payment price minus the additional service fee from customer and the fee paid to us by the coach.
  const applicationFeeTotal = orderTotalUnitAmount - coachAmountReceived;

  return {
    customerServiceFeePercentDecimal: CUSTOMER_MARKUP_PERCENT_DECIMAL,
    customerApplicationFee: customerApplicationFeeUniteAmount,
    sellerApplicationFee: sellerApplicationFeeUnitAmout,
    orderSubtotal: orderSubtotalUnitAmount,
    orderTotal: orderTotalUnitAmount,
    coachAmountReceived,
    applicationFeeTotal,
  };
};
