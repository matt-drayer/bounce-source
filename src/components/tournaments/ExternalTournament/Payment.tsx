import * as React from 'react';
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { PaymentElement, useElements } from '@stripe/react-stripe-js';
import { ExternalTournament } from 'constants/tournaments';
import { createExternalTournamentPayment } from 'services/client/payments/createExternalTournamentPayment';
import { useStripe } from 'hooks/useStripe';
import ChevronLeftIcon from 'svg/ChevronLeft';
import { TournamentRequirements } from 'components/tournaments/ExternalTournament/RegisterForm';

interface Props {
  tournament: ExternalTournament;
  requirements: TournamentRequirements;
  tournamentSlug: string;
  onSubmit(): void;
  back(): void;
}

const Payment = ({ onSubmit, back, tournament, tournamentSlug, requirements }: Props) => {
  const { stripe } = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!elements) {
      Sentry.captureException(
        new Error('Failed to initialize ELEMENTS for Stripe for tournament payment'),
      );
    }
  }, [elements]);

  useEffect(() => {
    if (!stripe) {
      Sentry.captureException(new Error('Failed to initialize STRIPE for tournament payment'));
    }
  }, [stripe]);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
          return;
        }

        setIsLoading(true);

        try {
          const { setupIntent, error } = await stripe.confirmSetup({
            elements,
            redirect: 'if_required',
            confirmParams: { return_url: window.location.href },
          });

          if (error) {
            Sentry.captureException(error);
            alert(
              'There was an error signing up for the tournament. Refresh the page and try again.',
            );
            setIsLoading(false);
            return;
          }

          await createExternalTournamentPayment<{
            requirements: TournamentRequirements;
            tournamentId: string;
            providerCardId: string;
          }>(
            {
              requirements: {
                ...requirements,
                amount: requirements.amount * 100,
              },
              tournamentId: tournament.airtableId,
              providerCardId: setupIntent?.payment_method as string,
            },
            tournamentSlug,
          );

          onSubmit();

          setIsLoading(false);
        } catch (error) {
          Sentry.captureException(error);
          alert(
            'There was an error signing up for the tournament. Refresh the page and try again.',
          );
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <p className="mb-8 mt-8 flex text-[1.12rem] font-semibold text-brand-gray-1000">
        <button type="button" onClick={() => back()}>
          <ChevronLeftIcon className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
        Payment
      </p>

      <PaymentElement
        options={{
          defaultValues: {},
          fields: {
            billingDetails: {
              name: 'auto',
            },
          },
        }}
      />

      <button
        disabled={!stripe || !elements || isLoading}
        type="submit"
        className="button-rounded-inline-background-bold mt-8 flex h-[39px] w-full items-center justify-center text-[1rem] font-medium italic"
      >
        {isLoading ? 'Loading...' : 'Register'}
      </button>
    </form>
  );
};

export default Payment;
