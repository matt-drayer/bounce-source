import React from 'react';
import { format } from 'date-fns';
import { getMyGroupThreadPageUrl } from 'constants/pages';
import { CoachStatusEnum } from 'types/generated/client';
import CoachBadge from 'svg/CoachBadge';
import Link from 'components/Link';
import CardNotification from './CardNotification';
import { GroupCommentNotificationTemplateProps } from '../props';

export default function GroupCommentNotificationTemplate({
  status,
  group,
  groupThread,
  actorFullName,
  badgeComponent,
  message,
}: GroupCommentNotificationTemplateProps) {
  const [initialStatus] = React.useState(status);

  if (!group || !groupThread) {
    return null;
  }

  return (
    <Link
      href={getMyGroupThreadPageUrl({
        groupId: group.id,
        threadId: groupThread.id,
      })}
      className="block"
    >
      <CardNotification status={initialStatus}>
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs font-semibold leading-5">
              {actorFullName}{' '}
            </div>
            {badgeComponent}
          </div>
          <div className="mt-1 text-xs leading-5">{message}</div>
          {!!group?.title && <div className="mt-1 text-sm font-semibold">{group?.title}</div>}
        </div>
      </CardNotification>
    </Link>
  );
}
