import * as React from 'react';
import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import { Virtual } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { lessonShortName } from 'constants/sports';
import { DAY_INDEX_SHORT } from 'constants/time';
import { LessonTypesEnum } from 'types/generated/client';
import classNames from 'styles/utils/classNames';
import { CalendarSwiperProps, CalendarWeekProps, LessonWithLocale } from './props';
import { LessonBlock, TimeLine, WeeklyCalendarGrid } from './styles';
import { useGroupLessonsByStartDate } from './useGroupLessonsByStartDate';

const MINUTES_IN_HOUR = 60;
const DAYS_PER_WEEK = 7;
const WEEKS_FOR_CALENDAR = 53;
const CURRENT_DATE_INDEX = Math.floor((WEEKS_FOR_CALENDAR * 2) / 2) - 1;
// NOTE: Choosing 6 because part of the
const INDEX_OF_EARLIEST_START_TIME = 8;
// NOTE: This should be an object or use 24hr scale and convert
const TIMES = [
  { time: 0, displayTime: '12', ampm: 'am' },
  { time: 1, displayTime: '1', ampm: 'am' },
  { time: 2, displayTime: '2', ampm: 'am' },
  { time: 3, displayTime: '3', ampm: 'am' },
  { time: 4, displayTime: '4', ampm: 'am' },
  { time: 5, displayTime: '5', ampm: 'am' },
  { time: 6, displayTime: '6', ampm: 'am' },
  { time: 7, displayTime: '7', ampm: 'am' },
  { time: 8, displayTime: '8', ampm: 'am' },
  { time: 9, displayTime: '9', ampm: 'am' },
  { time: 10, displayTime: '10', ampm: 'am' },
  { time: 11, displayTime: '11', ampm: 'am' },
  { time: 12, displayTime: '12', ampm: 'pm' },
  { time: 13, displayTime: '1', ampm: 'pm' },
  { time: 14, displayTime: '2', ampm: 'pm' },
  { time: 15, displayTime: '3', ampm: 'pm' },
  { time: 16, displayTime: '4', ampm: 'pm' },
  { time: 17, displayTime: '5', ampm: 'pm' },
  { time: 18, displayTime: '6', ampm: 'pm' },
  { time: 19, displayTime: '7', ampm: 'pm' },
  { time: 20, displayTime: '8', ampm: 'pm' },
  { time: 21, displayTime: '9', ampm: 'pm' },
  { time: 22, displayTime: '10', ampm: 'pm' },
  { time: 23, displayTime: '11', ampm: 'pm' },
];

