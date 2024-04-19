import * as React from 'react';
import { FC } from 'react';
import { format } from 'date-fns';
import GoogleMapReact from 'google-map-react';
import { HOME_PAGE } from 'constants/pages';
import { mapToUsDate } from 'utils/shared/date/mapToUsDate';
import Link from 'components/Link';
import Head from 'components/utilities/Head';
import RegisterForm from './RegisterForm';

const TriplesTournamentPage: FC<{ tournament: any; teamsCount: number }> = ({
  tournament,
  teamsCount,
}) => {
  const startDate = tournament['Start Date'];

  return (
    <>
      <Head
        noIndex
        title={`Tournament: ${tournament.Title}`}
        ogImage={`${process.env.APP_URL}/api/v1/tournaments/triples-tournament/${tournament.id}/images/og`}
      />
      <div className="flex flex-col bg-brand-gray-100 pb-16 pl-6 pr-6 pt-8 md:pl-16 md:pr-16">
        <header className="flex w-full items-center justify-between">
          <a href={HOME_PAGE}>
            <img src="/images/tournaments/orange-logo.svg" alt="logo" />
          </a>
        </header>
        <main className="mb-24 mt-16 flex flex-col-reverse justify-between sm:flex-row">
          <div className="w-full rounded-xl bg-color-bg-lightmode-primary pb-8 pl-6 pr-6 pt-8 dark:bg-color-bg-darkmode-primary sm:w-[60%] md:w-[70%] md:pl-8 md:pr-8">
            <h1 className="mb-16 text-[2.4rem] font-bold italic leading-tight text-brand-gray-1000 md:text-[4rem]">
              {tournament['Title']}
            </h1>

            <div>
              <ul className="mb-0 flex flex-col justify-between md:mb-12 md:flex-row">
                <li className="mb-3 flex w-full max-w-[265px] flex-col md:mb-0">
                  <div className="mb-1 flex">
                    <img
                      src="/images/tournaments/calendar_month-black.svg"
                      alt="event"
                      className="mr-1"
                    />
                    <span className="font-light text-brand-gray-600">Tournament Date</span>
                  </div>
                  <span className="text-brand-gray-1000">{mapToUsDate(startDate)}</span>
                </li>
                <li className="mb-3 flex w-full max-w-[265px] flex-col md:mb-0">
                  <div className="mb-1 flex">
                    <img
                      src="/images/tournaments/schedule.svg"
                      alt="registration fee"
                      className="mr-1"
                    />
                    <span className="font-light text-brand-gray-600">Tournament Time</span>
                  </div>
                  <span className="text-brand-gray-1000">{tournament['Time']}</span>
                </li>
                <li className="mb-3 flex w-full max-w-[265px] flex-col md:mb-0">
                  <div className="mb-1 flex">
                    <img
                      src="/images/tournaments/payments.svg"
                      alt="registration fee"
                      className="mr-1"
                    />
                    <span className="font-light text-brand-gray-600">Registration Fee</span>
                  </div>
                  <span className="text-brand-gray-1000">{tournament['Registration Fee']}</span>
                </li>
              </ul>

              <ul className="flex flex-col justify-between md:flex-row">
                <li className="mb-3 flex w-full max-w-[265px] flex-col md:mb-0">
                  <div className="mb-1 flex">
                    <img src="/images/tournaments/sell-black.svg" alt="format" className="mr-1" />
                    <span className="font-light text-brand-gray-600">Format</span>
                  </div>
                  <span className="text-brand-gray-1000">{tournament['Format']}</span>
                </li>
                <li className="mb-3 flex w-full max-w-[265px] flex-col md:mb-0">
                  <div className="mb-1 flex">
                    <img src="/images/tournaments/groups-black.svg" alt="groups" className="mr-1" />
                    <span className="font-light text-brand-gray-600">Theme</span>
                  </div>
                  <span className="text-brand-gray-1000">{tournament['Theme']}</span>
                </li>
                <li className="mb-3 flex w-full max-w-[265px] flex-col md:mb-0">
                  <div className="mb-1 flex">
                    <img src="/images/tournaments/trophy-black.svg" alt="trophy" className="mr-1" />
                    <span className="font-light text-brand-gray-600">Prize Money</span>
                  </div>
                  <ul className="list-disc pl-4 text-brand-gray-1000">
                    <li>1st, 2nd and 3rd place receive prizes.</li>
                    <li>All 32 Triples tournament players receive a Cardio Tennis Tumbler</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="mb-16 mt-16 h-[1px] w-full bg-brand-gray-25"></div>

            <div>
              <h2 className="mb-12 text-[2.4rem] font-normal leading-none text-brand-gray-1000 sm:text-[4rem]">
                Location{' '}
              </h2>
              <div className="mb-12 flex flex-col">
                <p className="mb-2 text-[1.3rem] font-medium italic text-brand-gray-1000">
                  Facility name
                </p>
                <p className="text-brand-gray-1000">{tournament['Facility Name']}</p>
              </div>
              <div className="flex flex-col">
                <p className="mb-2 text-[1.3rem] font-medium italic text-brand-gray-1000">
                  Address{' '}
                </p>
                <p className="mb-2 text-brand-gray-1000">{tournament['Location']}</p>
              </div>

              <div style={{ height: '300px', width: '100%', maxWidth: '700px' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: process.env.GOOGLE_MAPS_API_KEY as string,
                  }}
                  defaultCenter={{
                    lat: 40.337069,
                    lng: -80.07561,
                  }}
                  defaultZoom={15}
                  options={{
                    mapId: process.env.GOOGLE_MAPS_MAP_ID,
                  }}
                >
                  {/*@ts-ignore*/}
                  <div lat={40.337069} lng={-80.07561}>
                    <img src="/images/tournaments/Location.svg" alt="" />
                  </div>
                </GoogleMapReact>
              </div>
            </div>

            <div>
              <h2 className="mb-12 mt-16 text-[2.4rem] font-normal leading-none text-brand-gray-1000 sm:text-[4rem]">
                Contact
              </h2>
              <p className="mb-2 text-[1.3rem] font-medium italic text-brand-gray-1000">Email </p>
              <ul className="list-disc pl-5">
                <li>
                  <span className="text-brand-gray-1000">
                    Marcy Bruce{' '}
                    <a href="mailto:marcyb93@me.com" className="text-brand-fire-500 underline">
                      marcyb93@me.com
                    </a>{' '}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-16 flex flex-col items-center justify-between rounded-xl bg-brand-gray-900 pb-8 pl-8 pr-8 pt-8 sm:flex-row">
              <h2 className="mb-4 text-center text-[2.4rem] font-bold italic leading-tight text-white sm:mb-0 sm:text-left sm:text-[3rem] md:text-[4rem]">
                Ready to play?
              </h2>
              <button
                onClick={() => window.scrollTo({ top: 0 })}
                className="button-rounded-inline-background-bold flex h-[61px] w-full max-w-[145px] items-center justify-center text-[1rem] md:text-[1.5rem]"
              >
                Register
              </button>
            </div>
          </div>

          <div className="mb-5 w-full self-start rounded-xl bg-color-bg-lightmode-primary pb-8 pl-6 pr-6 pt-8 dark:bg-color-bg-darkmode-primary sm:mb-0 sm:w-[38%] md:w-[28%] md:pl-8 md:pr-8">
            <RegisterForm teamsCount={teamsCount} tournamentId={tournament.id} />
          </div>
        </main>
        <footer className="mt-auto flex flex-col items-center justify-between sm:flex-row">
          <Link href={HOME_PAGE}>
            <img src="/images/tournaments/orange-logo.svg" alt="logo" />
          </Link>
          <span className="mt-2 text-brand-gray-600 sm:mt-0">
            © {new Date().getFullYear()}, All Rights Reserved
          </span>
        </footer>
      </div>
    </>
  );
};

export default TriplesTournamentPage;
