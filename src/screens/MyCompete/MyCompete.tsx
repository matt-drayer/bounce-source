import React, { useMemo } from 'react';
import { addDays, isFuture } from 'date-fns';
import { getEventUrl } from 'constants/pages';
import { GetRequestPayload, GetResponsePayload } from 'constants/payloads/tourmaments';
import { useApiGateway } from 'hooks/useApi';
import { useViewer } from 'hooks/useViewer';
import BounceTournament from 'svg/BounceTournament';
import Calendar from 'svg/Calendar';
import Location from 'svg/Location';
import Trophy from 'svg/Trophy';
import TabPageScrollPage from 'layouts/TabPageScrollPage';
import Link from 'components/Link';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';

const DEFAULT_IMAGE_PATH = '/images/tournaments/app/default.png';

function formatDateRange(startDate: Date, endDate: Date) {
  const yearOptions: Intl.DateTimeFormatOptions = { year: 'numeric' };
  const monthDayOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

  const startMonthDay = new Intl.DateTimeFormat('en-US', monthDayOptions).format(startDate);
  const endMonthDay = new Intl.DateTimeFormat('en-US', monthDayOptions).format(endDate);
  const year = new Intl.DateTimeFormat('en-US', yearOptions).format(startDate);

  return `${startMonthDay} - ${endMonthDay} ${year}`;
}

const TournamentCard = ({ tournament }: { tournament: GetResponsePayload['tournaments'][0] }) => {
  const [startYear, startMonth, startDay] = tournament.startDate.split('-').map(Number);
  const [endYear, endMonth, endDay] = tournament.endDate.split('-').map(Number);
  const startDateObject = new Date(startYear, startMonth - 1, startDay);
  const endDateObject = new Date(endYear, endMonth - 1, endDay);

  return (
    <Link className="block h-full" href={getEventUrl(tournament.slug)}>
      <div>
        <img
          src={`${process.env.APP_URL}/${tournament.appImageUrl || DEFAULT_IMAGE_PATH}`}
          className="h-[110px] w-full rounded-lg object-cover lg:h-[130px]"
        />
        <div className="mt-2.5 flex items-center justify-between">
          <BounceTournament className="h-5" />
          {!!tournament.registrationFee && (
            <div className="text-sm font-bold text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary lg:text-sm">
              ${tournament.registrationFee}
            </div>
          )}
        </div>
        <h2 className="mt-1.5 font-medium lg:mt-2 lg:text-lg lg:font-bold lg:leading-6">
          {tournament.title}
        </h2>
        <div className="lg:text=sm mt-1 space-y-1 text-xs text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
          <div className="flex items-center">
            <Calendar className="mr-1.5 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
            <span>{formatDateRange(startDateObject, endDateObject)}</span>
          </div>
          <div className="flex items-center">
            <Location className="mr-1.5 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center">
            <Trophy className="mr-1.5 h-4 w-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
            <span>{tournament.gender}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function MyCompete() {
  const viewer = useViewer();
  const { get, isLoading, data } = useApiGateway<GetRequestPayload, GetResponsePayload>(
    '/v1/tournaments',
  );
  const tournaments = data?.tournaments || [];

  React.useEffect(() => {
    get();
  }, []);

  const sortedTouraments = useMemo(() => {
    return tournaments
      .filter((tournament) => {
        const startDateObject = addDays(new Date(tournament.startDate), 1); // NOTE: Giving it an extra day in the feed in case there are timezone issues
        return isFuture(startDateObject);
      })
      .sort((a, b) => {
        const aDate = new Date(a.startDate);
        const bDate = new Date(b.startDate);
        return aDate.getTime() - bDate.getTime();
      });
  }, [tournaments]);

  return (
    <>
      <Head noIndex title="Tournaments" description="Tournaments on Bounce" />
      <TabPageScrollPage>
        <>
          <div className="fixed left-0 top-0 z-20 w-full lg:pl-sidebar">
            <div className="safearea-spacer-top w-full bg-color-bg-lightmode-primary bg-opacity-80 backdrop-blur-sm dark:bg-color-bg-darkmode-primary"></div>
            <div className="flex h-mobile-page-title items-center justify-between bg-color-bg-lightmode-primary bg-opacity-80 px-6 shadow-mobile-top-nav backdrop-blur-sm dark:bg-color-bg-darkmode-primary">
              <h1 className="w-full text-lg font-bold leading-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:text-3xl">
                Tournaments
              </h1>
            </div>
          </div>
          <div className="h-mobile-page-title w-full lg:h-desktop-page-title">&nbsp;</div>
        </>
        <div className="flex h-full w-full grow flex-col overflow-y-auto bg-color-bg-lightmode-primary px-6 pb-28 dark:bg-color-bg-darkmode-primary">
          <div className="w-full space-y-6 pt-2 lg:mx-auto lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
            {sortedTouraments.map((tournament) => {
              return <TournamentCard key={tournament.id} tournament={tournament} />;
            })}
          </div>
        </div>
        <TabBar />
      </TabPageScrollPage>
    </>
  );
}
