import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';
import styled from 'styled-components';
import { HOSTED_TOURNAMENTS_PAGE, TOURNAMENTS_PAGE } from 'constants/pages';
import { TournamentPreview } from 'constants/tournaments';
import Link from 'components/Link';

type Props = {
  tournament: TournamentPreview;
};

const PanelItem = ({
  title,
  icon,
  description,
}: {
  title: string;
  icon: string;
  description: string;
}) => (
  <li className="mb-8 flex flex-col">
    <span className="flex items-center">
      <img src={icon} alt={title} className="mr-2" />{' '}
      <span className="font-light text-brand-gray-300 opacity-[0.6]">{title}</span>
    </span>
    <span className="mt-2 text-white">{description}</span>
  </li>
);

function Body({ tournament }: { tournament: TournamentPreview }) {
  return (
    <Disclosure.Button className="disclosure-btn flex w-full flex-wrap items-center justify-between pb-2 pl-4 pr-4 pt-2 sm:flex-nowrap sm:pb-4 sm:pl-8 sm:pr-8 sm:pt-4">
      <span
        className={classNames(
          'flex w-[50%] justify-start text-[0.8rem] sm:w-[25%] sm:text-[1rem]',
          tournament.status === 'Active' ? 'text-white' : 'text-brand-gray-300',
        )}
      >
        {tournament.dates}
      </span>
      <span className="flex w-[50%] justify-end text-end text-[0.8rem] text-brand-gray-300 opacity-[0.6] sm:w-[25%] sm:justify-start sm:text-left sm:text-[1rem]">
        {tournament.location}
      </span>
      <span className="mt-auto flex w-[50%] justify-start text-[0.8rem] text-brand-gray-300 opacity-[0.6] sm:mt-0 sm:w-[25%] sm:text-[1rem]">
        {tournament.bannerTextThirdEntry}
      </span>

      <div className="mt-4 flex w-[50%] justify-end sm:mt-0 sm:w-[25%]">
        {tournament.status === 'Active' && (
          <>
            {/* @ts-ignore */}
            {tournament.isExternal ? (
              <Link
                href={`${HOSTED_TOURNAMENTS_PAGE}/${tournament.slug}`}
                className="button-rounded-inline-background-bold flex h-[30px] w-full max-w-[70px] items-center justify-center text-[0.8rem] sm:h-[39px] sm:max-w-[96px] sm:text-[1rem]"
              >
                Join
              </Link>
            ) : (
              <Link
                href={`${TOURNAMENTS_PAGE}/${tournament.slug}`}
                className="button-rounded-inline-background-bold flex h-[30px] w-full max-w-[70px] items-center justify-center text-[0.8rem] sm:h-[39px] sm:max-w-[96px] sm:text-[1rem]"
              >
                Join
              </Link>
            )}
          </>
        )}
        {tournament.status === 'Concluded' && (
          <span className="flex h-[30px] w-full max-w-[70px] items-center justify-center text-[0.8rem] italic text-brand-gray-300 sm:h-[39px] sm:max-w-[96px] sm:text-[1rem]">
            Concluded
          </span>
        )}

        {tournament.status === 'Closed' && (
          <span className="flex h-[30px] w-full max-w-[70px] items-center justify-center text-[0.8rem] italic text-brand-gray-300 sm:h-[39px] sm:max-w-[96px] sm:text-[1rem]">
            Invite only
          </span>
        )}
      </div>
    </Disclosure.Button>
  );
}

const Event = ({ tournament }: Props) => {
  const hidden = tournament.status === 'Concluded' || tournament.status === 'Closed';

  return (
    <StyledEvent className="w-full rounded-xl border border-solid border-white border-opacity-5">
      <Disclosure>
        {() => {
          return (
            <>
              {tournament.status === 'Concluded' ? (
                <Link isExternal href={tournament.recap}>
                  <Body tournament={tournament} />
                </Link>
              ) : (
                <Body tournament={tournament} />
              )}

              <Disclosure.Panel hidden={hidden} className="text-gray-500">
                <hr className="ml-8 mr-8 border-t border-solid border-white border-opacity-5" />
                <div className="flex w-full flex-wrap justify-between pb-8 pl-8 pr-8 pt-8">
                  <ul className="w-full pr-2 sm:max-w-[50%] md:max-w-[33%]">
                    <PanelItem
                      description={tournament.format}
                      title={'Format'}
                      icon={'/images/tournaments/sell.svg'}
                    />
                    <PanelItem
                      description={tournament.rewards}
                      title={'Prizes'}
                      icon={'/images/tournaments/emoji_events.svg'}
                    />
                    <PanelItem
                      description={tournament.events}
                      title={'Events'}
                      icon={'/images/tournaments/groups.svg'}
                    />
                  </ul>
                  <ul className="w-full sm:max-w-[50%] md:max-w-[33%]">
                    <PanelItem
                      description={tournament.dates}
                      title={'Tournament Date'}
                      icon={'/images/tournaments/calendar_month.svg'}
                    />
                    <PanelItem
                      description={tournament.registrationCloses}
                      title={'Registration Closes'}
                      icon={'/images/tournaments/how_to_reg.svg'}
                    />
                    {!!tournament.registrationFee && (
                      <PanelItem
                        description={tournament.registrationFee}
                        title={'Registration Fee'}
                        icon={'/images/tournaments/event_note.svg'}
                      />
                    )}
                  </ul>
                  <ul className="w-full sm:max-w-full md:max-w-[33%]">
                    {/*  <li>*/}
                    {/*    <span>*/}
                    {/*      2023 USA Pickleball National Championships - make sure to READ ALL*/}
                    {/*      information in the buttons concerning registration - players must have*/}
                    {/*      participated in a qualifying tournament to be considered eligible to*/}
                    {/*      register. Open registration starts June 8, 2023 and ends September 8, 2023*/}
                    {/*      midnight CDT.*/}
                    {/*    </span>*/}
                    {/*  </li>*/}
                  </ul>
                </div>
              </Disclosure.Panel>
            </>
          );
        }}
      </Disclosure>
    </StyledEvent>
  );
};

const StyledEvent = styled.div`
  background: linear-gradient(151deg, #181818 0%, #111 100%);
  .disclosure-btn {
  }
`;

export default Event;
