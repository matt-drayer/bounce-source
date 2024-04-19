import { gql } from '@apollo/client';

export const GET_PLAY_SESSION_COMMENTS = gql`
  query getPlaySessionComments($playSessionId: uuid!) {
    playSessionComments(
      orderBy: { createdAt: ASC }
      where: { playSessionId: { _eq: $playSessionId } }
    ) {
      id
      createdAt
      content
      playSessionCommentId
      playSessionId
      playSessionRootCommentId
      userId
      userProfile {
        id
        fullName
        preferredName
        profileImagePath
        username
      }
    }
  }
`;
