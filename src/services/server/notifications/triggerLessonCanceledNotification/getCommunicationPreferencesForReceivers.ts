import { LessonParticipantStatusesEnum } from 'types/generated/server';
import { InputParams } from './params';
import { getCommunicationPreferencesUserIdMap } from '../helpers/getCommunicationPreferencesUserIdMap';

export const collectReceiverUserIds = ({ lesson }: InputParams): string[] => {
  const userIds: string[] = [];
  const ownerId = lesson?.ownerUserId;

  if (ownerId) {
    userIds.push(ownerId);
  }

  lesson?.participants
    // NOTE: If feels like this is the wrong place to filter for active participants (although not have a preference will not send email)
    // It seems more correct to do it in the pipeline and filter for only active participants
    // Actually this whole function may be an anti-pattern. I should probably do the query in each individual pipeline and only get the necessary key
    ?.filter((participant) => {
      return participant.status === LessonParticipantStatusesEnum.Active;
    })
    .forEach((participant) => {
      const userId = participant.user.id;

      if (userId) {
        userIds.push(userId);
      }
    });

  return userIds;
};

export const getCommunicationPreferencesForReceivers = async (params: InputParams) => {
  const userIds = collectReceiverUserIds(params);
  const communicationPreferences = await getCommunicationPreferencesUserIdMap(userIds);

  return communicationPreferences;
};
