import * as React from 'react';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { LOGIN_PAGE, MY_CHANGE_PASSWORD_PAGE } from 'constants/pages';
import { useViewer } from 'hooks/useViewer';
import SafeAreaPage from 'layouts/SafeAreaPage';
import LinkBoxButton from 'components/LinkBoxButton';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import SectionHeading from 'components/SectionHeading';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';

const MyPaymentDetails = () => {
  const router = useRouter();
  const viewer = useViewer();

  React.useEffect(() => {
    if (router.isReady && viewer.status === AuthStatus.Anonymous) {
      router.push(LOGIN_PAGE);
    }
  }, [router.isReady, viewer.status]);

  return (
    <>
      <Head title="Financial info" />
      <SafeAreaPage>
        <div className="relative flex h-full grow flex-col">
          <div className="flex h-full w-full grow flex-col">
            <div className="w-full">
              <FixedPageTitle title="Financial Info" isPop isBackdropBlur />
            </div>
            <main className="flex h-full flex-auto flex-col px-6 pt-2">
              <div>
                <SectionHeading>Payment options</SectionHeading>
                <div className="space-y-1 py-2">
                  <div></div>
                </div>
              </div>
            </main>
            <TabBar />
          </div>
        </div>
      </SafeAreaPage>
    </>
  );
};

export default MyPaymentDetails;
