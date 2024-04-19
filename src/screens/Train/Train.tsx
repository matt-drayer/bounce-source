import React from 'react';
import { addDays, eachDayOfInterval, format, isBefore, isSameDay, startOfToday } from 'date-fns';
import { Else, If, Then } from 'react-if';
import { getLessonPageUrl } from 'constants/pages';
import {
  Lessons,
  useGetActiveLessonsFromFollowedCoachesLazyQuery,
  useGetPlayerLessonsLazyQuery,
} from 'types/generated/client';
import { getLessonImageUrl } from 'utils/shared/user/getLessonImageUrl';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useViewer } from 'hooks/useViewer';
import TabPageScrollChild from 'layouts/TabPageScrollChild';
import ButtonMyCoaches from 'components/ButtonMyCoaches';
import DateGroupHeader from 'components/DateGroupHeader';
import Link from 'components/Link';
import TabSlider from 'components/TabSlider';
import Card from 'components/cards/Card';
import CardLessonFeed from 'components/cards/CardLessonFeed';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import TabButton from './TabButton';

enum SliderTabKeys {
  BrowseLessons = 'BROWSE_LESSONS',
  MyLessons = 'MY_LESSONS',
}

enum MyLessonsTabs {
  Upcoming = 'UPCOMING',
  Past = 'PAST',
}

const TAB_SLIDER = [
  {
    name: 'Browse Lessons',
    key: SliderTabKeys.BrowseLessons,
  },
  {
    name: 'My Lessons',
    key: SliderTabKeys.MyLessons,
  },
];

const formatDateString = (date: Date) => format(date, 'yyyy-MM-dd');
// const formatDateLine = (date: Date) => format(date, 'LLL d');
// const formatWeekLine = (date: Date) => format(date, 'E');

