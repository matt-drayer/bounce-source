import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { MY_SETTINGS_PAGE } from 'constants/pages';
import {
  GetUserNotificationsQuery,
  NotificationStatusesEnum,
  useGetUserNotificationsCountLazyQuery,
  useGetUserNotificationsLazyQuery,
  useUpdateNotificationsAsReadMutation,
} from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import Cog from 'svg/Cog';
import TabPageScrollPage from 'layouts/TabPageScrollPage';
import Link from 'components/Link';
import SectionHeading from 'components/SectionHeading';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import NotificationTypeSelector from './components/NotificationTypeSelector';

const PAGE_LIMIT = 20;

export default function MyNotifications() {
  const viewer = useViewer();
  const [getUserNotificationsCountLazyQuery, { data: countData }] =
    useGetUserNotificationsCountLazyQuery();
  const [
    getUserNotificationsLazyQuery,
    {
      data: notificationsData,
      loading: notificationsLoading,
      called: notificationsCalled,
      fetchMore: fetchMoreNotifications,
    },
  ] = useGetUserNotificationsLazyQuery();
  const [updateNotificationsAsReadMutation] = useUpdateNotificationsAsReadMutation();
  const notificationCount = countData?.userNotificationsAggregate.aggregate?.count;
  const notifications = notificationsData?.userNotifications || [];
  const hasMoreNotifications =
    notificationCount !== notifications.length && notificationCount !== 0;

  const setNotificationsAsRead = async (data: GetUserNotificationsQuery | undefined) => {
    const readAt = new Date().toISOString();
    const newNotifications = data?.userNotifications || [];
    const updates = newNotifications.map((notification) => {
      return {
        _set: { readAt: readAt, status: NotificationStatusesEnum.Read },
        where: {
          id: {
            _eq: notification.id,
          },
        },
      };
    });
    return updateNotificationsAsReadMutation({
      variables: {
        updates,
      },
    });
  };

  React.useEffect(() => {
    if (viewer.userId) {
      getUserNotificationsCountLazyQuery({
        variables: {
          userId: viewer.userId,
        },
      }).catch((error) => Sentry.captureException(error));
      getUserNotificationsLazyQuery({
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'network-only',
        variables: {
          userId: viewer.userId,
          offset: 0,
          limit: PAGE_LIMIT,
        },
      })
        .then((res) => setNotificationsAsRead(res.data))
        .catch((error) => Sentry.captureException(error));
    }
  }, [viewer.userId]);

  return (
    <>
      <Head noIndex title="Notifications" description="All your notifications" />
      <TabPageScrollPage>
        <>
          <div className="fixed left-0 top-0 z-20 w-full lg:pl-sidebar">
            <div className="safearea-spacer-top w-full bg-color-bg-lightmode-primary bg-opacity-80 backdrop-blur-sm dark:bg-color-bg-darkmode-primary"></div>
            <div className="flex h-mobile-page-title items-center justify-between bg-color-bg-lightmode-primary bg-opacity-80 px-6 shadow-mobile-top-nav backdrop-blur-sm dark:bg-color-bg-darkmode-primary">
              <h1 className="w-full text-lg font-bold leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-3xl">
                Notifications
              </h1>
              <div>
                <Link className="flex items-center font-medium" href={MY_SETTINGS_PAGE}>
                  <Cog className="mr-1 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="h-mobile-page-title w-full lg:h-desktop-page-title">&nbsp;</div>
        </>
        <div className="flex h-full w-full grow flex-col overflow-y-auto bg-color-bg-lightmode-primary px-6 pb-28 dark:bg-color-bg-darkmode-primary">
          <div className="w-full lg:mx-auto lg:max-w-main-content-container">
            <div className="my-2">
              <SectionHeading>Latest</SectionHeading>
            </div>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationTypeSelector key={notification.id} notification={notification} />
              ))}
            </div>
            {notificationsCalled && hasMoreNotifications && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  className="button-rounded-inline-brand-inverted px-4"
                  disabled={notificationsLoading}
                  onClick={() => {
                    if (notificationsLoading) {
                      return;
                    }

                    fetchMoreNotifications({
                      variables: {
                        userId: viewer.userId,
                        offset: notifications.length,
                        limit: PAGE_LIMIT,
                      },
                    })
                      .then((res) => setNotificationsAsRead(res.data))
                      .catch((error) => Sentry.captureException(error));
                  }}
                >
                  {notificationsLoading ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </div>
        </div>
        <TabBar />
      </TabPageScrollPage>
    </>
  );
}
