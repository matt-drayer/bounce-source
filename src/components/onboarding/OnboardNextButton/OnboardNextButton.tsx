import React from 'react';

const DEFALT_BUTTON_TEXT = 'Next';
const DEFAULT_BOTTOM_MESSAGE = "Don't worry - you'll be able to edit this later.";

interface Props {
  buttonText?: string;
  isDisabled: boolean;
  bottomMessage?: React.ReactNode;
}

const OnboardNextButton: React.FC<Props> = ({ buttonText, isDisabled, bottomMessage }) => {
  return (
    <div className="mx-auto w-full max-w-xl lg:max-w-onboard-content-container">
      <div>
        <button type="submit" className="button-rounded-full-primary w-full" disabled={isDisabled}>
          {buttonText ? buttonText : DEFALT_BUTTON_TEXT}
        </button>
      </div>
      <div className="mt-4 text-center text-xs leading-5 text-gray-500">
        {bottomMessage ? bottomMessage : DEFAULT_BOTTOM_MESSAGE}
      </div>
    </div>
  );
};

export default OnboardNextButton;
