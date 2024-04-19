import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { AuthStatus } from 'constants/auth';
import {
  FollowStatusesEnum,
  useGetActiveCoachProfilesLazyQuery,
  useGetUserFollowingIdsLazyQuery,
} from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import SearchIcon from 'svg/SearchIcon';
import TabPageScrollChild from 'layouts/TabPageScrollChild';
import PageTitle from 'components/PageTitle';
import TabSlider from 'components/TabSlider';
import Card from 'components/cards/Card';
import CardFollowCoach from 'components/cards/CardFollowCoach';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';

enum SliderTabKeys {
  MyCoaches = 'MY_COACHES',
  ExploreCoaches = 'EXPLORE_COACHES',
}

const TAB_SLIDER = [
  {
    name: 'My coaches',
    key: SliderTabKeys.MyCoaches,
  },
  {
    name: 'Explore',
    key: SliderTabKeys.ExploreCoaches,
  },
];

const MyCoaches = () => {
  const viewer = useViewer();
  const [
    getActiveCoachProfilesLazyQuery,
    { data: coachData, loading: coachLoading, called: coachCalled },
  ] = useGetActiveCoachProfilesLazyQuery();
  const [
    getUserFollowingIdsLazyQuery,
    { data: followData, loading: followLoading, called: followCalled },
  ] = useGetUserFollowingIdsLazyQuery();
  const [searchText, setSearchText] = React.useState('');
  const [initialCoachesFollowed, setInitialCoachesFollowed] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [hasFetchedFollowing, setHasFetchedFollowing] = React.useState(false);
  const [activeSliderTabIndex, setActiveSliderTabIndex] = React.useState(0);
  const activeSliderTab = TAB_SLIDER[activeSliderTabIndex];
  const followedCoachesList = followData?.userFollows || [];
  const followedCoaches = followedCoachesList.reduce((acc, curr) => {
    acc[curr.followedUserId] = curr.status;
    return acc;
  }, {} as { [key: string]: FollowStatusesEnum });
  const coaches = (coachData?.userProfiles || []).filter((coach) => {
    if (!hasFetchedFollowing) {
      return false;
    }

    const isSearched =
      coach?.fullName?.toUpperCase().includes(searchText.toUpperCase()) ||
      coach?.username?.toUpperCase().includes(searchText.toUpperCase());
    if (!!searchText && isSearched) {
      return true;
    }

    if (!!searchText && searchText.length > 1 && !isSearched) {
      return false;
    }

    const isInitiallyFollowing = initialCoachesFollowed[coach.id];
    const isCurrentlyFollowing = followedCoaches[coach.id] === FollowStatusesEnum.Active;

    return activeSliderTab.key === SliderTabKeys.MyCoaches
      ? isInitiallyFollowing || isCurrentlyFollowing
      : true;
  });

  React.useEffect(() => {
    const queryFetch = async () => {
      if (viewer.status !== AuthStatus.Loading) {
        getActiveCoachProfilesLazyQuery().catch((error) => Sentry.captureException(error));

        if (viewer.userId) {
          getUserFollowingIdsLazyQuery({
            variables: {
              followerUserId: viewer.userId,
            },
          })
            .then((res) => {
              const following = res.data?.userFollows || [];
              const initialFollowing: { [key: string]: boolean } = {};
              following.forEach((follow) => {
                initialFollowing[follow.followedUserId] =
                  follow.status === FollowStatusesEnum.Active;
              });
              setInitialCoachesFollowed(initialFollowing);
              setHasFetchedFollowing(true);
            })
            .catch((error) => Sentry.captureException(error));
        }
      }
    };

    queryFetch();
  }, [viewer.status]);

  return (
    <>
      <Head title="Coaches" description="Coaches on Bounce" />
      <TabPageScrollChild>
        <div className="shrink-0 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
          <div className="relative shrink-0 items-center lg:flex">
            <PageTitle title="Coaches" isPop />
            <div className="absolute flex w-full justify-center">
              <div className="hidden w-full max-w-md px-6 lg:block">
                <TabSlider
                  activeIndex={activeSliderTabIndex}
                  tabs={TAB_SLIDER.map((tab, index) => ({
                    name: tab.name,
                    isActive: activeSliderTabIndex === index,
                    activeIndex: activeSliderTabIndex,
                    handleClick: () => setActiveSliderTabIndex(index),
                  }))}
                />
              </div>
            </div>
          </div>
          <div className="px-6 lg:hidden">
            <TabSlider
              activeIndex={activeSliderTabIndex}
              tabs={TAB_SLIDER.map((tab, index) => ({
                name: tab.name,
                isActive: activeSliderTabIndex === index,
                activeIndex: activeSliderTabIndex,
                handleClick: () => setActiveSliderTabIndex(index),
              }))}
            />
          </div>
        </div>
        <div className="relative flex w-full shrink-0 items-center justify-center space-x-2 bg-color-bg-lightmode-primary px-6 py-4 shadow-mobile-top-nav dark:bg-color-bg-darkmode-primary">
          <div className="relative w-full max-w-main-content-container">
            <div className="absolute left-4 top-2.5 h-5 w-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              <SearchIcon />
            </div>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="input-base-form pl-11 pr-4"
              placeholder="Search coaches"
            />
          </div>
        </div>
        <div className="flex w-full grow flex-col items-center overflow-y-auto bg-color-bg-lightmode-secondary px-6 pb-8 pt-4 dark:bg-color-bg-darkmode-secondary">
          <div className="flex w-full max-w-main-content-container grow flex-col space-y-2 pb-8">
            {coaches.map((coach) => {
              return (
                <CardFollowCoach
                  key={coach.id}
                  coach={coach}
                  isLoading={followLoading || !followCalled}
                  userId={viewer.userId}
                  isFollowing={followedCoaches[coach.id] === FollowStatusesEnum.Active}
                />
              );
            })}
            {(!coaches || coaches.length === 0) &&
              hasFetchedFollowing &&
              !coachLoading &&
              !followLoading &&
              coachCalled &&
              followCalled &&
              activeSliderTab.key === SliderTabKeys.MyCoaches && (
                <Card>
                  <div className="flex items-center justify-center py-8 text-center text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                    Follow coaches in the explore tab for them to appear here
                  </div>
                </Card>
              )}
            {(!coaches || coaches.length === 0) &&
              !coachLoading &&
              !followLoading &&
              coachCalled &&
              followCalled &&
              activeSliderTab.key === SliderTabKeys.ExploreCoaches && (
                <Card>
                  <div className="flex items-center justify-center px-2 py-8 text-center text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                    There are no coaches near you
                  </div>
                </Card>
              )}
          </div>
        </div>
        <TabBar />
      </TabPageScrollChild>
    </>
  );
};

export default MyCoaches;
