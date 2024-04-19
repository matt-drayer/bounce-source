import * as React from 'react';
import { format, isAfter, isSameDay, startOfToday } from 'date-fns';
import { PLAY_PAGE, TRAIN_PAGE } from 'constants/pages';
import { getLessonPageUrl, getPlaySessionPageUrl } from 'constants/pages';
import {
  useGetPlayerLessonsLazyQuery,
  useGetPlayerPlaySessionsLazyQuery,
} from 'types/generated/client';
import { getLessonImageUrl } from 'utils/shared/user/getLessonImageUrl';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useViewer } from 'hooks/useViewer';
import TabPageScrollChild from 'layouts/TabPageScrollChild';
import ButtonMyCoaches from 'components/ButtonMyCoaches';
import DateGroupHeader from 'components/DateGroupHeader';
import Link from 'components/Link';
import SectionHeading from 'components/SectionHeading';
import Card from 'components/cards/Card';
import CardLessonFeed from 'components/cards/CardLessonFeed';
import CardPlayFeed from 'components/cards/CardPlayFeed';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import { ButtonWrapperBlue, ButtonWrapperOrange } from './styles';

const PlayerExplorePage = () => {
  const today = startOfToday();
  const viewer = useViewer();
  const [
    getPlayerLessonsQuery,
    { data: dataPlayerLessons, loading: loadingPlayerLessons, called: calledPlayerLessons },
  ] = useGetPlayerLessonsLazyQuery();
  const [
    getPlayerPlaySessionsQuery,
    {
      data: dataPlayerPlaySessions,
      loading: loadingPlayerPlaySessions,
      called: calledPlayerPlaySessions,
    },
  ] = useGetPlayerPlaySessionsLazyQuery();
  const upcomingLessons = (dataPlayerLessons?.lessonParticipants || [])
    .map((p) => {
      const startDateObject = new Date(p.lesson.startDateTime);
      return { ...p.lesson, startTimestamp: startDateObject.getTime(), startDateObject };
    })
    .filter((lesson) => isAfter(lesson.startDateObject, today));
  const upcomingPlaySessions = [
    ...(dataPlayerPlaySessions?.playSessionParticipants || [])
      .map((p) => {
        const startDateObject = new Date(p.playSession.startDateTime);
        return { ...p.playSession, startTimestamp: startDateObject.getTime(), startDateObject };
      })
      .filter((playSession) => isAfter(playSession.startDateObject, today)),
    ...(dataPlayerPlaySessions?.playSessions || [])
      .map((p) => {
        const startDateObject = new Date(p.startDateTime);
        return { ...p, startTimestamp: startDateObject.getTime(), startDateObject };
      })
      .filter((playSession) => isAfter(playSession.startDateObject, today)),
  ];
  const allUpcoming = [...upcomingLessons, ...upcomingPlaySessions].sort(
    (a, b) => a.startTimestamp - b.startTimestamp,
  );
  const groupedUpcomingItems: (typeof allUpcoming)[] = [];
  allUpcoming.forEach((item) => {
    const mostRecentGroup = groupedUpcomingItems[groupedUpcomingItems.length - 1];
    if (!mostRecentGroup) {
      groupedUpcomingItems.push([item]);
    } else if (isSameDay(mostRecentGroup[0].startDateObject, item.startDateObject)) {
      mostRecentGroup.push(item);
    } else {
      groupedUpcomingItems.push([item]);
    }
  });

  React.useEffect(() => {
    if (viewer.userId) {
      getPlayerLessonsQuery({
        variables: { userId: viewer.userId },
        fetchPolicy: 'cache-and-network',
      });
      getPlayerPlaySessionsQuery({
        variables: { userId: viewer.userId },
        fetchPolicy: 'cache-and-network',
      });
    }
  }, [viewer.userId]);

  return (
    <>
      <Head title="Home" description="Explore Bounce. Find coaches, players, and courts." />
      <TabPageScrollChild>
        <div className="relative shrink-0 bg-color-bg-lightmode-primary pb-4 pt-5 shadow-mobile-top-nav dark:bg-color-bg-darkmode-primary">
          <div className="flex justify-between px-6">
            <div className="text-xl font-bold">Home</div>
            <div className="flex items-center">
              <div>
                <ButtonMyCoaches />
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full grow flex-col items-center overflow-y-auto bg-color-bg-lightmode-secondary px-6 pt-4 dark:bg-color-bg-darkmode-secondary">
          <div className="flex w-full max-w-main-content-container grow flex-col pb-16">
            <div>
              <div className="flex justify-between">
                <SectionHeading>Upcoming</SectionHeading>
                <Link
                  href={PLAY_PAGE}
                  className="text-sm leading-5 text-color-text-lightmode-primary underline dark:text-color-text-darkmode-primary"
                >
                  View all
                </Link>
              </div>
              <div className="mt-4">
                {(loadingPlayerLessons ||
                  !calledPlayerLessons ||
                  loadingPlayerPlaySessions ||
                  !calledPlayerPlaySessions) &&
                groupedUpcomingItems?.length === 0 ? null : !groupedUpcomingItems ||
                  groupedUpcomingItems.length === 0 ? (
                  <Card>
                    <div className="flex items-center justify-center py-8 text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      Join matches and lessons to see them here
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {groupedUpcomingItems.map((upcomingItems) => (
                      <div key={upcomingItems[0].id}>
                        <DateGroupHeader today={today} date={upcomingItems[0].startDateObject} />
                        <div className="mt-2 space-y-2">
                          {upcomingItems.map((item) => {
                            if (!item || !item.__typename) {
                              return null;
                            }

                            if (item.__typename === 'Lessons') {
                              const lesson = item;
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
                            } else if (item.__typename === 'PlaySessions') {
                              const playSession = item;
                              return (
                                <Link
                                  key={playSession.id}
                                  href={getPlaySessionPageUrl(playSession.id)}
                                  className="block"
                                >
                                  <CardPlayFeed playSession={playSession} />
                                </Link>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="mb-4">
                <SectionHeading>Play</SectionHeading>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                <Link href={TRAIN_PAGE}>
                  <ButtonWrapperOrange className="flex aspect-square items-center justify-center bg-cover bg-center bg-no-repeat px-5 text-center font-semibold text-white">
                    Train
                  </ButtonWrapperOrange>
                </Link>
                <Link href={PLAY_PAGE}>
                  <ButtonWrapperBlue className="flex aspect-square items-center justify-center bg-cover bg-center bg-no-repeat px-5 text-center font-semibold text-white">
                    Play
                  </ButtonWrapperBlue>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <TabBar />
      </TabPageScrollChild>
    </>
  );
};

export default PlayerExplorePage;
