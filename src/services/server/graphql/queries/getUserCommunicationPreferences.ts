import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetUserCommunicationPreferencesQuery,
  GetUserCommunicationPreferencesQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getUserCommunicationPreferences($userIdList: [UserCommunicationPreferencesBoolExp!]!) {
    userCommunicationPreferences(where: { _or: $userIdList }) {
      id
      lessonBookedEmail
      lessonBookedPush
      lessonCanceledEmail
      lessonCanceledPushed
      lessonReminderEmail
      lessonReminderPush
      marketingEmail
      marketingPush
      newFollowerEmail
      newFollowerPush
      newLessonPublishedEmail
      newLessonPublishedPush
      participantLeftLessonEmail
      participantLeftLessonPush
      payoutEmail
      payoutPush
      playSessionCanceledEmail
      playSessionCanceledPush
      playSessionParticipantJoinedEmail
      playSessionParticipantJoinedPush
      playSessionParticipantLeftEmail
      playSessionParticipantLeftPush
      playSessionReminderEmail
      playSessionReminderPush
    }
  }
`;

export const getUserCommunicationPreferences = async (
  variables: GetUserCommunicationPreferencesQueryVariables,
) => {
  const data = await client.request<GetUserCommunicationPreferencesQuery>(print(QUERY), variables);
  return data;
};
