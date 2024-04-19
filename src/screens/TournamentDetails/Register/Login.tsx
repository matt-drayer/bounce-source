import React from 'react';
import FormLogin from 'components/forms/FormLogin';
import Header from './Header';
import { RegisterProps, Steps } from './types';

export default function Login({ setSteps, handleNext }: RegisterProps) {
  return (
    <div className="tournament-register-form h-full">
      <div className="px-6 pt-6">
        <Header title="Register" cta="Login" />
      </div>
      <div className="mt-2 h-full">
        <FormLogin
          isFormOnly
          isShowSignupLink
          shouldSkipReload
          toggleSignup={() => setSteps(Steps.CreateAccount)}
          formWrapperClassName="p-6 pb-8"
          buttonWrapperClassName="px-6 pb-6"
          spacerClassName="space-y-6"
          handleAuthComplete={() => handleNext()}
        />
      </div>
    </div>
  );
}
