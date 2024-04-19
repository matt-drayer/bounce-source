import * as React from 'react';
import { useModal } from 'hooks/useModal';
import ModalLoginComponent, { Props as ModalLoginProps } from 'components/modals/ModalLogin';
import ModalSignupComponent, { Props as ModalSignupProps } from 'components/modals/ModalSignup';

export const useAuthModals = () => {
  const {
    isOpen: isLoginOpen,
    openModal: openLoginModal,
    closeModal: closeLoginModal,
  } = useModal();
  const {
    isOpen: isSignupOpen,
    openModal: openSignupModal,
    closeModal: closeSignupModal,
  } = useModal();

  const ModalLogin = React.useMemo(() => {
    const LoginWrapper = ({
      ...props
    }: Omit<ModalLoginProps, 'isOpen' | 'handleClose' | 'toggleSignup'> & {
      handleClose?: (value: boolean) => void;
      toggleSignup?: () => void;
    }) => {
      return (
        <ModalLoginComponent
          {...props}
          handleClose={props.handleClose || (() => closeLoginModal())}
          toggleSignup={
            props.toggleSignup ||
            (() => {
              closeLoginModal();
              openSignupModal();
            })
          }
          isOpen={isLoginOpen}
        />
      );
    };
    return LoginWrapper;
  }, [isLoginOpen]);

  const ModalSignup = React.useMemo(() => {
    const SignupWrapper = ({
      ...props
    }: Omit<ModalSignupProps, 'isOpen' | 'handleClose' | 'toggleLogin'> & {
      handleClose?: (value: boolean) => void;
      toggleLogin?: () => void;
    }) => {
      return (
        <ModalSignupComponent
          {...props}
          handleClose={props.handleClose || (() => closeSignupModal())}
          toggleLogin={
            props.toggleLogin ||
            (() => {
              closeSignupModal();
              openLoginModal();
            })
          }
          isOpen={isSignupOpen}
        />
      );
    };
    return SignupWrapper;
  }, [isSignupOpen]);

  return {
    isLoginOpen,
    openLoginModal,
    closeLoginModal,
    isSignupOpen,
    openSignupModal,
    closeSignupModal,
    ModalLogin,
    ModalSignup,
  };
};
