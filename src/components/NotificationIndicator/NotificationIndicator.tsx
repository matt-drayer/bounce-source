import * as React from 'react';
import { BellIcon } from '@heroicons/react/24/solid';
import { MY_NOTIFICATIONS_PAGE } from 'constants/pages';
import { useGetUserUnreadNotificationCountLazyQuery } from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import Link from 'components/Link';

const REFETCH_TIME_MS = 30_000;

interface Props {
  className?: string;
}

const NotificationIndicator: React.FC<Props> = ({ className }) => {
  const viewer = useViewer();
  const [getUserUnreadNotificationCountLazyQuery, { data, startPolling, stopPolling }] =
    useGetUserUnreadNotificationCountLazyQuery();
  const hasNotifications = !!data?.userNotificationsAggregate.aggregate?.count;

  React.useEffect(() => {
    if (viewer.userId) {
      getUserUnreadNotificationCountLazyQuery({
        fetchPolicy: 'network-only',
        variables: {
          userId: viewer.userId,
        },
      });
      startPolling(REFETCH_TIME_MS);
    }

    return () => stopPolling();
  }, [viewer.userId]);

  return (
    <div className="relative flex shrink-0 items-center justify-end text-base">
      <BellIcon className={className} />
      {hasNotifications && (
        <div className="absolute top-0 right-0.5 h-2 w-2 rounded-full bg-red-500 shadow-indicator">
          &nbsp;
        </div>
      )}
    </div>
  );
};

export default NotificationIndicator;
