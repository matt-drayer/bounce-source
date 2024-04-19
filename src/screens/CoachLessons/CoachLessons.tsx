import React from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { addDays, eachDayOfInterval, format, isBefore, isSameDay, startOfToday } from 'date-fns';
import { NEW_LESSON_PAGE, getLessonPageUrl } from 'constants/pages';
import {
  GetActiveOwnerLessonsByIdQuery,
  useGetActiveOwnerLessonsByIdLazyQuery,
} from 'types/generated/client';
import { getLessonImageUrl } from 'utils/shared/user/getLessonImageUrl';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import CalendarAddWhite from 'svg/CalendarAddWhite';
import TabPageScrollChildViewHeight from 'layouts/TabPageScrollChildViewHeight';
import LessonCalendar from 'components/LessonCalendar';
import Link from 'components/Link';
import TabSlider from 'components/TabSlider';
import Card from 'components/cards/Card';
import CardLessonFeed from 'components/cards/CardLessonFeed';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';

enum SliderTabKeys {
  Calendar = 'CALENDAR',
  Today = 'TODAY',
}

const TAB_SLIDER = [
  {
    name: 'Upcoming',
    key: SliderTabKeys.Today,
  },
  {
    name: 'Calendar',
    key: SliderTabKeys.Calendar,
  },
];

const EMPTY_LESSONS: GetActiveOwnerLessonsByIdQuery['lessons'] = [];

const formatDateString = (date: Date) => format(date, 'yyyy-MM-dd');
const formatDateLine = (date: Date) => format(date, 'LLL d');
const formatWeekLine = (date: Date) => format(date, 'E');

