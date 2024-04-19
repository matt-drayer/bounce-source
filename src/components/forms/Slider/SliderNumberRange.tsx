import React, { useState } from 'react';
import classNames from 'styles/utils/classNames';
import { MultiRangeBackground } from './styles';

type SliderProps = {
  rangeMinimum: number;
  rangeMaximum: number;
  valueMinimum: number;
  valueMaximum: number;
  setValueMinumum: (value: number) => void;
  setValueMaximum: (value: number) => void;
  step: number;
  decimals?: number;
  isDisabled?: boolean;
  prefix?: string;
};

const THUMB_WIDTH_REM = 1.5;
const THUMB_WIDTH_PX = THUMB_WIDTH_REM * 16;

const THUMB_OFFSET_PERCENT = THUMB_WIDTH_PX / 302;

export default function SliderMultiNumberRange({
  rangeMinimum,
  rangeMaximum,
  valueMinimum,
  valueMaximum,
  setValueMinumum,
  setValueMaximum,
  step,
  decimals,
  isDisabled,
  prefix = '',
}: SliderProps) {
  const changeMinimumValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    const newMinValue = !isNaN(newValue)
      ? Math.max(Math.min(newValue, valueMaximum), rangeMinimum)
      : Math.min(0, valueMaximum);
    setValueMinumum(
      decimals || decimals === 0 ? parseFloat(newMinValue.toFixed(decimals)) : newMinValue,
    );
  };

  const changeMaximumValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    const newMaxValue = !isNaN(newValue)
      ? Math.min(Math.max(newValue, valueMinimum), rangeMaximum)
      : Math.max(0, valueMinimum);
    setValueMaximum(
      decimals || decimals === 0 ? parseFloat(newMaxValue.toFixed(decimals)) : newMaxValue,
    );
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .slider-number-range input[type='range']::-webkit-slider-thumb {
            pointer-events: all;
            -webkit-appearance: none;
            height: ${THUMB_WIDTH_REM}rem;
            width: ${THUMB_WIDTH_REM}rem;
            margin-top: 0.5rem
          }
          
          .slider-number-range input[type='range']::-moz-range-thumb {
            pointer-events: all;
            -webkit-appearance: none;
            height: ${THUMB_WIDTH_REM}rem;
            width: ${THUMB_WIDTH_REM}rem;
            margin-top: 0.5rem
          }

          .slider-number-range input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          .slider-number-range input[type=number] {
            -moz-appearance: textfield;
          }`,
        }}
      />
      <div
        className={classNames(
          'slider-number-range flex flex-col items-center justify-start',
          isDisabled && 'opacity-40',
        )}
      >
        <div className="relative w-full">
          <div>
            <input
              className={classNames(
                'pointer-events-none absolute h-0 w-full appearance-none ring-opacity-0 ring-offset-transparent focus:ring-opacity-0 focus:ring-offset-transparent dark:ring-opacity-0 dark:ring-offset-transparent focus:dark:ring-opacity-0 focus:dark:ring-offset-transparent',
                isDisabled ? 'cursor-default' : 'cursor-pointer',
              )}
              style={{ zIndex: valueMinimum > rangeMaximum - 5 * step ? 5 : 3 }}
              type="range"
              step={step}
              min={rangeMinimum}
              max={rangeMaximum}
              value={valueMinimum}
              onChange={changeMinimumValue}
              disabled={isDisabled}
            />
            <input
              className={classNames(
                'pointer-events-none absolute h-0 w-full appearance-none ring-opacity-0 ring-offset-transparent focus:ring-opacity-0 focus:ring-offset-transparent dark:ring-opacity-0 dark:ring-offset-transparent focus:dark:ring-opacity-0 focus:dark:ring-offset-transparent',
                isDisabled ? 'cursor-default' : 'cursor-pointer',
              )}
              style={{ zIndex: 4 }}
              type="range"
              step={step}
              min={rangeMinimum}
              max={rangeMaximum}
              value={valueMaximum}
              onChange={changeMaximumValue}
              disabled={isDisabled}
            />
            <div className="relative">
              <div
                style={{ zIndex: 1 }}
                className="absolute h-2 w-full rounded bg-color-bg-lightmode-secondary dark:bg-color-bg-darkmode-secondary"
              ></div>
              <MultiRangeBackground
                className="absolute bottom-0 top-0 h-2 rounded-md bg-color-bg-lightmode-invert dark:bg-color-bg-darkmode-invert"
                valueMinimum={valueMinimum}
                valueMaximum={valueMaximum}
                rangeMinimum={rangeMinimum}
                rangeMaximum={rangeMaximum}
                thumbWidth={`${THUMB_WIDTH_REM}rem`}
              >
                <p className="typography-product-body-highlight absolute bottom-6 left-0 mt-1 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">{`${prefix}${valueMinimum}`}</p>
                <p className="typography-product-body-highlight absolute bottom-6 right-0 mt-1 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">{`${prefix}${valueMaximum}`}</p>
              </MultiRangeBackground>
            </div>
          </div>
          <div className="mt-6 flex shrink items-center justify-between">
            <div className="relative inline-flex min-w-0 flex-1">
              {!!prefix && (
                <div className="absolute bottom-0 left-3 top-0 my-auto flex items-center text-sm text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                  {prefix}
                </div>
              )}
              <input
                type="number"
                onChange={changeMinimumValue}
                value={
                  `${valueMinimum}`.length > 1
                    ? `${valueMinimum}`.replace(/^0+|[^0-9.]/g, '')
                    : `${valueMinimum}`
                }
                className="min-w-0 flex-1 rounded border-none bg-color-bg-input-lightmode-primary px-3 py-2 text-center dark:bg-color-bg-input-darkmode-primary"
                disabled={isDisabled}
              />
            </div>
            <span className="mx-4 flex items-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              -
            </span>
            <div className="relative inline-flex min-w-0 flex-1">
              {!!prefix && (
                <div className="absolute bottom-0 left-3 top-0 my-auto flex items-center text-sm text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                  {prefix}
                </div>
              )}
              <input
                type="number"
                onChange={changeMaximumValue}
                value={
                  `${valueMaximum}`.length > 1
                    ? `${valueMaximum}`.replace(/^0+|[^0-9.]/g, '')
                    : `${valueMaximum}`
                }
                className="min-w-0 flex-1 rounded border-none bg-color-bg-input-lightmode-primary px-3 py-2 text-center dark:bg-color-bg-input-darkmode-primary"
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
