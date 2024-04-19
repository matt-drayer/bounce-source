import * as React from 'react';
import { differenceInMinutes, format, isSameMonth } from 'date-fns';
import { getLessonPageUrl, getPlaySessionPageUrl } from 'constants/pages';
import {
  useGetPlayerLessonsLazyQuery,
  useGetPlayerPlaySessionsLazyQuery,
} from 'types/generated/client';
import { getLessonImageUrl } from 'utils/shared/user/getLessonImageUrl';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useViewer } from 'hooks/useViewer';
import Link from 'components/Link';
import Card from 'components/cards/Card';
import CardLessonFeed from 'components/cards/CardLessonFeed';
import CardPlayFeed from 'components/cards/CardPlayFeed';

interface Props {
  userId: string;
}

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;

const PlayerLessons: React.FC<Props> = ({ userId }) => {
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
  const {
    lessons,
    displayLessonDays,
    displayLessonHours,
    displayLessonMinutes,
    playSessions,
    displayPlaySessionDays,
    displayPlaySessionHours,
    displayPlaySessionMinutes,
    displayCourtTimeDays,
    displayCourtTimeHours,
    displayCourtTimeMinutes,
    groupedCourtTime,
  } = React.useMemo(() => {
    const lessons =
      dataPlayerLessons?.lessonParticipants.map((p) => {
        const lesson = p.lesson;
        const startDateObject = new Date(lesson.startDateTime);
        const endDateObject = new Date(lesson.endDateTime);
        const durationMinutes = differenceInMinutes(endDateObject, startDateObject);

        return {
          ...lesson,
          startDateObject,
          startTimestamp: startDateObject.getTime(),
          endDateObject,
          durationMinutes,
        };
      }) || [];
    const playSessions = [
      ...(dataPlayerPlaySessions?.playSessionParticipants || []).map((p) => {
        const playSession = p.playSession;
        const startDateObject = new Date(playSession.startDateTime);
        const endDateObject = new Date(playSession.endDateTime);
        const durationMinutes = differenceInMinutes(endDateObject, startDateObject);

        return {
          ...playSession,
          startDateObject,
          startTimestamp: startDateObject.getTime(),
          endDateObject,
          durationMinutes,
        };
      }),
      ...(dataPlayerPlaySessions?.playSessions || []).map((p) => {
        const playSession = p;
        const startDateObject = new Date(playSession.startDateTime);
        const endDateObject = new Date(playSession.endDateTime);
        const durationMinutes = differenceInMinutes(endDateObject, startDateObject);

        return {
          ...playSession,
          startDateObject,
          startTimestamp: startDateObject.getTime(),
          endDateObject,
          durationMinutes,
        };
      }),
    ];
    const allCourtTime = [...lessons, ...playSessions].sort(
      (a, b) => b.startTimestamp - a.startTimestamp,
    );
    const groupedCourtTime: (typeof allCourtTime)[] = [];
    allCourtTime.forEach((lesson) => {
      const mostRecentGroup = groupedCourtTime[groupedCourtTime.length - 1];
      if (!mostRecentGroup) {
        groupedCourtTime.push([lesson]);
      } else if (isSameMonth(mostRecentGroup[0]?.startDateObject, lesson?.startDateObject)) {
        mostRecentGroup.push(lesson);
      } else {
        groupedCourtTime.push([lesson]);
      }
    });

    const totalLessonMinutes = lessons.reduce((sum, lesson) => sum + lesson.durationMinutes, 0);
    const totalLessonHours = totalLessonMinutes / MINUTES_PER_HOUR;
    const displayLessonDays = Math.floor(totalLessonHours / HOURS_PER_DAY);
    const displayLessonHours = Math.floor(totalLessonHours % HOURS_PER_DAY);
    const displayLessonMinutes = Math.round(
      ((totalLessonHours % HOURS_PER_DAY) % displayLessonHours) % MINUTES_PER_HOUR,
    );
    const totalPlaySessionMinutes = playSessions.reduce(
      (sum, playSession) => sum + playSession.durationMinutes,
      0,
    );
    const totalPlaySessionHours = totalPlaySessionMinutes / MINUTES_PER_HOUR;
    const displayPlaySessionDays = Math.floor(totalPlaySessionHours / HOURS_PER_DAY);
    const displayPlaySessionHours = Math.floor(totalPlaySessionHours % HOURS_PER_DAY);
    const displayPlaySessionMinutes = Math.round(
      ((totalPlaySessionHours % HOURS_PER_DAY) % displayPlaySessionHours) % MINUTES_PER_HOUR,
    );

    const totalCourtTimeMinutes = totalLessonMinutes + totalPlaySessionMinutes;
    const totalCourtTimeHours = totalCourtTimeMinutes / MINUTES_PER_HOUR;
    const displayCourtTimeDays = Math.floor(totalCourtTimeHours / HOURS_PER_DAY);
    const displayCourtTimeHours = Math.floor(totalCourtTimeHours % HOURS_PER_DAY);
    const displayCourtTimeMinutes = Math.round(
      ((totalCourtTimeHours % HOURS_PER_DAY) % displayCourtTimeHours) % MINUTES_PER_HOUR,
    );

    return {
      lessons,
      totalLessonHours,
      displayLessonDays,
      displayLessonHours,
      displayLessonMinutes,
      playSessions,
      displayPlaySessionDays,
      displayPlaySessionHours,
      displayPlaySessionMinutes,
      totalCourtTimeMinutes,
      totalCourtTimeHours,
      displayCourtTimeDays,
      displayCourtTimeHours,
      displayCourtTimeMinutes,
      groupedCourtTime,
    };
  }, [dataPlayerLessons?.lessonParticipants, dataPlayerPlaySessions?.playSessionParticipants]);

  React.useEffect(() => {
    if (userId) {
      getPlayerLessonsQuery({
        variables: {
          userId: userId,
        },
      });
      getPlayerPlaySessionsQuery({
        variables: { userId: viewer.userId },
        fetchPolicy: 'cache-and-network',
      });
    }
  }, [userId]);

  if (
    loadingPlayerLessons ||
    !calledPlayerLessons ||
    loadingPlayerPlaySessions ||
    !calledPlayerPlaySessions
  ) {
    return null;
  }

  return (
    <div className="px-6 pb-12 pt-12">
      <div>
        <Card>
          <div className="flex items-center px-4 py-3">
            <div className="flex-auto space-y-3 text-base leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              <div>Lessons complete</div>
              <div>Play sessions complete</div>
              <div>Total time on court</div>
            </div>
            <div className="shrink-0 space-y-1 text-center">
              <div className="text-xl font-bold leading-6 text-color-brand-highlight">
                {lessons.length}
              </div>
              <div className="text-xl font-bold leading-6 text-color-brand-highlight">
                {playSessions.length}
              </div>
              <div className="text-xl font-bold leading-6 text-color-brand-highlight">
                {!!displayCourtTimeDays && (
                  <>
                    <span>{displayCourtTimeDays}</span>
                    <span className="font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      d
                    </span>
                  </>
                )}{' '}
                {displayCourtTimeHours || 0}
                <span className="font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  h
                </span>{' '}
                {displayCourtTimeMinutes || 0}
                <span className="font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  min
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-6 space-y-6">
        {groupedCourtTime.map((items) => {
          return (
            <div key={items[0].id}>
              <div className="text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                {format(
                  items?.[0]?.startDateObject ||
                    lessons?.[0]?.startDateObject ||
                    playSessions?.[0]?.startDateObject ||
                    new Date(),
                  'LLLL y',
                )}
              </div>
              <div className="mt-2 space-y-2">
                {items.map((item) => {
                  if (!item || !item.__typename) {
                    return null;
                  }

                  if (item.__typename === 'Lessons') {
                    const lesson = item;
                    const isParticipant = !!lesson.participants.find(
                      (participant) => participant.userId === viewer.userId,
                    );
                    return (
                      <Link key={lesson.id} href={getLessonPageUrl(lesson.id)} className="block">
                        <CardLessonFeed
                          title={lesson.title}
                          imageUrl={getLessonImageUrl({ path: lesson.coverImagePath })}
                          startTime={format(new Date(lesson.startDateTime), 'p')}
                          endTime={format(new Date(lesson.endDateTime), 'p')}
                          type={lesson.type}
                          courtName={lesson.userCustomCourt?.title || ''}
                          participants={lesson.participants.map((participant) => {
                            return {
                              id: participant.id,
                              name: participant?.userProfile?.preferredName || '',
                              image: getProfileImageUrlOrPlaceholder({
                                path: participant?.userProfile?.profileImagePath,
                              }),
                            };
                          })}
                          participantLimit={lesson.participantLimit}
                          participantCount={lesson.participantsAggregate.aggregate?.count}
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
          );
        })}
      </div>
    </div>
  );
};

export default PlayerLessons;
