import * as React from 'react';
import { ChevronLeftIcon, MapPinIcon } from '@heroicons/react/24/solid';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { MediaProviders } from 'constants/media';
import { MY_SETTINGS_PAGE } from 'constants/pages';
import { RequestStatus } from 'constants/requests';
import { ImageWideForLessonType, lessonDisplayName } from 'constants/sports';
import {
  CoachQualificationStatusesEnum,
  CoachStatusEnum,
  FollowStatusesEnum,
  LessonTypesEnum,
  UserFollows,
  UserProfileFieldsFragment,
  useUpdateCoachProfileMutation,
  useUpdatePlayerProfileMutation,
  useUpdateUserCoverImageMutation,
  useUpdateUserProfileImageMutation,
  useUpsertFollowerConnectionMutation,
} from 'types/generated/client';
import { updateCacheGetUserProfileFollowing } from 'gql/cache/updateCacheGetUserProfileFollowing';
import { uploadImage } from 'services/client/imagekit/uploadImage';
import { generateRandomFileName } from 'utils/shared/media/generateRandomFileName';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { calculateYearsOfCoachingExperience } from 'utils/shared/user/calculateYearsOfCoachingExperience';
import { getBadgeTextForQualification } from 'utils/shared/user/getBadgeTextForQualification';
import { getCoverImageUrl } from 'utils/shared/user/getCoverImageUrl';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useAuthModals } from 'hooks/useAuthModals';
import { useViewer } from 'hooks/useViewer';
import AddPhoto from 'svg/AddPhoto';
import CoachBadge from 'svg/CoachBadge';
import Cog6ToothIcon from 'svg/Cog';
import TabPageScrollPage from 'layouts/TabPageScrollPage';
import CoverImageBackground from 'components/CoverImageBackground';
import Link from 'components/Link';
import QrFloatingButton from 'components/QrFloatingButton';
import TabSectionButton from 'components/TabSectionButton';
import VerticalOverflowText from 'components/VerticalOverflowText';
import ModalSignup from 'components/modals/ModalSignup';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import CoachDashboard from './CoachDashboard';
import CoachLessonCalendar from './CoachLessonCalendar';
import EditProfile from './EditProfile';
import PlayerLessons from './PlayerLessons';

const DEFAULT_COVER_IMAGE = '/images/app/default-profile-cover.png';

enum ActiveTab {
  About = 'ABOUT',
  LessonHistory = 'LESSON_HISTORY',
  Dashboard = 'DASHBOARD',
  Calendar = 'CALENDAR',
}

interface Props {
  profile?: UserProfileFieldsFragment;
  isLoading: boolean;
  isViewerProfile?: boolean;
  followingDetails?: Pick<UserFollows, 'status' | 'followerUserId' | 'followedUserId'>;
  refetchProfile?: () => void;
  username?: string;
}

