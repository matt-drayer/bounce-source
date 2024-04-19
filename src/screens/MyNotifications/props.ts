import {
  CoachStatusEnum,
  GetUserNotificationsQuery,
  NotificationStatusesEnum,
} from 'types/generated/client';

export interface NotificationTypeSelectorProps {
  notification: GetUserNotificationsQuery['userNotifications'][0];
}

export interface LessonNotificationProps extends NotificationTypeSelectorProps {
  status: NotificationStatusesEnum;
  lesson: GetUserNotificationsQuery['userNotifications'][0]['notificationDetails']['primaryEntity']['lesson'];
}

export interface LessonNotificationTemplateProps extends LessonNotificationProps {
  badgeComponent: React.ReactNode;
  message: string;
  actorFullName?: string | null;
  actorCoachStatus?: string | null;
}

export interface PlaySessionNotificationProps extends NotificationTypeSelectorProps {
  status: NotificationStatusesEnum;
  playSession: GetUserNotificationsQuery['userNotifications'][0]['notificationDetails']['primaryEntity']['playSession'];
}

export interface GroupCommentNotificationProps extends NotificationTypeSelectorProps {
  status: NotificationStatusesEnum;
  group: GetUserNotificationsQuery['userNotifications'][0]['notificationDetails']['primaryEntity']['group'];
  groupThread: GetUserNotificationsQuery['userNotifications'][0]['notificationDetails']['primaryEntity']['groupThread'];
}

export interface GroupCommentNotificationTemplateProps extends GroupCommentNotificationProps {
  badgeComponent: React.ReactNode;
  message: string;
  actorFullName?: string | null;
}

export interface PlaySessionNotificationTemplateProps extends PlaySessionNotificationProps {
  badgeComponent: React.ReactNode;
  message: string;
  actorFullName?: string | null;
  actorCoachStatus?: string | null;
}