const Train = () => {
  const today = startOfToday();
  const viewer = useViewer();
  const [getActiveLessonsFromFollowedCoachesQuery, { data, loading, called }] =
    useGetActiveLessonsFromFollowedCoachesLazyQuery();
  const [
    getPlayerLessonsQuery,
    { data: dataPlayerLessons, loading: loadingPlayerLessons, called: calledPlayerLessons },
  ] = useGetPlayerLessonsLazyQuery();
  const [activeSliderTabIndex, setActiveSliderTabIndex] = React.useState(0);
  const [activeMyLessonsTab, setActiveMyLessonsTab] = React.useState(MyLessonsTabs.Upcoming);
  // const [activeDate, setActiveDate] = React.useState(new Date());
  const activeSliderTab = TAB_SLIDER[activeSliderTabIndex];
  const followedCoaches = data?.userFollows || [];
  const followedCoachesProfiles = followedCoaches.map((coach) => coach.followedProfile);
  const browseLessons = followedCoachesProfiles.reduce((lessonAccumulator, profile) => {
    const currentCoachLessons = profile?.coachLessons || [];
    // @ts-ignore having a difficult time for pulling out the types
    lessonAccumulator = [...lessonAccumulator, ...currentCoachLessons];
    return lessonAccumulator;
  }, [] as Lessons[]);
  const { sortedBrowseLessons } = React.useMemo(() => {
    const sortedBrowseLessons = browseLessons
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

    return { sortedBrowseLessons };
  }, [browseLessons]);

  const { groupedBrowseLessons } = React.useMemo(() => {
    const groupedBrowseLessons: (typeof sortedBrowseLessons)[] = [];
    sortedBrowseLessons.forEach((lesson) => {
      const mostRecentGroup = groupedBrowseLessons[groupedBrowseLessons.length - 1];
      if (!mostRecentGroup) {
        groupedBrowseLessons.push([lesson]);
      } else if (isSameDay(mostRecentGroup[0].startDateObject, lesson.startDateObject)) {
        mostRecentGroup.push(lesson);
      } else {
        groupedBrowseLessons.push([lesson]);
      }
    });

    return { groupedBrowseLessons };
  }, [sortedBrowseLessons]);

  // const { activeBrowseLessons } = React.useMemo(() => {
  //   const groupedLessons: { [key: string]: typeof sortedBrowseLessons } = {};

  //   sortedBrowseLessons.forEach((lesson) => {
  //     const dateGroup = groupedLessons[lesson.dateString];
  //     if (!dateGroup) {
  //       groupedLessons[lesson.dateString] = [];
  //     }
  //     groupedLessons[lesson.dateString].push(lesson);
  //   });
  //   const activeBrowseLessons = groupedLessons[formatDateString(activeDate)] || [];

  //   return { groupedLessons, activeBrowseLessons };
  // }, [sortedBrowseLessons, activeDate]);

  const { groupedUpcomingLessons, groupedPastLessons } = React.useMemo(() => {
    const lessonsWithDate =
      dataPlayerLessons?.lessonParticipants?.map((participant) => {
        const startDateObject = new Date(participant.lesson.startDateTime);

        return {
          ...participant.lesson,
          startDateObject: new Date(participant.lesson.startDateTime),
          isPast: isBefore(startDateObject, today),
        };
      }) || [];
    const myUpcomingLessons = lessonsWithDate
      .filter((l) => !l.isPast)
      // NOTE: Sort asc
      .sort((a, b) => a.startDateObject.getTime() - b.startDateObject.getTime());
    const myPastLessons = lessonsWithDate
      .filter((l) => l.isPast)
      // NOTE: Sort desc
      .sort((a, b) => b.startDateObject.getTime() - a.startDateObject.getTime());

    const groupedUpcomingLessons: (typeof myUpcomingLessons)[] = [];
    const groupedPastLessons: (typeof myPastLessons)[] = [];
    myUpcomingLessons.forEach((lesson) => {
      const mostRecentGroup = groupedUpcomingLessons[groupedUpcomingLessons.length - 1];
      if (!mostRecentGroup) {
        groupedUpcomingLessons.push([lesson]);
      } else if (isSameDay(mostRecentGroup[0].startDateObject, lesson.startDateObject)) {
        mostRecentGroup.push(lesson);
      } else {
        groupedUpcomingLessons.push([lesson]);
      }
    });
    myPastLessons.forEach((lesson) => {
      const mostRecentGroup = groupedPastLessons[groupedPastLessons.length - 1];
      if (!mostRecentGroup) {
        groupedPastLessons.push([lesson]);
      } else if (isSameDay(mostRecentGroup[0].startDateObject, lesson.startDateObject)) {
        mostRecentGroup.push(lesson);
      } else {
        groupedPastLessons.push([lesson]);
      }
    });

    return { myUpcomingLessons, myPastLessons, groupedUpcomingLessons, groupedPastLessons };
  }, [dataPlayerLessons?.lessonParticipants]);

  const myLessons =
    activeMyLessonsTab === MyLessonsTabs.Past ? groupedPastLessons : groupedUpcomingLessons;

  const minimumFinalDate = addDays(today, 6);
  const finalAvailableLesson = sortedBrowseLessons[sortedBrowseLessons.length - 1];
  const longestDate =
    sortedBrowseLessons?.length > 0 &&
    isBefore(minimumFinalDate, finalAvailableLesson.startDateObject)
      ? finalAvailableLesson.startDateObject
      : minimumFinalDate;
  const dateRange = eachDayOfInterval({ start: today, end: longestDate });

  React.useEffect(() => {
    if (viewer.userId) {
      getActiveLessonsFromFollowedCoachesQuery({
        variables: { followerUserId: viewer.userId },
        nextFetchPolicy: 'cache-and-network',
        fetchPolicy: 'cache-and-network',
      });
      getPlayerLessonsQuery({
        variables: { userId: viewer.userId },
        nextFetchPolicy: 'cache-and-network',
        fetchPolicy: 'cache-and-network',
      });
    }
  }, [viewer.userId]);

  return (
    <>
      <Head
        title="Find Lessons and Train"
        description="Find other players to play tennis and pickeball in your city."
      />
      <TabPageScrollChild>
        <div className="shrink-0 bg-color-bg-lightmode-primary pt-5 dark:bg-color-bg-darkmode-primary">
          <div
            className={classNames(
              'relative flex items-center justify-between px-6',
              activeSliderTabIndex === 0 && 'lg:pb-5 lg:shadow-mobile-top-nav',
            )}
          >
            <div className="text-lg font-bold leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-3xl">
              Train
            </div>
            <div
              className={classNames(
                'hidden w-full max-w-md px-4 lg:block',
                activeSliderTab.key === SliderTabKeys.BrowseLessons &&
                  'relative shadow-mobile-top-nav',
              )}
            >
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
            <div className="flex items-center">
              <div>
                <ButtonMyCoaches />
              </div>
            </div>
          </div>
          <div
            className={classNames(
              'mt-4 px-6 lg:hidden',
              activeSliderTab.key === SliderTabKeys.BrowseLessons &&
                'relative pb-5 shadow-mobile-top-nav',
            )}
          >
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
        {activeSliderTab.key === SliderTabKeys.BrowseLessons && (
          <>
            {/* <div className="mt-4 flex shrink-0 flex-nowrap space-x-2 overflow-x-auto overflow-y-visible px-6 pb-4">
            {dateRange.map((displayDate) => (
              <button
                onClick={() => setActiveDate(displayDate)}
                className={classNames(
                  'shrink-0 rounded-md px-2 py-2 text-center',
                  isSameDay(displayDate, activeDate)
                    ? 'bg-color-brand-heavy text-color-text-darkmode-primary'
                    : 'bg-color-bg-lightmode-secondary dark:bg-color-bg-darkmode-secondary text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                )}
              >
                <div className="text-xs leading-none">{formatWeekLine(displayDate)}</div>
                <div className="mt-1 text-xs font-semibold leading-none">
                  {formatDateLine(displayDate)}
                </div>
              </button>
            ))}
          </div> */}
            <>
              {(!called || loading) &&
              groupedBrowseLessons?.length === 0 ? null : groupedBrowseLessons.length === 0 ? (
                <div className="flex h-full w-full grow flex-col space-y-2 overflow-y-auto bg-color-bg-lightmode-secondary px-6 pb-16 pt-4 dark:bg-color-bg-darkmode-secondary">
                  <If condition={followedCoaches.length > 0}>
                    <Then>
                      <Card>
                        <div className="flex items-center justify-center py-8 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                          Lessons will appear once added.
                        </div>
                      </Card>
                    </Then>
                    <Else>
                      <div className="flex items-center rounded-md bg-color-brand-active p-4">
                        <div className="mr-4 shrink-0">
                          <ButtonMyCoaches />
                        </div>
                        <div className="pr-4 text-sm text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                          Follow coaches to see their lesson
                        </div>
                      </div>
                    </Else>
                  </If>
                </div>
              ) : (
                <div className="flex h-full w-full grow flex-col items-center overflow-y-auto bg-color-bg-lightmode-secondary px-6 pt-4 dark:bg-color-bg-darkmode-secondary">
                  <div className="flex w-full max-w-main-content-container grow flex-col space-y-6 pb-16">
                    {groupedBrowseLessons.map((lessonsOnDate) => {
                      return (
                        <div key={lessonsOnDate[0].id}>
                          <DateGroupHeader today={today} date={lessonsOnDate[0].startDateObject} />
                          <div className="mt-2 space-y-2">
                            {lessonsOnDate.map((lesson) => {
                              const isParticipant = !!lesson.participants.find(
                                (participant) => participant.userId === viewer.userId,
                              );
                              return (
                                <Link
                                  key={lesson.id}
                                  href={getLessonPageUrl(lesson.id)}
                                  className="block"
                                >
                                  <CardLessonFeed
                                    title={lesson.title}
                                    imageUrl={getLessonImageUrl({ path: lesson.coverImagePath })}
                                    startTime={format(new Date(lesson.startDateTime), 'p')}
                                    endTime={format(new Date(lesson.endDateTime), 'p')}
                                    type={lesson.type}
                                    courtName={lesson.userCustomCourt?.title || ''}
                                    participantCount={
                                      lesson.participantsAggregate?.aggregate?.count
                                    }
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
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          </>
        )}
        {activeSliderTab.key === SliderTabKeys.MyLessons && (
          <>
            <div className="relative mt-6 flex shrink-0 shadow-mobile-top-nav">
              <TabButton
                handleClick={() => setActiveMyLessonsTab(MyLessonsTabs.Upcoming)}
                isActive={activeMyLessonsTab === MyLessonsTabs.Upcoming}
              >
                Upcoming
              </TabButton>
              <TabButton
                handleClick={() => setActiveMyLessonsTab(MyLessonsTabs.Past)}
                isActive={activeMyLessonsTab === MyLessonsTabs.Past}
              >
                Past
              </TabButton>
            </div>
            <div className="flex h-full w-full grow flex-col items-center overflow-y-auto bg-color-bg-lightmode-secondary px-6 pt-4 dark:bg-color-bg-darkmode-secondary">
              <div className="flex w-full max-w-main-content-container grow flex-col space-y-6 pb-16">
                {myLessons.map((lessonsOnDate) => {
                  return (
                    <div key={lessonsOnDate[0].id}>
                      <DateGroupHeader today={today} date={lessonsOnDate[0].startDateObject} />
                      <div className="mt-2 space-y-2">
                        {lessonsOnDate.map((lesson) => {
                          const isParticipant = !!lesson.participants.find(
                            (participant) => participant.userId === viewer.userId,
                          );
                          return (
                            <Link
                              key={lesson.id}
                              href={getLessonPageUrl(lesson.id)}
                              className="block"
                            >
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
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        <TabBar />
      </TabPageScrollChild>
    </>
  );
};

export default Train;