const CalendarWeek: React.FC<CalendarWeekProps> = ({
  index,
  slideContent,
  now,
  hours,
  minutes,
  toggleBottomSheet,
  scrollHeight,
  setScrollHeight,
  slideRefs,
  hasSetInitialScroll,
  setHasSetInitialScroll,
  activeCalendarBlock,
  setActiveCalendarBlock,
  activeLessonId,
  setActiveLessonId,
  lessonsByStartDate,
  isOwner,
}) => {
  const timeScaleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!hasSetInitialScroll && timeScaleRef?.current?.offsetTop) {
      setHasSetInitialScroll(true);
      setScrollHeight(timeScaleRef?.current?.offsetTop);
      slideRefs.current[index]?.scroll({ top: timeScaleRef?.current?.offsetTop });
    }
  }, [hasSetInitialScroll]);

  React.useEffect(() => {
    slideRefs.current[index]?.scroll({ top: scrollHeight });
  }, [scrollHeight]);

  return (
    <>
      <div className="bg-color-bg-lightmode-secondary px-6 pt-4 dark:bg-color-bg-darkmode-secondary">
        <WeeklyCalendarGrid>
          <div className="border-b border-r border-color-border-input-lightmode dark:border-color-border-input-darkmode">
            &nbsp;
          </div>
          {slideContent.map((day, i) => {
            return (
              <div
                key={day?.toDateString() || i}
                className={classNames(
                  'justify-center border-b border-r border-color-border-input-lightmode pb-2 pt-1.5 text-center text-xs dark:border-color-border-input-darkmode lg:flex lg:py-[6.5px] lg:text-base lg:leading-[19px]',
                  !!now && !!day && now.toDateString() === day.toDateString()
                    ? 'bg-brand-gray-200 text-color-text-lightmode-primary dark:bg-brand-gray-700 dark:text-color-text-darkmode-primary'
                    : 'bg-transparent text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                )}
              >
                <div>{DAY_INDEX_SHORT[i]}</div>
                <div className="hidden lg:mr-1.5 lg:block">, </div>
                <div>{day ? day.getDate() : ' '}</div>
              </div>
            );
          })}
        </WeeklyCalendarGrid>
      </div>
      <div
        ref={(el) => (slideRefs.current[index] = el)}
        className="relative flex h-full w-full flex-auto flex-col overflow-y-auto bg-color-bg-lightmode-secondary px-6 pb-24 dark:bg-color-bg-darkmode-secondary"
      >
        {TIMES.map(({ time, displayTime, ampm }, timeIndex) => {
          const emptyCells = new Array(DAYS_PER_WEEK).fill('+');
          const isCurrentHour = hours === time;

          return (
            <div
              key={time}
              className="relative"
              ref={timeIndex === INDEX_OF_EARLIEST_START_TIME ? timeScaleRef || null : null}
            >
              {!!isCurrentHour && (
                <TimeLine
                  className="absolute z-30 w-full border-b border-brand-fire-500"
                  top={((minutes || 0) / 60) * 100}
                >
                  &nbsp;
                </TimeLine>
              )}
              <WeeklyCalendarGrid>
                <div className="border-b border-r border-color-border-input-lightmode pb-2 pt-2 text-center text-xs dark:border-color-border-input-darkmode lg:text-sm">
                  <div className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {displayTime}
                  </div>
                  <div className="text-brand-gray-400">{ampm}</div>
                </div>
                {emptyCells.map((_cell, dateIndex) => {
                  const key = `${dateIndex}-${timeIndex}`;
                  const dateOfCell = format(slideContent[dateIndex], 'yyyy-MM-dd');
                  const lessonsOnDate = lessonsByStartDate[dateOfCell];
                  const intervalsOnDate = lessonsOnDate?.intervals || [];
                  const isActiveTimeBlock =
                    !!slideContent[dateIndex] &&
                    dateOfCell === activeCalendarBlock?.date &&
                    time === activeCalendarBlock?.time;
                  let lessonsStartOnCurrentHour: LessonWithLocale[] = [];

                  lessonsOnDate?.lessons.forEach((lesson) => {
                    if (lesson.startHour === time) {
                      lessonsStartOnCurrentHour.push(lesson);
                    }
                  });

                  return (
                    <div key={key} className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (isOwner) {
                            toggleBottomSheet();
                            setActiveLessonId('');
                            setActiveCalendarBlock({
                              time: time,
                              date: dateOfCell,
                            });
                          }
                        }}
                        className={classNames(
                          'relative h-full w-full rounded-none border-b border-r bg-color-bg-lightmode-primary pt-1 text-center text-xs transition-shadow duration-300 dark:bg-color-bg-darkmode-primary',
                          isActiveTimeBlock && 'z-10 border border-color-brand-primary shadow-lg',
                          !isActiveTimeBlock &&
                            'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                        )}
                      >
                        {isOwner ? '+' : ' '}
                      </button>
                      {lessonsStartOnCurrentHour.map((lesson) => {
                        const isActiveLessonBlock = activeLessonId === lesson.id;
                        const interval = intervalsOnDate[lesson.indexOfInterval];

                        return (
                          <LessonBlock
                            key={lesson.id}
                            type="button"
                            onClick={() => {
                              setActiveLessonId(lesson.id);
                              setActiveCalendarBlock(null);
                            }}
                            className={classNames(
                              'absolute z-20 flex flex-auto items-center rounded-none border text-center text-xs text-color-text-lightmode-primary transition-shadow duration-300 lg:text-sm',
                              isActiveLessonBlock && 'z-20 border-color-brand-primary shadow-lg',
                              !isActiveLessonBlock && 'border-transparent',
                              lesson.type === LessonTypesEnum.Individual &&
                                'bg-color-lesson-individual',
                              lesson.type === LessonTypesEnum.Cardio && 'bg-color-lesson-cardio',
                              lesson.type === LessonTypesEnum.Clinic && 'bg-color-lesson-clinic',
                              lesson.type === LessonTypesEnum.Camp && 'bg-color-lesson-camp',
                              lesson.type === LessonTypesEnum.Custom && 'bg-color-lesson-other',
                            )}
                            heightPercent={(lesson.durationMinutes / MINUTES_IN_HOUR) * 100}
                            widthPercent={100 / interval.count}
                            leftPercent={((lesson.numberInInterval - 1) / interval.count) * 100}
                            topPercent={(lesson.startMinute / MINUTES_IN_HOUR) * 100}
                          >
                            <span className="w-full">{lessonShortName[lesson.type]}</span>
                          </LessonBlock>
                        );
                      })}
                    </div>
                  );
                })}
              </WeeklyCalendarGrid>
            </div>
          );
        })}
      </div>
    </>
  );
};

const CalendarSwiper: React.FC<CalendarSwiperProps> = ({
  setSwiperRef,
  setMonth,
  setYear,
  toggleBottomSheet,
  activeCalendarBlock,
  setActiveCalendarBlock,
  activeLessonId,
  setActiveLessonId,
  lessons,
  isOwner,
}) => {
  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [now, setNow] = React.useState<null | Date>();
  const [weeks, setWeeks] = React.useState<Date[][]>([]);
  const [scrollHeight, setScrollHeight] = React.useState(0);
  const [hasSetInitialScroll, setHasSetInitialScroll] = React.useState(false);
  const hours = now?.getHours();
  const minutes = now?.getMinutes();
  const lessonsByStartDate = useGroupLessonsByStartDate(lessons);

  // Initialize date and time related variables
  React.useEffect(() => {
    const dateNow = new Date();
    setNow(dateNow);

    // Refresh the current time every few minutes so the green line moves
    let interval = setInterval(() => {
      setNow(new Date());
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // TODO: Do I need to do this in the click handler instead of the effect?
  React.useEffect(() => {
    let weekDates = [];
    let pastWeeksDates = [];
    let futureWeeksDates = [];
    const dateNow = new Date();
    const firstDayOfWeek = startOfWeek(dateNow);
    const firstDayOfVisibleWeek = firstDayOfWeek;
    const lastDayOfVisibleWeek = endOfWeek(firstDayOfVisibleWeek);
    const daysInCurrentWeek = eachDayOfInterval({
      start: firstDayOfVisibleWeek,
      end: lastDayOfVisibleWeek,
    });

    for (let i = 1; i < WEEKS_FOR_CALENDAR; i++) {
      const firstDayOfPastWeek = addWeeks(firstDayOfWeek, i * -1);
      const lastDayOfPastWeek = endOfWeek(firstDayOfPastWeek);
      const daysInPastWeek = eachDayOfInterval({
        start: firstDayOfPastWeek,
        end: lastDayOfPastWeek,
      });
      pastWeeksDates.push(daysInPastWeek);

      const firstDayOfFutureWeek = addWeeks(firstDayOfWeek, i);
      const lastDayOfFutureWeek = endOfWeek(firstDayOfFutureWeek);
      const daysInFutureWeek = eachDayOfInterval({
        start: firstDayOfFutureWeek,
        end: lastDayOfFutureWeek,
      });
      futureWeeksDates.push(daysInFutureWeek);
    }

    pastWeeksDates = pastWeeksDates.reverse();

    weekDates = [...pastWeeksDates, daysInCurrentWeek, ...futureWeeksDates];

    setWeeks(weekDates);
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-color-bg-lightmode-secondary dark:bg-color-bg-darkmode-secondary">
      {weeks?.length > 0 ? (
        <Swiper
          virtual
          modules={[Virtual]}
          onSwiper={(swiper) => {
            setSwiperRef(swiper);
          }}
          centeredSlides
          slidesPerView={1}
          loop={false}
          className="flex h-full w-full flex-col"
          initialSlide={CURRENT_DATE_INDEX}
          onSliderFirstMove={(swiper) => {
            const activeRef = slideRefs.current[swiper.activeIndex];
            if (activeRef) {
              setScrollHeight(activeRef.scrollTop);
            }
          }}
          onSlideNextTransitionStart={(swiper) => {
            const activeRef = slideRefs.current[swiper.activeIndex - 1];
            if (activeRef) {
              setScrollHeight(activeRef.scrollTop);
            }
          }}
          onSlidePrevTransitionStart={(swiper) => {
            const activeRef = slideRefs.current[swiper.activeIndex + 1];
            if (activeRef) {
              setScrollHeight(activeRef.scrollTop);
            }
          }}
          onActiveIndexChange={(swiperInstance) => {
            const startOfWeek = weeks[swiperInstance.activeIndex]?.[0];
            setMonth(startOfWeek.getMonth());
            setYear(`${startOfWeek.getFullYear()}`);
          }}
        >
          {weeks.map((slideContent, index) => (
            <SwiperSlide key={index} virtualIndex={index} className="swiper-slide h-full w-full">
              <CalendarWeek
                index={index}
                scrollHeight={scrollHeight}
                setScrollHeight={setScrollHeight}
                slideContent={slideContent}
                now={now}
                hours={hours}
                minutes={minutes}
                toggleBottomSheet={toggleBottomSheet}
                slideRefs={slideRefs}
                hasSetInitialScroll={hasSetInitialScroll}
                setHasSetInitialScroll={setHasSetInitialScroll}
                activeCalendarBlock={activeCalendarBlock}
                setActiveCalendarBlock={setActiveCalendarBlock}
                activeLessonId={activeLessonId}
                setActiveLessonId={setActiveLessonId}
                lessonsByStartDate={lessonsByStartDate}
                isOwner={isOwner}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="bg-color-bg-lightmode-secondary px-6 pt-2">
          <WeeklyCalendarGrid>
            <div>&nbsp;</div>
            {new Array(DAYS_PER_WEEK).fill(null).map((day, i) => {
              return (
                <div
                  key={day?.toDateString() || i}
                  className="rounded border border-color-bg-lightmode-secondary  bg-color-bg-lightmode-inactive pb-2 pt-1.5 text-center text-xs"
                >
                  <div>&nbsp;</div>
                  <div>&nbsp;</div>
                </div>
              );
            })}
          </WeeklyCalendarGrid>
        </div>
      )}
    </div>
  );
};

export default React.memo(CalendarSwiper);
