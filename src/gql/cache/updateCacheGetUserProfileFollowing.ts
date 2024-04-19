import { ApolloCache, FetchResult } from '@apollo/client';
import {
  GetUserProfileByUsernameQuery,
  UpsertFollowerConnectionMutation,
} from 'types/generated/client';
import { GET_USER_PROFILE_BY_USERNAME } from 'gql/queries/getUserProfileByUsername';

// NOTE (23 Aug 2022): You need to update the cache on insert if you don't request data again to make sure Apollo is aware of it to display on the DOM.
export const updateCacheGetUserProfileFollowing =
  (username: string) =>
  (
    cache: ApolloCache<any>,
    {
      data,
    }: Omit<
      FetchResult<UpsertFollowerConnectionMutation, Record<string, any>, Record<string, any>>,
      'context'
    >,
  ) => {
    const read: GetUserProfileByUsernameQuery | null = cache.readQuery({
      query: GET_USER_PROFILE_BY_USERNAME,
      variables: {
        username: username.toLowerCase(),
        viewerId: data?.insertUserFollowsOne?.followerUserId,
      },
    });
    const newFollow = data?.insertUserFollowsOne;
    const filteredUserFollows = (read?.userFollows || []).filter((userFollow) => {
      return userFollow.followedUserId !== newFollow?.followedUserId;
    });
    const newData = {
      userProfiles: read?.userProfiles,
      userFollows: [newFollow, ...filteredUserFollows],
    };
    cache.writeQuery({
      query: GET_USER_PROFILE_BY_USERNAME,
      variables: {
        username: username.toLowerCase(),
        viewerId: data?.insertUserFollowsOne?.followerUserId,
      },
      data: newData,
    });
  };
