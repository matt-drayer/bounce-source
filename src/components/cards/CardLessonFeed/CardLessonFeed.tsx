import * as React from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { lessonShortName } from 'constants/sports';
import { EMPTY_AVATAR_SRC } from 'constants/user';
import { LessonTypesEnum } from 'types/generated/client';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import Card from 'components/cards/Card';
import classNames from 'styles/utils/classNames';

const MAX_DISPLAY_PARTICIPANTS = 4;

interface Props {
  title: string;
  imageUrl: string;
  startTime: string;
  endTime: string;
  type: LessonTypesEnum;
  courtName: string;
  useShortName?: boolean;
  participants?: {
    id: string;
    name: string;
    image: string;
  }[];
  participantCount?: number | null;
  participantLimit?: number | null;
  coachName: string;
  coachImagePath: string;
  isCoach: boolean;
  isParticipant: boolean;
  priceUnitAmount: number;
}

const CardLessonFeed: React.FC<Props> = ({
  // imageUrl,
  title,
  startTime,
  endTime,
  type,
  courtName,
  participants,
  participantCount,
  participantLimit,
  coachName,
  coachImagePath,
  isCoach,
  priceUnitAmount,
}) => {
  // const fallbackImageUrlSquare = ImageSquareForLessonType[type];
  // const fallbackImageUrlWide = ImageWideForLessonType[type];
  const price = convertUnitPriceToFormattedPrice(priceUnitAmount).priceDisplay;
  const participantDisplayCount = Math.min(participantLimit || 0, MAX_DISPLAY_PARTICIPANTS);
  const placeholderParticipantList = new Array(participantDisplayCount).fill(null);
  const participantList = placeholderParticipantList.map((_, index) => {
    const matchingParticipant = participants?.[index];

    if (matchingParticipant) {
      return { ...matchingParticipant, isActive: true };
    } else {
      return {
        id: `placeholder-${index}`,
        name: 'Participant',
        image: EMPTY_AVATAR_SRC,
        isActive: false,
      };
    }
  });
  // const participantTopLeft = participantList[3];
  // const participantTopRight = participantList[2];
  // const participantBottomLeft = participantList[1];
  // const participantBottomRight = participantList[0];

  return (
    <Card>
      <div className="h-full p-2 lg:p-4">
        <div className="flex h-full grow">
          <div className="mr-2 flex flex-col lg:mr-4">
            <img
              src={getProfileImageUrlOrPlaceholder({ path: coachImagePath })}
              className="h-12 w-12 rounded-full object-cover object-center lg:hidden"
              alt={title}
            />
            <img
              src={getProfileImageUrlOrPlaceholder({ path: coachImagePath })}
              className="hidden h-36 w-36 rounded-full object-cover object-center lg:block"
            />
            <div className="flex grow flex-col items-center justify-end text-xs leading-tight text-brand-gray-400 lg:hidden lg:text-base lg:leading-none">
              <div>
                <span className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  {participantCount || 0}
                </span>
                /{participantLimit}
              </div>
              <div>filled</div>
            </div>
            {/* NOTE: Trying a less busy design
            {!!participantBottomRight && (
              <div className="mt-1.5 flex grow flex-col items-center justify-end -space-y-2">
                {!!participantTopRight && (
                  <div className="flex -space-x-1 lg:hidden">
                    {!!participantTopRight && (
                      <img
                        className={classNames(
                          'inline-block h-5 w-5 rounded-full ring-2 ring-white lg:h-8 lg:w-8',
                          !participantTopLeft.isActive ? 'grayscale' : 'grayscale-0',
                        )}
                        src={participantTopLeft.image}
                        alt={participantTopLeft.name}
                      />
                    )}
                    <img
                      className={classNames(
                        'inline-block h-5 w-5 rounded-full ring-2 ring-white lg:h-8 lg:w-8',
                        !participantTopRight.isActive ? 'grayscale' : 'grayscale-0',
                      )}
                      src={participantTopRight.image}
                      alt={participantTopRight.name}
                    />
                  </div>
                )}
                <div className="mt-1 flex -space-x-1 lg:hidden">
                  {!!participantBottomLeft && (
                    <img
                      className={classNames(
                        'inline-block h-5 w-5 rounded-full ring-2 ring-white lg:h-8 lg:w-8',
                        !participantBottomLeft.isActive ? 'grayscale' : 'grayscale-0',
                      )}
                      src={participantBottomLeft.image}
                      alt={participantBottomLeft.name}
                    />
                  )}
                  <img
                    className={classNames(
                      'inline-block h-5 w-5 rounded-full ring-2 ring-white lg:h-8 lg:w-8',
                      !participantBottomRight.isActive ? 'grayscale' : 'grayscale-0',
                    )}
                    src={participantBottomRight.image}
                    alt={participantBottomRight.name}
                  />
                </div>
              </div>
            )} */}
          </div>
          <div className="flex grow flex-col justify-between lg:min-h-[140px]">
            <div>
              <div className="flex items-center justify-between">
                <div
                  className={classNames(
                    'flex items-center text-sm leading-4 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary lg:text-base lg:leading-[19px] lg:text-color-text-lightmode-secondary dark:lg:text-color-text-darkmode-secondary',
                  )}
                >
                  <span
                    className={classNames(
                      'mr-2 flex h-5 items-center rounded-2xl px-2 text-xs font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:h-6 lg:text-sm',
                      type === LessonTypesEnum.Individual && 'bg-color-lesson-individual',
                      type === LessonTypesEnum.Cardio && 'bg-color-lesson-cardio',
                      type === LessonTypesEnum.Clinic && 'bg-color-lesson-clinic',
                      type === LessonTypesEnum.Camp && 'bg-color-lesson-camp',
                      type === LessonTypesEnum.Custom && 'bg-color-lesson-other',
                    )}
                  >
                    {lessonShortName[type]}
                  </span>{' '}
                  {startTime.replace(' ', '')} - {endTime.replace(' ', '')}
                </div>
                {!!priceUnitAmount && (
                  <div className="hidden text-sm font-medium leading-4 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:block lg:text-lg lg:font-semibold lg:leading-none">
                    {price}
                  </div>
                )}
              </div>
              <div className="mt-2 flex text-sm font-bold leading-4 lg:text-xl lg:leading-[29px]">
                {title}
              </div>
              {!!courtName && (
                <div className="-ml-0.5 mt-1 flex items-center text-xs leading-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:text-sm">
                  <MapPinIcon className="mr-1 h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />{' '}
                  <span>{courtName}</span>
                </div>
              )}
            </div>
            <div className="mt-1 flex grow flex-col justify-end">
              <div className="flex items-center justify-between">
                <div
                  className={classNames(
                    'flex w-full items-end justify-between lg:w-auto lg:items-center',
                  )}
                >
                  <div className="flex items-center">
                    <div className="mr-4 text-xs font-medium leading-none text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-base lg:leading-none">
                      Coach: {coachName}
                    </div>
                    <div className="ml-4 hidden items-center lg:flex">
                      <div className="flex -space-x-1 overflow-hidden">
                        {participantList?.map((participant, index) => (
                          <img
                            key={participant.id || index}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white lg:h-8 lg:w-8"
                            src={participant.image}
                            alt={participant.name}
                          />
                        ))}
                      </div>
                      <div className="ml-2 text-xs font-medium leading-4 text-brand-gray-400 lg:text-base lg:leading-none">
                        <span className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                          {participantCount || 0}
                        </span>
                        /{participantLimit} filled
                      </div>
                    </div>
                  </div>
                  {!!priceUnitAmount && (
                    <div className="block text-sm font-medium leading-4 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:hidden lg:text-lg lg:font-semibold lg:leading-none">
                      {price}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block">
                  <div className="button-rounded-inline-brand-inverted px-10">View Details</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardLessonFeed;
