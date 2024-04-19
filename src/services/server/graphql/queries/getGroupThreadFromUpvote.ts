import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetGroupThreadFromUpvoteQuery,
  GetGroupThreadFromUpvoteQueryVariables,
} from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getGroupThreadFromUpvote($id: uuid!) {
    groupCommentVotesByPk(id: $id) {
      userId
      id
      vote
      comment {
        id
        user {
          email
          id
        }
        thread {
          id
          group {
            id
            title
          }
        }
      }
    }
  }
`;

export const getGroupThreadFromUpvote = async (
  variables: GetGroupThreadFromUpvoteQueryVariables,
) => {
  const data = await client.request<GetGroupThreadFromUpvoteQuery>(print(QUERY), variables);
  return data;
};
