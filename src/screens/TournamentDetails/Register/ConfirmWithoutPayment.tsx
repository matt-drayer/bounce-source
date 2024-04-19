import React, { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { PostRequestPayload } from 'constants/payloads/tournamentsRegister';
import { OrderTotal } from 'utils/shared/money/calculateEventOrderTotal';
import { useApiGateway } from 'hooks/useApi';
import { Button } from 'components/Button';
import Header from './Header';
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

export default function ConfirmWithoutPayment({
  onSubmit,
  back,
  event: tournament,
  orderTotal,
  registrationFormData,
  invitationId,
  teamId,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { post: createTournamentPayment } = useApiGateway<PostRequestPayload>(REGISTER_API);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        setIsLoading(true);

        try {
          await createTournamentPayment({
            payload: {
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
      className="tournament-register-form flex h-full flex-col items-start"
    >
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="flex flex-auto flex-col px-6 pb-6 pt-6">
          <Header title="Register" cta="Confirm and join" />
          <div className="mt-8">
            <OrderItemList orderTotal={orderTotal} />
          </div>
        </div>
      </div>
      <div className="w-full px-6 pb-6">
        <Button disabled={isLoading} type="submit" variant="brand" size="lg">
          {isLoading ? 'Loading...' : 'Register'}
        </Button>
      </div>
    </form>
  );
}
