import React from 'react';
import { OrderTotal } from 'utils/shared/money/calculateEventOrderTotal';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';

export default function OrderItemList({ orderTotal }: { orderTotal: OrderTotal }) {
  return (
    <div className="space-y-4 rounded-lg border border-color-brand-primary bg-color-bg-lightmode-brand-secondary p-ds-lg dark:bg-color-bg-darkmode-brand-secondary">
      {!!orderTotal.registrationFee && (
        <div className="typography-product-body-highlight flex items-center justify-between">
          <div>Tournament Registration</div>
          <div>{convertUnitPriceToFormattedPrice(orderTotal.registrationFee).priceDisplay}</div>
        </div>
      )}
      {(orderTotal.registrationGroups || []).map((group, index) =>
        !group.priceUnitAmount ? null : (
          <div
            key={group.id}
            className="typography-product-body-highlight flex items-center justify-between"
          >
            <div>{`Event: ${group.title}`}</div>
            <div>{convertUnitPriceToFormattedPrice(group.priceUnitAmount).priceDisplay}</div>
          </div>
        ),
      )}
      {!!orderTotal.subtotal && (
        <div className="typography-product-body-highlight flex items-center justify-between">
          <div>Taxes and fees</div>
          <div>{orderTotal.processingFeePercentage}%</div>
        </div>
      )}
      {!!orderTotal.total && (
        <div className="typography-product-subheading flex items-center justify-between text-color-text-brand">
          <div>Total</div>
          <div>{convertUnitPriceToFormattedPrice(orderTotal.total).priceDisplay}</div>
        </div>
      )}
    </div>
  );
}
