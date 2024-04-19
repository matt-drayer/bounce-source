import React, { useState } from 'react';
// import { ENFORCE_THIRD_PLACE_MATCH } from 'constants/brackets';
// import { getRoundNames } from 'utils/shared/brackets/getRoundNames';
import { nameToFirstInitials } from 'utils/shared/name/nameToFirstInitials';
import ChevronLeft from 'svg/ChevronLeft';
import ChevronRight from 'svg/ChevronRight';
import CourtFlat from 'svg/CourtFlat';
import { Button, ButtonText } from 'components/Button';
import classNames from 'styles/utils/classNames';
import { MatchType, Round, Seeding } from './types';

interface MatchProps {
  isUserOrganizer: boolean;
  matches?: MatchType[];
  hasPreviousRound: boolean;
  hasNextRound: boolean;
  moveToPreviousRound?: () => void;
  moveToNextRound?: () => void;
  setAssignCourtId: (courtId: string) => void;
  setScoreMatchId: (courtId: string) => void;
  seeding?: Seeding;
}

const Match = ({
  isUserOrganizer,
  matches,
  hasPreviousRound,
  hasNextRound,
  moveToPreviousRound,
  moveToNextRound,
  setAssignCourtId,
  setScoreMatchId,
  seeding,
}: MatchProps) => {
  if (!matches) {
    return null;
  }

  const hasMultipleMatches = matches.length > 1;

  return (
    <div className="flex">
      <div className="relative flex w-[15vw] items-center">
        <div
          className={classNames(
            'mt-[1px] h-[6.5625rem] w-full bg-transparent',
            hasPreviousRound &&
              hasMultipleMatches &&
              'border border-l-0 border-r-0 border-color-bg-lightmode-primary dark:border-color-bg-darkmode-primary',
          )}
        >
          &nbsp;
        </div>
        {hasPreviousRound && (
          <button
            type="button"
            className="absolute left-1/2 right-1/2 top-[1.3625rem] h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-color-bg-lightmode-primary p-ds-sm dark:bg-color-bg-darkmode-primary"
            onClick={moveToPreviousRound}
          >
            <ChevronLeft className="h-5 w-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary" />
          </button>
        )}
        {hasPreviousRound && hasMultipleMatches && (
          <button
            type="button"
            className="absolute bottom-[1.3625rem] left-1/2 right-1/2 h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-color-bg-lightmode-primary p-ds-sm dark:bg-color-bg-darkmode-primary"
            onClick={moveToPreviousRound}
          >
            <ChevronLeft className="h-5 w-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary" />{' '}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-6">
        {matches.map(({ team1, team2, games, id, courtNumber, winningTeamId, isBye }) => {
          const hasMatchScores =
            games?.length &&
            (typeof games[0]?.team1Score === 'number' || games[0]?.team2Score === 'number');
          const hasAllTeams = (isBye && (!!team1 || !!team2)) || (!!team1 && !!team2);
          const canAddScore = !hasMatchScores && hasAllTeams && !isBye && isUserOrganizer;
          const team1Seeding = seeding?.find((seed) => seed.eventTeamId === team1?.id);
          const team2Seeding = seeding?.find((seed) => seed.eventTeamId === team2?.id);

          return (
            <div
              key={id}
              className="flex h-20 w-[70vw] rounded-lg border border-color-border-input-lightmode bg-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary"
            >
              <button
                type="button"
                onClick={() => !isBye && isUserOrganizer && setAssignCourtId(id)}
                className="flex w-10 shrink-0 items-center rounded-none border-r border-color-border-input-lightmode pl-2 pr-ds-xs dark:border-color-border-input-darkmode"
              >
                <CourtFlat className="h-4 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />{' '}
                <span className="typography-product-button-label-xs ml-1">
                  {courtNumber || courtNumber === 0 ? courtNumber : '-'}
                </span>
              </button>
              <div className="relative flex w-full min-w-0 grow flex-col">
                <div className="grow divide-y divide-color-border-input-lightmode dark:divide-color-border-input-darkmode">
                  <div
                    className={classNames(
                      'relative flex h-1/2 w-full items-center justify-between overflow-hidden px-ds-xs',
                      !!winningTeamId && winningTeamId === team1?.id && 'text-color-text-brand',
                    )}
                  >
                    {team1Seeding?.seed && (
                      <div className="typography-product-tabbar-mobile absolute left-1 top-1 h-3 w-4 rounded-lg bg-color-bg-lightmode-secondary text-center">
                        {team1Seeding.seed}
                      </div>
                    )}
                    <div
                      className={classNames(
                        'flex min-w-0 flex-1 flex-col justify-center pl-ds-xl text-left',
                        canAddScore ? 'max-w-[calc(100%-6rem)]' : 'max-w-full',
                      )}
                    >
                      {team1?.members.map((member, i) => (
                        <div key={member.id} className="typography-product-text-card truncate">
                          {nameToFirstInitials(member?.userProfile?.fullName || '')}
                        </div>
                      ))}
                    </div>
                    {games.map((game, i) => (
                      <div key={game.id} className="flex items-center justify-center px-ds-md">
                        {game.team1Score}
                      </div>
                    ))}
                  </div>
                  <div
                    className={classNames(
                      'relative flex h-1/2 items-center justify-between px-ds-xs',
                      !!winningTeamId && winningTeamId === team2?.id && 'text-color-text-brand',
                    )}
                  >
                    {team2Seeding?.seed && (
                      <div className="typography-product-tabbar-mobile absolute left-1 top-1 h-3 w-4 rounded-lg bg-color-bg-lightmode-secondary text-center">
                        {team2Seeding.seed}
                      </div>
                    )}
                    <div
                      className={classNames(
                        'flex min-w-0 flex-1 flex-col justify-center pl-ds-xl text-left',
                        canAddScore ? 'max-w-[calc(100%-6rem)]' : 'max-w-full',
                      )}
                    >
                      {isBye ? (
                        <div className="typography-product-text-card text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                          Bye
                        </div>
                      ) : (
                        team2?.members.map((member) => (
                          <div key={member.id} className="typography-product-text-card truncate">
                            {nameToFirstInitials(member?.userProfile?.fullName || '')}
                          </div>
                        ))
                      )}
                    </div>
                    {games.map((game) => (
                      <div key={game.id} className="flex items-center justify-center px-ds-md">
                        {game.team2Score}
                      </div>
                    ))}
                  </div>
                </div>
                {canAddScore && (
                  <Button
                    variant="brand"
                    size="sm"
                    isInline
                    className="absolute right-2 top-1/2 my-auto -translate-y-1/2 shadow-[0px_4px_4px_0px_rgba(124,30,0,0.16)]"
                    onClick={() => setScoreMatchId(id)}
                  >
                    Add score
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {hasNextRound && hasMultipleMatches && (
        <div className="relative flex w-[15vw] items-center">
          <div
            className={classNames(
              'mt-[1px] h-[6.5625rem] w-1/2 rounded-br-lg rounded-tr-lg border border-l-0 border-color-bg-lightmode-primary bg-transparent dark:border-color-bg-darkmode-primary',
            )}
          >
            &nbsp;
          </div>
          <div className="h-[1px] w-1/2 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
            &nbsp;
          </div>
          <button
            type="button"
            className="absolute bottom-1/2 left-1/2 right-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-color-bg-lightmode-primary p-ds-sm dark:bg-color-bg-darkmode-primary"
            onClick={moveToNextRound}
          >
            <ChevronRight className="h-5 w-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary" />
          </button>
        </div>
      )}
      {hasNextRound && !hasMultipleMatches && (
        <div className="relative flex w-[15vw] items-center">
          <div className={classNames('mt-[1px] h-[6.5625rem] w-full bg-transparent')}>&nbsp;</div>
          <button
            type="button"
            className="absolute left-1/2 right-1/2 top-[1.3625rem] h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-color-bg-lightmode-primary p-ds-sm dark:bg-color-bg-darkmode-primary"
            onClick={moveToNextRound}
          >
            <ChevronRight className="h-5 w-5 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary" />
          </button>
        </div>
      )}
    </div>
  );
};

interface RoundSelectorProps {
  roundIndex: number;
  setRoundIndex: (index: number) => void;
  activeRoundIndex: number;
  children: React.ReactNode;
}

const RoundSelector = ({
  roundIndex,
  activeRoundIndex,
  setRoundIndex,
  children,
}: RoundSelectorProps) => {
  const isActive = roundIndex === activeRoundIndex;
  return (
    <ButtonText
      className={classNames(
        'typography-product-chips-filters min-w-24 rounded-md bg-color-bg-lightmode-primary px-1 py-2.5 text-color-text-lightmode-primary dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-primary',
        !isActive && 'bg-opacity-40',
      )}
      onClick={() => setRoundIndex(roundIndex)}
    >
      {children}
    </ButtonText>
  );
};

const ROUNED_EXAMPLES = ['1st Round', '2nd Round', 'Quarterfinals', 'Semifinals', 'Finals'];

interface Props {
  isUserOrganizer: boolean;
  rounds?: Round[];
  setAssignCourtId: (courtId: string) => void;
  setScoreMatchId: (courtId: string) => void;
  seeding?: Seeding;
}

export default function Bracket({
  isUserOrganizer,
  rounds,
  setAssignCourtId,
  setScoreMatchId,
  seeding,
}: Props) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);
  const activeRound = rounds?.[activeRoundIndex];
  /**
   * @todo Get third place flag from DB, make sure this maps correctly
   * It doesn't work the same after it's been made for handling third place
   */
  // const roundNames = getRoundNames(rounds?.length || 0, ENFORCE_THIRD_PLACE_MATCH);
  const matchesByTwo = [];

  if (activeRound?.matches?.length) {
    for (let i = 0; i < activeRound.matches.length; i += 2) {
      const roundMatches = [];

      if (activeRound.matches[i]) {
        roundMatches.push(activeRound.matches[i]);
      }
      if (activeRound.matches[i + 1]) {
        roundMatches.push(activeRound.matches[i + 1]);
      }
      matchesByTwo.push(roundMatches);
    }
  }

  return (
    <>
      <div className="pt-ds-xl">
        <div className="scroll flex space-x-2 overflow-x-auto whitespace-nowrap px-4 pb-4">
          {rounds?.map((round, i) => (
            <RoundSelector
              key={i}
              roundIndex={i}
              activeRoundIndex={activeRoundIndex}
              setRoundIndex={setActiveRoundIndex}
            >
              {round.title}
            </RoundSelector>
          ))}
        </div>
      </div>
      <div className="flex flex-auto flex-col gap-6 overflow-y-auto py-ds-lg">
        {/* {rounds?.[0]?.matches.map((match, i) => {
            return <Match key={} matches={matches} />;
          })} */}
        {matchesByTwo.map((matches, i) => (
          <Match
            isUserOrganizer={isUserOrganizer}
            key={activeRound?.id + `-${i}`}
            matches={matches}
            hasPreviousRound={!!activeRound?.roundOrder}
            hasNextRound={!!rounds?.[activeRoundIndex + 1]}
            moveToNextRound={() => setActiveRoundIndex(activeRoundIndex + 1)}
            moveToPreviousRound={() => setActiveRoundIndex(activeRoundIndex - 1)}
            setAssignCourtId={setAssignCourtId}
            setScoreMatchId={setScoreMatchId}
            seeding={seeding}
          />
        ))}
      </div>
    </>
  );
}
