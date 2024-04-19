import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TOURNAMENT_ORGANIZER_DASHBOARD } from 'constants/pages';
import { useGetEventDetailsLazyQuery } from 'types/generated/client';
import { calculateHaversineDistance } from 'utils/shared/geo/calculateHaversineDistance';
import { useGeoLocation } from 'hooks/useGeoLocation';
import { useModal } from 'hooks/useModal';
import Calendar from 'svg/Calendar';
import ChevronLeft from 'svg/ChevronLeft';
import Dot from 'svg/Dot';
import Location from 'svg/Location';
import Players from 'svg/Players';
import ShareIcon from 'svg/Share';
import TournamentsBuilder from 'screens/TournamentsBuilder';
import { Button, ButtonText } from 'components/Button';
import ModalShare from 'components/modals/ModalShare';
import DashboardTabBar from './DashboardTabBar';
import Sidebar from '../OrganizerTournamentDashboard/Sidebar';

function formatDate(inputDate: Date, isStart: boolean) {
  const date = new Date(inputDate);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (isStart) {
    const startOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };

    return new Intl.DateTimeFormat('en-US', startOptions).format(date);
  }
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

export default function EventDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [getEventById, { loading, error, data }] = useGetEventDetailsLazyQuery();
  const { position, centerLatitude, centerLongitude } = useGeoLocation();
  const [isOpenToEdit, setIsOpenToEdit] = React.useState(false);
  React.useEffect(() => {
    if (id) {
      getEventById({
        variables: { id: id },
      });
    }
  }, [id, getEventById]);
  const cardData = data?.eventsByPk 

  const decoratedTournaments = React.useMemo(() => {
    if (cardData) {
      return {
        ...cardData,
        distance: Math.round(
          calculateHaversineDistance({
            coord1: {
              latitude: cardData.latitude,
              longitude: cardData.longitude,
            },
            coord2: {
              latitude: centerLatitude,
              longitude: centerLongitude,
            },
            unit: 'miles',
          }),
        ),
      };
    }
    return null;
  }, [cardData, centerLatitude, centerLongitude]);


  const {
    openModal: openShareModal,
    closeModal: closeShareModal,
    isOpen: isShareModalOpen,
  } = useModal();

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareAction = () => {
    openShareModal();
    if (navigator.share) {
      navigator
        .share({
          title: `Tournament on Bounce: ${cardData?.title}`,
          text: `Compete in the ${cardData?.title} tournament, in ${
            cardData?.city?.name && cardData?.city?.countrySubdivision?.code
              ? `${cardData?.city?.name}, ${cardData?.city?.countrySubdivision?.code}`
              : cardData?.displayLocation
          }! More details at ${shareUrl}`,
          url: shareUrl,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    }
  };

  const modalHandler = () => {
    setIsOpenToEdit(!isOpenToEdit);
  };

  if (isOpenToEdit) {
    return <TournamentsBuilder isEdit={isOpenToEdit} eventData={cardData} />;
  }

  return (
    <div className="flex gap-px max-md:flex-wrap">
      <Sidebar />
      <div className="flex w-full flex-col gap-8 p-4">
        <div className="self-stretch rounded-lg bg-white p-4">
          {decoratedTournaments && (
            <div className="max-md: flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex w-[72%] flex-col max-md:ml-0 max-md:w-full">
                <div className="flex grow flex-col leading-[120%] max-md:mt-10 max-md:max-w-full">
                  <div className="flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                    <div className="flex items-center justify-between gap-5 py-px text-3xl font-bold max-md:max-w-full max-md:flex-wrap">
                      <Link href={TOURNAMENT_ORGANIZER_DASHBOARD}>
                        <ChevronLeft className="h-6 w-6 " />
                      </Link>
                      <div className="flex-auto italic max-md:max-w-full">
                        {decoratedTournaments.title}
                      </div>
                    </div>
                    <div className="my-auto flex  cursor-pointer justify-center gap-1 whitespace-nowrap rounded-2xl text-sm font-medium">
                      <ButtonText
                        size="sm"
                        className="flex items-center text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
                        onClick={shareAction}
                      >
                        <ShareIcon className="mr-1 h-4 w-4" /> Share
                      </ButtonText>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-1 rounded-xl bg-color-bg-lightmode-secondary p-4 text-sm leading-5 dark:bg-color-bg-darkmode-secondary max-md:max-w-full">
                    <div className="flex w-full justify-between gap-5 whitespace-nowrap py-1 text-xs font-medium leading-4 text-neutral-600 max-md:max-w-full max-md:flex-wrap">
                      <img
                        loading="lazy"
                        srcSet={`${process.env.CLOUDFLARE_PUBLIC_URL}${decoratedTournaments.organizerImagePath}`}
                        className="w-[70px] shrink-0"
                      />
                      <div className="flex items-center justify-center gap-1 rounded-full bg-color-bg-lightmode-secondary px-2 py-1 dark:bg-color-bg-darkmode-secondary">
                        <Players className="h-4 w-4" />
                        <div>{decoratedTournaments.sourceRegistrationCount}</div>
                        <div className="grow">Players</div>
                      </div>
                    </div>
                    <div className="mt-1 text-base font-bold leading-5 text-zinc-900 max-md:max-w-full">
                      {decoratedTournaments.title}
                    </div>
                    <div className="mt-1 flex justify-between gap-1.5 text-neutral-600 max-md:max-w-full max-md:flex-wrap">
                      <div className="mt-1 flex items-center gap-1">
                        <Calendar className="w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
                        <div className="typography-product-caption grow text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                          {formatDate(decoratedTournaments.startDate, true)} -{' '}
                          {formatDate(decoratedTournaments.endDate, false)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <Location className="w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
                      <div className="typography-product-caption text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                        {decoratedTournaments.displayLocation}
                      </div>
                      <Dot className="h-1 w-1" />
                      <div className="typography-product-caption text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                        {decoratedTournaments.distance} mi
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4 self-start whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={modalHandler}
                      className="grow justify-center rounded-full border border-solid border-[color:var(--surface-surface-invert,#0F0F10)] px-6 py-2 text-zinc-900"
                    >
                      Edit tournament
                    </Button>
                    <Button
                      variant="brand"
                      size="md"
                      className="justify-center whitespace-nowrap rounded-full bg-color-bg-lightmode-brand px-6 py-2 text-color-text-darkmode-invert text-color-text-lightmode-invert dark:bg-color-bg-darkmode-brand max-md:px-5"
                    >
                      Create Draw
                    </Button>
                  </div>
                </div>
              </div>
              <div className="ml-5 flex w-[22rem] flex-col max-md:ml-0 max-md:w-full">
                <img
                  loading="lazy"
                  src={decoratedTournaments?.coverImageUrl ?? undefined}
                  className="aspect-[1.49] w-full grow self-stretch max-md:mt-10"
                />
              </div>
            </div>
          )}
        </div>
        {decoratedTournaments && <DashboardTabBar cardData={cardData} />}

        <ModalShare
          isOpen={isShareModalOpen}
          closeModal={closeShareModal}
          shareUrl={shareUrl}
          title="Share tournament"
        />
      </div>
    </div>
  );
}
