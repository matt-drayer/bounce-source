import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getEventUrl } from 'constants/pages';
import {
  CompetitionFormatsEnum,
  GetGamedayByEventIdQuery,
  MatchSelectionCriteriaEnum,
  useGetGamedayByEventIdLazyQuery,
  useUpdateCompleteSequenceMutation,
  useUpdateReleaseCourtsFromGroupMutation,
} from 'types/generated/client';
import { useAuthModals } from 'hooks/useAuthModals';
import { useModal } from 'hooks/useModal';
import { useViewer } from 'hooks/useViewer';
import ChevronLeft from 'svg/ChevronLeft';
import { Button } from 'components/Button';
import Link from 'components/Link';
import TabSlider from 'components/TabSlider';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import Bracket from './Bracket';
import Court from './Court';
import MatchesList from './MatchList';
import ModalAddScore from './ModalAddScore';
import ModalAssignCourt from './ModalAssignCourt';
import ModalStartGroup from './ModalStartGroup';
import PoolResults from './PoolResults';
import { GradientBackground } from './styles';
import { MatchStatus, MatchType } from './types';
import { calculateGroupCompletion, formatDate, formatDateTimeShort } from './utils';

enum SliderTabKeys {
  RoundRobin = 'ROUND_ROBIN',
  SingleElimination = 'SINGLE_ELIMINATION',
}

const TAB_SLIDER = [
  {
    name: 'Pool play',
    key: SliderTabKeys.RoundRobin,
  },
  {
    name: 'Pool results',
    key: SliderTabKeys.RoundRobin,
  },
  {
    name: 'Single elim',
    key: SliderTabKeys.SingleElimination,
  },
];

const DEFAULT_NUMBER_OF_COURTS = 4;

