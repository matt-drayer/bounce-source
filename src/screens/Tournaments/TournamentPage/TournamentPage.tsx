import { FC, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { format } from 'date-fns';
import GoogleMapReact from 'google-map-react';
import { fill, sortBy } from 'lodash';
import ReactMarkdown from 'react-markdown';
import { Registrant, Tournament } from 'constants/tournaments';
import { READING_TOURNAMENT_SLUG } from 'constants/tournaments';
import { groupRegistrantsByTeams } from 'services/server/airtable/tournaments';
import { dateAsTimezone } from 'utils/shared/date/dateAsTimezone';
import { is24HoursPassed } from 'utils/shared/date/is24HoursPassed';
import { mapToUsDate } from 'utils/shared/date/mapToUsDate';
import Countdown from 'components/Countdown';
import ClosedModal from 'components/tournaments/ClosedModal/ClosedModal';
import Pool from 'components/tournaments/Pool';
import RegisterForm from 'components/tournaments/RegisterForm';
import TournamentDetails from 'components/tournaments/TournamentDetails';
import TournamentFooter from 'components/tournaments/TournamentFooter';
import TournamentHeader from 'components/tournaments/TournamentHeader';
import classNames from 'styles/utils/classNames';

const TournamentPage: FC<{ tournament: Tournament; registrants: Registrant[] }> = ({
  tournament,
  registrants = [],
}) => {
  const [isPoolsExpanded, setIsPoolsExpanded] = useState<boolean>(false);
  const [poolsHeight, setPoolsHeight] = useState<number>(0);
  const [countdownDate, setCountdownDate] = useState<Date | null>(null);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [pools, setPools] = useState<ReturnType<typeof groupRegistrantsByTeams>>([]);
  const poolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isClientLoaded && poolsRef.current) {
      setPoolsHeight(poolsRef.current.clientHeight);
    }
  }, [isClientLoaded]);

  useEffect(() => {
    if (tournament) {
      setCountdownDate(new Date(tournament.startDate));
    }
  }, [tournament]);

  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  useEffect(() => {
    if (isClientLoaded && registrants) {
      setPools(groupRegistrantsByTeams(registrants));
    }
  }, [isClientLoaded]);

  if (!tournament) return null;

  const teamsCount = pools
    .map((pool) => {
      return [...Object.keys(pool.teams), ...fill(Array(tournament.filledTeamsPerGroup), undefined)]
        .length;
    })
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

  const details = [
    {
      icon: '/images/tournaments/how_to_reg-black.svg',
      title: 'Registration Deadline',
      body: (
        <>
          {' '}
          {format(
            dateAsTimezone(tournament.registrationCloses, 'America/Los_Angeles'),
            'LL/dd/yyyy',
          )}
        </>
      ),
    },
    {
      icon: '/images/tournaments/payments.svg',
      title: 'Registration Fee',
      body: <>${tournament.registrationFee}</>,
    },
    {
      icon: '/images/tournaments/calendar_month-black.svg',
      title: 'Tournament Date',
      body: (
        <>
          {format(dateAsTimezone(tournament.startDate, 'America/Los_Angeles'), 'LL/dd/yyyy')} -{' '}
          {format(dateAsTimezone(tournament.endDate, 'America/Los_Angeles'), 'LL/dd/yyyy')}
        </>
      ),
    },
    {
      icon: '/images/tournaments/sell-black.svg',
      title: 'Format',
      body: (
        <ReactMarkdown
          children={tournament.formatDetails}
          components={{
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-4 font-light text-brand-gray-1000" {...props} />
            ),
            li: ({ node, children, ...props }) => (
              <li {...props} dangerouslySetInnerHTML={{ __html: children.join('') }} />
            ),
          }}
        />
      ),
    },
    {
      icon: '/images/tournaments/groups-black.svg',
      title: 'Event type(s)',
      body: (
        <ul className="list-disc pl-4 text-brand-gray-1000">
          <li>{tournament.detailsEvents.join(', ')}</li>
          <li>Round robin followed by a knockout round</li>
        </ul>
      ),
    },
    {
      icon: '/images/tournaments/trophy-black.svg',
      title: 'Prize Money',
      body: (
        <ul className="list-disc pl-4 font-light text-brand-gray-1000">
          <li>${tournament.firstPlacePrize} Winner</li>
          <li>${tournament.finalistPrize} Finalist</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="flex flex-col bg-brand-gray-100 pb-16 pl-6 pr-6 pt-8 md:pl-16 md:pr-16">
      <TournamentHeader
        title={`Tournament: ${tournament.title}`}
        description={`Pickleball tournament on ${mapToUsDate(tournament.startDate)} - ${mapToUsDate(
          tournament.endDate,
        )} at ${tournament.venueName} - ${tournament.venueAddress}. ${tournament.description}`}
        ogImage={
          tournament.ogImageUrl ||
          `${process.env.APP_URL}/api/v1/tournaments/${tournament.id}/images/og`
        }
        noIndex
      />
      <main className="mb-24 mt-16 flex flex-col-reverse justify-between sm:flex-row">
        <div className="w-full rounded-xl bg-color-bg-lightmode-primary pb-8 pl-6 pr-6 pt-8 dark:bg-color-bg-darkmode-primary sm:w-[60%] md:w-[70%] md:pl-8 md:pr-8">
          <div className="flex flex-col-reverse items-start justify-between  sm:flex-row ">
            <h1 className="text-[2.3rem] font-bold italic leading-tight text-brand-gray-1000 md:text-[4rem]">
              {tournament.title}
            </h1>
            {!!tournament.sponsorImageUrl && (
              <div className="mb-2 shrink-0 text-center md:mb-0 md:ml-16">
                <div className="mb-2 hidden text-sm font-bold md:block">Sponsored by</div>
                <img src={tournament.sponsorImageUrl} className="w-[9.25rem]" alt="sponsor logo" />
              </div>
            )}
          </div>
          {tournament.description && (
            <p className="mt-8 font-light text-brand-gray-1000">{tournament.description}</p>
          )}

          <TournamentDetails data={details} />

          <div className="mb-0 mt-16 flex-col">
            <h2 className="mb-12 text-[2.5rem] sm:text-[4rem]">Participants</h2>

            {tournament.participantsDescription && (
              <p className="text-brand-gray-1000">{tournament.participantsDescription}</p>
            )}

            <p className="mb-12 mt-12 text-[1.25rem] font-semibold italic">
              Registered Teams: {teamsCount}
              <span className="text-brand-gray-600">/{tournament.membersCount}</span>
            </p>

            {!!countdownDate && (
              <div className="mb-12">
                <p className="mb-4 text-center text-brand-gray-1000">
                  {tournament.countdownDescription}
                </p>

                <Countdown date={countdownDate} />
              </div>
            )}

            <div
              className={classNames(
                'flex flex-wrap justify-between',
                isClientLoaded ? 'opacity-100' : 'opacity-0',
              )}
              ref={poolsRef}
              style={
                {
                  // maxHeight: isPoolsExpanded ? 'initial' : 270,
                  // overflow: 'hidden',
                }
              }
            >
              {sortBy(pools, 'name').map((pool, index) => {
                return <Pool tournament={tournament} pool={pool} key={index} />;
              })}
            </div>

            {/*  {!isPoolsExpanded && poolsHeight >= 270 && (*/}
            {/*    <button*/}
            {/*      className="mt-4 flex items-center self-center font-medium text-brand-fire-500"*/}
            {/*      onClick={() => setIsPoolsExpanded(true)}*/}
            {/*    >*/}
            {/*      See all players{' '}*/}
            {/*      <img src="/images/tournaments/expand_more.svg" alt="expand more" className="ml-2" />*/}
            {/*    </button>*/}
            {/*  )}*/}
            {/*</div>*/}

            {/*<div>*/}
            {/*  <h2 className="mb-12 text-[2.5rem] font-normal leading-none text-brand-gray-1000 sm:text-[4rem]">*/}
            {/*    Tournament eligibility{' '}*/}
            {/*  </h2>*/}
            {/*  <ul className="list-disc pl-5">*/}
            {/*    <li className="mb-2">*/}

            {/*        In order to participate in the Sunday knockout round, teams must have a combined*/}
            {/*        DUPR rating below 8.0. Individual DUPR ratings must be below 4.5*/}
            {/*      </span>*/}
            {/*    </li>*/}
            {/*    <li className="mb-2">*/}
            {/*      <span className="font-light text-brand-gray-1000">*/}
            {/*        Within 48 hours of registration you will receive a confirmation or a request for*/}
            {/*        more information to confirm your DUPR rating*/}
            {/*      </span>*/}
            {/*    </li>*/}
            {/*  </ul>*/}
            {/*</div>*/}

            {/*<p className="mt-12 font-medium">*/}
            {/*  If a player(s) is caught gaming the rating system in any way, they will banned from all*/}
            {/*  future Bounce tournaments. This decision is at the tournament coordinator's discretion.*/}
            {/*</p>*/}

            <div>
              <h2 className="mb-12 text-[2.5rem] font-normal leading-none text-brand-gray-1000 sm:text-[4rem]">
                Tournament FAQs
              </h2>
              <div className="space-y-8">
                {tournament.faq.map(({ title, description }, index) => {
                  return (
                    <div key={index}>
                      <h3 className="text-xl font-semibold italic leading-normal">{title}</h3>
                      <p className="mt-2 text-brand-gray-1000">{description}</p>
                    </div>
                  );
                })}
              </div>{' '}
            </div>

            <div className="mb-8 mt-8 h-[1px] w-full bg-brand-gray-25" />

            <div>
              <h3 className="text-xl font-semibold italic leading-normal">Have more questions?</h3>
              <p className="mt-2 text-brand-gray-1000">
                We’re ready to help. Contact us on{' '}
                <a href="mailto:team@bounce.game" className="font-medium text-brand-fire-500">
                  team@bounce.game
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-12 mt-16 text-[2.5rem] font-normal leading-none text-brand-gray-1000 sm:text-[4rem]">
                Location{' '}
              </h2>
              <div className="mb-12 flex flex-col">
                <p className="mb-2 text-[1.3rem] font-medium italic text-brand-gray-1000">
                  Facility name
                </p>
                <p className="font-light text-brand-gray-1000">{tournament.venueName}</p>
              </div>
              <div className="flex flex-col">
                <p className="mb-2 text-[1.3rem] font-medium italic text-brand-gray-1000">
                  Address
                </p>
                <p className="font-light text-brand-gray-1000">{tournament.venueAddress}</p>
              </div>

              <div
                style={{ height: '300px', width: '100%', maxWidth: '700px' }}
                className="mb-16 mt-2"
              >
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: process.env.GOOGLE_MAPS_API_KEY as string,
                  }}
                  defaultCenter={{
                    lat: +tournament.lat,
                    lng: +tournament.long,
                  }}
                  defaultZoom={15}
                  options={{
                    mapId: process.env.GOOGLE_MAPS_MAP_ID,
                  }}
                >
                  {/*@ts-ignore*/}
                  <div lat={+tournament.lat} lng={+tournament.long}>
                    <img src="/images/tournaments/Location.svg" alt="" />
                  </div>
                </GoogleMapReact>
              </div>

              <p className="mb-2 text-[1.3rem] font-medium italic text-brand-gray-1000">
                Court information
              </p>
              <ul className="list-disc pl-5 font-light">
                {tournament.surfaceType && (
                  <li className="mb-2">
                    <span className="text-brand-gray-1000">
                      Surface Type: {tournament.surfaceType.join(', ')}
                    </span>
                  </li>
                )}
                {tournament.playAreaType && (
                  <li className="mb-2">
                    <span className="text-brand-gray-1000">
                      Play Area Type: {tournament.playAreaType}
                    </span>
                  </li>
                )}
                {tournament.netType && (
                  <li className="mb-2">
                    <span className="text-brand-gray-1000">Net Type: {tournament.netType}</span>
                  </li>
                )}
                <li className="mb-2">
                  <span className="text-brand-gray-1000">Ball Used: {tournament.ball}</span>
                </li>
                <li>
                  <span className="text-brand-gray-1000">
                    Number of Courts: {tournament.courtsNumber}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-12 mt-16 text-[2.5rem] font-normal leading-none text-brand-gray-1000 sm:text-[4rem]">
                Registration process{' '}
              </h2>
              <ul className="list-disc pl-5 font-light">
                <li className="mb-2">
                  <span className="text-brand-gray-1000">
                    You will receive another email within 48 hours notifying you if your DUPR rating
                    is confirmed or if we need additional information.{' '}
                  </span>
                </li>
                <li className="mb-2">
                  <span className="text-brand-gray-1000">
                    Your partner will have to go through the same process{' '}
                    <strong className="font-medium">before the registration deadlines</strong>{' '}
                    otherwise you forfeit your bid to participate.{' '}
                  </span>
                </li>
                <li className="mb-2">
                  <span className="text-brand-gray-1000">
                    At all times you can{' '}
                    <a href="mailto:mickey@bounce.game" className="font-medium text-brand-fire-500">
                      reach out to our team
                    </a>{' '}
                    with any questions.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-12 mt-16 text-[2.5rem] font-normal leading-none text-brand-gray-1000 sm:text-[4rem]">
                Refund policy{' '}
              </h2>
              <ul className="list-disc pl-5 font-light">
                <li className="mb-2">
                  <span className="text-brand-gray-1000">
                    Refunds will be provided if the tournament is canceled for inclement weather.
                  </span>
                </li>
                <li className="mb-2">
                  <span className="text-brand-gray-1000">
                    Bounce tournament credits will be given to players who cancel. Cancellations
                    must be before the deadline.
                  </span>
                </li>
                <li className="mb-2">
                  <span className="text-brand-gray-1000">
                    Credits may be used at any Bounce tournament.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-12 mt-16 text-[2.5rem] font-normal leading-none text-brand-gray-1000 sm:text-[4rem]">
                Contact
              </h2>
              <p className="mb-2 text-[1.3rem] font-medium italic text-brand-gray-1000">Email </p>
              <ul className="list-disc pl-5">
                <li>
                  <span className="text-brand-gray-1000">
                    Tournament Lead{' '}
                    <a href="mailto:mickey@bounce.game" className="text-brand-fire-500">
                      mickey@bounce.game
                    </a>{' '}
                  </span>
                </li>
              </ul>
            </div>

            {/*<div className="mt-16 flex flex-col items-center justify-between rounded-xl bg-brand-gray-900 pt-8 pb-8 pr-8 pl-8 sm:flex-row">*/}
            {/*  <h2 className="mb-4 text-center text-[3rem] font-bold italic leading-tight text-white sm:mb-0 sm:text-left md:text-[4rem]">*/}
            {/*    Ready to play?*/}
            {/*  </h2>*/}
            {/*  <button className="button-rounded-inline-background-bold flex h-[61px] w-full max-w-[145px] items-center justify-center text-[1rem] md:text-[1.5rem]">*/}
            {/*    Register*/}
            {/*  </button>*/}
            {/*</div>*/}
          </div>
        </div>
        {!is24HoursPassed(tournament.registrationCloses) ? (
          <RegisterForm tournament={tournament} />
        ) : (
          <ClosedModal date={tournament.registrationCloses} />
        )}
      </main>
      <TournamentFooter />
    </div>
  );
};

export default TournamentPage;
