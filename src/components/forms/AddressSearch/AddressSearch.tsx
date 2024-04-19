import React from 'react';
import { Combobox } from '@headlessui/react';
import classNames from 'styles/utils/classNames';

interface Props {
  handleSubmit: (address: google.maps.places.AutocompletePrediction | null) => void;
  handleAutcompleteSuggestions: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addressString: string;
  suggestedAddresses: google.maps.places.AutocompletePrediction[];
  activeAutocompleteAddress: google.maps.places.AutocompletePrediction | null;
  placeholder: string;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
}

export default function AddressSearch({
  handleSubmit,
  suggestedAddresses,
  addressString,
  activeAutocompleteAddress,
  handleAutcompleteSuggestions,
  placeholder,
  className,
  id,
  name,
  autoComplete,
  type,
  required,
  onBlur,
  onFocus,
  disabled,
}: Props) {
  return (
    <Combobox as="div" className="w-full" value={activeAutocompleteAddress} onChange={handleSubmit}>
      <Combobox.Label className="hidden">Address</Combobox.Label>
      <div className="relative">
        <Combobox.Input
          id={id}
          name={name}
          autoComplete={autoComplete}
          type={type}
          className={classNames(className, disabled && 'cursor-not-allowed select-none opacity-50')}
          placeholder={placeholder}
          required={required}
          onChange={(a) => !disabled && handleAutcompleteSuggestions(a)}
          onBlur={onBlur}
          onFocus={onFocus}
          value={addressString}
          displayValue={(a: google.maps.places.AutocompletePrediction | null) => {
            return a?.description || addressString;
          }}
        />
        {suggestedAddresses?.length > 0 && (
          <Combobox.Options className="absolute top-8 z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-2 text-base shadow-popover ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {suggestedAddresses.map((address) => (
              <Combobox.Option
                key={address.place_id}
                value={address}
                className={({ active }) =>
                  classNames(
                    'relative cursor-pointer select-none py-2 pl-4 pr-4 hover:bg-color-bg-lightmode-invert hover:text-color-text-lightmode-invert',
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'font-semibold')}>
                      {address.description}
                    </span>
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
