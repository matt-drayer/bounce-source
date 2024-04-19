import { ApolloCache, FetchResult } from '@apollo/client';
import { GetUserFollowingIdsQuery, UpsertFollowerConnectionMutation } from 'types/generated/client';
import { GET_USER_FOLLOWING_IDS } from 'gql/queries/getUserFollowingIds';

// NOTE (23 Aug 2022): You need to update the cache on insert if you don't request data again to make sure Apollo is aware of it to display on the DOM.
export const updateCacheGetUserFollowingIds = (
  cache: ApolloCache<any>,
  {
    data,
  }: Omit<
    FetchResult<UpsertFollowerConnectionMutation, Record<string, any>, Record<string, any>>,
    'context'
  >,
) => {
  const read: GetUserFollowingIdsQuery | null = cache.readQuery({
    query: GET_USER_FOLLOWING_IDS,
    variables: {
      followerUserId: data?.insertUserFollowsOne?.followerUserId,
    },
  });
  const newFollow = data?.insertUserFollowsOne;
  const filteredUserFollows = (read?.userFollows || []).filter((userFollow) => {
    return userFollow.followedUserId !== newFollow?.followedUserId;
  });
  const newData = {
    userFollows: [newFollow, ...filteredUserFollows],
  };
  cache.writeQuery({
    query: GET_USER_FOLLOWING_IDS,
    variables: {
      followerUserId: data?.insertUserFollowsOne?.followerUserId,
    },
    data: newData,
  });
};
