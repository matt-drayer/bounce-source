import * as React from 'react';
import { FC } from 'react';
import classNames from 'classnames';
import { fill, random } from 'lodash';
import { MappedPool, Tournament } from 'constants/tournaments';
import { useViewer } from 'hooks/useViewer';
import { NAMES } from 'components/tournaments/Pool/constants';

type Props = {};

const Pool: FC<{ pool: MappedPool; tournament: Tournament }> = ({ pool, tournament }) => {
  const { viewer } = useViewer();

  const teams = Object.keys(pool.teams);

  const filledTeamsPerPool = tournament.filledTeamsPerGroup;

  const allTeams = [...teams, ...fill(Array(filledTeamsPerPool), undefined)];

  return (
    <div className="mb-4 flex w-full flex-col rounded-[8px] bg-brand-gray-25 p-4 sm:w-[48%]">
      <h3 className="mb-4 flex justify-between text-[1.25rem] font-semibold">
        <span className="italic">
          {pool.name}{' '}
          <span className="ml-3">
            {' '}
            {tournament.filledTeamsPerGroup + Object.keys(pool.teams).length} /{' '}
            <span className="text-brand-gray-600">{tournament.maxTeamsPerPool}</span>
          </span>
        </span>
        <span className="text-[1.12rem] font-medium text-brand-fire-500">{pool.poolTime}</span>
      </h3>
      <div className="flex flex-wrap justify-between">
        {allTeams.map((value, index) => {
          const length = allTeams.length;

          const isTeamsCountOdd = length % 2 !== 0;

          let shouldHaveBottomOffset;

          if (isTeamsCountOdd) {
            shouldHaveBottomOffset = index !== length - 1;
          } else {
            shouldHaveBottomOffset = index !== length - 1 && index !== length - 2;
          }

          const [member1, member2] = value ? pool.teams[value] : [null, null];

          const currentUser = viewer?.email === member1?.email || viewer?.email === member2?.email;

          return (
            <div
              className={classNames(
                'w-[48%] rounded-[8px] border border-b-brand-gray-100 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                length > 2 && shouldHaveBottomOffset && 'mb-4',
              )}
              key={index}
            >
              <div className="rounded-[8px] rounded-bl-none rounded-br-none bg-brand-gray-1000 p-2 text-[0.8rem] text-white">
                Team {index + 1}
              </div>
              <div className="min-h-[36px] p-2 text-[0.8rem] blur-sm">
                {currentUser && member1 && member1.firstNameOfteamMembers?.join(', ')}

                {/*<span className="">{!currentUser && NAMES[random(0, NAMES.length)]}</span>*/}
                <span className="">{NAMES[random(0, NAMES.length)]}</span>
                {/*{member1 && index === 0 ? (*/}
                {/*  member1['First Name of Team Members (from Teams)']?.join(', ')*/}
                {/*) : (*/}
                {/*  <span className="flex w-full justify-center font-bold">Filled</span>*/}
                {/*)}*/}
              </div>

              {/*{member2 && (*/}
              {/*  <div className="p-2 text-[0.8rem]">*/}
              {/*    {member2['First Name (from Registrant)']}{' '}*/}
              {/*    {member2['Last Name (from Registrant_ID)']}*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pool;
