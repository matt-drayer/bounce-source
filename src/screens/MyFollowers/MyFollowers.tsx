import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { getProfilePageUrl } from 'constants/pages';
import {
  FollowStatusesEnum,
  useGetUserFollowerProfilesLazyQuery,
  useUpdateFollowerInactiveMutation,
} from 'types/generated/client';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useViewer } from 'hooks/useViewer';
import TabPageScrollChild from 'layouts/TabPageScrollChild';
import Link from 'components/Link';
import PageTitle from 'components/PageTitle';
import Card from 'components/cards/Card';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';

const MyFollowers: React.FC<{ isCoach: boolean }> = () => {
  const viewer = useViewer();
  const [getUserFollowerProfilesQuery, { data, loading, called }] =
    useGetUserFollowerProfilesLazyQuery();
  const [updateFollowerInactiveMutation] = useUpdateFollowerInactiveMutation();
  const [searchText, setSearchText] = React.useState('');
  const followerProfiles =
    data?.userFollows?.filter((follow) => {
      if (!follow.followerProfile) {
        return false;
      }
      if (follow.status === FollowStatusesEnum.Inactive) {
        return false;
      }
      if (!searchText || searchText.length < 2) {
        return true;
      }

      const profile = follow.followerProfile;
      const isSearched =
        profile?.fullName?.toUpperCase().includes(searchText.toUpperCase()) ||
        profile?.username?.toUpperCase().includes(searchText.toUpperCase());

      return isSearched;
    }) || [];

  React.useEffect(() => {
    if (viewer.userId) {
      getUserFollowerProfilesQuery({
        variables: {
          followedUserId: viewer.userId,
        },
      }).catch((error) => {
        Sentry.captureException(error);
      });
    }
  }, [viewer.userId]);

  return (
    <>
      <Head noIndex title="Players" description="All the players that follow you" />
      <TabPageScrollChild>
        <div className="relative z-10 flex w-full shrink-0 flex-col bg-color-bg-lightmode-primary pb-4 shadow-mobile-top-nav dark:bg-color-bg-darkmode-primary">
          <div className="relative shrink-0 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary lg:pt-6">
            <PageTitle title="Players" isPop isAutoHeightDesktop />
          </div>
          <div className="relative z-10 flex w-full flex-col items-center px-6 lg:mt-4">
            <div className="w-full max-w-main-content-container">
              <label className="sr-only" htmlFor="search-coach">
                Search followers
              </label>
              <input
                id="search-coach"
                name="search-coach"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                placeholder="Search followers"
                className="input-form"
              />
            </div>
          </div>
        </div>
        <div className="flex w-full grow flex-col items-center overflow-y-auto bg-color-bg-lightmode-secondary px-6 pb-8 pt-4 dark:bg-color-bg-darkmode-secondary">
          <div className="flex w-full max-w-main-content-container grow flex-col space-y-2 pb-8">
            {followerProfiles.map((follow) => {
              const profile = follow.followerProfile;

              if (!profile) {
                return null;
              }

              return (
                <Card key={profile.id}>
                  <div className="flex items-center justify-between px-6 py-3">
                    <Link href={getProfilePageUrl(profile.username)} className="flex items-center">
                      <img
                        src={getProfileImageUrlOrPlaceholder({
                          path: profile.profileImagePath,
                        })}
                        className="h-16 w-16 rounded-full object-cover object-center"
                      />
                      <div className="ml-4 text-sm leading-none">
                        <div className="text=color-brand-heavy">{profile.fullName}</div>
                        {/* <div className="mt-1 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                          @{profile.username}
                        </div> */}
                      </div>
                    </Link>
                    <button
                      type="button"
                      className="button-rounded-inline-primary px-4 py-2 text-sm leading-4"
                      onClick={() => {
                        const variables = {
                          followerUserId: profile.id,
                          followedUserId: viewer.userId,
                          status: FollowStatusesEnum.Inactive,
                        };
                        updateFollowerInactiveMutation({
                          variables,
                          optimisticResponse: {
                            __typename: 'mutation_root',
                            updateUserFollows: {
                              __typename: 'UserFollowsMutationResponse',
                              ...variables,
                              returning: [
                                {
                                  __typename: 'UserFollows',
                                  ...variables,
                                },
                              ],
                            },
                          },
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="safearea-spacer-bot w-full"></div>
        </div>
        <TabBar />
      </TabPageScrollChild>
    </>
  );
};

export default MyFollowers;
