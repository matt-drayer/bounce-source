import { gql } from '@apollo/client';

export const GET_USER_COMMUNICATION_PREFERENCES = gql`
  query getUserCommunicationPreferences($id: uuid!) {
    usersByPk(id: $id) {
      id
      coachStatus
      communicationPreferences {
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
  }
`;

export const UPDATE_USER_COMMUNCATION_PREFERENCES = gql`
  mutation updateUserCommunicationPreferences(
    $id: uuid!
    $_set: UserCommunicationPreferencesSetInput!
  ) {
    updateUserCommunicationPreferencesByPk(pkColumns: { id: $id }, _set: $_set) {
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
