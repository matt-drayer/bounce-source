import * as React from 'react';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import {
  CONTACT_US,
  LOGIN_PAGE,
  LOGOUT_PAGE,
  MY_NOTIFICATION_SETTINGS_PAGE, // MY_PAYMENT_DETAILS_PAGE,
  MY_PERSONAL_INFO_PAGE,
} from 'constants/pages';
import { useViewer } from 'hooks/useViewer';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Link from 'components/Link';
import LinkBoxButton from 'components/LinkBoxButton';
import PageTitle from 'components/PageTitle';
import SectionHeading from 'components/SectionHeading';
import ContactUs from 'components/SettingsContent/ContactUs';
import NotificationPreferences from 'components/SettingsContent/NotificationPreferences';
import PersonalDetails from 'components/SettingsContent/PersonalDetails';
import TabSectionButton from 'components/TabSectionButton';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';

enum ActiveTab {
  PersonalInfo = 'PERSONAL_INFO',
  NotificationPreferences = 'NOTIFICATION_PREFERENCES',
  ContactUs = 'CONTACT_US',
}

const MySettings = () => {
  const router = useRouter();
  const viewer = useViewer();
  const [activeTab, setActiveTab] = React.useState(ActiveTab.PersonalInfo);

  React.useEffect(() => {
    if (router.isReady && viewer.status === AuthStatus.Anonymous) {
      router.push(LOGIN_PAGE);
    }
  }, [router.isReady, viewer.status]);

  return (
    <>
      <Head title="Settings" />
      <SafeAreaPage>
        <div className="relative flex h-full grow flex-col">
          <div className="flex h-full w-full grow flex-col">
            <div className="relative shrink-0 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
              <PageTitle title="Settings" isPop isBackdropBlur />
              <div className="relative hidden lg:flex lg:justify-between lg:pr-8">
                <div className="flex">
                  <TabSectionButton
                    handleClick={() => setActiveTab(ActiveTab.PersonalInfo)}
                    isActive={activeTab === ActiveTab.PersonalInfo}
                    className="px-9"
                  >
                    Personal Info
                  </TabSectionButton>
                  <TabSectionButton
                    handleClick={() => setActiveTab(ActiveTab.NotificationPreferences)}
                    isActive={activeTab === ActiveTab.NotificationPreferences}
                    className="px-9"
                  >
                    Notification Preferences
                  </TabSectionButton>
                  <TabSectionButton
                    handleClick={() => setActiveTab(ActiveTab.ContactUs)}
                    isActive={activeTab === ActiveTab.ContactUs}
                    className="px-9"
                  >
                    Contact Us
                  </TabSectionButton>
                </div>
                <div>
                  <Link href={LOGOUT_PAGE} className="font-medium text-color-brand-primary">
                    Log out
                  </Link>
                </div>
              </div>
            </div>
            <main className="flex h-full flex-auto flex-col lg:px-6">
              <div className="mx-auto hidden w-full max-w-main-content-container lg:block">
                {activeTab === ActiveTab.PersonalInfo && <PersonalDetails />}
                {activeTab === ActiveTab.NotificationPreferences && <NotificationPreferences />}
                {activeTab === ActiveTab.ContactUs && (
                  <div className="py-6">
                    <ContactUs />
                  </div>
                )}
              </div>
              <div className="flex h-full flex-auto flex-col px-6 pt-2 lg:hidden">
                <div>
                  <SectionHeading>Account settings</SectionHeading>
                  <div className="space-y-1 py-2">
                    <LinkBoxButton href={MY_PERSONAL_INFO_PAGE}>Personal info</LinkBoxButton>
                    {/* <LinkBoxButton href={MY_PAYMENT_DETAILS_PAGE}>Financial info</LinkBoxButton> */}
                    <LinkBoxButton href={MY_NOTIFICATION_SETTINGS_PAGE}>
                      Notification settings
                    </LinkBoxButton>
                    <LinkBoxButton href={CONTACT_US}>Contact us</LinkBoxButton>
                  </div>
                </div>
                <div className="flex w-full flex-auto items-center">
                  <LinkBoxButton href={LOGOUT_PAGE} hideIcon>
                    Log out
                  </LinkBoxButton>
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

export default MySettings;
