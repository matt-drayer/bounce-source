import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { Stripe as StripeType, loadStripe } from '@stripe/stripe-js';

// import { Stripe } from '@capacitor-community/stripe';

// const stripe = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);

interface StripeParams {
  stripe: StripeType | null;
  stripeMobileNative?: StripeType | undefined; // TODO: Implement
}

export const StripeContext = React.createContext<StripeParams>({ stripe: null });

// TODO: Integrate capacitor Stripe (or custom build) to get a more native experience
export const StripeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [stripe, setStripe] = React.useState<StripeType | null>(null);

  React.useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);

        if (!stripeInstance) {
          Sentry.captureException(new Error('Failed to initialize Stripe'));
        }

        setStripe(stripeInstance);
      } catch (error) {
        Sentry.captureException(error);
      }
    };
    initializeStripe();
  }, []);

  return <StripeContext.Provider value={{ stripe }}>{children}</StripeContext.Provider>;
};
