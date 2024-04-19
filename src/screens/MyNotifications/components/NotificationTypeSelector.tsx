import * as React from 'react';
import { NotificationActionTypesEnum } from 'types/generated/client';
import GroupCommentSubmittedNotification from './GroupCommentSubmittedNotification';
import GroupCommentUpvotedNotification from './GroupCommentUpvotedNotification';
import LessonCoachCancelNotification from './LessonCoachCancelNotification';
import LessonParticipantJoinNotification from './LessonParticipantJoinNotification';
import LessonParticipantLeaveNotification from './LessonParticipantLeaveNotification';
import LessonStartReminderNotification from './LessonStartReminderNotification';
import PlaySessionCommentNotification from './PlaySessionCommentNotification';
import PlaySessionOrganizerCancelNotification from './PlaySessionOrganizerCancelNotification';
import PlaySessionParticipantJoinNotification from './PlaySessionParticipantJoinNotification';
import PlaySessionParticipantLeaveNotification from './PlaySessionParticipantLeaveNotification';
import PlaySessionStartReminderNotification from './PlaySessionStartReminderNotification';
import PlaySessionUpdatedNotification from './PlaySessionUpdatedNotification';
import { NotificationTypeSelectorProps } from '../props';

export default function NotificationTypeSelector({ notification }: NotificationTypeSelectorProps) {
  const notificationDetails = notification.notificationDetails;
  const actionType = notificationDetails.actionType;

  if (actionType === NotificationActionTypesEnum.LessonCoachCancel) {
    return (
      <LessonCoachCancelNotification
        notification={notification}
        status={notification.status}
        lesson={notification.notificationDetails.primaryEntity.lesson}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.LessonParticipantLeave) {
    return (
      <LessonParticipantLeaveNotification
        notification={notification}
        status={notification.status}
        lesson={notification.notificationDetails.primaryEntity.lesson}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.LessonParticipantJoin) {
    return (
      <LessonParticipantJoinNotification
        notification={notification}
        status={notification.status}
        lesson={notification.notificationDetails.primaryEntity.lesson}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.LessonStartReminder) {
    return (
      <LessonStartReminderNotification
        notification={notification}
        status={notification.status}
        lesson={notification.notificationDetails.primaryEntity.lesson}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.PlaySessionOrganizerCancel) {
    return (
      <PlaySessionOrganizerCancelNotification
        notification={notification}
        status={notification.status}
        playSession={notification.notificationDetails.primaryEntity.playSession}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.PlaySessionParticipantLeave) {
    return (
      <PlaySessionParticipantLeaveNotification
        notification={notification}
        status={notification.status}
        playSession={notification.notificationDetails.primaryEntity.playSession}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.PlaySessionParticipantJoin) {
    return (
      <PlaySessionParticipantJoinNotification
        notification={notification}
        status={notification.status}
        playSession={notification.notificationDetails.primaryEntity.playSession}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.PlaySessionStartReminder) {
    return (
      <PlaySessionStartReminderNotification
        notification={notification}
        status={notification.status}
        playSession={notification.notificationDetails.primaryEntity.playSession}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.PlaySessionCommentSubmit) {
    return (
      <PlaySessionCommentNotification
        notification={notification}
        status={notification.status}
        playSession={notification.notificationDetails.primaryEntity.playSession}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.PlaySessionDetailsUpdate) {
    return (
      <PlaySessionUpdatedNotification
        notification={notification}
        status={notification.status}
        playSession={notification.notificationDetails.primaryEntity.playSession}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.GroupCommentUpvote) {
    return (
      <GroupCommentUpvotedNotification
        notification={notification}
        status={notification.status}
        group={notification.notificationDetails.primaryEntity.group}
        groupThread={notification.notificationDetails.primaryEntity.groupThread}
      />
    );
  }
  if (actionType === NotificationActionTypesEnum.GroupCommentReply) {
    return (
      <GroupCommentSubmittedNotification
        notification={notification}
        status={notification.status}
        group={notification.notificationDetails.primaryEntity.group}
        groupThread={notification.notificationDetails.primaryEntity.groupThread}
      />
    );
  }

  return null;
}
