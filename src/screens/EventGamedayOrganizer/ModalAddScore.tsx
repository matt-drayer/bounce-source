import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Sentry from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import {
  UpdateGameScoreMutationVariables,
  UpdateSingleEliminationMatchProgressionMutationVariables,
  WinReasonsEnum,
  useSetMatchScoresFreeCourtMutation,
  useSetMatchScoresMutation,
  useSetMatchScoresUpdateNextMatchCourtMutation,
  useUpdateGameScoreMutation,
  useUpdateSingleEliminationMatchProgressionMutation,
} from 'types/generated/client';
import { nameToFirstInitials } from 'utils/shared/name/nameToFirstInitials';
import { useRequestStatus } from 'hooks/useRequestStatus';
import CloseIcon from 'svg/CloseIcon';
import Minus from 'svg/Minus';
import { Button } from 'components/Button';
import Modal, { ModalProps } from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';
import { CourtsType, MatchStatus, MatchType } from './types';
import { preventNumberChangeOnWheel } from './utils';

const TEAM1_FIELD = 'team1Score';
const TEAM2_FIELD = 'team2Score';

const formSchema = z.object({
  [TEAM1_FIELD]: z.number(),
  [TEAM2_FIELD]: z.number(),
});

export type FormData = z.infer<typeof formSchema>;

interface Props extends ModalProps {
  courts: CourtsType;
  settingScoreFotMatch: MatchType | null | undefined;
  movingCourtToMatchId?: string;
  refetchEvent?: () => Promise<void>;
  winningTeamNextMatch1Id?: string;
  winningTeamNextMatch2Id?: string;
  losingTeamNextMatch1Id?: string;
  losingTeamNextMatch2Id?: string;
}

