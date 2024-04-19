import React from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import {
  addDays,
  eachDayOfInterval,
  format,
  isBefore,
  isSameDay,
  startOfDay,
  startOfToday,
} from 'date-fns';
import { throttle } from 'lodash';
import { useRouter } from 'next/router';
import { NEW_PLAY_SESSION_PAGE, getPlaySessionPageUrl } from 'constants/pages';
import {
  useGetActiveJoinedPlaySessionsLazyQuery,
  useGetPlaySessionFeedLazyQuery,
} from 'types/generated/client';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import CalendarPlus from 'svg/CalendarPlus';
import TabPageScrollChild from 'layouts/TabPageScrollChild';
import DateGroupHeader from 'components/DateGroupHeader';
import Link from 'components/Link';
import TabSlider from 'components/TabSlider';
import CardPlaySessionGroup from 'components/cards/CardPlaySessionGroup';
import {
  transformMyPlaySessionsToProps,
  transformPlaySessionFeedToProps,
} from 'components/cards/CardPlaySessionGroup/transformers';
import ModalPlaySession from 'components/modals/ModalPlaySession';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';

enum MyPlaySessionTabs {
  Feed = 'FEED',
  MyGames = 'MY_GAMES',
}

const TAB_SLIDER = [
  {
    name: 'Open play',
    key: MyPlaySessionTabs.Feed,
  },
  {
    name: 'My games',
    key: MyPlaySessionTabs.MyGames,
  },
];

const formatDateString = (date: Date) => format(date, 'yyyy-MM-dd');
const formatDateLine = (date: Date) => format(date, 'd');
const formatWeekLine = (date: Date) => format(date, 'E');

