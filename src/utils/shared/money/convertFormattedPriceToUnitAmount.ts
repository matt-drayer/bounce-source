// NOTE: REALLY NEED UNIT TESTS FOR THIS FUNCTION
import { CURRENCY_USD } from 'constants/currency';

const USD_UNIT_CONVERSION_FACTOR = 100;

export function convertFormattedPriceToUnitAmount(
  formattedAmount: number,
  currency: string = CURRENCY_USD,
): number {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    // currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(formattedAmount);
  let zeroDecimalCurrency: boolean = true;

  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }

  if (zeroDecimalCurrency) {
    return formattedAmount;
  } else if (currency === CURRENCY_USD) {
    return Math.round(formattedAmount * USD_UNIT_CONVERSION_FACTOR);
  } else {
    return Math.round(formattedAmount * USD_UNIT_CONVERSION_FACTOR);
  }
}
