import React, { useState } from 'react';
import { useAuthModals } from 'hooks/useAuthModals';
import BounceLogoSplash from 'svg/BounceLogoSplash';
import { Button } from 'components/Button';
import classNames from 'styles/utils/classNames';

type SignupProps = {
  onSubmitSignup?: () => void;
  ignoreText?: string;
  ignoreAction?: () => void;
  title?: string;
  cta?: string;
  isShowMobile?: boolean;
};

export default function BottomRegisterBar({
  onSubmitSignup,
  ignoreText,
  ignoreAction,
  isShowMobile,
}: SignupProps) {
  const { openSignupModal, ModalLogin, ModalSignup } = useAuthModals();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          openSignupModal();
        }}
        className={classNames(
          'fixed bottom-0 h-[4.625rem] w-full items-center border-t border-color-border-input-lightmode bg-color-bg-lightmode-primary bg-opacity-90 px-ds-2xl py-ds-sm backdrop-blur-sm dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary lg:py-ds-lg',
          isShowMobile ? 'flex' : 'hidden lg:flex',
        )}
      >
        <div className="hidden w-full items-center justify-between gap-ds-2xl lg:flex">
          <BounceLogoSplash className="h-10" />
          <div className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            We’ll ping you when there’s a tournament near you.
          </div>
          <input
            type="text"
            placeholder="First and last name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-base-form w-auto grow"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-base-form w-auto grow"
          />
          <Button type="submit" variant="brand" size="md" isInline className="h-10 py-2">
            Join Bounce
          </Button>
        </div>
        <div
          className={classNames(
            'mx-auto w-full max-w-sm justify-center',
            isShowMobile ? 'flex lg:hidden' : 'hidden',
          )}
        >
          <Button type="submit" variant="brand" size="md" className="py-ds-md">
            Join Bounce
          </Button>
        </div>
      </form>
      <div className={classNames('h-[4.625rem]', isShowMobile ? 'block' : 'hidden lg:block')}>
        &nbsp;
      </div>
      <ModalSignup
        isShowLoginLink
        defaultEmail={email}
        defaultName={name}
        handleSignupSuccess={onSubmitSignup}
        ignoreText={ignoreText}
        ignoreAction={ignoreAction}
      />
      <ModalLogin isShowSignupLink />
    </>
  );
}
