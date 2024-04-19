import { gql } from '@apollo/client';

export const GET_GROUP_THREAD_BY_ID = gql`
  query getGroupThreadById($id: uuid!, $userId: uuid!) {
    groupThreadsByPk(id: $id) {
      comments(orderBy: { createdAt: ASC }) {
        content
        createdAt
        groupCommentId
        groupRootCommentId
        id
        isOriginalThreadComment
        updatedAt
        userId
        userProfile {
          id
          fullName
          preferredName
          profileImagePath
          username
        }
        votesAggregate(where: { vote: { _eq: POSITIVE } }) {
          aggregate {
            count
          }
        }
        votes(where: { userId: { _eq: $userId } }) {
          id
          userId
          groupThreadCommentId
          vote
        }
        files {
          id
          url
          path
        }
      }
    }
  }
`;

export const INSERT_GROUP_THREAD_COMMENT = gql`
  mutation insertGroupThreadComment(
    $userId: uuid!
    $groupThreadId: uuid!
    $content: String!
    $groupCommentId: uuid
    $groupRootCommentId: uuid
  ) {
    insertGroupThreadCommentsOne(
      object: {
        userId: $userId
        groupThreadId: $groupThreadId
        content: $content
        groupCommentId: $groupCommentId
        groupRootCommentId: $groupRootCommentId
        isOriginalThreadComment: false
        votes: { data: { userId: $userId, vote: POSITIVE } }
      }
    ) {
      id
      groupThreadId
      content
    }
  }
`;
