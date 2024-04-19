import * as React from 'react';
import { StripeContext } from 'context/StripeContext';

export const useStripe = () => {
  const { stripe } = React.useContext(StripeContext);
  return { stripe };
};
