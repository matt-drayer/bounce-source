import React from 'react';
import { format } from 'date-fns';
import { getLessonPageUrl } from 'constants/pages';
import { CoachStatusEnum } from 'types/generated/client';
import CoachBadge from 'svg/CoachBadge';
import Link from 'components/Link';
import CardNotification from './CardNotification';
import { LessonNotificationTemplateProps } from '../props';

const LessonNotificationTemplate: React.FC<LessonNotificationTemplateProps> = ({
  status,
  lesson,
  actorFullName,
  actorCoachStatus,
  badgeComponent,
  message,
}) => {
  const [initialStatus] = React.useState(status);

  return (
    <Link href={getLessonPageUrl(lesson?.id)} className="block">
      <CardNotification status={initialStatus}>
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs font-semibold leading-5">
              {actorFullName}{' '}
              {actorCoachStatus === CoachStatusEnum.Active && (
                <div className="h-4 w-4 text-color-brand-primary">
                  <CoachBadge className="h-6 w-6" />
                </div>
              )}
            </div>
            {badgeComponent}
          </div>
          <div className="mt-1 text-xs leading-5">{message}</div>
          <div className="mt-1 text-sm font-semibold">{lesson?.title}</div>
          <div className="mt-1 flex items-center text-xs">
            <div className="mr-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">{`${format(
              new Date(lesson?.startDateTime),
              'p',
            )} - ${format(new Date(lesson?.endDateTime), 'p')}`}</div>
            <div className="text-color-brand-primary">
              {format(new Date(lesson?.startDateTime), 'MMM d')}
            </div>
          </div>
        </div>
      </CardNotification>
    </Link>
  );
};

export default LessonNotificationTemplate;
