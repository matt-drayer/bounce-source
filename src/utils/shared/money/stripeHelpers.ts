const FLAT_FEE = 0.3;
const VARIABLE_SALE_FEE = 0.029;

export const stripeProfitAfterFees = (revenueInDollars: number) => {
  const profit = revenueInDollars - revenueInDollars * VARIABLE_SALE_FEE - FLAT_FEE;
  return profit;
};

// NOTE: This is old and am using the function in convertUnitPriceToFormattedPrice
// export function formatAmountForDisplay(amount: number, currency: string): string {
//   let numberFormat = new Intl.NumberFormat(['en-US'], {
//     style: 'currency',
//     currency: currency,
//     // currencyDisplay: 'symbol', NOTE: currencyDisplay is for ES2020+
//   });
//   return numberFormat.format(amount);
// }
