import * as React from 'react';
import { getCourtPageUrl } from 'constants/pages';
import {
  CourtSurfacesEnum,
  FollowStatusesEnum,
  VenueAccessTypesEnum,
  VenueNetsEnum,
  useGetUserVenueFollowLazyQuery,
  useUpsertVenueFollowMutation,
} from 'types/generated/client';
import { getGoogleMapsAddressUrl } from 'utils/shared/location/getGoogleMapsAddressUrl';
import { useViewer } from 'hooks/useViewer';
import CourtFlat from 'svg/CourtFlat';
import Directions from 'svg/Directions';
import Flag from 'svg/Flag';
import Location from 'svg/Location';
import Lock from 'svg/Lock';
import Membership from 'svg/Membership';
import Net from 'svg/Net';
import Public from 'svg/Public';
import RacketBall from 'svg/RacketBall';
import Share from 'svg/Share';
import Surface from 'svg/Surface';
import Link from 'components/Link';
import classNames from 'styles/utils/classNames';
import { PLAY_SESSIONS_ID } from './types';

const getAccessParamters = (accessType?: VenueAccessTypesEnum | null) => {
  if (!accessType || accessType === VenueAccessTypesEnum.NeedsAudit) {
    return null;
  }

  if (
    accessType === VenueAccessTypesEnum.Membership ||
    accessType === VenueAccessTypesEnum.Private
  ) {
    return {
      name: 'Membership',
      Icon: Lock,
    };
  } else if (accessType === VenueAccessTypesEnum.OneTime) {
    return {
      name: 'One-time fee',
      Icon: Membership,
    };
  } else {
    return {
      name: 'Free',
      Icon: Public,
    };
  }
};

const getNetName = (netType?: VenueNetsEnum | null) => {
  if (!netType) {
    return null;
  }

  if (netType === VenueNetsEnum.BringYourOwn || netType === VenueNetsEnum.Portable) {
    return 'Non-permanent nets';
  } else {
    return 'Permanent nets';
  }
};

const getSurfaceNames = (surfaceType?: CourtSurfacesEnum[] | null) => {
  if (!surfaceType || surfaceType.length === 0) {
    return null;
  }

  return surfaceType.map((s) => s[0] + s.slice(1).toLowerCase()).join(' | ');
};

interface CourtDetailsProps {
  venueId: string;
  locationShortName: string;
  addressString: string;
  venueTitle: string;
  access?: VenueAccessTypesEnum | null;
  indoorCourtCount: number;
  outdoorCourtCount: number;
  netType?: VenueNetsEnum | null;
  surfaceType: CourtSurfacesEnum[];
  handleNeedsAuth: () => void;
  shareUrl: string;
  openShareModal: () => void;
}

