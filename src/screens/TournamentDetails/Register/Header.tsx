import React from 'react';

type HeaderProps = {
  title: string;
  cta?: string;
};

const Header: React.FC<HeaderProps> = ({ title, cta }) => {
  return (
    <div>
      <h2 className="typography-product-heading-mobile text-color-text-brand dark:text-color-text-brand">
        {title}
      </h2>
      {!!cta && (
        <p className="typography-product-subheading mt-8 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          {cta}
        </p>
      )}
    </div>
  );
};

export default Header;
