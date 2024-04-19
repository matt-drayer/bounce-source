import { gql } from '@apollo/client';

export const INSERT_PLAY_SESSION_COMMENT = gql`
  mutation insertPlaySessionComment(
    $content: String!
    $playSessionId: uuid!
    $playSessionCommentId: uuid = null
    $playSessionRootCommentId: uuid = null
    $userId: uuid!
  ) {
    insertPlaySessionCommentsOne(
      object: {
        content: $content
        playSessionId: $playSessionId
        playSessionCommentId: $playSessionCommentId
        playSessionRootCommentId: $playSessionRootCommentId
        userId: $userId
      }
    ) {
      content
      id
      createdAt
      deletedAt
      playSessionCommentId
      playSessionId
      playSessionRootCommentId
      updatedAt
      userId
    }
  }
`;