export default function CourtDetails({
  venueId,
  locationShortName,
  addressString,
  venueTitle,
  access,
  indoorCourtCount,
  outdoorCourtCount,
  netType,
  surfaceType,
  handleNeedsAuth,
  shareUrl,
  openShareModal,
}: CourtDetailsProps) {
  const viewer = useViewer();
  const [getUserVenueFollowLazyQuery, { data: followQueryData, loading: isFollowQueryLoading }] =
    useGetUserVenueFollowLazyQuery();
  const [upsertVenueFollowMutation, { loading: isFollowUpsertLoading }] =
    useUpsertVenueFollowMutation();
  const isFollowing = followQueryData?.venueFollows?.[0]?.status === FollowStatusesEnum.Active;
  const isFollowDisabled = viewer.isSessionLoading || isFollowUpsertLoading || isFollowQueryLoading;
  const AccessType = getAccessParamters(access);

  React.useEffect(() => {
    if (viewer.userId) {
      getUserVenueFollowLazyQuery({
        variables: {
          userId: viewer.userId,
          venueId,
        },
      });
    }
  }, [venueId, viewer.userId]);

  let courtCount = [];

  if (indoorCourtCount > 0) {
    courtCount.push(`${indoorCourtCount} indoor`);
  }
  if (outdoorCourtCount > 0) {
    courtCount.push(`${outdoorCourtCount} outdoor`);
  }

  return (
    <>
      <div>
        <div className="mb-2 flex items-center justify-between lg:mb-4">
          <h2 className="typography-product-caption flex items-center leading-none text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            <Location className="mr-1 h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />{' '}
            {locationShortName}
          </h2>
          <div className="flex items-center space-x-ds-lg text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            <Link
              className="typography-product-button-label-small flex items-center leading-none"
              isExternal
              href={getGoogleMapsAddressUrl(addressString)}
            >
              <Directions className="mr-1 h-4 w-4" /> Direction
            </Link>
            <button
              className="typography-product-button-label-small hidden items-center leading-none lg:flex"
              type="button"
              onClick={() => {
                openShareModal();

                if (navigator.share) {
                  navigator
                    .share({
                      title: `${venueTitle} on Bounce`,
                      text: `Play pickleball at ${venueTitle}.`,
                      url: shareUrl,
                    })
                    .then(() => console.log('Successful share'))
                    .catch((error) => console.log('Error sharing:', error));
                }
              }}
            >
              <Share className="mr-1 h-4 w-4" /> Share
            </button>
          </div>
        </div>
        <h1 className="typography-product-heading mb-8 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:mb-0 lg:min-h-[4.5rem]">
          {venueTitle}
        </h1>
        <div className="space-y-ds-lg">
          {!!AccessType && (
            <div className="typography-product-body flex items-center leading-none text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              <AccessType.Icon className="mr-ds-md h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />{' '}
              {AccessType?.name}
            </div>
          )}
          {courtCount.length > 0 && (
            <div className="typography-product-body flex items-center leading-none text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              <CourtFlat className="mr-ds-md h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />{' '}
              {courtCount.join(' | ')}
            </div>
          )}
          {!!getNetName(netType) && (
            <div className="typography-product-body flex items-center leading-none text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              <Net className="mr-ds-md h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />{' '}
              {getNetName(netType)}
            </div>
          )}
          {surfaceType && surfaceType.length > 0 && (
            <div className="typography-product-body flex items-center leading-none text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              <Surface className="mr-ds-md h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />{' '}
              {getSurfaceNames(surfaceType)}
            </div>
          )}
        </div>
        <div className="mt-ds-xl hidden w-full justify-between space-x-4 lg:flex">
          <button
            type="button"
            disabled={isFollowDisabled}
            className="button-rounded-inline-primary-inverted typography-product-button-label-medium group min-h-[2.5rem] w-1/2"
            onClick={() => {
              if (viewer.isSessionLoading) {
                return;
              }

              if (viewer.isAnonymousSession) {
                handleNeedsAuth();
                return;
              }

              if (isFollowUpsertLoading || isFollowQueryLoading) {
                return;
              }

              if (isFollowing) {
                upsertVenueFollowMutation({
                  variables: {
                    venueId,
                    userId: viewer.userId,
                    status: FollowStatusesEnum.Inactive,
                  },
                }).then(() =>
                  getUserVenueFollowLazyQuery({
                    fetchPolicy: 'network-only',
                    variables: {
                      userId: viewer.userId,
                      venueId,
                    },
                  }),
                );
              } else {
                upsertVenueFollowMutation({
                  variables: {
                    venueId,
                    userId: viewer.userId,
                    status: FollowStatusesEnum.Active,
                  },
                }).then(() =>
                  getUserVenueFollowLazyQuery({
                    fetchPolicy: 'network-only',
                    variables: {
                      userId: viewer.userId,
                      venueId,
                    },
                  }),
                );
              }
            }}
          >
            <span className={classNames(isFollowing ? 'hidden' : 'inline')}>Follow</span>
            <span className={classNames('group-hover:hidden', isFollowing ? 'inline' : 'hidden')}>
              Following
            </span>
            <span
              className={classNames(
                'text-color-text-brand',
                isFollowing ? 'hidden group-hover:inline' : 'hidden',
              )}
            >
              Unfollow
            </span>
          </button>
          <Link
            href={`#${PLAY_SESSIONS_ID}`}
            className="button-rounded-inline-primary typography-product-button-label-medium flex min-h-[2.5rem] w-1/2 items-center justify-center"
          >
            <RacketBall className="mr-2 h-5 w-5" /> Open play
          </Link>
        </div>
        <div className="mt-12 hidden items-center justify-center text-center lg:flex">
          <Link
            className="typography-product-button-label-small flex items-center leading-none text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            href={`mailto:support@bounce.game?subject=Issue with ${venueTitle} in ${locationShortName} - ${venueId}`}
          >
            <Flag className="mr-1 h-4 w-4" /> Report an issue
          </Link>
        </div>
      </div>
    </>
  );
}
