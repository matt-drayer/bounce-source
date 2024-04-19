import * as React from 'react';
import SafeAreaPage from 'layouts/SafeAreaPage';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import PersonalDetails from 'components/SettingsContent/PersonalDetails';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';

const MyPersonalDetails = () => {
  return (
    <>
      <Head title="Personal info" />
      <SafeAreaPage>
        <div className="relative flex h-full grow flex-col">
          <div className="flex h-full w-full grow flex-col">
            <FixedPageTitle title="Personal Info" isPop isBackdropBlur />
            <main className="flex h-full flex-auto flex-col px-6 pt-2">
              <PersonalDetails />
            </main>
            <TabBar />
          </div>
        </div>
      </SafeAreaPage>
    </>
  );
};

export default MyPersonalDetails;
