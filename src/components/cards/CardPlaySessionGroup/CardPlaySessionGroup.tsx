import * as React from 'react';
import { DUPR_IMAGES } from 'constants/sports';
import { pluralize } from 'utils/shared/pluralize';
import ChatBubble from 'svg/ChatBubble';
import Clock from 'svg/Clock';
import Location from 'svg/Location';
import User from 'svg/User';
import classNames from 'styles/utils/classNames';
import { Props } from './props';

export default function CardPlaySessionGroup({
  imageUrl,
  title,
  startTime,
  endTime,
  courtName,
  participantCount,
  participantLimit,
  organizerName,
  commentCount,
  isParticipant,
  skillRatingMinimum,
  skillRatingMaximum,
  date,
  isShowDate,
}: Props) {
  const isUnlimited = !participantLimit;
  const remainingSpots = (participantLimit || 0) - (participantCount || 0);
  const spotsText = isParticipant
    ? 'Going'
    : isUnlimited
    ? 'Unlimited'
    : `${pluralize({
        count: remainingSpots,
        singular: 'spot',
        plural: 'spots',
      })} left`;

  const skillRatingText = !skillRatingMaximum
    ? 'All Levels'
    : `${(skillRatingMinimum || 0).toFixed(2)}-${skillRatingMaximum?.toFixed(2)}`;
  const skillImagePreset = DUPR_IMAGES.find((preset) => {
    if (!skillRatingMaximum && !preset.maxRating) {
      return true;
    }

    return (skillRatingMaximum || 0) <= (preset.maxRating || 0);
  });
  const skillImageMobileUrl = skillImagePreset?.mobileSquarePath;
  const skillImageDesktopUrl = skillImagePreset?.desktopSquarePath;

  return (
    <div>
      <div className="h-full">
        <div className="flex h-full grow">
          <div className="mr-4 flex shrink-0 flex-col lg:mr-4">
            <div className="relative">
              {!!imageUrl && (
                <img
                  src={imageUrl}
                  alt=""
                  className="block h-[108px] w-[108px] rounded-lg lg:h-[156px] lg:w-[156px]"
                />
              )}
              {!imageUrl && (
                <>
                  <img
                    src={skillImageMobileUrl}
                    alt="Player rating"
                    className="block h-[108px] w-[108px] rounded-lg lg:hidden"
                  />
                  <img
                    src={skillImageDesktopUrl}
                    alt="Player rating"
                    className="hidden rounded-lg lg:block  lg:h-[156px] lg:w-[156px]"
                  />
                </>
              )}
              {!!skillRatingText && (
                <div className="absolute left-1/2 top-1/2 m-auto w-full -translate-x-1/2 -translate-y-1/2 transform">
                  <div className="text-xs font-semibold text-color-text-darkmode-primary lg:text-sm">
                    DUPR
                  </div>
                  <div className="mt-1.5 text-base font-semibold text-color-text-darkmode-primary lg:mt-2 lg:text-2xl">
                    {skillRatingText}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex grow flex-col lg:min-h-[140px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center rounded-2xl bg-color-bg-lightmode-secondary px-2 py-0.5 text-xs font-medium text-color-text-lightmode-tertiary dark:bg-color-bg-darkmode-secondary">
                <ChatBubble className="mr-1 h-4 w-4" />
                <span>
                  {pluralize({
                    count: commentCount,
                    singular: 'Comment',
                    plural: 'Comments',
                  })}
                </span>
              </div>
              <div
                className={classNames(
                  'text-xs font-medium lg:text-sm',
                  isParticipant
                    ? 'text-brand-fire-500'
                    : 'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
                )}
              >
                {spotsText}
              </div>
            </div>
            <div className="mt-1 flex text-left text-base font-bold leading-normal text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-3xl lg:leading-10">
              {title}
            </div>
            <div className="mt-1 space-y-1 lg:mt-2 lg:space-y-2">
              <div className="flex items-center text-xs text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary lg:text-sm">
                <Clock className="mr-1 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />{' '}
                {isShowDate ? `${date} @ ` : ''}
                {startTime.replace(' ', '')} - {endTime.replace(' ', '')}
              </div>
              <div className="flex items-center text-xs text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary lg:text-sm">
                <Location className="mr-1 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />{' '}
                <span>{courtName}</span>
              </div>
              <div className="flex items-center text-xs text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary lg:text-sm">
                <User className="mr-1 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />{' '}
                {organizerName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
