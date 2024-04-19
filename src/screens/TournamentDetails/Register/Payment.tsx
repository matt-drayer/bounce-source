import * as React from 'react';
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { PostRequestPayload } from 'constants/payloads/tournamentsRegister';
import { OrderTotal } from 'utils/shared/money/calculateEventOrderTotal';
import { useApiGateway } from 'hooks/useApi';
import { Button } from 'components/Button';
import LoadingSkeleton from 'components/LoadingSkeleton';
import classNames from 'styles/utils/classNames';
import OrderItemList from './OrderItemList';
import { REGISTER_API, RegisterProps, RegistrationFormData } from './types';

interface Props extends RegisterProps {
  onSubmit: () => void;
  back?: () => void;
  orderTotal: OrderTotal;
  registrationFormData: RegistrationFormData;
  invitationId?: string;
  teamId?: string;
}

export default function Payment({
  onSubmit,
  back,
  event: tournament,
  orderTotal,
  registrationFormData,
  invitationId,
  teamId,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const { post: createTournamentPayment } = useApiGateway<PostRequestPayload>(REGISTER_API);

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
      className="tournament-register-form flex h-full flex-col items-start"
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

          await createTournamentPayment({
            payload: {
              providerCardId: setupIntent?.payment_method as string,
              tournamentId: tournament?.id,
              duprId: registrationFormData.duprId,
              birthday: registrationFormData.birthday,
              groups: registrationFormData.groups,
              invitationId: invitationId,
              teamId: teamId,
            },
          });

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
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="flex flex-auto flex-col px-6 pb-6 pt-6">
          <OrderItemList orderTotal={orderTotal} />
          <div className="mt-4">
            <div className={classNames(isStripeReady ? 'block' : 'hidden')}>
              <PaymentElement
                onReady={() => setIsStripeReady(true)}
                options={{
                  defaultValues: {},
                  fields: {
                    billingDetails: {
                      name: 'auto',
                    },
                  },
                }}
              />
            </div>
            <div className={classNames(isStripeReady ? 'hidden' : 'block')}>
              <div className="space-y-4">
                <div>
                  <LoadingSkeleton count={1} />
                  <LoadingSkeleton height="3rem" />
                </div>
                <div>
                  <LoadingSkeleton count={1} />
                  <LoadingSkeleton height="3rem" />
                </div>
                <div>
                  <LoadingSkeleton count={1} />
                  <LoadingSkeleton height="3rem" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-6 pb-6">
        <Button
          disabled={!stripe || !elements || isLoading}
          type="submit"
          variant="brand"
          size="lg"
        >
          {isLoading ? 'Loading...' : 'Register'}
        </Button>
      </div>
    </form>
  );
}
