import { LessonParticipant } from './params';
import { getCommunicationPreferencesUserIdMap } from '../helpers/getCommunicationPreferencesUserIdMap';

interface Params {
  lessonParticipant: LessonParticipant;
}

export const collectReceiverUserIds = ({ lessonParticipant }: Params): string[] => {
  const notificationReceiver = lessonParticipant.lesson.owner;

  if (!notificationReceiver) {
    return [];
  }

  const userIds = [notificationReceiver.id];
  return userIds;
};

export const getCommunicationPreferencesForReceivers = async ({ lessonParticipant }: Params) => {
  const userIds = collectReceiverUserIds({ lessonParticipant });
  const communicationPreferences = await getCommunicationPreferencesUserIdMap(userIds);

  return communicationPreferences;
};