export default function Play() {
  const router = useRouter();
  const today = startOfToday();
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const dateHeadersRefs = React.useRef<{ [key: string]: HTMLElement | null }>({});
  const scrollingContainerRef = React.useRef<HTMLDivElement>(null);
  const [
    getPlaySessionFeedLazyQuery,
    { data: playSessionFeedData, loading: playSessionFeedLoading, called: playSessionFeedCalled },
  ] = useGetPlaySessionFeedLazyQuery();
  const [
    getActiveJoinedPlaySessionsLazyQuery,
    { data: myPlaySessionData, loading: myPlaySessionLoading, called: myPlaySessionCalled },
  ] = useGetActiveJoinedPlaySessionsLazyQuery();
  const [activeSliderTabIndex, setActiveSliderTabIndex] = React.useState(0);
  const [activeDate, setActiveDate] = React.useState(new Date());
  const activeMyPlaySessionTab = TAB_SLIDER[activeSliderTabIndex].key;
  const [activePlaySessionId, setActivePlaySessionId] = React.useState<string | null>(null);
  const isFeed = activeMyPlaySessionTab === MyPlaySessionTabs.Feed;
  const playSessionFeed = playSessionFeedData?.playSessions || [];
  const myPlaySessions = (myPlaySessionData?.playSessionParticipants || []).map(
    (p) => p.playSession,
  );
  const playSessionsForUi = isFeed ? playSessionFeed : myPlaySessions;
  const { sortedPlaySessions, pastPlaySessions, upcomingPlaySessions } = React.useMemo(() => {
    const sortedPlaySessions = playSessionsForUi
      .map((playSession) => {
        const startDateObject = new Date(playSession.startDateTime);
        return {
          ...playSession,
          startDateObject: startDateObject,
          startTimestamp: startDateObject.getTime(),
          dateString: formatDateString(startDateObject),
          isPast: isBefore(startDateObject, today),
        };
      })
      .sort((a, b) => a.startTimestamp - b.startTimestamp);

    const pastPlaySessions = sortedPlaySessions.filter((playSession) => playSession.isPast);
    const upcomingPlaySessions = sortedPlaySessions.filter((playSession) => !playSession.isPast);

    return { sortedPlaySessions, pastPlaySessions, upcomingPlaySessions };
  }, [playSessionsForUi]);
  const { groupedPastPlaySessions, groupedUpcomingPlaySessions, playSessionDates } =
    React.useMemo(() => {
      const groupedPlaySessions: (typeof sortedPlaySessions)[] = [];
      const groupedPastPlaySessions: (typeof sortedPlaySessions)[] = [];
      const groupedUpcomingPlaySessions: (typeof sortedPlaySessions)[] = [];
      const playSessionDates: string[] = [];

      sortedPlaySessions.forEach((playSession) => {
        const mostRecentGroup = groupedPlaySessions[groupedPlaySessions.length - 1];
        if (!mostRecentGroup) {
          playSessionDates.push(playSession.dateString);
          groupedPlaySessions.push([playSession]);
        } else if (isSameDay(mostRecentGroup[0].startDateObject, playSession.startDateObject)) {
          mostRecentGroup.push(playSession);
        } else {
          playSessionDates.push(playSession.dateString);
          groupedPlaySessions.push([playSession]);
        }
      });
      pastPlaySessions.forEach((playSession) => {
        const mostRecentGroup = groupedPastPlaySessions[groupedPastPlaySessions.length - 1];
        if (!mostRecentGroup) {
          groupedPastPlaySessions.push([playSession]);
        } else if (isSameDay(mostRecentGroup[0].startDateObject, playSession.startDateObject)) {
          mostRecentGroup.push(playSession);
        } else {
          groupedPastPlaySessions.push([playSession]);
        }
      });
      upcomingPlaySessions.forEach((playSession) => {
        const mostRecentGroup = groupedUpcomingPlaySessions[groupedUpcomingPlaySessions.length - 1];
        if (!mostRecentGroup) {
          groupedUpcomingPlaySessions.push([playSession]);
        } else if (isSameDay(mostRecentGroup[0].startDateObject, playSession.startDateObject)) {
          mostRecentGroup.push(playSession);
        } else {
          groupedUpcomingPlaySessions.push([playSession]);
        }
      });

      return {
        groupedPlaySessions,
        groupedPastPlaySessions,
        groupedUpcomingPlaySessions,
        playSessionDates,
      };
    }, [sortedPlaySessions, pastPlaySessions, upcomingPlaySessions]);

  const minimumFinalDate = addDays(today, 6);
  const finalAvailablePlaySession = sortedPlaySessions[sortedPlaySessions.length - 1];
  const longestDate =
    sortedPlaySessions?.length > 0 &&
    isBefore(minimumFinalDate, finalAvailablePlaySession.startDateObject)
      ? finalAvailablePlaySession.startDateObject
      : minimumFinalDate;
  const dateRange = React.useMemo(
    () => eachDayOfInterval({ start: today, end: longestDate }),
    [activeSliderTabIndex, longestDate],
  );

  React.useEffect(() => {
    if (viewer.userId && user) {
      const today = startOfToday();

      if (activeMyPlaySessionTab === MyPlaySessionTabs.Feed) {
        const primaryGroupId = user.groups?.[0]?.groupId;

        if (primaryGroupId) {
          getPlaySessionFeedLazyQuery({
            variables: {
              userId: viewer.userId,
              startDateTime: today.toISOString(),
              groupId: primaryGroupId,
            },
            nextFetchPolicy: 'cache-and-network',
            fetchPolicy: 'cache-and-network',
          });
        }
      } else if (activeMyPlaySessionTab === MyPlaySessionTabs.MyGames) {
        getActiveJoinedPlaySessionsLazyQuery({
          variables: { userId: viewer.userId, startDateTime: today.toISOString() },
          nextFetchPolicy: 'cache-and-network',
          fetchPolicy: 'cache-and-network',
        });
      }
    }
  }, [viewer.userId, user, activeMyPlaySessionTab]);

  React.useEffect(() => {
    if (router.isReady) {
      if (router.query.mygames === 'true') {
        const myGamesIndex = TAB_SLIDER.findIndex((tab) => tab.key === MyPlaySessionTabs.MyGames);

        if (myGamesIndex !== -1) {
          setActiveSliderTabIndex(myGamesIndex);
        }
      }
    }
  }, [router.isReady]);

  React.useEffect(() => {
    const container = scrollingContainerRef.current;

    const handleScroll = throttle(() => {
      const container = scrollingContainerRef.current;

      if (dateHeadersRefs.current) {
        let activeDate = formatDateString(new Date());

        Object.keys(dateHeadersRefs.current).forEach((date) => {
          const el = dateHeadersRefs.current?.[date];

          if (el && container) {
            const containerTop = container?.getBoundingClientRect().top;
            const elTop = el.getBoundingClientRect().top;

            // Check if element top matches with container top
            const OFFSET = 48;
            if (elTop - containerTop - OFFSET <= 0) {
              activeDate = date;
            }
          }

          const [year, month, day] = activeDate.split('-').map((str) => parseInt(str, 10));
          const dateObject = new Date(year, month - 1, day);
          setActiveDate(dateObject);
        });
      }
    }, 250); // throttle interval, adjust as necessary

    container?.addEventListener('scroll', handleScroll);

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [dateRange]);

  return (
    <>
      <Head
        title="Play Pickleball"
        description="Find other players to play pickeball with in your city."
      />
      <TabPageScrollChild>
        <div className="flex w-full shrink-0 items-center justify-between bg-color-bg-lightmode-primary pt-4 dark:bg-color-bg-darkmode-primary">
          <div className={classNames('relative hidden items-center justify-between px-6 lg:flex')}>
            <div className="text-lg font-bold leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-3xl">
              Play
            </div>
            {/* {!user ? null : (
            <Link href={NEW_PLAY_SESSION_PAGE}>
              <a className="button-rounded-inline-primary flex items-center px-4 text-xs font-semibold lg:px-8 lg:py-2 lg:leading-6">
                <CalendarPlus className="mr-2 h-4 w-4" /> Create Session
              </a>
            </Link>
          )} */}
          </div>
          <div className="hidden w-full max-w-[336px] grow px-4 lg:flex">
            <TabSlider
              activeIndex={activeSliderTabIndex}
              tabs={TAB_SLIDER.map((tab, index) => ({
                name: tab.name,
                isActive: activeSliderTabIndex === index,
                activeIndex: activeSliderTabIndex,
                handleClick: () => {
                  setActiveSliderTabIndex(index);
                  if (scrollingContainerRef?.current) {
                    scrollingContainerRef.current.scrollTop = 0;
                  }
                },
              }))}
            />
          </div>
          <div className="hidden lg:block">&nbsp;</div>
        </div>
        <>
          <div className="relative z-20 w-full shrink-0 border-b border-color-border-input-lightmode dark:border-color-border-input-darkmode">
            <div className="flex w-full px-4 lg:hidden">
              <TabSlider
                activeIndex={activeSliderTabIndex}
                tabs={TAB_SLIDER.map((tab, index) => ({
                  name: tab.name,
                  isActive: activeSliderTabIndex === index,
                  activeIndex: activeSliderTabIndex,
                  handleClick: () => {
                    setActiveSliderTabIndex(index);
                    if (scrollingContainerRef?.current) {
                      scrollingContainerRef.current.scrollTop = 0;
                    }
                  },
                }))}
              />
            </div>
            <div className="relative mx-auto flex max-w-play-container shrink-0 flex-nowrap space-x-2 overflow-x-auto overflow-y-visible px-6 py-3 lg:px-0">
              {dateRange.map((displayDate) => {
                const dateString = formatDateString(displayDate);
                const isDateWithPlaySessions = playSessionDates.includes(dateString);

                return (
                  <button
                    key={displayDate.getTime()}
                    onClick={() => {
                      setActiveDate(displayDate);
                      const dateString = formatDateString(displayDate);

                      if (
                        !dateHeadersRefs ||
                        !scrollingContainerRef.current ||
                        !dateHeadersRefs.current?.[dateString]
                      ) {
                        return;
                      }

                      // Get the top position of the header relative to the scrolling container
                      const topPos = dateHeadersRefs.current?.[dateString]?.offsetTop;

                      if (!topPos) {
                        return;
                      }

                      // Update the scrollTop property of the scrolling container
                      const OFFSET = 180;
                      scrollingContainerRef.current.scrollTop = topPos - OFFSET;
                    }}
                    className={classNames(
                      'h-12 w-12 shrink-0 rounded-full border text-center transition-all duration-100',
                      isDateWithPlaySessions
                        ? 'border-brand-fire-600'
                        : 'border-color-border-card-lightmode dark:border-color-border-card-darkmode',
                      isSameDay(displayDate, activeDate)
                        ? 'bg-brand-fire-600 text-color-text-darkmode-primary'
                        : 'bg-color-bg-lightmode-secondary text-color-text-lightmode-primary shadow-none dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-primary',
                    )}
                  >
                    <div className="mb-[1px] text-xs leading-none">
                      {formatWeekLine(displayDate)}
                    </div>
                    <div className="text-base font-medium leading-4">
                      {formatDateLine(displayDate)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div
            ref={scrollingContainerRef}
            className="flex h-full w-full grow flex-col items-center overflow-y-auto bg-color-bg-lightmode-primary px-4 dark:bg-color-bg-darkmode-primary"
          >
            {/* <div className="h-4">&nbsp;</div> */}
            <div className="mt-4 flex w-full max-w-play-container grow flex-col space-y-8 pb-24">
              {groupedUpcomingPlaySessions.map((lessonsOnDate) => {
                return (
                  <div key={lessonsOnDate[0].id}>
                    <div className="sticky top-0 z-10 bg-color-bg-lightmode-primary bg-opacity-80 py-1 backdrop-blur-md dark:bg-color-bg-darkmode-primary dark:bg-opacity-80">
                      <DateGroupHeader today={today} date={lessonsOnDate[0].startDateObject} />
                    </div>
                    <div
                      data-date={lessonsOnDate[0].dateString}
                      ref={(el) => (dateHeadersRefs.current[lessonsOnDate[0].dateString] = el)}
                      className="invisible h-[1px]"
                    ></div>
                    <div className="mt-3.5 space-y-4">
                      {lessonsOnDate.map((playSession) => {
                        return (
                          <button
                            key={playSession.id}
                            className="block w-full"
                            type="button"
                            onClick={() => setActivePlaySessionId(playSession.id)}
                          >
                            <CardPlaySessionGroup
                              {...(isFeed
                                ? transformPlaySessionFeedToProps({
                                    currentUserAsParticipant: [],
                                    ...playSession,
                                  })
                                : transformMyPlaySessionsToProps(playSession))}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
        <div className="fixed bottom-0 left-0 z-10 hidden w-screen lg:block lg:pl-sidebar">
          <div className="relative mx-auto max-w-play-container">
            <div className="absolute -right-8 bottom-0">
              <div className="flex w-full items-center justify-center pb-4">
                <Link
                  href={NEW_PLAY_SESSION_PAGE}
                  className="button-rounded-full-primary flex w-full items-center justify-center px-8"
                >
                  <CalendarPlus className="mr-3 h-5 w-5 text-color-text-darkmode-primary dark:text-color-text-lightmode-primary" />
                  <span>Create an open play</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <TabBar
          aboveTabContent={
            !user ? null : (
              <div className="safearea-pad-bot absolute bottom-tabs left-0 flex w-full items-center justify-center">
                <div className="flex w-full items-center justify-center px-4 pb-4">
                  <Link
                    href={NEW_PLAY_SESSION_PAGE}
                    className="button-rounded-inline-primary flex items-center justify-center px-4"
                  >
                    <CalendarPlus className="mr-3 h-5 w-5 text-color-text-darkmode-primary dark:text-color-text-lightmode-primary" />
                    <span>Create an open play</span>
                  </Link>
                </div>
              </div>
            )
          }
        />
      </TabPageScrollChild>
      <ModalPlaySession
        playSessionId={activePlaySessionId}
        closeModal={() => setActivePlaySessionId(null)}
        fetchPlaySessions={() => {
          const primaryGroupId = user?.groups?.[0]?.groupId;

          if (primaryGroupId) {
            getPlaySessionFeedLazyQuery({
              variables: {
                userId: viewer.userId,
                startDateTime: today.toISOString(),
                groupId: primaryGroupId,
              },
              nextFetchPolicy: 'network-only',
              fetchPolicy: 'network-only',
            });
            getActiveJoinedPlaySessionsLazyQuery({
              variables: { userId: viewer.userId, startDateTime: today.toISOString() },
              nextFetchPolicy: 'network-only',
              fetchPolicy: 'network-only',
            });
          }
        }}
      />
    </>
  );
}
