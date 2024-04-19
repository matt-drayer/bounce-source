import * as React from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { lessonShortName } from 'constants/sports';
import { ImageSquareForLessonType } from 'constants/sports';
import { LessonTypesEnum } from 'types/generated/client';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import Card from 'components/cards/Card';
import classNames from 'styles/utils/classNames';

interface Props {
  title: string;
  imageUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  type: LessonTypesEnum;
  courtName: string;
  useShortName?: boolean;
  coachName: string;
  coachProfileImage: string;
}

const CardLesson: React.FC<Props> = ({
  imageUrl,
  title,
  date,
  startTime,
  endTime,
  type,
  courtName,
  coachName,
  coachProfileImage,
}) => {
  const fallbackImageUrlSquare = ImageSquareForLessonType[type];

  return (
    <Card>
      <div className="h-full p-2">
        <div className="flex h-full grow">
          <div className="mr-2">
            <img
              src={getProfileImageUrlOrPlaceholder({ path: coachProfileImage })}
              className="w-14 rounded object-cover object-center"
              alt={title}
            />
          </div>
          <div className="flex grow flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <div
                  className={classNames('text-sm font-medium leading-4 text-color-brand-highlight')}
                >
                  {date} @ {startTime.replace(' ', '')} - {endTime.replace(' ', '')}
                </div>
              </div>
              <div className="mt-1 flex text-sm font-semibold leading-4">{title}</div>
              {!!courtName && (
                <div className="-ml-0.5 mt-1 flex items-center text-xs leading-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  <MapPinIcon className="mr-1 h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />{' '}
                  <span>{courtName}</span>
                </div>
              )}
            </div>
            <div className="flex grow flex-col">
              <div className="flex h-full items-end justify-between">
                <div className={classNames('flex w-full items-center justify-between')}>
                  <div>
                    <div className="text-xs font-medium leading-none text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                      Coach: {coachName}
                    </div>
                  </div>
                  <div
                    className={classNames(
                      'flex h-5 items-center rounded-2xl px-2 text-xs font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:h-6 lg:text-sm',
                      type === LessonTypesEnum.Individual && 'bg-color-lesson-individual',
                      type === LessonTypesEnum.Cardio && 'bg-color-lesson-cardio',
                      type === LessonTypesEnum.Clinic && 'bg-color-lesson-clinic',
                      type === LessonTypesEnum.Camp && 'bg-color-lesson-camp',
                      type === LessonTypesEnum.Custom && 'bg-color-lesson-other',
                    )}
                  >
                    {lessonShortName[type]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardLesson;
