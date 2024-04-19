import React, { useEffect, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import {
  EventCourtStatusesEnum,
  GetGamedayByEventIdQuery,
  UpdateCourtsStartGroupMutationVariables,
  UpdatedUnassignCourtMutationVariables,
  useUpdateCourtsStartGroupMutation,
  useUpdatedUnassignCourtMutation,
} from 'types/generated/client';
import { nameToFirstInitials } from 'utils/shared/name/nameToFirstInitials';
import CloseIcon from 'svg/CloseIcon';
import CourtFlat from 'svg/CourtFlat';
import { Button, ButtonText } from 'components/Button';
import Modal, { ModalProps } from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';
import { CourtsType, MatchStatus, MatchType } from './types';
import { preventNumberChangeOnWheel } from './utils';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  numberOfEstimatedCourts: number;
  allCourts: NonNullable<GetGamedayByEventIdQuery['eventsByPk']>['courts'];
  groups: NonNullable<GetGamedayByEventIdQuery['eventsByPk']>['groups'];
  matches: MatchType[];
  poolId: string;
  groupId: string;
  refetchEvent?: () => Promise<void>;
}

const formSchema = z.object({
  numberOfCourts: z.number().int().positive(),
});

export type FormData = z.infer<typeof formSchema>;

/**
 * @note could query for courts when you open modal instead of intial query
 */
