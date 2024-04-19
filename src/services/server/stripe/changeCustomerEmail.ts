import stripe from 'services/server/stripe/instance';

interface Params {
  id: string;
  email: string;
}

const changeCustomerEmail = async ({ id, email }: Params) => {
  const stripeUser = await stripe.customers.update(id, {
    email,
  });

  return stripeUser;
};

export default changeCustomerEmail;
