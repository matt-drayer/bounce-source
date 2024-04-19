import React from 'react';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import OrangeDot from 'svg/Dot';
import Format from 'svg/Format';
import Details from 'svg/RacketTwo';
import Prizes from 'svg/Trophy';
import { EventProps, EventPropsForForm } from './types';
import {
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
  formatDate,
  formatDateRange,
  formatTime,
  getGroupFormatName,
  getScoringFormatName,
  isShowGroupFormat,
  isShowScoringFormat,
} from './utils';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const EventDetails = ({
  group,
  hasPrizes,
}: {
  group: EventProps['event']['groups'][0];
  hasPrizes?: boolean;
}) => {
  if (!group) {
    return null;
  }

  const startDateObject = new Date(group.startsAt);
  const endDateObject = new Date(group.endsAt);
  const dayOfWeek = startDateObject.getDay();
  const dayName = DAYS_OF_WEEK[dayOfWeek];
  const teamsInGroup = group.teams.length;
  const teamLimit = group.teamLimit;
  const isTeamsOverLimit = teamsInGroup >= teamLimit;

  return (
    <div className="flex flex-col rounded-xl bg-color-bg-lightmode-tertiary p-ds-3xl dark:bg-color-bg-darkmode-tertiary">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <h2 className="typography-product-heading-compact text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          {group.title}
        </h2>
        {group.priceUnitAmount ? (
          <div className="flex gap-ds-md">
            <p className="typography-product-body-highlight text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              Event Fee
            </p>
            <p className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              {convertUnitPriceToFormattedPrice(group.priceUnitAmount).priceDisplay}
            </p>
          </div>
        ) : (
          <p className="typography-product-element-label rounded-full bg-color-bg-lightmode-primary text-color-text-brand dark:bg-color-bg-darkmode-primary dark:text-color-text-brand">
            Event Full
          </p>
        )}
      </div>
      <div className="mt-ds-lg flex flex-wrap items-center justify-start gap-ds-sm md:mt-ds-sm">
        <p className="typography-product-body-highlight text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {formatDate({ date: group.startsAt })}
        </p>
        <OrangeDot className="h-1 w-1 text-color-text-brand" />
        <p className="typography-product-body-highlight text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {dayName}
        </p>
        <OrangeDot className="h-1 w-1 text-color-text-brand" />
        <p className="typography-product-body-highlight text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {formatTime({ date: startDateObject })} - {formatTime({ date: endDateObject })}
        </p>
      </div>
      {!!isShowGroupFormat(group.format) && (
        <div className="mt-ds-2xl flex flex-col gap-ds-md md:flex-row">
          <p className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            Event format
          </p>
          <p className="typography-product-body-highlight text-color-text-brand dark:text-color-text-brand">
            {getGroupFormatName(group.format)}
          </p>
        </div>
      )}

      <div className="mt-ds-3xl flex w-full flex-col justify-between gap-10 md:flex-row md:gap-2">
        <div className="flex w-full flex-col md:w-1/3">
          <div className="flex items-center">
            <Format className="mr-2 h-5 w-5 text-color-text-lightmode-primary" />
            <p className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Format
            </p>
          </div>
          <ul className="mt-ds-md list-disc space-y-ds-xs pl-5 marker:text-color-brand-primary">
            {!!group.minimumNumberOfGames && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Min number of games {group.minimumNumberOfGames}
              </li>
            )}
            {!!group.minimumRating && !!group.maximumRating && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Rating {group.minimumRating} - {group.maximumRating}
              </li>
            )}
            {!!group.minimumRating && !group.maximumRating && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Rating {group.minimumRating} and up
              </li>
            )}
            {!group.minimumRating && !!group.maximumRating && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Rating up to {group.maximumRating}
              </li>
            )}
            {!!group.minimumAge && !!group.maximumAge && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Ages {group.minimumAge} - {group.maximumAge}
              </li>
            )}
            {!!group.minimumAge && !group.maximumAge && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Ages {group.minimumAge} and up
              </li>
            )}
            {!group.minimumAge && !!group.maximumAge && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                All ages up to {group.maximumAge}
              </li>
            )}
            {teamLimit && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Max number of teams {teamLimit}
              </li>
            )}
          </ul>
        </div>
        <div className="flex w-full flex-col md:w-1/3">
          <div className="flex items-center">
            <Details className="mr-2 h-5 w-5 text-color-text-lightmode-primary" />
            <p className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Play details
            </p>
          </div>
          <ul className="mt-ds-md list-disc space-y-ds-xs pl-5 marker:text-color-brand-primary">
            {!!group.totalPoints && !!group.winBy && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Games to {group.totalPoints} win by {group.winBy}
              </li>
            )}
            {!!group.totalPoints && !group.winBy && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Games to {group.totalPoints}
              </li>
            )}
            {!!group.winBy && !group.totalPoints && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Win by {group.winBy}
              </li>
            )}
            {!!group.gamesPerMatch && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                {group.gamesPerMatch} set
              </li>
            )}
            {isShowScoringFormat(group.scoringFormat) && (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                {getScoringFormatName(group.scoringFormat)}
              </li>
            )}
          </ul>
        </div>
        <div className="flex w-full flex-col md:w-1/3">
          <div className="flex items-center">
            <Prizes className="mr-2 h-5 w-5 text-color-text-lightmode-primary" />
            <p className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Prizes
            </p>
          </div>
          <ul className="mt-ds-md list-disc space-y-ds-xs pl-5 marker:text-color-brand-primary">
            {hasPrizes ? (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                Learn more about prizes in the FAQ section
              </li>
            ) : (
              <li className="typography-product-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                This tournament does not have prizes
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function Events({ event, eventGroups, isReview }: EventPropsForForm) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="typography-product-heading-compact text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
        Events
      </h2>
      {!isReview &&
        (event.groups || []).map((group, index) => (
          <EventDetails key={index} group={group} hasPrizes={event.hasPrizes} />
        ))}
      {isReview &&
        (eventGroups || []).map((group, index) => (
          <EventDetails key={index} group={group} hasPrizes={event.hasPrizes} />
        ))}
    </div>
  );
}
