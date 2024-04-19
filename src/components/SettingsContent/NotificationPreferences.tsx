import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { LOGIN_PAGE } from 'constants/pages';
import {
  CoachStatusEnum,
  useGetUserCommunicationPreferencesLazyQuery,
  useUpdateUserCommunicationPreferencesMutation,
} from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import SectionHeading from 'components/SectionHeading';
import NotificationRow from './NotificationRow';
import { CommunicationPreferences } from './props';

/**
 * @todo Add notifications for play sessions
 */
const COACH_EMAIL_ITEM_GROUPS: { label: string; itemKey: keyof CommunicationPreferences }[][] = [
  [
    { label: 'New followers', itemKey: 'newFollowerEmail' },
    { label: 'Lesson bookings', itemKey: 'lessonBookedEmail' },
    { label: 'Player leaves lesson', itemKey: 'participantLeftLessonEmail' },
  ],
  [{ label: 'Promotions', itemKey: 'marketingEmail' }],
];
const PLAYER_EMAIL_ITEM_GROUPS: { label: string; itemKey: keyof CommunicationPreferences }[][] = [
  [{ label: 'Lesson cancellations', itemKey: 'lessonCanceledEmail' }],
  [{ label: 'Promotions', itemKey: 'marketingEmail' }],
];

const NotificationPreferences = () => {
  const router = useRouter();
  const viewer = useViewer();
  const [
    getUserCommunicationPreferencesQuery,
    { data: preferencesData, loading: preferencesLoading, called: preferencesCalled },
  ] = useGetUserCommunicationPreferencesLazyQuery();
  const [updateUserCommunicationPreferencesMutation, { loading: updateLoading }] =
    useUpdateUserCommunicationPreferencesMutation();
  const coachStatus = preferencesData?.usersByPk?.coachStatus;
  const communicationPreferences = preferencesData?.usersByPk?.communicationPreferences;

  React.useEffect(() => {
    if (router.isReady && viewer.status === AuthStatus.Anonymous) {
      router.push(LOGIN_PAGE);
    }
  }, [router.isReady, viewer.status]);

  React.useEffect(() => {
    getUserCommunicationPreferencesQuery({
      variables: {
        id: viewer.userId,
      },
    }).catch((error) => Sentry.captureException(error));
  }, [viewer.userId]);

  return (
    <>
      {!preferencesLoading && !!coachStatus && !!communicationPreferences && (
        <div className="pt-10">
          <div className="-mb-5">
            <SectionHeading>Emails</SectionHeading>
          </div>
          {coachStatus === CoachStatusEnum.Active ? (
            <div className="mt-6 space-y-8 lg:mt-0 lg:space-y-0">
              {COACH_EMAIL_ITEM_GROUPS.map((group, index) => {
                return (
                  <div
                    className="space-y-4 border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:space-y-6 lg:border-b lg:py-6 lg:pr-40"
                    key={index}
                  >
                    {group.map(({ label, itemKey }) => {
                      return (
                        <NotificationRow
                          key={itemKey}
                          label={label}
                          itemKey={itemKey}
                          userId={viewer.userId!}
                          communicationPreferences={communicationPreferences}
                          updatePreference={updateUserCommunicationPreferencesMutation}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 space-y-8 lg:mt-0 lg:space-y-0">
              {PLAYER_EMAIL_ITEM_GROUPS.map((group, index) => {
                return (
                  <div
                    className="space-y-4 border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:space-y-6 lg:border-b lg:py-6 lg:pr-40"
                    key={index}
                  >
                    {group.map(({ label, itemKey }) => {
                      return (
                        <NotificationRow
                          key={itemKey}
                          label={label}
                          itemKey={itemKey}
                          userId={viewer.userId!}
                          communicationPreferences={communicationPreferences}
                          updatePreference={updateUserCommunicationPreferencesMutation}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationPreferences;
