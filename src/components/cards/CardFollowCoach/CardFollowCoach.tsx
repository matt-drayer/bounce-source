import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import { getProfilePageUrl } from 'constants/pages';
import { FollowStatusesEnum } from 'types/generated/client';
import {
  GetActiveCoachProfilesQuery,
  useUpsertFollowerConnectionMutation,
} from 'types/generated/client';
import { updateCacheGetUserFollowingIds } from 'gql/cache/updateCacheGetUserFollowingIds';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import Link from 'components/Link';
import Card from 'components/cards/Card';

interface Props {
  isLoading: boolean;
  isFollowing: boolean;
  userId: string | null | undefined;
  coach: GetActiveCoachProfilesQuery['userProfiles'][0]; // Get coach from query
}

const BUTTON_MIN_WIDTH_PX = 84;

const CardFollowCoach: React.FC<Props> = ({ userId, coach, isLoading, isFollowing }) => {
  const [upsertFollowerMutation] = useUpsertFollowerConnectionMutation();

  return (
    <Card key={coach.id}>
      <div className="flex items-center justify-between px-4 py-2">
        <Link href={getProfilePageUrl(coach.username)} className="flex items-center">
          <img
            src={getProfileImageUrlOrPlaceholder({ path: coach.profileImagePath })}
            className="h-[3.75rem] w-[3.75rem] rounded-full object-cover object-center"
          />
          <div className="ml-3 text-sm leading-none">
            <div className="text=color-brand-heavy">{coach.fullName}</div>
            {/* <div className="mt-1 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              @{coach.username}
            </div> */}
          </div>
        </Link>
        {isLoading ? null : isFollowing ? (
          <button
            type="button"
            className={`button-rounded-inline-brand-inverted min-w-[${BUTTON_MIN_WIDTH_PX}px] px-2.5 py-2 text-sm leading-4`}
            onClick={() => {
              if (userId) {
                const variables = {
                  followerUserId: userId,
                  followedUserId: coach.id,
                  status: FollowStatusesEnum.Inactive,
                };
                upsertFollowerMutation({
                  variables: variables,
                  optimisticResponse: {
                    __typename: 'mutation_root',
                    insertUserFollowsOne: {
                      __typename: 'UserFollows',
                      ...variables,
                    },
                  },
                }).catch((error) => Sentry.captureException(error));
              } else {
                // TODO: Show CTA to login/sign up
              }
            }}
          >
            Following
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (userId) {
                const variables = {
                  followerUserId: userId,
                  followedUserId: coach.id,
                  status: FollowStatusesEnum.Active,
                };
                upsertFollowerMutation({
                  update: updateCacheGetUserFollowingIds,
                  variables: variables,
                  optimisticResponse: {
                    __typename: 'mutation_root',
                    insertUserFollowsOne: {
                      __typename: 'UserFollows',
                      ...variables,
                    },
                  },
                }).catch((error) => Sentry.captureException(error));
              } else {
                // TODO: Show CTA to login/sign up
              }
            }}
            className={`button-rounded-inline-primary min-w-[${BUTTON_MIN_WIDTH_PX}px] px-5 py-2 text-sm leading-4`}
          >
            Follow
          </button>
        )}
      </div>
    </Card>
  );
};

export default CardFollowCoach;
