import React, { ChangeEvent } from 'react';
import Link from 'next/link';
import { useGetPublishedEventsLazyQuery } from 'types/generated/client';
import { EventStatusesEnum } from 'types/generated/client';
import { calculateHaversineDistance } from 'utils/shared/geo/calculateHaversineDistance';
import { useGeoLocation } from 'hooks/useGeoLocation';
import Calendar from 'svg/Calendar';
import Dot from 'svg/Dot';
import Location from 'svg/Location';
import SearchIcon from 'svg/SearchIcon';
import TournamentsBuilder from 'screens/TournamentsBuilder';
import { Button, ButtonLink, ButtonText } from 'components/Button';
import TabSlider from 'components/TabSlider';
import SidebarNav from 'components/nav/SidebarNav';
import Sidebar from './Sidebar';

interface TournamentDashboardProps {}

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

const TAB_SLIDER = [
  {
    name: EventStatusesEnum.Published,
  },
  {
    name: EventStatusesEnum.Draft,
  },
];
export default function TournamentDashBoard(props: TournamentDashboardProps) {
  const [getPublishedEvents, { loading, error, data }] = useGetPublishedEventsLazyQuery();
  const [activeSliderTabIndex, setActiveSliderTabIndex] = React.useState(0);
  const activeSliderTab = TAB_SLIDER[activeSliderTabIndex];
  const [searchValue, setSearchValue] = React.useState('');
  const { position, centerLatitude, centerLongitude } = useGeoLocation();

  const searchLowerCase = searchValue.toLowerCase();

  React.useEffect(() => {
    getPublishedEvents();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const events = data?.events || [];

  const decoratedTournaments = React.useMemo(() => {
    let processedTournaments = (events || [])?.map((tournament) => {
      return {
        ...tournament,
        distance: Math.round(
          calculateHaversineDistance({
            coord1: {
              latitude: tournament.latitude,
              longitude: tournament.longitude,
            },
            coord2: {
              latitude: centerLatitude,
              longitude: centerLongitude,
            },
            unit: 'miles',
          }),
        ),
      };
    });
    return processedTournaments;
  }, [events, centerLatitude, centerLongitude]);

  const filteredTournaments = decoratedTournaments?.filter((v) => {
    if (activeSliderTab.name === EventStatusesEnum.Published) {
      return (
        v.status === EventStatusesEnum.Published && v.title.toLowerCase().includes(searchLowerCase)
      );
    } else if (activeSliderTab.name === EventStatusesEnum.Draft) {
      return (
        v.status === EventStatusesEnum.Draft && v.title.toLowerCase().includes(searchLowerCase)
      );
    }
    return false;
  });

  return (
    <div className="flex gap-px max-md:flex-wrap">
      <Sidebar />
      <div className="flex flex-1 flex-col self-start max-md:max-w-full">
        <div className="flex w-full justify-between gap-5 px-8 py-4 leading-5 max-md:max-w-full max-md:flex-wrap max-md:px-5">
          <div className="bg-color-bg-lightmode-input dark:bg-color-bg-darkmode-input flex justify-between gap-2 rounded-md px-3.5 py-2 leading-[150%]">
            <SearchIcon className="my-auto aspect-square h-4 w-4 w-5 text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder" />
            <div className="flex-auto">
              <input
                type="text"
                value={searchValue}
                onChange={handleInputChange}
                placeholder="Search"
                className="input-base-form"
              />
            </div>
          </div>
          <div className="flex w-1/3 flex-col justify-center rounded-3xl bg-color-bg-lightmode-secondary p-1 shadow-sm dark:bg-color-bg-darkmode-secondary">
            <TabSlider
              activeIndex={activeSliderTabIndex}
              tabs={TAB_SLIDER.map((tab, index) => ({
                name: tab.name,
                isActive: activeSliderTabIndex === index,
                activeIndex: activeSliderTabIndex,
                handleClick: () => setActiveSliderTabIndex(index),
              }))}
            />
          </div>
          <div className="w-[16rem]">
            <ButtonLink
              variant="brand"
              href="/tournaments/create"
              className="justify-center whitespace-nowrap rounded-full bg-color-bg-lightmode-brand px-6 py-3 text-color-text-darkmode-invert text-color-text-lightmode-invert dark:bg-color-bg-darkmode-brand max-md:px-5"
            >
              Create a tournament
            </ButtonLink>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-12">
          {filteredTournaments &&
            filteredTournaments.map((card) => (
              <Link href={`/tournaments-dashboard/${card.id}`} key={card.id}>
                <div className="cursor-pointer border-black p-1 hover:border">
                  <div className="flex flex-col gap-1 rounded-lg leading-5 max-md:mt-8">
                    {card.coverImageUrl && (
                      <img
                        loading="lazy"
                        srcSet={card.coverImageUrl}
                        className="aspect-[2.04] w-full"
                      />
                    )}
                    <div className="typography-product-subheading mt-2 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                      {card.title}
                    </div>
                    <div className="mt-2 flex justify-between gap-2">
                      <Calendar className="w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
                      <div className="typography-product-caption grow text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                        {formatDate(card.startDate, true)} - {formatDate(card.endDate, false)}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <Location className="w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
                      <div className="typography-product-caption text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                        {card.displayLocation}
                      </div>
                      <Dot className="h-1 w-1" />
                      <div className="typography-product-caption text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                        {card.distance} mi
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
