import React from 'react';
import { useGetEventDetailsLazyQuery } from 'types/generated/client';
import { getImageUrl } from 'services/client/cloudflare/getImageUrl';
import CloseIcon from 'svg/CloseIcon';
import SafeAreaPage from 'layouts/SafeAreaPage';
import BottomRegisterBar from 'components/BottomRegisterBar';
import { Button, ButtonText } from 'components/Button';
import Footer from 'components/Footer';
import Modal, { useModal } from 'components/modals/Modal';
import Head from 'components/utilities/Head';
import Register from './Register/Register';
import TournamentContent from './TournamentContent';
import { EXIT_TEXT, Event, PageProps } from './types';

export default function TournamentDetails(props: PageProps) {
  if (!props.event) {
    return null;
  }

  const {
    isOpen: isRegistrationOpen,
    openModal: openRegistrationModal,
    closeModal: closeRegistrationModal,
  } = useModal();
  const { event: staticPageEvent, faqs, jsonLd } = props;
  const [getEventDetailsLazyQuery, { data, loading, error }] = useGetEventDetailsLazyQuery();
  const decoratedStaticPageEvent: Event = { ...staticPageEvent, registrations: [], groups: [] };
  const event = data?.eventsByPk || decoratedStaticPageEvent;

  React.useEffect(() => {
    /**
     * @note typically we would wait for the user's firebase to sync, but anonymous and logged in user should have the same permissions
     */
    if (staticPageEvent?.id && !staticPageEvent.isExternal) {
      getEventDetailsLazyQuery({
        variables: {
          id: staticPageEvent.id,
        },
      });
    }
  }, [staticPageEvent?.id]);

  if (!event) {
    return null;
  }

  return (
    <>
      <Head
        title={`${event.title} | Pickleball Tournament`}
        description={`Compete in the ${event.title} pickleball tournament. Being played in ${
          event.city
            ? `${event.city.name}, ${event.city.countrySubdivision.code}`
            : event.displayLocation || event.addressString
        }. Find pickleball tournaments on Bounce.`}
        ogImage={
          event.coverImageUrl
            ? getImageUrl({
                url: event.coverImageUrl,
                path: event.coverImagePath || '',
              })
            : undefined
        }
      />
      <SafeAreaPage isShowTopNav isHideSidebar isIgnoreMobileTabs>
        <main className="mx-auto h-full w-full max-w-[70rem] bg-color-bg-lightmode-primary pb-4 dark:bg-color-bg-darkmode-primary lg:pb-20">
          <div className="flex h-full w-full lg:flex-row-reverse lg:pt-8">
            <div className="sticky top-24 hidden h-full w-full self-start bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary lg:block lg:max-w-[26rem]">
              <Register event={event} />
            </div>
            <div className="w-full flex-1 lg:pr-10">
              <TournamentContent event={event} faqs={props.faqs} jsonLd={props.jsonLd} />
            </div>
          </div>
        </main>
        <Footer
          isBottomRegister={event.isExternal}
          ignoreText={EXIT_TEXT}
          ignoreAction={() => {
            window.open(event.externalUrl || '', '_blank');
          }}
          onSubmitSignup={() => {
            window.open(event.externalUrl || '', '_blank');
          }}
        />
        <div>
          <div className="flex w-full items-center justify-center border-t border-transparent p-4 opacity-0 lg:hidden">
            <div className="mx-auto w-full max-w-lg">
              <Button
                variant="brand"
                size="lg"
                onClick={() => openRegistrationModal()}
                className="w-full"
              >
                Register
              </Button>
            </div>
          </div>
          <div className="fixed bottom-0 flex w-full items-center justify-center border-t border-color-border-input-lightmode bg-color-bg-lightmode-primary p-4 dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary lg:hidden">
            <div className="mx-auto w-full max-w-lg">
              <Button
                variant="brand"
                size="lg"
                onClick={() => openRegistrationModal()}
                className="w-full"
              >
                Register for Tournament
              </Button>
            </div>
          </div>
        </div>
      </SafeAreaPage>
      {!!jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}
      <Modal isOpen={isRegistrationOpen} handleClose={closeRegistrationModal}>
        <ButtonText
          onClick={() => closeRegistrationModal()}
          className="absolute right-4 top-4 rounded-full p-2"
        >
          <CloseIcon className="h-5 w-5" />
        </ButtonText>
        <Register event={event} />
      </Modal>
    </>
  );
}