const CoachLessons = () => {
  const today = startOfToday();
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const [getActiveOwnerLessonsByIdQuery, { data, loading, called }] =
    useGetActiveOwnerLessonsByIdLazyQuery();
  const [activeSliderTabIndex, setActiveSliderTabIndex] = React.useState(0);
  const [activeDate, setActiveDate] = React.useState(new Date());
  const activeSliderTab = TAB_SLIDER[activeSliderTabIndex];
  const lessons = data?.lessons || EMPTY_LESSONS;
  const { sortedLessons } = React.useMemo(() => {
    const sortedLessons = lessons
      .map((lesson) => {
        const startDateObject = new Date(lesson.startDateTime);
        return {
          ...lesson,
          startDateObject: startDateObject,
          startTimestamp: startDateObject.getTime(),
          dateString: formatDateString(startDateObject),
        };
      })
      .sort((a, b) => a.startTimestamp - b.startTimestamp);

    return { sortedLessons };
  }, [lessons]);

  const { activeLessons } = React.useMemo(() => {
    const groupedLessons: { [key: string]: typeof sortedLessons } = {};

    sortedLessons.forEach((lesson) => {
      const dateGroup = groupedLessons[lesson.dateString];
      if (!dateGroup) {
        groupedLessons[lesson.dateString] = [];
      }
      groupedLessons[lesson.dateString].push(lesson);
    });
    const activeLessons = groupedLessons[formatDateString(activeDate)] || [];

    return { groupedLessons, activeLessons };
  }, [sortedLessons, activeDate]);

  const minimumFinalDate = addDays(today, 6);
  const finalAvailableLesson = sortedLessons[sortedLessons.length - 1];
  const longestDate =
    sortedLessons?.length > 0 && isBefore(minimumFinalDate, finalAvailableLesson.startDateObject)
      ? finalAvailableLesson.startDateObject
      : minimumFinalDate;
  const dateRange = eachDayOfInterval({ start: today, end: longestDate });

  React.useEffect(() => {
    if (viewer.userId) {
      getActiveOwnerLessonsByIdQuery({
        variables: { ownerUserId: viewer.userId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
      });
    }
  }, [viewer.userId]);

  return (
    <>
      <Head title="Lessons" description="Your coach lessons" />
      <TabPageScrollChildViewHeight>
        <div className="shrink-0 bg-color-bg-lightmode-primary pt-5 dark:bg-color-bg-darkmode-primary">
          <div className="flex items-center justify-between px-6">
            <div className="text-xl font-bold lg:text-3xl">Lessons</div>
            <div className="hidden w-full max-w-sm px-6 lg:block">
              <TabSlider
                activeIndex={activeSliderTabIndex}
                tabs={TAB_SLIDER.map((tab, index) => ({
                  name: tab.name,
                  isActive: activeSliderTabIndex === index,
                  activeIndex: activeSliderTabIndex,
                  handleClick: () => setActiveSliderTabIndex(index),
                }))}
              />
            </div>
            {!user ? null : (
              <Link
                href={NEW_LESSON_PAGE}
                className="button-rounded-inline-primary flex items-center px-4 text-xs font-semibold lg:px-8 lg:py-2 lg:leading-6"
              >
                <CalendarAddWhite className="mr-2 h-4 w-4" />
                Create Lesson
              </Link>
            )}
          </div>
          <div className="mt-4 px-6 lg:hidden">
            <TabSlider
              activeIndex={activeSliderTabIndex}
              tabs={TAB_SLIDER.map((tab, index) => ({
                name: tab.name,
                isActive: activeSliderTabIndex === index,
                activeIndex: activeSliderTabIndex,
                handleClick: () => setActiveSliderTabIndex(index),
              }))}
            />
          </div>
        </div>
        {activeSliderTab.key === SliderTabKeys.Today && (
          <>
            <div className="relative mt-4 flex shrink-0 flex-nowrap space-x-2 overflow-x-auto overflow-y-visible px-6 pb-4 shadow-lightmode-secondary">
              {dateRange.map((displayDate) => (
                <button
                  key={displayDate.getTime()}
                  onClick={() => setActiveDate(displayDate)}
                  className={classNames(
                    'h-[3.75rem] w-[3.75rem] shrink-0 rounded-full border text-center transition-all duration-100',
                    isSameDay(displayDate, activeDate)
                      ? 'border-color-brand-primary bg-color-bg-lightmode-primary text-color-text-lightmode-primary shadow-brand dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary'
                      : 'border-transparent bg-color-bg-lightmode-secondary text-color-text-lightmode-primary shadow-none dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-primary',
                  )}
                >
                  <div className="text-xs leading-none">{formatWeekLine(displayDate)}</div>
                  <div className="mt-1 text-xs font-semibold leading-none">
                    {formatDateLine(displayDate)}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex w-full grow flex-col items-center overflow-y-auto bg-color-bg-lightmode-secondary px-6 pb-24 pt-4 dark:bg-color-bg-darkmode-secondary">
              <div className="flex w-full max-w-main-content-container grow flex-col space-y-2 lg:space-y-4">
                {activeLessons.length === 0 ? (
                  <Card>
                    <div className="flex items-center justify-center py-8 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      Lessons will appear once added.
                    </div>
                  </Card>
                ) : (
                  activeLessons.map((lesson) => {
                    const isParticipant = !!lesson.participants.find(
                      (participant) => participant.userId === viewer.userId,
                    );
                    return (
                      <Link key={lesson.id} href={getLessonPageUrl(lesson.id)}>
                        <CardLessonFeed
                          title={lesson.title}
                          imageUrl={getLessonImageUrl({ path: lesson.coverImagePath })}
                          startTime={format(new Date(lesson.startDateTime), 'p')}
                          endTime={format(new Date(lesson.endDateTime), 'p')}
                          type={lesson.type}
                          courtName={lesson.userCustomCourt?.title || ''}
                          participantCount={lesson.participantsAggregate?.aggregate?.count}
                          participantLimit={lesson.participantLimit}
                          participants={lesson.participants.map((participant) => {
                            return {
                              id: participant.id,
                              name: participant?.userProfile?.preferredName || '',
                              image: getProfileImageUrlOrPlaceholder({
                                path: participant?.userProfile?.profileImagePath,
                              }),
                            };
                          })}
                          coachName={lesson.ownerProfile?.fullName || ''}
                          coachImagePath={lesson.ownerProfile?.profileImagePath || ''}
                          isCoach={lesson.ownerProfile?.id === viewer.userId}
                          isParticipant={isParticipant}
                          priceUnitAmount={lesson.priceUnitAmount}
                        />
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
        {activeSliderTab.key === SliderTabKeys.Calendar && (
          <div className="flex grow flex-col overflow-y-hidden pb-tabs lg:pb-0">
            <LessonCalendar lessons={lessons} isOwner />
          </div>
        )}
        <TabBar
          aboveTabContent={
            !user ? null : (
              <div className="safearea-pad-bot absolute bottom-tabs right-0">
                <div className="pb-5 pr-5">
                  <Link href={NEW_LESSON_PAGE} className="floating-action-button-primary">
                    <PlusIcon className="h-6 w-6 text-color-text-darkmode-primary" />
                  </Link>
                </div>
              </div>
            )
          }
        />
      </TabPageScrollChildViewHeight>
    </>
  );
};

export default CoachLessons;
