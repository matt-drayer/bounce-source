import * as React from 'react';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { LOGIN_PAGE } from 'constants/pages';
import { useViewer } from 'hooks/useViewer';
import SafeAreaPage from 'layouts/SafeAreaPage';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import ContactUs from 'components/SettingsContent/ContactUs';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';

const MyContactUs = () => {
  const router = useRouter();
  const viewer = useViewer();

  React.useEffect(() => {
    if (router.isReady && viewer.status === AuthStatus.Anonymous) {
      router.push(LOGIN_PAGE);
    }
  }, [router.isReady, viewer.status]);

  return (
    <>
      <Head title="Contact us" />
      <SafeAreaPage>
        <div className="relative flex h-full grow flex-col">
          <div className="flex h-full w-full grow flex-col">
            <div className="w-full">
              <FixedPageTitle title="Contact us" isPop isBackdropBlur />
            </div>
            <main className="flex h-full flex-auto flex-col px-6 pt-2">
              <ContactUs />
            </main>
            <div className="safearea-pad-bot">
              <TabBar />
            </div>
          </div>
        </div>
      </SafeAreaPage>
    </>
  );
};

export default MyContactUs;