export default function EventGamedayOrganizer() {
  const router = useRouter();
  const { openLoginModal, ModalLogin, ModalSignup } = useAuthModals();
  const { isUserSession, isAnonymousSession, userId } = useViewer();
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const topActiveMatchRef = useRef<HTMLButtonElement>(null);
  const matchListContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [
    getGamedayByEventIdLazyQuery,
    { data: gamedayData, loading: isGamedayDataLoading, error: gamedayDataError },
  ] = useGetGamedayByEventIdLazyQuery();
  const [updateReleaseCourtsFromGroupMutation] = useUpdateReleaseCourtsFromGroupMutation();
  const [updateCompleteSequenceMutation] = useUpdateCompleteSequenceMutation();
  const [activeSliderTabIndex, setActiveSliderTabIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [scoreMatchId, setScoreMatchId] = React.useState('');
  const [assignCourtId, setAssignCourtId] = React.useState('');
  const {
    isOpen: isStartGroupOpen,
    closeModal: closeModalStartGroup,
    openModal: openModalStartGroup,
  } = useModal();
  const isUserOrganizer =
    !!gamedayData?.eventsByPk?.hostUserId && userId === gamedayData?.eventsByPk?.hostUserId;

  useEffect(() => {
    if (activeSliderTabIndex !== 0) {
      setHasScrolled(false);
    }
  }, [activeSliderTabIndex]);

  useEffect(() => {
    if (isAnonymousSession) {
      openLoginModal();
    }
  }, [isAnonymousSession]);

  useEffect(() => {
    if (isUserSession && router.isReady && router.query.idOrSlug) {
      getGamedayByEventIdLazyQuery({
        variables: {
          id: router.query.idOrSlug as string,
        },
      });
    }
  }, [router.isReady, router.query.idOrSlug, isUserSession]);

  const event = gamedayData?.eventsByPk;
  const groups = (event?.groups || [])
    .map((g) => ({
      ...g,
      startsAtTimestamp: new Date(g.startsAt).getTime(),
      titleWithTime: `${g.title} (${formatDateTimeShort(g.startsAt)})`,
    }))
    .sort((a, b) => {
      if (a.startsAtTimestamp < b.startsAtTimestamp) return -1;
      if (a.startsAtTimestamp > b.startsAtTimestamp) return 1;
      return 0;
    });
  const activeGroup = groups[activeGroupIndex];
  const courtsForGroup = activeGroup?.courts || [];
  const courtsWithNullActiveMatch = courtsForGroup.filter((court) => !court.activeMatch);
  const courtsWithNonNullActiveMatch = courtsForGroup.filter((court) => !!court.activeMatch);

  // Sorting courts with non-null activeMatch by updatedAt in descending order
  const sortedCourtsWithNullActiveMatch = [...courtsWithNullActiveMatch].sort(
    (a, b) => a.courtNumber - b.courtNumber,
  );
  const sortedCourtsWithNonNullActiveMatch = [...courtsWithNonNullActiveMatch].sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
  );
  const firstCourt = sortedCourtsWithNullActiveMatch[0];
  const remainingInactiveCourts = sortedCourtsWithNullActiveMatch.slice(1);

  const courts = firstCourt
    ? [firstCourt, ...sortedCourtsWithNonNullActiveMatch, ...remainingInactiveCourts]
    : [...sortedCourtsWithNonNullActiveMatch];

  const { rounds, roundRobinSequence } = useMemo(() => {
    const roundRobinSequence = activeGroup?.sequences.find(
      (sequence) => sequence.competitionFormat === CompetitionFormatsEnum.RoundRobin,
    );
    const roundRobinPools = roundRobinSequence?.pools.reduce((acc, pool) => {
      acc.push(pool);
      return acc;
    }, [] as NonNullable<GetGamedayByEventIdQuery['eventsByPk']>['groups'][0]['sequences'][0]['pools']);
    const rounds =
      roundRobinPools?.reduce((acc, pool) => {
        return [...acc, ...pool.rounds];
      }, [] as NonNullable<GetGamedayByEventIdQuery['eventsByPk']>['groups'][0]['sequences'][0]['pools'][0]['rounds']) ||
      [];

    return { rounds, roundRobinSequence };
  }, [activeGroup?.sequences]);

  const {
    matches: roundRobinMatches,
    upcomingMatches: upcomingRoundRobinMatches,
    nextMatch: nextRoundRobinMatch,
    activeMatches: activeRoundRobinMatches,
    completedMatches: completedRoundRobinMatches,
    nextMatchWithoutCourt: nextRoundRobinMatchWithoutCourt,
    lastMatchPerRound,
  } = useMemo(() => {
    let isNextGameSet = false;
    const flatMatches: MatchType[] = rounds?.flatMap((round) => round.matches) || [];
    const lastMatchPerRound: string[] =
      rounds?.map((round) => round.matches[round.matches.length - 1].id) || [];
    const decoratedMatches = flatMatches.map((match) => {
      const isMatchOnCourt = courts.some((court) => court.activeMatch?.id === match.id);
      const hasScores = !!match?.games?.some(
        (game) => typeof game.team1Score === 'number' && typeof game.team2Score === 'number',
      );
      let status: MatchStatus;

      if (isMatchOnCourt) {
        status = MatchStatus.Active;
      } else if (!hasScores && !isNextGameSet) {
        status = MatchStatus.UpNext;
        isNextGameSet = true;
      } else if (!hasScores) {
        status = MatchStatus.Upcoming;
      } else {
        status = MatchStatus.Complete;
      }

      return {
        ...match,
        status: status,
      };
    });
    const completedMatches = decoratedMatches.filter(
      (match) => match.status === MatchStatus.Complete,
    );
    const activeMatches = decoratedMatches.filter((match) => match.status === MatchStatus.Active);
    const nextMatch = decoratedMatches.find((match) => match.status === MatchStatus.UpNext);
    const upcomingMatches = decoratedMatches.filter(
      (match) => match.status === MatchStatus.Upcoming,
    );
    const finalMatches = [
      ...completedMatches,
      ...activeMatches,
      ...(nextMatch ? [nextMatch] : []),
      ...upcomingMatches,
    ].filter((m) => !!m);

    const nextMatchWithoutCourt = [...(nextMatch ? [nextMatch] : []), ...upcomingMatches].find(
      (match) => !match.courtNumber,
    );

    return {
      matches: finalMatches,
      completedMatches,
      activeMatches,
      nextMatch: nextMatch,
      upcomingMatches,
      nextMatchWithoutCourt,
      lastMatchPerRound,
    };
  }, [rounds, courts]);

  const topActiveMatch = activeRoundRobinMatches[0];

  const {
    singleEliminationMatches,
    nextMatchSingleElimination,
    nextSingleEliminationMatchWithoutCourt,
    activeSingleEliminationMatches,
    upcomingSingleEliminationMatches,
  } = useMemo(() => {
    let isNextGameSet = false;
    const singleEliminationSequence = activeGroup?.sequences.find(
      (sequence) => sequence.competitionFormat === CompetitionFormatsEnum.SingleElimination,
    );
    const flatMatches: MatchType[] =
      singleEliminationSequence?.pools[0]?.rounds?.flatMap((round) => round.matches) || [];
    const decoratedMatches = flatMatches.map((match) => {
      const isMatchOnCourt = courts.some((court) => court.activeMatch?.id === match.id);
      const hasScores = !!match?.games?.some(
        (game) => typeof game.team1Score === 'number' && typeof game.team2Score === 'number',
      );
      let status: MatchStatus;

      if (match.isBye) {
        status = MatchStatus.Complete;
      } else if (isMatchOnCourt) {
        status = MatchStatus.Active;
      } else if (!hasScores && !isNextGameSet) {
        status = MatchStatus.UpNext;
        isNextGameSet = true;
      } else if (!hasScores) {
        status = MatchStatus.Upcoming;
      } else {
        status = MatchStatus.Complete;
      }

      return {
        ...match,
        status: status,
      };
    });
    const completedMatches = decoratedMatches.filter(
      (match) => match.status === MatchStatus.Complete,
    );
    const activeMatches = decoratedMatches.filter((match) => match.status === MatchStatus.Active);
    const nextMatch = decoratedMatches.find((match) => match.status === MatchStatus.UpNext);
    const upcomingMatches = decoratedMatches.filter(
      (match) => match.status === MatchStatus.Upcoming,
    );
    const finalMatches = [
      ...completedMatches,
      ...activeMatches,
      ...(nextMatch ? [nextMatch] : []),
      ...upcomingMatches,
    ].filter((m) => !!m);

    const nextMatchWithoutCourt = [...(nextMatch ? [nextMatch] : []), ...upcomingMatches].find(
      (match) => !match.courtNumber,
    );

    return {
      singleEliminationMatches: finalMatches,
      nextMatchSingleElimination: nextMatch,
      completedSingleEliminationMatches: completedMatches,
      activeSingleEliminationMatches: activeMatches,
      upcomingSingleEliminationMatches: upcomingMatches,
      nextSingleEliminationMatchWithoutCourt: nextMatchWithoutCourt,
    };
  }, [activeGroup]);

  useEffect(() => {
    if (topActiveMatch && !hasScrolled && activeSliderTabIndex === 0) {
      setHasScrolled(true);

      if (matchListContainerRef.current && topActiveMatchRef.current) {
        const container = matchListContainerRef.current;
        const activeItem = topActiveMatchRef.current;
        const distanceFromTop = activeItem.offsetTop - container.offsetTop;

        setTimeout(() => {
          container.scrollTop = distanceFromTop;
        }, 1);
      }
    }
  }, [topActiveMatch, hasScrolled, activeSliderTabIndex]);

  const {
    winningTeamNextMatch1Id,
    winningTeamNextMatch2Id,
    losingTeamNextMatch1Id,
    losingTeamNextMatch2Id,
  } = useMemo(() => {
    let winningTeamNextMatch1Id = '';
    let winningTeamNextMatch2Id = '';
    let losingTeamNextMatch1Id = '';
    let losingTeamNextMatch2Id = '';

    if (!scoreMatchId) {
      return {
        winningTeamNextMatch1Id,
        winningTeamNextMatch2Id,
        losingTeamNextMatch1Id,
        losingTeamNextMatch2Id,
      };
    }

    for (let i = 0; i < singleEliminationMatches.length; i++) {
      if (singleEliminationMatches[i].previousMatch1Id === scoreMatchId) {
        if (
          singleEliminationMatches[i].selectionCriteriaPreviousMatch1 ===
          MatchSelectionCriteriaEnum.Winner
        ) {
          winningTeamNextMatch1Id = singleEliminationMatches[i].id;
        }
        if (
          singleEliminationMatches[i].selectionCriteriaPreviousMatch1 ===
          MatchSelectionCriteriaEnum.Loser
        ) {
          losingTeamNextMatch1Id = singleEliminationMatches[i].id;
        }
      }

      if (singleEliminationMatches[i].previousMatch2Id === scoreMatchId) {
        if (
          singleEliminationMatches[i].selectionCriteriaPreviousMatch2 ===
          MatchSelectionCriteriaEnum.Winner
        ) {
          winningTeamNextMatch2Id = singleEliminationMatches[i].id;
        }
        if (
          singleEliminationMatches[i].selectionCriteriaPreviousMatch2 ===
          MatchSelectionCriteriaEnum.Loser
        ) {
          losingTeamNextMatch2Id = singleEliminationMatches[i].id;
        }
      }
    }

    return {
      winningTeamNextMatch1Id,
      winningTeamNextMatch2Id,
      losingTeamNextMatch1Id,
      losingTeamNextMatch2Id,
    };
  }, [scoreMatchId, singleEliminationMatches]);

  const allCourtsForEvent = event?.courts;
  const allRoundRobinMatchesNotStarted = [
    ...(nextRoundRobinMatch ? [nextRoundRobinMatch] : []),
    ...upcomingRoundRobinMatches,
  ];
  const allSingleEliminationMatchesNotStarted = [
    ...(nextMatchSingleElimination ? [nextMatchSingleElimination] : []),
    ...upcomingSingleEliminationMatches,
  ];
  const allMatches = [...(roundRobinMatches || []), ...(singleEliminationMatches || [])];
  const assigningCourtToMatch = assignCourtId
    ? allMatches.find((match) => match.id === assignCourtId)
    : undefined;
  const settingScoreFotMatch = scoreMatchId
    ? allMatches.find((match) => match.id === scoreMatchId)
    : undefined;
  const allActiveMatches = [...activeRoundRobinMatches, ...activeSingleEliminationMatches];
  const allMatchesNotStarted = [
    ...allRoundRobinMatchesNotStarted,
    ...allSingleEliminationMatchesNotStarted,
  ];
  // --
  const isRoundRobinMatchesComplete =
    allRoundRobinMatchesNotStarted.length === 0 && activeRoundRobinMatches.length === 0;
  const isRoundRobinSequenceComplete = roundRobinSequence?.isSequenceComplete;
  const singleEliminationSequence = activeGroup?.sequences.find(
    (sequence) => sequence.competitionFormat === CompetitionFormatsEnum.SingleElimination,
  );
  const singleEliminationRounds = singleEliminationSequence?.pools[0]?.rounds;
  const movingCourtToMatchId =
    nextRoundRobinMatchWithoutCourt?.id || nextSingleEliminationMatchWithoutCourt?.id;
  const upcomingSequenceCount = Math.max(
    (activeGroup?.sequences?.filter((sequence) => !sequence.isSequenceComplete).length || 0) - 1, // Subtract 1 for active sequence
    0,
  );
  const totalIncompleteSequences = activeGroup?.sequences.filter(
    (sequence) => !sequence.isSequenceComplete,
  ).length;
  const isOnFinalSequence = totalIncompleteSequences === 1;
  const activeSequence = activeGroup?.sequences.find((sequence) => !sequence.isSequenceComplete);
  const groupCompletionPercent = calculateGroupCompletion({
    totalMatchesCount: allMatches.length,
    completedMatchesCount: completedRoundRobinMatches.length,
    upcomingSequenceCount,
  });
  const hasOneActiveMatch = allActiveMatches.length === 1;
  const hasNoUpcomingGames = allMatchesNotStarted.length === 0;
  const isFinalSequenceAboutToComplete =
    isOnFinalSequence && hasOneActiveMatch && hasNoUpcomingGames;
  const hasMultipleSequences = activeGroup?.sequences.length > 1;
  const isFinalSequenceAutoComplete =
    hasMultipleSequences &&
    activeGroup?.sequences[activeGroup?.sequences.length - 1].competitionFormat !==
      CompetitionFormatsEnum.RoundRobin;
  const shouldReleaseCourts =
    isOnFinalSequence && isFinalSequenceAutoComplete && isFinalSequenceAboutToComplete;
  const shouldCompleteSequence = shouldReleaseCourts;
  const isGroupComplete = totalIncompleteSequences === 0;

  const refetchEvent = async () => {
    return getGamedayByEventIdLazyQuery({
      fetchPolicy: 'cache-and-network',
      variables: {
        id: router.query.idOrSlug as string,
      },
    });
  };

  const scrollToTopOfMatchList = () => {};
  if (matchListContainerRef.current && topActiveMatchRef.current) {
    const container = matchListContainerRef.current;
    const activeItem = topActiveMatchRef.current;
    const distanceFromTop = activeItem.offsetTop - container.offsetTop;

    setTimeout(() => {
      container.scrollTop = distanceFromTop;
    }, 1);
  }

  return (
    <>
      <Head title={`Gameday: ${event?.title}`.trim()} />
      <div className="h-safe-screen flex grow flex-col overflow-hidden">
        <div className="flex items-center px-ds-lg py-ds-xs">
          <Link className="flex items-center justify-center p-1.5" href={getEventUrl(event?.id)}>
            <ChevronLeft className="w-6" />
          </Link>
          <h1 className="typography-product-subheading ml-ds-sm truncate">
            {event?.title ? event.title : ''}
          </h1>
        </div>
        <div className="px-ds-lg pb-ds-md">
          <select
            className="input-form"
            onChange={(e) => {
              setActiveGroupIndex(parseInt(e.target.value, 10));
              setActiveSliderTabIndex(0);
            }}
          >
            {groups.map((group, index) => (
              <option key={group.id} value={index}>
                {group.titleWithTime}
              </option>
            ))}
          </select>
        </div>
        <GradientBackground className="flex grow flex-col overflow-y-hidden">
          <div className="px-4 pt-ds-md">
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
          {activeSliderTabIndex === 0 &&
            (!!courts?.length ? (
              <div className="scroll flex space-x-4 overflow-x-auto whitespace-nowrap px-4 pb-4 pt-ds-md">
                {courts.map((court) => (
                  <Court
                    eventId={event?.id || ''}
                    isUserOrganizer={isUserOrganizer}
                    key={court.id}
                    courtId={court.id}
                    courtNumber={court.courtNumber}
                    activeMatch={court.activeMatch}
                    assignCourtId={assignCourtId}
                    setAssignCourtId={setAssignCourtId}
                    scoreMatchId={scoreMatchId}
                    setScoreMatchId={setScoreMatchId}
                  />
                ))}
              </div>
            ) : !activeGroup || isGroupComplete ? null : (
              <div className="p-4">
                <div className="rounded-xl border border-color-border-card-lightmode bg-color-bg-lightmode-primary p-4 text-center shadow-sm dark:border-color-border-card-lightmode dark:bg-color-bg-darkmode-primary">
                  <div className="text-sm">
                    {!!activeGroup?.startsAt && (
                      <h3>
                        <div className="font-medium">Scheduled start time</div>
                        <div className="text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                          {formatDate(new Date(activeGroup.startsAt))}
                        </div>
                      </h3>
                    )}
                    {isUserOrganizer && (
                      <>
                        <div className="mt-2 text-xs">
                          You must assign courts to start the event
                        </div>
                        <div className="mt-2">
                          <Button
                            variant="brand"
                            size="md"
                            isInline
                            onClick={() => openModalStartGroup()}
                          >
                            Assign courts and start event
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {activeSliderTabIndex === 1 && (
            <PoolResults
              matches={completedRoundRobinMatches}
              groupId={activeGroup?.id}
              shouldShowBracketButton={isRoundRobinMatchesComplete && !isRoundRobinSequenceComplete}
              refetchEvent={async () => {
                await refetchEvent();
                setActiveSliderTabIndex(2);
              }}
            />
          )}
          {activeSliderTabIndex === 2 && (
            <Bracket
              isUserOrganizer={isUserOrganizer}
              rounds={singleEliminationRounds}
              setAssignCourtId={setAssignCourtId}
              setScoreMatchId={setScoreMatchId}
              seeding={singleEliminationSequence?.seeding}
            />
          )}
        </GradientBackground>
      </div>
      <div
        className={classNames(
          'fixed left-0 top-0 z-10 flex h-10 w-full grow items-center justify-between bg-color-bg-lightmode-primary px-ds-lg dark:bg-color-bg-darkmode-primary',
          isExpanded ? 'block' : 'hidden',
        )}
      >
        <div className="typography-product-subheading">
          {activeGroup?.title ? activeGroup.title : ''}
        </div>
        <div className="typography-product-button-label-small rounded-full bg-color-text-lightmode-secondary px-ds-md py-ds-xs text-color-text-lightmode-invert">
          {groupCompletionPercent}%
        </div>
      </div>
      {activeSliderTabIndex === 0 && (
        <div
          className={classNames(
            'fixed bottom-0 left-0 z-20 h-full w-full overflow-hidden pt-10 transition-all duration-300',
            isExpanded ? 'max-h-screen' : 'max-h-[calc(100vh-28rem)]',
          )}
        >
          <div className="flex h-full flex-col rounded-t-[1.25rem] bg-color-bg-lightmode-primary shadow-[0px_-4px_20px_0px_rgba(79,28,0,0.16)] dark:bg-color-bg-darkmode-primary">
            <MatchesList
              eventId={event?.id || ''}
              isUserOrganizer={isUserOrganizer}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              assignCourtId={assignCourtId}
              setAssignCourtId={setAssignCourtId}
              scoreMatchId={scoreMatchId}
              setScoreMatchId={setScoreMatchId}
              courts={[...courtsForGroup].sort((a, b) => a.courtNumber - b.courtNumber)}
              /**
               * @note is it better calling this games?
               */
              matches={roundRobinMatches || []}
              topActiveMatchId={topActiveMatch?.id}
              topActiveMatchRef={topActiveMatchRef}
              matchListContainerRef={matchListContainerRef}
              lastMatchPerRound={lastMatchPerRound}
            />
          </div>
        </div>
      )}
      <ModalAssignCourt
        isOpen={!!assigningCourtToMatch}
        handleClose={() => setAssignCourtId('')}
        courts={[...courtsForGroup].sort((a, b) => a.courtNumber - b.courtNumber)}
        assigningCourtToMatch={assigningCourtToMatch}
      />
      <ModalAddScore
        courts={courts}
        settingScoreFotMatch={settingScoreFotMatch}
        isOpen={!!scoreMatchId}
        handleClose={() => setScoreMatchId('')}
        movingCourtToMatchId={movingCourtToMatchId}
        winningTeamNextMatch1Id={winningTeamNextMatch1Id}
        winningTeamNextMatch2Id={winningTeamNextMatch2Id}
        losingTeamNextMatch1Id={losingTeamNextMatch1Id}
        losingTeamNextMatch2Id={losingTeamNextMatch2Id}
        refetchEvent={async () => {
          /**
           * @note We should optimistically update the cache so we don't have to refetch
           */

          const additionalPromises: Promise<any>[] = [];

          if (shouldReleaseCourts && activeGroup?.id) {
            additionalPromises.push(
              updateReleaseCourtsFromGroupMutation({
                variables: {
                  activeEventGroupId: activeGroup.id,
                },
              }),
            );
          }

          if (shouldCompleteSequence && activeSequence?.id) {
            additionalPromises.push(
              updateCompleteSequenceMutation({ variables: { id: activeSequence.id } }),
            );
          }

          await Promise.all(additionalPromises);
          await refetchEvent();
          scrollToTopOfMatchList();
        }}
      />
      <ModalStartGroup
        isOpen={isStartGroupOpen}
        handleClose={() => closeModalStartGroup()}
        numberOfEstimatedCourts={
          activeGroup?.numberOfEstimatedCourts ||
          (activeGroup?.teamLimit && Math.floor(activeGroup?.teamLimit / 2)) ||
          DEFAULT_NUMBER_OF_COURTS
        }
        allCourts={allCourtsForEvent || []}
        groups={event?.groups || []}
        matches={allRoundRobinMatchesNotStarted}
        /**
         * @todo some way to be smarter about getting the active pool?
         */
        poolId={activeGroup?.sequences[0]?.pools[0]?.id || ''}
        groupId={activeGroup?.id || ''}
        refetchEvent={async () => {
          /**
           * @note We should optimistically update the cache so we don't have to refetch
           */
          await refetchEvent();
          scrollToTopOfMatchList();
        }}
      />
      <ModalLogin isShowSignupLink isPreventClose />
      <ModalSignup isShowLoginLink isPreventClose />
    </>
  );
}
