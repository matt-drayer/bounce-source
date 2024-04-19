import * as React from 'react';
import { LessonPricing } from 'services/client/payments/getLessonPricing';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';

const Pricing: React.FC<{ lessonPricing?: LessonPricing }> = ({ lessonPricing }) => {
  return (
    <div className="mt-4 text-sm">
      <div className="flex items-center justify-between">
        <div>Lesson Price</div>
        {!!lessonPricing && (
          <div>
            {convertUnitPriceToFormattedPrice(lessonPricing.orderSubtotal).priceDisplayFull}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>Taxes & Fees</div>
        {!!lessonPricing && (
          <div>
            {
              convertUnitPriceToFormattedPrice(lessonPricing.customerApplicationFee)
                .priceDisplayFull
            }
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-base font-medium">
        <div>Total</div>
        {!!lessonPricing && (
          <div>{convertUnitPriceToFormattedPrice(lessonPricing.orderTotal).priceDisplayFull}</div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
