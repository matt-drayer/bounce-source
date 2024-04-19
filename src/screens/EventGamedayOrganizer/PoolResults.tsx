import React from 'react';
import { Disclosure } from '@headlessui/react';
import { rankTeams } from 'utils/shared/brackets/rankTeams';
import { nameToFirstInitials } from 'utils/shared/name/nameToFirstInitials';
import { useApiGateway } from 'hooks/useApi';
import { useRequestStatus } from 'hooks/useRequestStatus';
import ChevronDown from 'svg/ChevronDownSmall';
import Button from 'components/Button';
import classNames from 'styles/utils/classNames';
import { MatchType } from './types';

interface Props {
  matches: MatchType[];
  groupId?: string;
  shouldShowBracketButton?: boolean;
  refetchEvent?: () => Promise<void>;
}

export default function PoolResults({
  matches,
  groupId,
  shouldShowBracketButton,
  refetchEvent,
}: Props) {
  const rankedTeams = rankTeams(matches);
  const { setLoading, isLoading: isFullProcessLoading, setSuccess } = useRequestStatus();
  const { post: createBracketFetch, isLoading } = useApiGateway<{ groupId: string }>(
    '/v1/tournaments/generate-single-elimination',
  );
  const isDisiabled = isLoading || isFullProcessLoading;
  const canCreateBracket = !!groupId;

  return (
    <>
      <div className="flex flex-auto flex-col overflow-y-auto px-4 pb-ds-3xl pt-ds-lg">
        <div className="divide-y divide-color-border-card-lightmode rounded-lg border border-color-border-card-lightmode bg-color-bg-lightmode-primary dark:divide-color-border-card-darkmode dark:bg-color-bg-darkmode-primary">
          <div className="flex h-10 w-full grow items-center">
            <div className="typography-product-chips-filters w-full grow pl-2 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
              Team
            </div>
            <div className="typography-product-chips-filters w-14 shrink-0 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
              W - L
            </div>
            <div className="typography-product-chips-filters w-14 shrink-0 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
              Points
            </div>
            <div className="typography-product-chips-filters w-14 shrink-0 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
              +/- Diff
            </div>
            <div className="w-9 shrink-0">&nbsp;</div>
          </div>
          {rankedTeams.map((team) => {
            return (
              <Disclosure key={team.id} as="div">
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      key={team.id}
                      className={classNames(
                        'block w-full transition-shadow',
                        open && 'shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)]',
                      )}
                    >
                      <div className="flex items-center text-left">
                        <div
                          className={classNames(
                            'typography-product-caption w-full grow truncate py-2 pl-2 text-left',
                            open
                              ? 'typography-product-button-label-small text-color-tab-active'
                              : 'typography-product-caption',
                          )}
                        >
                          {team.members.map((member, i) => (
                            <div key={member.id} className="truncate">
                              {member.userProfile?.fullName
                                ? nameToFirstInitials(member.userProfile.fullName)
                                : `Player ${i + 1}`}
                            </div>
                          ))}
                        </div>
                        <div className="typography-product-button-label-small w-14 shrink-0">
                          {team.matchWins} - {team.matchLosses}
                        </div>
                        <div className="typography-product-button-label-small w-14 shrink-0">
                          {team.pointsFor}
                        </div>
                        <div className="typography-product-button-label-small w-14 shrink-0">
                          {team.pointsFor - team.pointsAgainst}
                        </div>
                        <div className="w-9 shrink-0 px-ds-sm">
                          <ChevronDown
                            className={classNames(
                              'w-5 text-color-text-lightmode-secondary transition-transform dark:text-color-text-darkmode-secondary',
                              open ? 'rotate-180' : 'rotate-0',
                            )}
                          />
                        </div>
                      </div>
                    </Disclosure.Button>
                    <Disclosure.Panel
                      static
                      className={classNames(
                        'grid text-sm text-gray-500 transition-all',
                        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <div className="overflow-hidden pl-2">
                        <div>
                          {team.matches.map((match) => {
                            if (!team.id) {
                              return null;
                            }

                            let teamPlayed:
                              | {
                                  id: string;
                                  members: {
                                    id: string;
                                    userProfile: { id: string; fullName?: string };
                                  }[];
                                }
                              | null
                              | undefined = null;

                            if (match.team1?.id && match.team1?.id !== team.id) {
                              teamPlayed = match.team1;
                            } else if (match.team2?.id && match.team2?.id !== team.id) {
                              teamPlayed = match.team2;
                            }

                            if (!teamPlayed) {
                              return null;
                            }

                            return (
                              <div key={match.id} className="flex items-center">
                                <div className="p-ds-md">
                                  {match.games.map((game) => {
                                    const currentTeamScore =
                                      team.id === game.team1Id ? game.team1Score : game.team2Score;
                                    const opponentScore =
                                      team.id === game.team1Id ? game.team2Score : game.team1Score;
                                    const didWin = team.id === game.winningTeamId;

                                    return (
                                      <div
                                        className={classNames(
                                          'typography-product-chips-filters flex items-center justify-center rounded-full px-2 py-1',
                                          didWin
                                            ? 'bg-brand-fire-100 text-color-text-brand'
                                            : 'bg-color-bg-lightmode-secondary text-color-text-lightmode-secondary dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-secondary',
                                        )}
                                      >
                                        {currentTeamScore}
                                        <span className="px-0.5">-</span>
                                        {opponentScore}
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="typography-product-caption truncate p-2 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                                  {teamPlayed.members.map((member, i) => (
                                    <div key={member.id} className="truncate">
                                      {member.userProfile?.fullName
                                        ? nameToFirstInitials(member.userProfile.fullName)
                                        : `Player ${i + 1}`}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            );
          })}
        </div>
      </div>
      {canCreateBracket && shouldShowBracketButton && (
        <div className="fixed bottom-8 w-full px-4">
          <Button
            variant="primary"
            onClick={async () => {
              if (isDisiabled) {
                return;
              }

              setLoading();

              await createBracketFetch({
                payload: {
                  groupId,
                },
              });

              if (refetchEvent) {
                await refetchEvent();
              }

              setSuccess();
            }}
            size="lg"
            disabled={isDisiabled}
          >
            Create elimination bracket
          </Button>
        </div>
      )}
    </>
  );
}
