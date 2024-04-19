import * as React from 'react';
import { useRouter } from 'next/router';
import { MY_GROUPS } from 'constants/pages';
import { useGetGroupMembersLazyQuery } from 'types/generated/client';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useViewer } from 'hooks/useViewer';
import SearchIcon from 'svg/SearchIcon';
import SafeAreaPage from 'layouts/SafeAreaPage';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';

const IS_HIDE_SIDEBAR = false;

export default function GroupMembers() {
  const { isUserSession } = useViewer();
  const router = useRouter();
  const [getGroupMembersLazyQuery, { data, loading }] = useGetGroupMembersLazyQuery();
  const members = data?.groupsByPk?.members || [];

  React.useEffect(() => {
    if (isUserSession && router.query.groupId && typeof router.query.groupId === 'string') {
      getGroupMembersLazyQuery({
        variables: {
          id: router.query.groupId,
        },
      });
    }
  }, [isUserSession, router.isReady]);

  return (
    <>
      <Head noIndex title="Group Members" />
      <SafeAreaPage isHideSidebar={IS_HIDE_SIDEBAR}>
        <div className="relative flex h-full grow flex-col pb-8">
          <div className="flex h-full w-full grow flex-col">
            <div className="w-full">
              <FixedPageTitle
                title="Members"
                backUrl={MY_GROUPS}
                isBackdropBlur
                isHideSidebar={IS_HIDE_SIDEBAR}
                bottom={
                  <div className="flex w-full items-center bg-color-bg-lightmode-primary px-4 pb-4 shadow-mobile-top-nav dark:bg-color-bg-darkmode-primary lg:hidden">
                    <div className="relative w-full">
                      <div className="absolute left-4 top-2.5">
                        <SearchIcon className="h-5 w-5 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
                      </div>
                      <input
                        className="w-full rounded-3xl bg-color-bg-input-lightmode-primary py-2 pl-11 dark:bg-color-bg-input-darkmode-primary"
                        placeholder="Search players"
                      />
                    </div>
                  </div>
                }
              />
            </div>
            <main className="pt-20 lg:pt-8">
              <div className="mx-auto max-w-2xl space-y-3 lg:space-y-6">
                {members.map((member) => {
                  const user = member.userProfile;

                  if (!user) {
                    return null;
                  }

                  return (
                    <div key={user.id} className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center">
                        <img
                          className={classNames(
                            'relative h-[3.25rem] w-[3.25rem] shrink-0 rounded-full object-cover object-center ring-2 ring-white lg:h-20 lg:w-20',
                          )}
                          src={getProfileImageUrlOrPlaceholder({ path: user?.profileImagePath })}
                          alt={user?.fullName || ''}
                        />
                        <div className="ml-2">
                          <h3 className="mb-1 text-sm font-semibold">{user.fullName}</h3>
                          <p className="text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                            {user.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </SafeAreaPage>
    </>
  );
}
