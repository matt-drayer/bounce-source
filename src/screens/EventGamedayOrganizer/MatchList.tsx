import React from 'react';
import { nameToFirstInitials } from 'utils/shared/name/nameToFirstInitials';
import ChevronUp from 'svg/ChevronUp';
import CourtFlat from 'svg/CourtFlat';
import classNames from 'styles/utils/classNames';
import { CourtsType, MatchStatus, MatchType, TeamType } from './types';
import { shouldHideCourtAssigmnet } from './utils';

interface MatchProps {
  id: string;
  eventId: string;
  isUserOrganizer: boolean;
  team1?: TeamType;
  team2?: TeamType;
  team1Score?: number;
  team2Score?: number;
  assignedCourt: number | undefined;
  setAssignCourtId: (courtId: string) => void;
  setScoreMatchId: (matchId: string) => void;
  status?: MatchStatus;
  topActiveMatchId?: string;
  topActiveMatchRef: React.RefObject<HTMLButtonElement>;
}

const Match = ({
  id,
  eventId,
  isUserOrganizer,
  team1,
  team2,
  team1Score,
  team2Score,
  assignedCourt,
  setAssignCourtId,
  setScoreMatchId,
  status,
  topActiveMatchId,
  topActiveMatchRef,
}: MatchProps) => {
  const isActiveItem = topActiveMatchId === id;

  return (
    <button
      id={isActiveItem ? id : undefined}
      ref={isActiveItem ? topActiveMatchRef : undefined}
      type="button"
      className={classNames(
        'flex items-center justify-between text-left',
        (!status || status === MatchStatus.Upcoming) &&
          'rounded-none border-b border-color-border-card-lightmode bg-color-bg-lightmode-primary dark:border-color-border-card-darkmode dark:bg-color-bg-darkmode-primary',
        status === MatchStatus.UpNext &&
          'rounded-lg border border-color-border-card-lightmode bg-brand-fire-200 text-color-text-lightmode-primary dark:border-color-border-card-darkmode',
        status === MatchStatus.Active &&
          'rounded-lg border border-color-border-input-lightmode bg-color-bg-lightmode-brand text-color-text-lightmode-invert dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-brand',
        status === MatchStatus.Complete &&
          'rounded-lg border border-color-border-input-lightmode bg-color-bg-lightmode-secondary text-color-text-lightmode-primary dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-primary',
      )}
      onClick={() => {
        if (!isUserOrganizer) {
          return;
        }
        if (status === MatchStatus.Complete) {
          setScoreMatchId(id);
        } else {
          setAssignCourtId(id);
        }
      }}
    >
      {!shouldHideCourtAssigmnet(eventId) && (
        <div
          className={classNames(
            'mr-5 flex shrink-0 items-center gap-1 p-2',
            status === MatchStatus.Active && 'text-color-text-lightmode-invert',
            assignedCourt && status !== MatchStatus.Active
              ? 'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary'
              : 'text-color-text-lightmode-icon dark:text-color-text-darkmode-icon',
          )}
        >
          <CourtFlat className="h-5" />
          <div className="typography-product-button-label-small">{assignedCourt || '-'}</div>
        </div>
      )}
      <div className="flex w-1/2 flex-1 flex-col truncate p-2">
        {team1?.members.map((member) => (
          <div key={member.id} className="typography-product-caption truncate">
            {nameToFirstInitials(member?.userProfile?.fullName || '')}
          </div>
        ))}
      </div>
      <div className="aspect-[1.08] shrink-0 px-2 py-5">
        <span className="typography-product-button-label-small">
          {typeof team1Score === 'number' && typeof team2Score === 'number'
            ? `${team1Score}-${team2Score}`
            : 'VS'}
        </span>
      </div>
      <div className="flex w-1/2 flex-1 flex-col truncate p-2">
        {team2?.members.map((member) => (
          <div key={member.id} className="typography-product-caption truncate">
            {nameToFirstInitials(member?.userProfile?.fullName || '')}
          </div>
        ))}
      </div>
    </button>
  );
};

interface Props {
  eventId: string;
  isUserOrganizer: boolean;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  courts: CourtsType;
  /**
   * @todo confirm this is right once data is more finalized
   */
  matches: MatchType[];
  assignCourtId: string;
  setAssignCourtId: (courtId: string) => void;
  scoreMatchId: string;
  setScoreMatchId: (matchId: string) => void;
  topActiveMatchId?: string;
  topActiveMatchRef: React.RefObject<HTMLButtonElement>;
  matchListContainerRef: React.RefObject<HTMLDivElement>;
  lastMatchPerRound: string[];
}

export default function MatchesList({
  eventId,
  isUserOrganizer,
  isExpanded,
  setIsExpanded,
  matches,
  setAssignCourtId,
  setScoreMatchId,
  topActiveMatchId,
  topActiveMatchRef,
  matchListContainerRef,
  lastMatchPerRound,
}: Props) {
  return (
    <div className="flex h-full flex-col px-4 pt-ds-md">
      <button
        type="button"
        className="flex w-full items-center justify-between pb-ds-xs"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="typography-product-heading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Schedule of play
        </span>
        <div
          className={classNames(
            'p-2 transition-transform duration-300',
            isExpanded && 'rotate-180',
          )}
        >
          <ChevronUp className="h-6 w-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary" />
        </div>
      </button>
      <div ref={matchListContainerRef} className="flex h-full flex-col overflow-y-auto pb-ds-md">
        {matches.map((match) => {
          const team1 = match?.team1;
          const team2 = match?.team2;
          const assignedCourt =
            match.courtNumber || match.courtNumber === 0 ? match.courtNumber : undefined;
          const isLastMatchInRound = lastMatchPerRound.includes(match.id);
          const isLastMatch = matches[matches.length - 1].id === match.id;
          const nextRoundId =
            isLastMatchInRound && !isLastMatch ? lastMatchPerRound.indexOf(match.id) + 2 : -1; // 0-based index, then add 1 to get the next round

          return (
            <React.Fragment key={match.id}>
              <Match
                key={match.id}
                eventId={eventId}
                isUserOrganizer={isUserOrganizer}
                id={match.id}
                team1={team1}
                team2={team2}
                team1Score={match.games[0]?.team1Score}
                team2Score={match.games[0]?.team2Score}
                assignedCourt={assignedCourt}
                setAssignCourtId={setAssignCourtId}
                setScoreMatchId={setScoreMatchId}
                status={match.status}
                topActiveMatchId={topActiveMatchId}
                topActiveMatchRef={topActiveMatchRef}
              />
              {isLastMatchInRound && nextRoundId !== -1 && (
                <div className="typography-product-subheading border-b border-color-border-card-lightmode py-2 text-center text-color-text-lightmode-secondary dark:border-color-border-card-darkmode dark:text-color-text-darkmode-secondary">
                  Round {nextRoundId}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