const ProfilePage: React.FC<Props> = ({
  profile,
  followingDetails,
  isViewerProfile,
  isLoading,
  refetchProfile,
  username,
}) => {
  const viewer = useViewer();
  const router = useRouter();
  const [upsertFollowerMutation] = useUpsertFollowerConnectionMutation();
  const [updateCoachProfileMutation, { loading: coachUpdateLoading }] =
    useUpdateCoachProfileMutation();
  const [updatePlayerProfileMutation, { loading: playerUpdateLoading }] =
    useUpdatePlayerProfileMutation();
  const [updateUserProfileImageMutation] = useUpdateUserProfileImageMutation();
  const [updateUserCoverImageMutation] = useUpdateUserCoverImageMutation();
  const [profileImagePreview, setProfileImagePreview] = React.useState('');
  const [coverImagePreview, setCoverImagePreview] = React.useState('');
  const [imageRequestStatus, setImageRequestStatus] = React.useState(RequestStatus.Idle);
  const [activeTab, setActiveTab] = React.useState(ActiveTab.About);
  const [isEdit, setIsEdit] = React.useState(false);
  const isImageUploading = imageRequestStatus === RequestStatus.InProgress;
  const isUpdatingProfile = coachUpdateLoading || playerUpdateLoading || isLoading;
  const isFollowing = followingDetails?.status === FollowStatusesEnum.Active;
  const isCoachProfile = profile?.coachStatus === CoachStatusEnum.Active;
  const coachQualifications = (profile?.coachQualifications || []).filter(
    (qualification) => qualification.status === CoachQualificationStatusesEnum.Active,
  );
  const coverImageUrl = getCoverImageUrl({ path: profile?.coverImagePath });
  const displayCoverImageUrl = coverImagePreview || coverImageUrl || DEFAULT_COVER_IMAGE;
  const isUpdateLoading = coachUpdateLoading || playerUpdateLoading;
  const pageMetaTitleUsername = profile?.username || username;
  const pageMetaTitle = pageMetaTitleUsername ? `${pageMetaTitleUsername} Profile` : 'Profile';
  const { ModalLogin, ModalSignup, openSignupModal } = useAuthModals();

  const handleSignupSuccess = async ({ userId }: { userId: string }) => {
    if (userId && profile?.id) {
      const variables = {
        followerUserId: userId,
        followedUserId: profile.id,
        status: FollowStatusesEnum.Active,
      };
      await upsertFollowerMutation({
        variables: variables,
        optimisticResponse: {
          __typename: 'mutation_root',
          insertUserFollowsOne: {
            __typename: 'UserFollows',
            ...variables,
          },
        },
      });
    }
  };

  return (
    <>
      <Head
        title={pageMetaTitle}
        description={`View user profile${
          pageMetaTitleUsername ? ` for ${pageMetaTitleUsername}` : ''
        }`}
      />
      <TabPageScrollPage handleSignupSuccess={handleSignupSuccess} ignoreSafeTop>
        <div className="flex h-full grow flex-col">
          <div className="relative">
            <div className="relative">
              <CoverImageBackground
                coverImageUrl={displayCoverImageUrl}
                className="h-36 w-full lg:h-48"
              />
              {isEdit && (
                <div className="absolute bottom-2 right-6 z-10 ">
                  <label
                    htmlFor="cover-image"
                    className={classNames(
                      'cursor-pointer rounded-full bg-color-bg-lightmode-primary p-2.5 shadow-fab dark:bg-color-bg-darkmode-primary',
                      isUpdatingProfile || isImageUploading ? 'hidden' : 'block',
                    )}
                  >
                    <span className="block h-6 w-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      <AddPhoto className="h-6 w-6" />
                    </span>
                  </label>
                  <input
                    id="cover-image"
                    name="cover-image"
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    disabled={isUpdatingProfile || isImageUploading}
                    onChange={async (e) => {
                      if (imageRequestStatus === RequestStatus.InProgress || !viewer.userId) {
                        return;
                      }

                      const file = e.target?.files?.[0];
                      if (file) {
                        setImageRequestStatus(RequestStatus.InProgress);

                        try {
                          const newPreviewUrl = URL.createObjectURL(file);
                          setCoverImagePreview(newPreviewUrl);
                        } catch (error) {
                          Sentry.captureException(error);
                        }

                        try {
                          const uploadResponse = await uploadImage({
                            file,
                            fileName: generateRandomFileName(file),
                            useUniqueFileName: true,
                            tags: ['cover', viewer?.userId],
                            folder: '',
                          });
                          await updateUserCoverImageMutation({
                            variables: {
                              id: viewer.userId,
                              coverImageFileName: uploadResponse.name,
                              coverImagePath: uploadResponse.filePath,
                              coverImageProvider: MediaProviders.ImageKit,
                              coverImageProviderId: uploadResponse.fileId,
                              coverImageProviderUrl: uploadResponse.url,
                            },
                          });

                          setImageRequestStatus(RequestStatus.Success);
                        } catch (error) {
                          Sentry.captureException(error);
                          setImageRequestStatus(RequestStatus.Error);
                        } finally {
                          setCoverImagePreview('');
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div className="safearea-pad-top absolute left-6 top-8 lg:hidden">
              <button
                type="button"
                onClick={() => router.back()}
                className="h-8 w-8 rounded-full bg-color-bg-lightmode-primary bg-opacity-20 p-1 dark:bg-color-bg-darkmode-primary"
              >
                <ChevronLeftIcon className="text-white" />
              </button>
            </div>
          </div>
          <div className="flex h-full grow flex-col">
            <div className="-mt-12 px-6 sm:-mt-16">
              <div className="flex justify-between">
                <div className="relative">
                  <img
                    className={classNames(
                      'relative h-24 w-24 shrink-0 rounded-full object-cover object-center ring-4 ring-white sm:h-32 sm:w-32',
                      isImageUploading && 'opacity-60',
                    )}
                    src={
                      profileImagePreview ||
                      getProfileImageUrlOrPlaceholder({ path: profile?.profileImagePath })
                    }
                    alt={profile?.fullName || ''}
                  />
                  {isEdit && (
                    <div className="absolute -right-1 bottom-0 z-10 ">
                      <label
                        htmlFor="profile-image"
                        className={classNames(
                          'cursor-pointer rounded-full bg-color-bg-lightmode-primary p-2.5 shadow-fab dark:bg-color-bg-darkmode-primary',
                          isUpdatingProfile || isImageUploading ? 'hidden' : 'block',
                        )}
                      >
                        <span className="block h-6 w-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                          <AddPhoto className="h-6 w-6" />
                        </span>
                      </label>
                      <input
                        id="profile-image"
                        name="profile-image"
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        disabled={isUpdatingProfile || isImageUploading}
                        onChange={async (e) => {
                          if (imageRequestStatus === RequestStatus.InProgress || !viewer.userId) {
                            return;
                          }

                          const file = e.target?.files?.[0];
                          if (file) {
                            setImageRequestStatus(RequestStatus.InProgress);

                            try {
                              const newPreviewUrl = URL.createObjectURL(file);
                              setProfileImagePreview(newPreviewUrl);
                            } catch (error) {
                              Sentry.captureException(error);
                            }

                            try {
                              const uploadResponse = await uploadImage({
                                file,
                                fileName: generateRandomFileName(file),
                                useUniqueFileName: true,
                                tags: ['profile', viewer?.userId],
                                folder: '',
                              });
                              await updateUserProfileImageMutation({
                                variables: {
                                  id: viewer.userId,
                                  profileImageFileName: uploadResponse.name,
                                  profileImagePath: uploadResponse.filePath,
                                  profileImageProvider: MediaProviders.ImageKit,
                                  profileImageProviderId: uploadResponse.fileId,
                                  profileImageProviderUrl: uploadResponse.url,
                                },
                              });

                              setImageRequestStatus(RequestStatus.Success);
                            } catch (error) {
                              Sentry.captureException(error);
                              setImageRequestStatus(RequestStatus.Error);
                            } finally {
                              setProfileImagePreview('');
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                {isLoading ? null : isViewerProfile ? (
                  <div className="mt-16 flex w-1/2 items-center space-x-4">
                    {isEdit ? (
                      <button
                        type="button"
                        disabled={isUpdateLoading}
                        className="button-rounded-inline-brand-inverted w-full font-medium leading-6"
                        onClick={() => setIsEdit(false)}
                      >
                        Discard
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isUpdateLoading}
                        className="button-rounded-inline-brand-inverted w-full font-medium leading-6"
                        onClick={() => setIsEdit(true)}
                      >
                        Edit profile
                      </button>
                    )}
                    {!isEdit && (
                      <Link href={MY_SETTINGS_PAGE} className="flex items-center">
                        <Cog6ToothIcon className="h-6 w-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="mt-16 flex w-1/2 items-center space-x-3">
                    {isFollowing ? (
                      <button
                        onClick={() => {
                          if (viewer.userId && profile?.id) {
                            const variables = {
                              followerUserId: viewer.userId,
                              followedUserId: profile.id,
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
                            openSignupModal(true);
                          }
                        }}
                        type="button"
                        className="button-rounded-inline-brand-inverted w-full"
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (viewer.userId && profile?.id && profile?.username) {
                            const variables = {
                              followerUserId: viewer.userId,
                              followedUserId: profile.id,
                              status: FollowStatusesEnum.Active,
                            };
                            upsertFollowerMutation({
                              update: updateCacheGetUserProfileFollowing(profile.username),
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
                            openSignupModal(true);
                          }
                        }}
                        type="button"
                        className="button-rounded-inline-primary w-full border border-transparent"
                      >
                        Follow
                      </button>
                    )}
                    {/* <button
                  type="button"
                  className="button-base border-color-button-lightmode inline-flex justify-center rounded-full border bg-color-button-lightmode px-5 py-2.5 text-sm font-medium text-color-text-darkmode-primary hover:bg-color-brand-secondary"
                >
                  Message
                </button> */}
                  </div>
                )}
              </div>
            </div>
            {isEdit && !!profile ? (
              <EditProfile
                profile={profile}
                handleToggle={() => setIsEdit(false)}
                isLoading={isUpdatingProfile}
                updateCoachProfileMutation={updateCoachProfileMutation}
                updatePlayerProfileMutation={updatePlayerProfileMutation}
                refetchProfile={refetchProfile}
                isCoachProfile={isCoachProfile}
              />
            ) : (
              <>
                <div className="mt-4 flex min-w-0 items-center px-6">
                  <h1 className="truncate text-2xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {profile?.fullName}
                  </h1>
                  {profile?.coachStatus === CoachStatusEnum.Active && (
                    <div className="ml-2 h-6 w-6 text-color-brand-highlight">
                      <CoachBadge className="h-6 w-6" />
                    </div>
                  )}
                </div>
                {/* <div className="mt-2 px-6">
                  <h2 className="text-sm leading-none text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                    @{profile?.username}
                  </h2>
                </div> */}
                {profile?.cityName && (
                  <div className="mt-4 flex items-center px-6">
                    <MapPinIcon className="h-5 w-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />{' '}
                    <span className="color-text-lightmode-primary ml-2 text-sm leading-none">
                      {profile.cityName}
                      {!!profile.countrySubdivision && `, ${profile.countrySubdivision.name}`}
                      {!profile.countrySubdivision &&
                        !!profile.country &&
                        `, ${profile.country.name}`}
                    </span>
                  </div>
                )}
                {!isCoachProfile &&
                  profile?.tennisRating &&
                  profile?.tennisRatingScale?.shortName && (
                    <div className="mt-4 flex items-center space-x-2  px-6">
                      <span className="text-sm leading-none text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                        Rating
                      </span>{' '}
                      <span className="rounded-xl bg-yellow-100 px-3 py-0.5 text-sm leading-5 text-yellow-800">
                        {profile.tennisRating} {profile.tennisRatingScale.shortName}
                      </span>
                    </div>
                  )}
                {isCoachProfile && coachQualifications.length > 0 && (
                  <div
                    className={classNames(
                      'mt-2 flex px-6',
                      coachQualifications.length > 2 ? 'flex-col items-start' : 'items-center',
                    )}
                  >
                    <div className="flex flex-wrap">
                      {coachQualifications.map((coachQualification) => {
                        return (
                          <span
                            key={coachQualification.id}
                            className="mr-2 mt-2 rounded-xl bg-color-brand-active px-3 py-0.5 text-sm leading-5 text-color-brand-primary"
                          >
                            {getBadgeTextForQualification(coachQualification.qualification)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                {isCoachProfile && (
                  <div className="mt-5 flex px-6">
                    <div className="flex items-center">
                      <div className="text-[26px] font-bold text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                        {calculateYearsOfCoachingExperience(
                          profile?.coachExperienceYears || 0,
                          new Date(profile?.coachExperienceSetAt || Date.now()),
                        )}
                      </div>
                      <div className="ml-3 text-xs leading-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                        Years of coaching
                      </div>
                    </div>
                    <div className="ml-10 flex items-center">
                      <div className="text-[26px] font-bold text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                        {profile?.coachLessonsAggregate?.aggregate?.count || 0}
                      </div>
                      <div className="ml-3 text-xs leading-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                        Lessons given with Bounce
                      </div>
                    </div>
                  </div>
                )}
                {isCoachProfile && (
                  <div className="mt-5 flex items-center px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex -space-x-1 overflow-hidden">
                          {profile?.followers.map((follower) => {
                            const profile = follower.followerProfile;

                            if (!profile) {
                              return null;
                            }

                            return (
                              <img
                                key={profile.id}
                                className="inline-block h-6 w-6 rounded-full object-cover object-center ring-2 ring-white"
                                src={getProfileImageUrlOrPlaceholder({
                                  path: profile.profileImagePath,
                                })}
                                alt={profile.preferredName || ''}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2.5 flex items-center">
                      <span className="text-sm font-bold leading-5 text-color-connections">
                        {profile?.followersAggregate?.aggregate?.count || 0}
                      </span>
                      <span className="ml-1 text-xs font-medium leading-4 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                        Players
                      </span>
                    </div>
                  </div>
                )}
                <div className="mt-6 flex h-full grow flex-col">
                  <div className="relative flex shadow-lightmode-primary">
                    {!!profile && (
                      <>
                        {isCoachProfile && (
                          <TabSectionButton
                            handleClick={() => setActiveTab(ActiveTab.About)}
                            isActive={activeTab === ActiveTab.About}
                            className="w-full"
                          >
                            About
                          </TabSectionButton>
                        )}
                        {/* {profile.coachStatus !== CoachStatusEnum.Active && (
                        <TabSectionButton
                          handleClick={() => setActiveTab(ActiveTab.LessonHistory)}
                          isActive={activeTab === ActiveTab.LessonHistory}
                          className="w-full"
                        >
                          Lesson history
                        </TabSectionButton>
                      )} */}
                        {isCoachProfile && (
                          <TabSectionButton
                            handleClick={() => setActiveTab(ActiveTab.Calendar)}
                            isActive={activeTab === ActiveTab.Calendar}
                            className="w-full"
                          >
                            Calendar
                          </TabSectionButton>
                        )}
                        {isCoachProfile && viewer.userId === profile.id && (
                          <TabSectionButton
                            handleClick={() => setActiveTab(ActiveTab.Dashboard)}
                            isActive={activeTab === ActiveTab.Dashboard}
                            className="w-full"
                          >
                            Dashboard
                          </TabSectionButton>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex grow flex-col bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
                    <div className="mx-auto flex w-full max-w-4xl flex-grow flex-col">
                      {activeTab === ActiveTab.About && (
                        <div className="py-6">
                          {!!profile?.aboutMe && (
                            <>
                              <h2 className="px-6 text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                                About
                              </h2>
                              <div className="mt-2 px-6 text-sm leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                                {profile?.aboutMe}
                              </div>
                            </>
                          )}
                          {!!profile?.id && !isCoachProfile && (
                            <PlayerLessons userId={profile.id} />
                          )}
                          {/* {!!profile?.aboutMeVideoUrl && (
                        <div className="relative mt-4 flex px-6">
                          <img
                            src="https://s3-alpha-sig.figma.com/img/2d7b/64b5/ab6caf18ee1877444457cb0cd08a3ded?Expires=1660521600&Signature=VdkkILXtkbcReE95pFMKz1iuPskJItOYIp9u3KMeOFqDTPs8p3fEkqi3u~UMJMKGD7TaD-IN9NFTmbOZ1J67e3eaaaFonXu6NfPX~3CAqjxCOheiZojFPVP0EHn9gQGt7-zXIitk~kmuHq2ZjX4W2Il3iYnVCF~MhX69b3e~B05P786FYPNIivYQt3491DyAqJ1jZmLcsiSxITsVQRw8EuNy4qsL0I0xhcpO~1AW69rF2ij2hmoAfekkCDjyiTadc4PahaMtlBZhJfcwt0l-E0gCKl4WaSvLQmth8GChnLUSJD0nYnMbZ135fVoeJGW4JTH5AGB1HeQmPyG1dEnkNQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
                            className="rounded"
                          />
                          <div className="absolute h-full w-full">
                            <div className="flex h-full w-full items-center justify-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary bg-opacity-40 backdrop-blur-sm">
                                <FaPlay className="h-4 w-4 text-color-bg-lightmode-primary" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )} */}
                          {/* NOTE: Confirm this is cross-device compatible. Test without snap as well and just scroll X */}
                          {!!profile && isCoachProfile && profile.coachServices?.length > 0 && (
                            <div className="mt-8">
                              <h2 className="px-6 text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                                Services
                              </h2>
                              <div
                                className="grid grid-flow-col overflow-y-auto pb-6 pt-4"
                                style={{
                                  overscrollBehaviorX: 'contain',
                                  scrollSnapType: 'x mandatory',
                                  maxWidth: '480px',
                                }}
                              >
                                {profile.coachServices.map((service) => {
                                  const serviceImageUrl =
                                    ImageWideForLessonType[service.type || LessonTypesEnum.Custom];
                                  return (
                                    <div key={service.id} className="w-screen snap-center px-6">
                                      <div className="flex h-full flex-col rounded bg-color-bg-lightmode-primary p-6 shadow-fab dark:bg-color-bg-darkmode-primary">
                                        <img
                                          src={serviceImageUrl}
                                          className="h-36 w-full rounded object-cover"
                                        />
                                        <div className="mt-4 flex justify-between">
                                          <div className="text-lg font-medium leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                                            {service.type ? lessonDisplayName[service.type] : ''}
                                          </div>
                                          {!!service.priceUnitAmount && (
                                            <div className="text-lg font-semibold leading-6 text-color-tab-active">
                                              {
                                                convertUnitPriceToFormattedPrice(
                                                  service.priceUnitAmount,
                                                ).priceDisplay
                                              }
                                            </div>
                                          )}
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                                          {service.title}
                                        </div>
                                        <VerticalOverflowText
                                          lineClamp={3}
                                          className="mt-2 h-14 pb-2 text-sm leading-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"
                                        >
                                          <div>{service.description}</div>
                                        </VerticalOverflowText>
                                        {/* <div className="mt-4 text-right leading-none text-color-text-lightmode-primary dark:text-color-text-darkmode-primary underline">
                                      Read more
                                    </div> */}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {activeTab === ActiveTab.Dashboard && <CoachDashboard profile={profile} />}
                      {activeTab === ActiveTab.Calendar && (
                        <CoachLessonCalendar profile={profile} />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <TabBar
          handleSignupSuccess={handleSignupSuccess}
          aboveTabContent={
            <div className="safearea-pad-bot absolute bottom-tabs right-0">
              <QrFloatingButton
                title="Share Profile QR Code"
                qrCodeString={`${process.env.APP_URL}/${profile?.username}`}
              />
            </div>
          }
        />
      </TabPageScrollPage>
      <ModalSignup handleSignupSuccess={handleSignupSuccess} isShowLoginLink />
      <ModalLogin isShowSignupLink />
    </>
  );
};

export default ProfilePage;
