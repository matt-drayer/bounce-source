import * as React from 'react';
import {
  PaymentElement,
  useElements,
  useStripe as useStripeInternal,
} from '@stripe/react-stripe-js';
import { SetupIntent, StripeError } from '@stripe/stripe-js';
import { RequestStatus } from 'constants/requests';

const AddCardForm: React.FC<{
  handleCompleteSetupIntent: (setupIntent: SetupIntent) => void;
  returnUrl: string;
}> = ({ handleCompleteSetupIntent, returnUrl }) => {
  const stripe = useStripeInternal();
  const elements = useElements();
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const [error, setError] = React.useState<undefined | StripeError>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!elements || !stripe) {
      return;
    }

    setRequestStatus(RequestStatus.InProgress);

    const { setupIntent, error } = await stripe?.confirmSetup({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: returnUrl,
        expand: ['payment_method'],
      },
    });

    if (error) {
      setError(error);
      setRequestStatus(RequestStatus.Error);
    } else if (setupIntent) {
      setRequestStatus(RequestStatus.Success);
      handleCompleteSetupIntent(setupIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <div className="mt-6">
        {!!error?.message && (
          <div className="mb-3 rounded border border-color-error p-4 text-center text-sm text-color-error">
            {error.message}
          </div>
        )}
        <button
          className="button-rounded-full-primary"
          type="submit"
          disabled={!stripe || !elements || requestStatus === RequestStatus.InProgress}
        >
          {requestStatus === RequestStatus.InProgress ? 'Adding card...' : 'Add credit card'}
        </button>
      </div>
    </form>
  );
};

export default AddCardForm;
