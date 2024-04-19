import React from 'react';
import { Dialog } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { addMinutes, format } from 'date-fns';
import { NEW_LESSON_PAGE, getLessonPageUrl } from 'constants/pages';
import { lessonShortName } from 'constants/sports';
import { ImageSquareForLessonType } from 'constants/sports';
import { MONTH_INDEX, MONTH_INDEX_SHORT } from 'constants/time';
import { LessonTypesEnum } from 'types/generated/client';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import Link from 'components/Link';
import Modal from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';
import CalendarSwiper from './CalendarSwiper';
import { CalendarBlock, Props } from './props';

const LessonCalendar: React.FC<Props> = ({ lessons, isOwner, isTransparentHeader }) => {
  const [swiperRef, setSwiperRef] = React.useState<any | null>(null);
  const { user } = useGetCurrentUser();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);
  const [activeCalendarBlock, setActiveCalendarBlock] = React.useState<null | CalendarBlock>(null);
  const [activeLessonId, setActiveLessonId] = React.useState('');
  const [month, setMonth] = React.useState<null | number>(null);
  const [year, setYear] = React.useState('');
  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId);
  const price = activeLesson?.priceUnitAmount
    ? convertUnitPriceToFormattedPrice(activeLesson?.priceUnitAmount).priceDisplay
    : '';
  const participantCount = activeLesson?.participants?.length || 0;
  const participantLimit = activeLesson?.participantLimit || 0;
  const activeBlockDate = activeCalendarBlock
    ? new Date(`${activeCalendarBlock.date}T${`${activeCalendarBlock.time}`.padStart(2, '0')}:00`)
    : null;
  const activeOwnerProfile = activeLesson?.ownerProfile;
  const activeLessonImageUrl = getProfileImageUrlOrPlaceholder({
    path: activeOwnerProfile?.profileImagePath,
  });
  const fallbackImageUrl = ImageSquareForLessonType[activeLesson?.type || LessonTypesEnum.Custom];

  return (
    <>
      <div className="flex w-full flex-auto flex-col overflow-hidden">
        <div
          className={classNames(
            'jusify-between flex w-full items-center bg-color-bg-lightmode-primary px-6 dark:bg-color-bg-darkmode-primary',
            isTransparentHeader
              ? 'bg-transparent pt-4'
              : 'bg-color-bg-lightmode-primary py-4 dark:bg-color-bg-darkmode-primary',
          )}
        >
          {month !== null ? (
            <div className="flex w-full shrink-0 grow items-center justify-between lg:justify-center lg:space-x-8">
              <button
                onClick={() => {
                  swiperRef?.slidePrev();
                }}
              >
                <ChevronLeftIcon className="h-7 w-7 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
              </button>
              <div className="font-semibold leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                <span className="lg:hidden">{MONTH_INDEX_SHORT[month]}</span>
                <span className="hidden lg:inline">{MONTH_INDEX[month]}</span> {year}
              </div>

              <button
                onClick={() => {
                  swiperRef?.slideNext();
                }}
              >
                <ChevronRightIcon className="h-7 w-7 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
              </button>
            </div>
          ) : (
            <div className="h-7 w-full">&nbsp;</div>
          )}
        </div>
        <CalendarSwiper
          setSwiperRef={setSwiperRef}
          setMonth={setMonth}
          setYear={setYear}
          lessons={lessons}
          isOwner={isOwner}
          isTransparentHeader={isTransparentHeader}
          toggleBottomSheet={() => {
            if (!user) {
              return;
            }
            setIsBottomSheetOpen(!isBottomSheetOpen);
          }}
          activeCalendarBlock={activeCalendarBlock}
          setActiveCalendarBlock={setActiveCalendarBlock}
          activeLessonId={activeLessonId}
          setActiveLessonId={setActiveLessonId}
        />
      </div>
      <Modal
        positionBottomDesktop
        isOpen={isBottomSheetOpen && !!activeBlockDate}
        handleClose={() => setIsBottomSheetOpen(false)}
        swipeProps={{
          onSwipedDown: () => setIsBottomSheetOpen(false),
          delta: 50,
          trackMouse: true,
          trackTouch: true,
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <Dialog.Title
              as="h3"
              tabIndex={0}
              className="text-xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            >
              {format(activeBlockDate || new Date(), 'EEEE, MMM d')}
            </Dialog.Title>
            <button
              type="button"
              className="rounded-md bg-color-bg-lightmode-primary text-color-text-lightmode-primary focus:outline-none focus:ring-2 focus:ring-color-checkbox-active focus:ring-offset-2 dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary"
              onClick={() => setIsBottomSheetOpen(false)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4">
            <p className="text-lg text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              No lessons have been scheduled yet at this date and time.
            </p>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-md border border-color-border-input-lightmode px-4 py-2.5 dark:border-color-border-input-darkmode">
              <div className="text-lg font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                {format(activeBlockDate || new Date(), 'p')}
              </div>
              <Link
                href={`${NEW_LESSON_PAGE}?datetime=${(activeBlockDate || new Date()).getTime()}`}
                className="button-base inline-flex justify-center rounded-full border border-color-button-lightmode bg-color-button-lightmode px-5 py-2.5 text-sm font-medium text-color-text-darkmode-primary"
              >
                Create lesson
              </Link>
            </div>
            <div className="flex items-center justify-between rounded-md border border-color-border-input-lightmode px-4 py-2.5 dark:border-color-border-input-darkmode">
              <div className="text-lg font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                {format(addMinutes(activeBlockDate || new Date(), 30), 'p')}
              </div>
              <Link
                href={`${NEW_LESSON_PAGE}?datetime=${addMinutes(
                  activeBlockDate || new Date(),
                  30,
                ).getTime()}`}
                className="button-base inline-flex justify-center rounded-full border border-color-button-lightmode bg-color-button-lightmode px-5 py-2.5 text-sm font-medium text-color-text-darkmode-primary"
              >
                Create lesson
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        positionBottomDesktop
        isOpen={!!activeLesson}
        handleClose={() => setActiveLessonId('')}
        swipeProps={{
          onSwipedDown: () => setActiveLessonId(''),
          delta: 50,
          trackMouse: true,
          trackTouch: true,
        }}
      >
        <div className="p-6">
          <div>
            <div className="flex items-start justify-between">
              <Dialog.Title
                as="h3"
                tabIndex={0}
                className="text-xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
              >
                {!!activeLesson?.startDateTime
                  ? format(new Date(activeLesson.startDateTime), 'EEEE, MMM d')
                  : ' '}
                &nbsp;
              </Dialog.Title>
              <button
                type="button"
                className="rounded-md bg-color-bg-lightmode-primary text-color-text-lightmode-primary focus:outline-none focus:ring-2 focus:ring-color-checkbox-active focus:ring-offset-2 dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary"
                onClick={() => setActiveLessonId('')}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-4 flex h-full grow">
              <div className="mr-2 flex flex-col">
                {!!activeLessonImageUrl && (
                  <img
                    src={activeLessonImageUrl}
                    className="h-card-image w-card-image rounded-full object-cover object-center"
                    alt={activeLesson?.title}
                  />
                )}
                {!activeLessonImageUrl && fallbackImageUrl && (
                  <img
                    src={fallbackImageUrl}
                    className="h-card-image w-card-image rounded-full object-cover object-center"
                    alt={activeLesson?.title}
                  />
                )}
                <div className="flex grow flex-col items-center justify-end text-xs leading-tight text-brand-gray-400 lg:hidden lg:text-base lg:leading-none">
                  <div>
                    <span className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                      {participantCount || 0}
                    </span>
                    /{participantLimit}
                  </div>
                  <div>filled</div>
                </div>
              </div>
              {!!activeLesson && (
                <div className="flex h-full grow flex-col justify-between">
                  <div className="flex justify-between">
                    <div
                      className={classNames(
                        'flex items-center text-sm leading-4 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary lg:text-base',
                      )}
                    >
                      <span
                        className={classNames(
                          'mr-2 flex h-5 items-center rounded-2xl px-2 text-xs font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                          activeLesson.type === LessonTypesEnum.Individual &&
                            'bg-color-lesson-individual',
                          activeLesson.type === LessonTypesEnum.Cardio && 'bg-color-lesson-cardio',
                          activeLesson.type === LessonTypesEnum.Clinic && 'bg-color-lesson-clinic',
                          activeLesson.type === LessonTypesEnum.Camp && 'bg-color-lesson-camp',
                          activeLesson.type === LessonTypesEnum.Custom && 'bg-color-lesson-other',
                        )}
                      >
                        {lessonShortName[activeLesson.type]}
                      </span>{' '}
                      {format(new Date(activeLesson.startDateTime), 'p')} -{' '}
                      {format(new Date(activeLesson.endDateTime), 'p')}
                    </div>
                  </div>
                  <div className="mt-2 flex text-sm font-bold leading-4">{activeLesson.title}</div>
                  {!!activeLesson?.userCustomCourt?.title && (
                    <div className="-ml-0.5 mt-1 flex items-center text-xs leading-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:text-sm">
                      <MapPinIcon className="mr-1 h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />{' '}
                      <span>{activeLesson.userCustomCourt.title}</span>
                    </div>
                  )}
                  <div className="mt-1 flex grow flex-col justify-end">
                    <div className="flex items-center justify-between">
                      <div
                        className={classNames(
                          'flex w-full items-end justify-between lg:w-auto lg:items-center',
                        )}
                      >
                        <div className="flex items-center">
                          <div className="mr-4 text-xs font-medium leading-none text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-base lg:leading-none">
                            Coach: {activeOwnerProfile?.fullName}
                          </div>
                        </div>
                        {!!activeLesson?.priceUnitAmount && (
                          <div className="block text-sm font-medium leading-4 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:hidden lg:text-lg lg:font-semibold lg:leading-none">
                            {price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link
                href={getLessonPageUrl(activeLesson?.id)}
                className="button-rounded-full-primary-inverted w-full"
              >
                View details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LessonCalendar;
