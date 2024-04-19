import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetGroupThreadFromCommentQuery,
  GetGroupThreadFromCommentQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getGroupThreadFromComment($id: uuid!) {
    groupThreadCommentsByPk(id: $id) {
      id
      content
      userId
      isOriginalThreadComment
      thread {
        group {
          id
          title
        }
        id
        userId
        comments {
          id
          userId
          isOriginalThreadComment
          content
          user {
            id
            fullName
            email
            preferredName
          }
        }
      }
    }
  }
`;

export const getGroupThreadFromComment = async (
  variables: GetGroupThreadFromCommentQueryVariables,
) => {
  const data = await client.request<GetGroupThreadFromCommentQuery>(print(QUERY), variables);
  return data;
};