export default function ModalStartGroup({
  isOpen,
  handleClose,
  numberOfEstimatedCourts,
  allCourts,
  groups,
  matches,
  poolId,
  groupId,
  refetchEvent,
}: Props) {
  const [
    updatedUnassignCourtMutation,
    { loading: isLoadingUnassignCourt, reset: resetUnassignCourt },
  ] = useUpdatedUnassignCourtMutation();
  const [
    updateCourtsStartGroupMutation,
    { loading: isLoadingCourtsStartGroup, reset: resetCourtsStartGroup },
  ] = useUpdateCourtsStartGroupMutation();
  const { register, handleSubmit, reset: resetForm } = useForm();
  const [shouldShowAllCourts, setShouldShowAllCourts] = useState(false);
  const allCourtsAndGroupData = allCourts.map((court) => {
    const group = groups.find((group) => group.id === court.activeEventGroupId);
    return {
      ...court,
      group,
    };
  });
  const availableCourts = allCourtsAndGroupData
    .filter(
      (court) => !court.activeEventGroupId && court.courtStatus === EventCourtStatusesEnum.Active,
    )
    .sort((a, b) => a.courtNumber - b.courtNumber);
  const courtsBeingUsed = allCourtsAndGroupData
    .filter(
      (court) => !!court.activeEventGroupId && court.courtStatus === EventCourtStatusesEnum.Active,
    )
    .sort((a, b) => a.courtNumber - b.courtNumber);
  const numberOfAvailableCourts = availableCourts.length;
  const hasEnoughCourts = numberOfAvailableCourts >= numberOfEstimatedCourts;
  const isDisabled = isLoadingUnassignCourt || isLoadingCourtsStartGroup;

  useEffect(() => {
    if (isOpen && hasEnoughCourts) {
      resetForm({
        numberOfCourts: numberOfEstimatedCourts,
      });
    }
  }, [isOpen, hasEnoughCourts, numberOfEstimatedCourts]);

  useEffect(() => {
    setShouldShowAllCourts(false);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <form
        onSubmit={handleSubmit(async (data) => {
          if (isDisabled) {
            return;
          }

          if (data.numberOfCourts === 0) {
            toast.error('No courts selected');
          }

          if (data.numberOfCourts > numberOfAvailableCourts) {
            toast.error('Not enough courts available');
          }

          const courtUpdates: UpdateCourtsStartGroupMutationVariables['courtUpdates'] = [];
          const matchUpdates: UpdateCourtsStartGroupMutationVariables['matchUpdates'] = [];

          for (let i = 0; i < data.numberOfCourts; i++) {
            const court = availableCourts[i];
            courtUpdates.push({
              _set: {
                activeEventGroupId: groupId,
                activeEventGroupPoolId: poolId,
                activeMatchId: matches[i].id,
              },
              where: {
                id: { _eq: court.id },
              },
            });
            matchUpdates.push({
              _set: {
                eventCourtId: court.id,
                courtNumber: court.courtNumber,
              },
              where: {
                id: { _eq: matches[i].id },
              },
            });
          }

          await updateCourtsStartGroupMutation({
            variables: {
              courtUpdates,
              matchUpdates,
            },
          });

          if (refetchEvent) {
            await refetchEvent();
          }

          handleClose();
          resetForm();
          resetUnassignCourt();
          resetCourtsStartGroup();
        })}
        className="px-4 pt-6"
      >
        <div className="flex w-full items-center justify-between">
          <div className="typography-product-heading">Start event</div>
          <button
            type="button"
            onClick={() => {
              handleClose();
            }}
            className="flex items-center justify-center rounded-full p-1.5 transition-colors hover:bg-color-bg-lightmode-secondary dark:hover:bg-color-bg-darkmode-secondary"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-ds-md flex items-center text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          <CourtFlat className="mr-2 h-4 text-color-bg-lightmode-icon dark:text-color-bg-darkmode-icon" />
          {numberOfAvailableCourts}/{numberOfAvailableCourts + courtsBeingUsed.length} courts
          available
        </div>
        <div className="typography-product-subheading mb-ds-sm mt-ds-md w-full text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          Assign number of courts
        </div>
        <div>
          <input
            {...register('numberOfCourts', {
              required: true,
              valueAsNumber: true,
              min: 1,
              max: numberOfAvailableCourts,
            })}
            className="input-form text-center"
            placeholder="Number of courts"
            type="number"
            onWheel={preventNumberChangeOnWheel}
            min={1}
            max={numberOfAvailableCourts}
            required
          />
        </div>
        {shouldShowAllCourts ? (
          <div>
            <div className="typography-product-subheading mb-ds-sm mt-ds-md w-full text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              Courts being used
            </div>
            <div className="flex flex-col gap-4">
              {courtsBeingUsed.map((court) => (
                <div className="flex items-center justify-between">
                  <div key={court.id} className="flex w-full items-center text-sm">
                    <CourtFlat className="mr-1 h-4" />
                    <span className="min-w-[2rem]">{court.courtNumber}</span>
                    <span>{court.group?.title}</span>
                    <div className="ml-2 flex shrink-0 items-center text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      {court.activeMatchId ? (
                        <span className="flex shrink-0 items-center">
                          <div className="mr-1 h-1.5 w-1.5 rounded-full bg-color-error">&nbsp;</div>{' '}
                          Has match
                        </span>
                      ) : (
                        <span className="flex shrink-0 items-center">
                          <div className="mr-1 h-1.5 w-1.5 shrink-0 rounded-full bg-color-success">
                            &nbsp;
                          </div>{' '}
                          Empty
                        </span>
                      )}
                    </div>
                  </div>
                  <ButtonText
                    disabled={isDisabled}
                    onClick={() => {
                      if (isDisabled) {
                        return;
                      }
                      updatedUnassignCourtMutation({
                        variables: {
                          id: court.id,
                        },
                      });
                    }}
                    className="flex shrink-0 flex-nowrap items-center rounded-lg border border-color-text-lightmode-primary py-1 pl-1 pr-1.5 text-xs leading-none disabled:opacity-50 dark:border-color-text-darkmode-primary"
                  >
                    <CloseIcon className="h-3.5" /> Free Court
                  </ButtonText>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full text-center">
            <ButtonText
              onClick={() => setShouldShowAllCourts(true)}
              className="typography-product-button-label-medium mt-4 text-color-brand-primary"
            >
              Show all courts
            </ButtonText>
          </div>
        )}
        <div className="mt-ds-2xl shrink-0 pb-ds-xl">
          <Button type="submit" variant="primary" size="lg" disabled={isDisabled}>
            Assign courts and start event
          </Button>
        </div>
      </form>
    </Modal>
  );
}
