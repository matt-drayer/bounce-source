import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { format, isSameDay, startOfToday } from 'date-fns';
import { getLessonPageUrl } from 'constants/pages';
import {
  UserProfileFieldsFragment,
  useGetActiveOwnerLessonsByIdLazyQuery,
  useGetCoachEarningsUnitAmountLazyQuery,
} from 'types/generated/client';
import { initializeConnectDashboard } from 'services/client/stripe/initializeConnectDashboard';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { getLessonImageUrl } from 'utils/shared/user/getLessonImageUrl';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useViewer } from 'hooks/useViewer';
import DateGroupHeader from 'components/DateGroupHeader';
import Link from 'components/Link';
import Card from 'components/cards/Card';
import CardLessonFeed from 'components/cards/CardLessonFeed';

interface Props {
  profile?: UserProfileFieldsFragment;
}

const CoachDashboard: React.FC<Props> = ({ profile }) => {
  const today = startOfToday();
  const viewer = useViewer();
  const [getActiveOwnerLessonsByIdQuery, { data: lessonData }] =
    useGetActiveOwnerLessonsByIdLazyQuery();
  const [getCoachEarningsUnitAmountLazyQuery, { data: earningsData, loading: earningsLoading }] =
    useGetCoachEarningsUnitAmountLazyQuery();
  const [isCreatingLoginLink, setIsCreatingLoginLink] = React.useState(false);
  const displayEarnings = earningsData?.lessonOrdersAggregate?.aggregate?.sum?.transferUnitAmount
    ? convertUnitPriceToFormattedPrice(
        earningsData.lessonOrdersAggregate.aggregate.sum.transferUnitAmount,
      ).priceDisplay
    : '-';
  const lessons = lessonData?.lessons || [];
  const { sortedLessons } = React.useMemo(() => {
    const sortedLessons = lessons
      .map((lesson) => {
        const startDateObject = new Date(lesson.startDateTime);
        const endDateObject = new Date(lesson.endDateTime);
        return {
          ...lesson,
          startDateObject: startDateObject,
          endDateObject: endDateObject,
          startTimestamp: startDateObject.getTime(),
          dateString: format(startDateObject, 'yyyy-MM-dd'),
        };
      })
      .sort((a, b) => b.startTimestamp - a.startTimestamp);

    return { sortedLessons };
  }, [lessons]);
  const groupedLessons: (typeof sortedLessons)[] = [];
  sortedLessons.forEach((lesson) => {
    const mostRecentGroup = groupedLessons[groupedLessons.length - 1];
    if (!mostRecentGroup) {
      groupedLessons.push([lesson]);
    } else if (isSameDay(mostRecentGroup[0]?.startDateObject, lesson?.startDateObject)) {
      mostRecentGroup.push(lesson);
    } else {
      groupedLessons.push([lesson]);
    }
  });

  React.useEffect(() => {
    if (profile?.id) {
      getActiveOwnerLessonsByIdQuery({
        variables: {
          ownerUserId: profile.id,
        },
      });
      getCoachEarningsUnitAmountLazyQuery({
        variables: { sellerUserId: profile.id },
      });
    }
  }, [profile?.id]);

  return (
    <div className="pb-16 pt-6">
      <div className="px-6">
        <div className="rounded-md bg-color-brand-active p-4 text-center text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Your dashboard is visible only to you
        </div>
      </div>
      <h2 className="mt-6 px-6 text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
        Financials
      </h2>
      <div className="mt-2 flex items-center space-x-5 px-6">
        <Card>
          <div className="flex items-center space-x-3 py-4 pl-5 pr-4">
            <div className="text-3xl font-bold leading-none text-color-brand-primary">
              {profile?.coachLessonsAggregate.aggregate?.count || 0}
            </div>
            <div className="text-xs text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Lessons given
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-3 py-4 pl-5 pr-4">
            <div className="text-3xl font-bold leading-none text-color-brand-primary">
              {displayEarnings}
            </div>
            <div className="text-xs text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Total earnings
            </div>
          </div>
        </Card>
      </div>
      <button
        type="button"
        onClick={async () => {
          if (isCreatingLoginLink) {
            return;
          }

          setIsCreatingLoginLink(true);

          try {
            const idToken = await viewer.viewer?.getIdToken();
            if (idToken) {
              const response = await initializeConnectDashboard(idToken);
              window.location.href = response.loginLink.url;
            } else {
              throw new Error(`Did not have an id token for: ${viewer.userId}`);
            }
          } catch (error) {
            Sentry.captureException(error);
          }

          setIsCreatingLoginLink(false);
        }}
        className="mt-4 px-6 text-sm font-semibold"
      >
        {isCreatingLoginLink ? (
          <span className="text-color-brand-highlight opacity-60">Loading...</span>
        ) : (
          <span className="text-color-brand-highlight underline">
            Full dashboard and bank details
          </span>
        )}
      </button>
      <div className="mt-9">
        <h2 className="mt-6 px-6 text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Lesesons given ({profile?.coachLessonsAggregate.aggregate?.count || 0})
        </h2>
        <div className="mt-4 space-y-6 px-6">
          {groupedLessons.map((lessonGroup) => {
            return (
              <div key={lessonGroup[0].id}>
                <DateGroupHeader today={today} date={lessonGroup[0]?.startDateObject} />
                <div className="mt-2 space-y-2">
                  {lessonGroup.map((lesson) => {
                    const isParticipant = !!lesson.participants.find(
                      (participant) => participant.userId === viewer.userId,
                    );
                    return (
                      <Link key={lesson.id} href={getLessonPageUrl(lesson.id)} className="block">
                        <CardLessonFeed
                          key={lesson.id}
                          title={lesson.title}
                          imageUrl={getLessonImageUrl({ path: lesson.coverImagePath })}
                          startTime={format(lesson?.startDateObject, 'p')}
                          endTime={format(lesson.endDateObject, 'p')}
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
    </div>
  );
};

export default CoachDashboard;
