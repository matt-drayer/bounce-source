import * as React from 'react';
import { FC } from 'react';
import classNames from 'classnames';
import { compact } from 'lodash';
import { useViewer } from 'hooks/useViewer';

type Props = {
  maxTeamsPerPool: number;
  filledTeamsPerGroup: number;
  poolName: string;

  teams: {
    firstNames: string[];
    lastNames: string[];
  }[];
};

const MultipleEventPool: FC<Props> = ({
  maxTeamsPerPool,
  poolName,
  teams,
  filledTeamsPerGroup,
}) => {
  const { viewer } = useViewer();

  return (
    <div className="mb-4 flex w-full flex-col rounded-[8px] bg-brand-gray-25 p-4 sm:w-[48%]">
      <h3 className="mb-4 flex justify-between text-[1.25rem] font-semibold">
        <span className="italic">
          {poolName}{' '}
          <span className="ml-3">
            {filledTeamsPerGroup + teams.length} /{' '}
            <span className="text-brand-gray-600">{maxTeamsPerPool}</span>
          </span>
        </span>
      </h3>
      <div className="flex flex-wrap justify-between">
        {teams.map((team, index) => {
          const isTeamsCountOdd = teams.length % 2 !== 0;

          let shouldHaveBottomOffset;

          if (isTeamsCountOdd) {
            shouldHaveBottomOffset = index !== teams.length - 1;
          } else {
            shouldHaveBottomOffset = index !== teams.length - 1 && index !== teams.length - 2;
          }

          const names = team.firstNames.map((firstName, index) => {
            const lastName = team.lastNames[index];

            if (lastName) {
              return `${firstName} ${lastName[0]}.`;
            }
          });

          if (compact(names).length < 2) {
            names.push("Partner hasn't registered");
          }

          return (
            <div
              className={classNames(
                'w-[48%] rounded-[8px] border border-b-brand-gray-100 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                teams.length > 2 && shouldHaveBottomOffset && 'mb-4',
              )}
              key={index}
            >
              <div className="rounded-[8px] rounded-bl-none rounded-br-none bg-brand-gray-1000 p-2 text-[0.8rem] text-white">
                Team {index + 1}
              </div>
              <div className="min-h-[36px] p-2 text-[0.8rem]">{names.join(' & ')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleEventPool;
