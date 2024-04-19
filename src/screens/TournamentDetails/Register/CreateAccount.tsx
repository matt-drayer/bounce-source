import React, { useState } from 'react';
import EyeIcon from 'svg/EyeIcon';
import FormSignup from 'components/forms/FormSignup';
import Header from './Header';
import { RegisterProps, Steps } from './types';

export default function CreateAccount({ setSteps, handleNext }: RegisterProps) {
  return (
    <div className="tournament-register-form h-full">
      <div className="px-6 pt-6">
        <Header title="Register" cta="Create an account" />
      </div>
      <div className="mt-2 h-full">
        <FormSignup
          isFormOnly
          isShowLoginLink
          shouldSkipReload
          formWrapperClassName="p-6 pb-8"
          buttonWrapperClassName="px-6 pb-6"
          spacerClassName="space-y-6"
          toggleLogin={() => setSteps(Steps.Login)}
          handleAuthComplete={() => handleNext()}
        />
      </div>
    </div>
  );
}
