import React from 'react';
import { nameToFirstInitials } from 'utils/shared/name/nameToFirstInitials';
import classNames from 'styles/utils/classNames';
import { ActiveCourtMatchType } from './types';
import { shouldHideCourtAssigmnet } from './utils';

interface PlayerNameProps {
  names: React.ReactNode[];
  isTop: boolean;
  isEmptyCourt: boolean;
}

const PlayerNamePair = ({ names, isTop, isEmptyCourt }: PlayerNameProps) => {
  return (
    <div
      className={classNames(
        'typography-product-body flex flex-col justify-end px-2 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
        isTop ? '-mb-3.5 pb-5 pt-2' : '-mt-3.5 pb-2 pt-5',
        isEmptyCourt
          ? 'bg-color-bg-darkmode-icon'
          : 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
      )}
    >
      {names.map((name, index) => (
        <div key={index} className="truncate">
          {typeof name === 'string' ? nameToFirstInitials(name) : name}
        </div>
      ))}
    </div>
  );
};

interface Props {
  eventId: string;
  isUserOrganizer: boolean;
  courtId: string;
  courtNumber: number;
  activeMatch: ActiveCourtMatchType;
  assignCourtId: string;
  setAssignCourtId: (courtId: string) => void;
  scoreMatchId: string;
  setScoreMatchId: (matchId: string) => void;
}

export default function Court({
  eventId,
  isUserOrganizer,
  courtId,
  courtNumber,
  activeMatch,
  setAssignCourtId,
  setScoreMatchId,
}: Props) {
  const isEmptyCourt = !activeMatch;
  const topPlayerNames =
    activeMatch?.teams?.[0]?.team?.members.map((member) => member?.userProfile?.fullName || '') ||
    [];
  const bottomPlayerNames =
    activeMatch?.teams?.[1]?.team?.members.map((member) => member?.userProfile?.fullName || '') ||
    [];
  const topPlayers: string[] = [
    ...topPlayerNames,
    ...new Array(2 - (topPlayerNames?.length || 0)).fill(<span>&nbsp;</span>),
  ];
  const bottomPlayers: string[] = [
    ...bottomPlayerNames,
    ...new Array(2 - (bottomPlayerNames?.length || 0)).fill(<span>&nbsp;</span>),
  ];

  return (
    <>
      <div>
        {!shouldHideCourtAssigmnet(eventId) && (
          <div className="typography-product-subheading mb-ds-sm text-center">
            Court {courtNumber}
          </div>
        )}
        <div
          className={classNames(
            'flex w-[144px] shrink-0 flex-col rounded-xl border-2 border-solid bg-transparent p-2',
            isEmptyCourt
              ? 'border-color-bg-darkmode-icon'
              : 'border-color-bg-lightmode-primary dark:border-color-bg-darkmode-primary',
          )}
        >
          <div className="mb-1 flex gap-1">
            <div
              className={classNames(
                'flex h-6 w-full rounded-tl-lg',
                isEmptyCourt
                  ? 'bg-color-bg-darkmode-icon'
                  : 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
              )}
            >
              &nbsp;
            </div>
            <div
              className={classNames(
                'flex h-6 w-full rounded-tr-lg',
                isEmptyCourt
                  ? 'bg-color-bg-darkmode-icon'
                  : 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
              )}
            >
              &nbsp;
            </div>
          </div>
          <div className="relative">
            <PlayerNamePair names={topPlayers || []} isTop isEmptyCourt={isEmptyCourt} />
          </div>
          <div className="relative z-10 flex w-full justify-center px-1.5">
            <button
              type="button"
              className={classNames(
                'typography-product-button-label-medium w-full justify-center self-center whitespace-nowrap rounded-full px-4 py-2 leading-4',
                !isUserOrganizer && 'user-select-none cursor-default opacity-0',
                isEmptyCourt
                  ? 'bg-color-bg-lightmode-primary text-color-text-lightmode-primary shadow-sm'
                  : 'bg-color-brand-primary text-color-text-lightmode-invert shadow-lg',
              )}
              onClick={() => {
                if (!isUserOrganizer) {
                  return;
                }

                if (isEmptyCourt) {
                  setAssignCourtId(courtId);
                } else {
                  setScoreMatchId(activeMatch.id || '');
                }
              }}
            >
              {isEmptyCourt ? 'Free' : 'Add Score'}
            </button>
          </div>
          <div className="relative">
            <PlayerNamePair names={bottomPlayers || []} isTop={false} isEmptyCourt={isEmptyCourt} />
          </div>
          <div className="mt-1 flex gap-1">
            <div
              className={classNames(
                'flex h-6 w-full rounded-bl-lg',
                isEmptyCourt
                  ? 'bg-color-bg-darkmode-icon'
                  : 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
              )}
            >
              &nbsp;
            </div>
            <div
              className={classNames(
                'flex h-6 w-full rounded-br-lg',
                isEmptyCourt
                  ? 'bg-color-bg-darkmode-icon'
                  : 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
              )}
            >
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
