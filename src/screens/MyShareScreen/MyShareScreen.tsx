import React from 'react';
import * as Sentry from '@sentry/nextjs';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { CoachStatusEnum } from 'types/generated/client';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import CoachBadge from 'svg/CoachBadge';
import TabPageScrollPage from 'layouts/TabPageScrollPage';
import PageTitle from 'components/PageTitle';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';

const MyShareScreen = () => {
  const { user } = useGetCurrentUser();
  const profileUrl = `${process.env.APP_URL}/${user?.username || ''}`;

  return (
    <>
      <Head title="Share Bounce" description="URL and QR code to share Bounce" />
      <TabPageScrollPage>
        <div className="flex h-full grow flex-col">
          <div className="relative flex h-full grow flex-col">
            <div className="flex h-full w-full grow flex-col">
              <div className="relative shrink-0 bg-color-bg-lightmode-primary shadow-mobile-top-nav dark:bg-color-bg-darkmode-primary">
                <PageTitle
                  title="Share your profile"
                  isPop
                  right={
                    <div className="hidden lg:block">
                      <button
                        onClick={() => {
                          try {
                            copy(profileUrl);
                            toast.success('Profile link copied');
                          } catch (error) {
                            Sentry.captureException(error);
                            toast.error('Could not copy');
                          }
                        }}
                        className="button-rounded-inline-primary px-8 font-medium"
                        type="button"
                      >
                        Copy profile link
                      </button>
                    </div>
                  }
                />
              </div>
              <div className="flex h-full w-full grow flex-col items-center justify-between overflow-y-auto bg-color-bg-lightmode-secondary px-6 pb-8 pt-6 dark:bg-color-bg-darkmode-secondary lg:justify-start lg:pt-10">
                <div className="flex flex-col items-center">
                  <img
                    src={getProfileImageUrlOrPlaceholder({ path: user?.profileImagePath })}
                    className="h-40 w-40 rounded-full"
                  />
                  <h1 className="mt-4 flex items-center text-center text-2xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {!!user?.fullName && user.fullName}&nbsp;
                    {user?.coachStatus === CoachStatusEnum.Active && (
                      <div className="h-6 w-6 text-color-brand-primary">
                        <CoachBadge className="h-6 w-6" />
                      </div>
                    )}
                  </h1>
                </div>
                <div className="lg:mt-12">
                  <QRCode value={profileUrl} size={144} />
                </div>
                <div className="w-full lg:hidden">
                  <button
                    onClick={() => {
                      try {
                        copy(profileUrl);
                        toast.success('Profile link copied');
                      } catch (error) {
                        Sentry.captureException(error);
                        toast.error('Could not copy');
                      }
                    }}
                    className="button-rounded-full-primary"
                    type="button"
                  >
                    Copy profile link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TabBar />
      </TabPageScrollPage>
    </>
  );
};

export default MyShareScreen;
