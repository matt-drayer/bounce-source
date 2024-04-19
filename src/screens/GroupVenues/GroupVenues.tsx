import * as React from 'react';
import { useRouter } from 'next/router';
import { MY_GROUPS } from 'constants/pages';
import { useGetGroupVenuesLazyQuery } from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import SafeAreaPage from 'layouts/SafeAreaPage';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import CardVenue from 'components/cards/CardVenue';
import Head from 'components/utilities/Head';

const IS_HIDE_SIDEBAR = false;

export default function GroupVenues() {
  const { isUserSession } = useViewer();
  const router = useRouter();
  const [getGroupVenuesLazyQuery, { data, loading }] = useGetGroupVenuesLazyQuery();
  const venues = data?.groupVenues.map((venue) => venue.venue) || [];

  React.useEffect(() => {
    if (isUserSession && router.query.groupId && typeof router.query.groupId === 'string') {
      getGroupVenuesLazyQuery({
        variables: {
          groupId: router.query.groupId,
        },
      });
    }
  }, [isUserSession, router.isReady]);

  return (
    <>
      <Head noIndex title="Group Courts" />
      <SafeAreaPage isHideSidebar={IS_HIDE_SIDEBAR}>
        <div className="relative flex h-full grow flex-col">
          <div className="flex h-full w-full grow flex-col">
            <div className="w-full">
              <FixedPageTitle
                title="Courts"
                backUrl={MY_GROUPS}
                isBackdropBlur
                isHideSidebar={IS_HIDE_SIDEBAR}
              />
            </div>
            <main className="pb-8 pt-4">
              <div className="space-y-10 px-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0 lg:px-6">
                {venues.map((venue) => {
                  if (!venue) {
                    return null;
                  }

                  return (
                    <CardVenue
                      key={venue.id}
                      {...venue}
                      totalCourtCount={venue.indoorCourtCount + venue.outdoorCourtCount}
                      imageUrl={venue.images[0]?.url}
                    />
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
