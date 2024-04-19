import * as React from 'react';
import SafeAreaPage from 'layouts/SafeAreaPage';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import NotificationPreferences from 'components/SettingsContent/NotificationPreferences';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';

const MyNotificationSettings = () => {
  return (
    <>
      <Head title="Notification preferences" />
      <SafeAreaPage>
        <div className="relative flex h-full grow flex-col">
          <div className="flex h-full w-full grow flex-col">
            <div className="w-full">
              <FixedPageTitle title="Notifications" isPop isBackdropBlur />
            </div>
            <main className="flex h-full flex-auto flex-col px-6 pt-2">
              <NotificationPreferences />
            </main>
            <TabBar />
          </div>
        </div>
      </SafeAreaPage>
    </>
  );
};

export default MyNotificationSettings;