export default function ModalAssignCourt({
  isOpen,
  handleClose,
  courts,
  settingScoreFotMatch,
  movingCourtToMatchId,
  refetchEvent,
  winningTeamNextMatch1Id,
  winningTeamNextMatch2Id,
  losingTeamNextMatch1Id,
  losingTeamNextMatch2Id,
}: Props) {
  const { isLoading, setLoading, setSuccess, setError } = useRequestStatus();
  const {
    handleSubmit,
    register,
    formState,
    reset: resetFormState,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const [
    updateGameScoreMutation,
    { loading: isUpdateScoreLoading, reset: resetUpdateScoreMutation },
  ] = useUpdateGameScoreMutation();
  const [
    setMatchScoresFreeCourtMutation,
    { loading: insertScoresFreeLoading, error: errorScoresFree, reset: resetScoresFreeMutation },
  ] = useSetMatchScoresFreeCourtMutation();
  const [
    setMatchScoresUpdateNextMatchCourtMutation,
    {
      loading: insertScoresCourtsLoading,
      error: errorScoresCourts,
      reset: resetScoresCourtsMutation,
    },
  ] = useSetMatchScoresUpdateNextMatchCourtMutation();
  const [
    setMatchScoresMutation,
    { loading: insertScoresLoading, error: errorScores, reset: resetScoresMutation },
  ] = useSetMatchScoresMutation();
  const [
    updateSingleEliminationMatchProgressionMutation,
    {
      loading: updateSingleEliminationMatchProgressionLoading,
      reset: resetUpdateSingleEliminationMatchProgression,
    },
  ] = useUpdateSingleEliminationMatchProgressionMutation();
  const team1 = settingScoreFotMatch?.team1;
  const team2 = settingScoreFotMatch?.team2;
  const isDisabled =
    isUpdateScoreLoading ||
    insertScoresLoading ||
    insertScoresFreeLoading ||
    insertScoresCourtsLoading ||
    updateSingleEliminationMatchProgressionLoading ||
    isLoading;

  useEffect(() => {
    resetFormState({
      team1Score: undefined,
      team2Score: undefined,
    });

    if (settingScoreFotMatch && isOpen) {
      const team1Score = settingScoreFotMatch?.games?.[0]?.team1Score;
      const team2Score = settingScoreFotMatch?.games?.[0]?.team2Score;

      if (team1Score || team2Score) {
        resetFormState({
          team1Score: team1Score || 0,
          team2Score: team2Score || 0,
        });
      }
    }
  }, [settingScoreFotMatch, isOpen]);

  return (
    <Modal isOpen={isOpen} handleClose={() => !isDisabled && handleClose()}>
      <div className="px-4 pt-6">
        <div className="flex w-full items-center justify-between">
          <div className="typography-product-heading">Add score</div>
          <button
            type="button"
            onClick={() => {
              handleClose();
              resetFormState();
            }}
            className="flex items-center justify-center rounded-full p-1.5 transition-colors hover:bg-color-bg-lightmode-secondary dark:hover:bg-color-bg-darkmode-secondary"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="typography-product-subheading mt-ds-xl w-full text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {typeof settingScoreFotMatch?.courtNumber === 'number'
            ? `Court ${settingScoreFotMatch.courtNumber}`
            : 'Match'}
        </div>
        <div
          className={classNames(
            'mt-ds-sm flex w-full flex-col justify-center whitespace-nowrap rounded-lg border-b border-color-border-card-lightmode dark:border-color-border-card-darkmode',
            (!settingScoreFotMatch?.status ||
              settingScoreFotMatch.status === MatchStatus.Upcoming) &&
              'bg-color-bg-lightmode-primary shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] dark:bg-color-bg-darkmode-primary',
            settingScoreFotMatch?.status === MatchStatus.UpNext &&
              'border-color-border-card-lightmode bg-brand-fire-200 text-color-text-lightmode-primary dark:border-color-border-card-darkmode',
            settingScoreFotMatch?.status === MatchStatus.Active &&
              'bg-color-bg-lightmode-brand text-color-text-lightmode-invert shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] dark:bg-color-bg-darkmode-brand',
            settingScoreFotMatch?.status === MatchStatus.Complete &&
              'bg-color-bg-lightmode-secondary text-color-text-lightmode-primary dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-primary',
          )}
        >
          <div className="flex items-center">
            <div className="w-1/2 truncate p-2">
              {team1?.members?.map((member) => (
                <div key={member.id} className="typography-product-caption truncate text-ellipsis">
                  {nameToFirstInitials(member?.userProfile?.fullName || '')}
                </div>
              ))}
            </div>
            <div className="typography-product-button-label-small min-w-10 shrink-0 p-2">
              <div>Add</div>
              <div>score</div>
            </div>
            <div className="w-1/2 truncate p-2">
              {team2?.members?.map((member) => (
                <div key={member.id} className="typography-product-caption truncate text-ellipsis">
                  {nameToFirstInitials(member?.userProfile?.fullName || '')}
                </div>
              ))}
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            if (isDisabled) {
              return;
            }

            if (!settingScoreFotMatch?.id) {
              toast.error('No valid match ID found');
              return;
            }

            if (!team1?.id || !team2?.id) {
              toast.error('Error with teams');
              Sentry.captureMessage(
                'Error with teams: setting score without 2 valid teams. Match ID: ' +
                  settingScoreFotMatch.id,
              );
              return;
            }

            const team1Score = data.team1Score;
            const team2Score = data.team2Score;

            if (team1Score === team2Score) {
              toast.error('Game can not end in a tie');
              return;
            }

            const existingGame = settingScoreFotMatch?.games?.[0];
            const hasExistingGame = !!existingGame;

            const winningTeamId = team1Score > team2Score ? team1.id : team2.id;
            const losingTeamId = team1Score < team2Score ? team1.id : team2.id;
            const courtBecomingAvailable =
              // Move the current court
              courts.find((court) => court.activeMatch?.id === settingScoreFotMatch.id) ||
              // Move the next court becoming available
              courts.filter((court) => !court.activeMatch)[0];

            try {
              setLoading();

              const scoreData = {
                losingTeamId: losingTeamId,
                matchId: settingScoreFotMatch.id,
                team1Id: team1.id,
                team1Score: team1Score,
                team2Id: team2.id,
                team2Score: team2Score,
                winReason: WinReasonsEnum.Score,
                winningTeamId: winningTeamId,
                data: [
                  {
                    teamId: team1.id,
                    score: team1Score,
                  },
                  {
                    teamId: team2.id,
                    score: team2Score,
                  },
                ],
              };

              /**
               * @note We should optimistically update the cache on inserts so we don't have to refetch
               */
              if (existingGame) {
                const scoreUpdates = (existingGame.scores || []).map(
                  (score): UpdateGameScoreMutationVariables['updates'] => {
                    if (score.teamId === team1.id) {
                      return {
                        where: {
                          id: { _eq: score.id },
                        },
                        _set: {
                          score: team1Score,
                        },
                      };
                    }
                    if (score.teamId === team2.id) {
                      return {
                        where: {
                          id: { _eq: score.id },
                        },
                        _set: {
                          score: team2Score,
                        },
                      };
                    }
                    return null;
                  },
                );
                const filteredScoreUpdates = (scoreUpdates || []).filter(
                  (su) => !!su,
                ) as UpdateGameScoreMutationVariables['updates'];

                await updateGameScoreMutation({
                  variables: {
                    updates: filteredScoreUpdates,
                    winningTeamId,
                    losingTeamId,
                    matchWinningTeamId: winningTeamId,
                    matchLosingTeamId: losingTeamId,
                    team1Score,
                    team2Score,
                    matchId: settingScoreFotMatch.id,
                    gameId: existingGame.id,
                  },
                });
              } else if (courtBecomingAvailable && movingCourtToMatchId) {
                await setMatchScoresUpdateNextMatchCourtMutation({
                  variables: {
                    ...scoreData,
                    courtId: courtBecomingAvailable.id,
                    courtNumber: courtBecomingAvailable.courtNumber || -1,
                    nextMatchId: movingCourtToMatchId,
                  },
                });
              } else if (courtBecomingAvailable) {
                await setMatchScoresFreeCourtMutation({
                  variables: {
                    ...scoreData,
                    courtId: courtBecomingAvailable.id,
                  },
                });
              } else {
                await setMatchScoresMutation({
                  variables: {
                    ...scoreData,
                  },
                });
              }
            } catch (error) {
              Sentry.captureException(error);
              if (error instanceof Error) {
                setError(error.message);
              } else {
                setError('');
              }
            }

            try {
              const updates: UpdateSingleEliminationMatchProgressionMutationVariables['updates'] =
                [];
              if (winningTeamNextMatch1Id) {
                updates.push({
                  _set: {
                    team1Id: winningTeamId,
                  },
                  where: {
                    id: { _eq: winningTeamNextMatch1Id },
                  },
                });
              }
              if (winningTeamNextMatch2Id) {
                updates.push({
                  _set: {
                    team2Id: winningTeamId,
                  },
                  where: {
                    id: { _eq: winningTeamNextMatch2Id },
                  },
                });
              }
              if (losingTeamNextMatch1Id) {
                updates.push({
                  _set: {
                    team1Id: losingTeamId,
                  },
                  where: {
                    id: { _eq: losingTeamNextMatch1Id },
                  },
                });
              }
              if (losingTeamNextMatch2Id) {
                updates.push({
                  _set: {
                    team2Id: losingTeamId,
                  },
                  where: {
                    id: { _eq: losingTeamNextMatch2Id },
                  },
                });
              }

              if (updates.length) {
                await updateSingleEliminationMatchProgressionMutation({
                  variables: {
                    updates,
                  },
                });
              }
            } catch (error) {
              Sentry.captureException(error);
              toast.error('Setting next single elimination match');
            }

            if (refetchEvent) {
              try {
                await refetchEvent();
              } catch (error) {
                Sentry.captureException(error);
                if (error instanceof Error) {
                  setError(error.message);
                } else {
                  setError('');
                }
              }
            }

            handleClose();
            setSuccess();
            resetFormState();
            // -- reset all mutations
            resetScoresFreeMutation();
            resetScoresCourtsMutation();
            resetScoresMutation();
            resetUpdateSingleEliminationMatchProgression();
            resetUpdateScoreMutation();

            /**
             * @todo Eager response instead of refetch?
             * @todo Send players notifications for next game, or do in webhook?
             */
          })}
        >
          <div className="mt-8 flex items-center">
            <div className="w-1/2">
              <label htmlFor={TEAM1_FIELD} className="sr-only">
                Score for {team1?.members?.join(', ')}
              </label>
              <input
                {...register(TEAM1_FIELD, { required: true, valueAsNumber: true, min: 0 })}
                disabled={isDisabled}
                className="input-form hide-number-stepper text-center"
                placeholder="0"
                type="number"
                min={0}
                step={1}
                required
                onWheel={preventNumberChangeOnWheel}
              />
            </div>
            <div className="mx-4 shrink-0">
              <Minus className="w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
            </div>
            <div className="w-1/2">
              <label htmlFor={TEAM2_FIELD} className="sr-only">
                Score for {team2?.members?.join(', ')}
              </label>
              <input
                {...register(TEAM2_FIELD, { required: true, valueAsNumber: true, min: 0 })}
                disabled={isDisabled}
                className="input-form hide-number-stepper text-center"
                placeholder="0"
                type="number"
                min={0}
                step={1}
                required
                onWheel={preventNumberChangeOnWheel}
              />
            </div>
          </div>
          <div className="mt-ds-3xl shrink-0 space-y-ds-lg pb-ds-xl">
            {/* <Button variant="secondary" size="lg" onClick={() => {}}>
            Forfeit
          </Button> */}
            <Button type="submit" variant="primary" size="lg" disabled={isDisabled}>
              Apply
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
