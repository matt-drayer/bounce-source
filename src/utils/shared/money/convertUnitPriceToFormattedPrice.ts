import { CURRENCY_USD } from 'constants/currency';

// NOTE: USD is in cents, so we divide by 100
const USD_UNIT_CONVERSION_FACTOR = 100;

// NOTE: Need currencies in a constant or database table

// TODO: Use Intl.NumberFormat as seen in stripeHelpers to convert, format, and display prices
// Write tests for this function and ensure it gets the same output

// NOTE: Do we need to do anymore to ensure we are only working with integers?
// We should be fine if we round all multiplication if we can trust priceUnitAmount
export const convertUnitPriceToFormattedPrice = (
  priceUnitAmount: number,
  currency: string = CURRENCY_USD,
) => {
  let currencyFormatted = currency.toUpperCase();

  if (currencyFormatted === CURRENCY_USD) {
    const priceFormatted = priceUnitAmount / USD_UNIT_CONVERSION_FACTOR;
    const cents = priceUnitAmount % USD_UNIT_CONVERSION_FACTOR;
    const centsString =
      cents > 0
        ? `.${`${cents < 10 ? `${cents}`.padStart(2, '0') : `${cents}`.padEnd(2, '0')}`}`
        : '';
    const dollars = Math.floor(priceUnitAmount / USD_UNIT_CONVERSION_FACTOR);
    const priceDisplay = `$${dollars}${centsString}`;
    const priceDisplayFull = `$${priceFormatted.toFixed(2)}`;

    // NOTE: The below code is more generic and can be easily molden to any locale. It uses newer APIs, and currencyDisplay was only introduced to Safari in 2021
    // let numberFormat = new Intl.NumberFormat(['en-US'], {
    //   style: 'currency',
    //   currency: currency,
    //   // currencyDisplay: 'symbol', NOTE: currencyDisplay is for ES2020+
    // });
    // const priceDisplay = numberFormat.format(priceFormatted).replace(/\D00(?=\D*$)/, '');

    return {
      priceUnitAmount,
      priceFormatted:
        priceFormatted % 1 === 0 ? priceFormatted : parseFloat(priceFormatted.toFixed(2)),
      priceDisplay,
      priceDisplayFull,
    };
  } else {
    return {
      priceUnitAmount,
      priceFormatted: priceUnitAmount,
      priceDisplay: `${priceUnitAmount}`,
      priceDisplayFull: `${priceUnitAmount}`,
    };
  }
};
