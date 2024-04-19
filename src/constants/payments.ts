import * as React from 'react';
import { PaymentFulfillmentChannelsEnum } from 'types/generated/client';
import PaymentLogo from 'svg/PaymentLogo';

// import Stripe from 'stripe';

export enum SaleStatus {
  Unpaid = 'UNPAID',
  Paid = 'PAID',
  Refund = 'REFUND',
}
// export type SubscriptionStatusValues = Stripe.Subscription.Status;

export const SubscriptionStatus: Record<string, string> = {
  Active: 'active',
  Canceled: 'canceled',
  Incomplete: 'incomplete',
  IncompleteExpired: 'incomplete_expired',
  PastDue: 'past_due',
  Trialing: 'trialing',
  Unpaid: 'unpaid',
};

// export type InvoiceStatusValues = Stripe.Invoice.Status;

export const InvoiceStatus: Record<string, string> = {
  Deleted: 'deleted',
  Draft: 'draft',
  Open: 'open',
  Paid: 'paid',
  Uncollectible: 'uncollectible',
  Void: 'void',
};

export enum PaymentProcessor {
  Stripe = 'STRIPE',
  Paypal = 'PAYPAL',
  Credit = 'CREDIT',
}

export enum DiscountType {
  Percent = 'PERCENT',
  Dollar = 'DOLLAR',
  FixedPrice = 'FIXED_PRICE',
}

export enum ProductStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Archived = 'ARCHIVED',
  DELETED = 'DELETED',
}

export interface CheckoutBody {
  // TODO: This pattern is deprecated. Update client and server to use Authorization: Bearer {token} header.
  token: string;
  stripePriceId: string;
}

export interface PortalBody {
  // TODO: This pattern is deprecated. Update client and server to use Authorization: Bearer {token} header.
  token: string;
}

export const CardBrandsDisplayName: Record<string, string> = {
  amex: 'Amex',
  cartes_bancaires: 'Cartes Bancaires',
  diners_club: 'Diners Club',
  discover: 'Discover',
  jcb: 'JCB',
  mastercard: 'Mastercard',
  visa: 'Visa',
  unionpay: 'Unionpay',
};

type FulfillmentDisplay = Record<
  PaymentFulfillmentChannelsEnum,
  {
    Logo?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    name?: string;
    description: string;
  }
>;

export const paymentFulfillChannelsCoach: FulfillmentDisplay = {
  [PaymentFulfillmentChannelsEnum.OnPlatform]: {
    Logo: PaymentLogo,
    description:
      'Bounce will process the payment and deposit the payment into your account. The player will be charged a 10% fee. In the case of a cancellation, we will distribute refunds according to our policy. All you have to do is show up and coach.',
  },
  [PaymentFulfillmentChannelsEnum.OffPlatform]: {
    name: 'Off-platform',
    description: 'Payment will be organized independently between you and the player.',
  },
  [PaymentFulfillmentChannelsEnum.ParticipantsChoice]: {
    name: "Player's Choice",
    description: 'The player can choose to pay using Bounce or organize independently with you.',
  },
};

export const paymentFulfillChannelsDisplay: FulfillmentDisplay = {
  [PaymentFulfillmentChannelsEnum.OnPlatform]: {
    Logo: PaymentLogo,
    description: 'The coach uses Bounce to manage payments.',
  },
  [PaymentFulfillmentChannelsEnum.OffPlatform]: {
    name: 'Off-platform',
    description: 'Payment will be organized independently between the coach and player.',
  },
  // NOTE: Including this to keep TypeScript happy
  [PaymentFulfillmentChannelsEnum.ParticipantsChoice]: {
    name: "Player's Choice",
    description:
      'The player can choose to pay using Bounce or organize independently with the coach.',
  },
};
