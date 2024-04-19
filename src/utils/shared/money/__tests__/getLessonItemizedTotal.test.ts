import {
  COACH_FEE_CENTS,
  CUSTOMER_MARKUP_PERCENT_DECIMAL,
  getLessonItemizedTotal,
} from '../getLessonItemizedTotal';

// test getLessonItemizedTotal
describe('getLessonItemizedTotal', () => {
  it('handles $1', () => {
    const priceUnitAmount = 100;
    const participantFee = priceUnitAmount * CUSTOMER_MARKUP_PERCENT_DECIMAL;
    const coachFee = COACH_FEE_CENTS;
    const total = priceUnitAmount + participantFee + coachFee;
    const result = getLessonItemizedTotal({ priceUnitAmount });
    expect(result).toEqual({
      customerServiceFeePercentDecimal: CUSTOMER_MARKUP_PERCENT_DECIMAL,
      customerApplicationFee: participantFee,
      sellerApplicationFee: COACH_FEE_CENTS,
      orderSubtotal: priceUnitAmount,
      orderTotal: total,
      coachAmountReceived: priceUnitAmount,
      applicationFeeTotal: participantFee + coachFee,
    });
  });

  it('handles $0', () => {
    const priceUnitAmount = 0;
    const participantFee = priceUnitAmount * CUSTOMER_MARKUP_PERCENT_DECIMAL;
    const coachFee = COACH_FEE_CENTS;
    const total = priceUnitAmount + participantFee + coachFee;
    const result = getLessonItemizedTotal({ priceUnitAmount });
    expect(result).toEqual({
      customerServiceFeePercentDecimal: CUSTOMER_MARKUP_PERCENT_DECIMAL,
      customerApplicationFee: participantFee,
      sellerApplicationFee: COACH_FEE_CENTS,
      orderSubtotal: priceUnitAmount,
      orderTotal: total,
      coachAmountReceived: priceUnitAmount,
      applicationFeeTotal: participantFee + coachFee,
    });
  });

  it('handles cents', () => {
    const priceUnitAmount = 15;
    const participantFee = 2; // Round up since it's cents
    const coachFee = COACH_FEE_CENTS;
    const total = priceUnitAmount + participantFee + coachFee;
    const result = getLessonItemizedTotal({ priceUnitAmount });
    expect(result).toEqual({
      customerServiceFeePercentDecimal: CUSTOMER_MARKUP_PERCENT_DECIMAL,
      customerApplicationFee: participantFee,
      sellerApplicationFee: COACH_FEE_CENTS,
      orderSubtotal: priceUnitAmount,
      orderTotal: total,
      coachAmountReceived: priceUnitAmount,
      applicationFeeTotal: participantFee + coachFee,
    });
  });

  it('handles large prices', () => {
    const priceUnitAmount = 10000;
    const participantFee = priceUnitAmount * CUSTOMER_MARKUP_PERCENT_DECIMAL;
    const coachFee = COACH_FEE_CENTS;
    const total = priceUnitAmount + participantFee + coachFee;
    const result = getLessonItemizedTotal({ priceUnitAmount });
    expect(result).toEqual({
      customerServiceFeePercentDecimal: CUSTOMER_MARKUP_PERCENT_DECIMAL,
      customerApplicationFee: participantFee,
      sellerApplicationFee: COACH_FEE_CENTS,
      orderSubtotal: priceUnitAmount,
      orderTotal: total,
      coachAmountReceived: priceUnitAmount,
      applicationFeeTotal: participantFee + coachFee,
    });
  });

  it('handles large prices with cents', () => {
    const priceUnitAmount = 10050;
    const participantFee = priceUnitAmount * CUSTOMER_MARKUP_PERCENT_DECIMAL;
    const coachFee = COACH_FEE_CENTS;
    const total = priceUnitAmount + participantFee + coachFee;
    const result = getLessonItemizedTotal({ priceUnitAmount });
    expect(result).toEqual({
      customerServiceFeePercentDecimal: CUSTOMER_MARKUP_PERCENT_DECIMAL,
      customerApplicationFee: participantFee,
      sellerApplicationFee: COACH_FEE_CENTS,
      orderSubtotal: priceUnitAmount,
      orderTotal: total,
      coachAmountReceived: priceUnitAmount,
      applicationFeeTotal: participantFee + coachFee,
    });
  });
});
