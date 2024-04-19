import * as React from 'react';

type Props = {};

const SponsoredBy = (props: Props) => {
  return (
    <div className="flex flex-col border-t border-color-border-input-lightmode pt-ds-3xl dark:border-color-border-input-darkmode">
      <h2 className="typography-product-heading-compact mb-ds-2xl">Sponsored by</h2>
    </div>
  );
};

export default SponsoredBy;
