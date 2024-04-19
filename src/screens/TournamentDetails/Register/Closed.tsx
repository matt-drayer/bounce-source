import React, { useEffect, useState } from 'react';
import { ButtonText } from 'components/Button';
import classNames from 'styles/utils/classNames';
import Header from './Header';
import { RegisterProps, Steps } from './types';
import { formatDate } from '../utils';

interface Props extends RegisterProps {}

const calculateTimeLeft = (date: string) => {
  const difference = +new Date(date) - +new Date();
  if (difference <= 0) {
    // If the current time is past the target date, return all zeroes
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  } else {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
};

const TimeBlock = ({ time, label }: { time: number; label: string }) => {
  return (
    <div className="flex w-1/4 flex-col items-center rounded-md bg-color-bg-lightmode-tertiary p-2 dark:bg-color-bg-darkmode-tertiary">
      <p className="typography-product-heading text-color-text-brand">{time}</p>
      <p className="typography-product-body text-color-text-brand">{label}</p>
    </div>
  );
};

export default function Closed({ setSteps, event }: Props) {
  const registrationClosedAt = event.registrationDeadlineDateTime;
  const registrationOpensAt = event.registrationOpenDateTime;
  const isCountdown =
    !!registrationOpensAt && Date.now() <= new Date(registrationOpensAt).getTime();
  const date = isCountdown ? registrationOpensAt : registrationClosedAt;
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date));

  useEffect(() => {
    if (!registrationClosedAt && !registrationOpensAt) {
      setSteps(Steps.AddEvent);
    }
  }, [registrationClosedAt, registrationOpensAt]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCountdown) {
      timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(date));
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [date, timeLeft, isCountdown]); // Empty dependency array ensures this effect runs only once

  if (!date) {
    return null;
  }

  return (
    <div
      className={classNames(
        'tournament-register-form flex w-full flex-col items-start gap-8 rounded-lg p-6 shadow-md',
      )}
    >
      <Header title={!isCountdown ? 'Registration closed' : 'Register'} />
      <div className="flex w-full flex-col items-center gap-2">
        <h3 className="typography-product-body text-color-text-lightmode-secondary  dark:text-color-text-darkmode-secondary">
          Registration {isCountdown ? 'opens' : 'closed'}
        </h3>
        <p className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          {formatDate({ date })}
        </p>
      </div>
      {isCountdown ? (
        <div className="flex w-full items-center justify-between gap-2">
          <TimeBlock time={timeLeft.days} label="Days" />
          <TimeBlock time={timeLeft.hours} label="Hours" />
          <TimeBlock time={timeLeft.minutes} label="Minutes" />
          <TimeBlock time={timeLeft.seconds} label="Seconds" />
        </div>
      ) : (
        <div className="flex w-full justify-center text-center">
          <ButtonText className="typography-product-button-label-medium text-color-text-brand">
            Contact
          </ButtonText>
        </div>
      )}
    </div>
  );
}
