import React, { useEffect, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import {
  useAssignCourtToMatchMutation,
  useUpdateRemoveCourtFromMatchMutation,
} from 'types/generated/client';
import { nameToFirstInitials } from 'utils/shared/name/nameToFirstInitials';
import CloseIcon from 'svg/CloseIcon';
import CourtFlat from 'svg/CourtFlat';
import { Button } from 'components/Button';
import Modal, { ModalProps } from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';
import { CourtsType, MatchStatus, MatchType } from './types';

interface CourtSelectionProps {
  selectedCourt: string;
  onCourtChange: (courtId: string) => void;
  courts: CourtsType;
  assigningCourtToMatch: MatchType | null | undefined;
}

const CourtSelection: React.FC<CourtSelectionProps> = ({
  selectedCourt,
  onCourtChange,
  courts,
  assigningCourtToMatch,
}) => {
  const availableCourts = (courts || []).filter(
    (court) =>
      !court.activeMatch ||
      (!!assigningCourtToMatch && court.activeMatch.id === assigningCourtToMatch.id),
  );

  return (
    <RadioGroup
      value={selectedCourt}
      onChange={(value) => {
        onCourtChange(value);
      }}
      className="mt-6"
    >
      <RadioGroup.Label className="typography-product-subheading w-full text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
        Available courts
      </RadioGroup.Label>
      <div className="mt-2 grid grid-cols-4 gap-4">
        {availableCourts.map((court) => (
          <RadioGroup.Option key={court.id} value={court.id}>
            {() => (
              <span
                className={classNames(
                  'typography-product-chips-filters flex h-10 items-center justify-center gap-1.5 rounded-md',
                  selectedCourt === court.id
                    ? 'bg-color-bg-lightmode-invert text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert'
                    : 'bg-color-bg-lightmode-secondary text-color-text-lightmode-secondary dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-secondary',
                )}
              >
                <CourtFlat className="h-4" />
                <span>{court.courtNumber}</span>
              </span>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

interface Props extends ModalProps {
  courts: CourtsType;
  assigningCourtToMatch: MatchType | null | undefined;
}

export default function ModalAssignCourt({
  isOpen,
  handleClose,
  courts,
  assigningCourtToMatch,
}: Props) {
  const [assignCourtToMatchMutation, { data, loading: isLoadingAssignCourt, error }] =
    useAssignCourtToMatchMutation();
  const [updateRemoveCourtFromMatchMutation, { loading: isLoadingRemoveCourt }] =
    useUpdateRemoveCourtFromMatchMutation();
  const [selectedCourt, setSelectedCourt] = useState('');
  const matchingCourt = courts.find((court) => court.activeMatch?.id === assigningCourtToMatch?.id);
  const previouslyAssignedCourt = matchingCourt;
  const leftPlayNames = assigningCourtToMatch?.team1?.members.map(
    ({ userProfile }) => userProfile?.fullName || '',
  );
  const rightPlayerNames = assigningCourtToMatch?.team1?.members.map(
    ({ userProfile }) => userProfile?.fullName || '',
  );
  const isDisabled = isLoadingAssignCourt || isLoadingRemoveCourt;

  useEffect(() => {
    if (matchingCourt) {
      if (matchingCourt) {
        setSelectedCourt(matchingCourt?.id);
      }
    }
  }, [matchingCourt]);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="px-4 pt-6">
        <div className="flex w-full items-center justify-between">
          <div className="typography-product-heading">Court</div>
          <button
            type="button"
            onClick={() => {
              handleClose();
              setSelectedCourt('');
            }}
            className="flex items-center justify-center rounded-full p-1.5 transition-colors hover:bg-color-bg-lightmode-secondary dark:hover:bg-color-bg-darkmode-secondary"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="typography-product-subheading mt-ds-xl w-full text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {previouslyAssignedCourt
            ? `Court ${previouslyAssignedCourt.courtNumber}`
            : 'Needs court assignment'}
        </div>
        <div
          className={classNames(
            'mt-ds-sm flex w-full flex-col justify-center whitespace-nowrap rounded-lg border-b border-color-border-card-lightmode dark:border-color-border-card-darkmode',
            (!assigningCourtToMatch?.status ||
              assigningCourtToMatch.status === MatchStatus.Upcoming) &&
              'bg-color-bg-lightmode-primary shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] dark:bg-color-bg-darkmode-primary',
            assigningCourtToMatch?.status === MatchStatus.UpNext &&
              'border-color-border-card-lightmode bg-brand-fire-200 text-color-text-lightmode-primary dark:border-color-border-card-darkmode',
            assigningCourtToMatch?.status === MatchStatus.Active &&
              'bg-color-bg-lightmode-brand text-color-text-lightmode-invert shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] dark:bg-color-bg-darkmode-brand',
            assigningCourtToMatch?.status === MatchStatus.Complete &&
              'bg-color-bg-lightmode-secondary text-color-text-lightmode-primary dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-primary',
          )}
        >
          <div className="flex items-center">
            <div className="w-1/2 truncate p-2">
              {leftPlayNames?.map((name) => (
                <div key={name} className="typography-product-caption truncate text-ellipsis">
                  {nameToFirstInitials(name)}
                </div>
              ))}
            </div>
            <div className="typography-product-button-label-small min-w-10 shrink-0 p-2">VS</div>
            <div className="w-1/2 truncate p-2">
              {rightPlayerNames?.map((name) => (
                <div key={name} className="typography-product-caption truncate text-ellipsis">
                  {nameToFirstInitials(name)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <CourtSelection
          selectedCourt={selectedCourt}
          onCourtChange={setSelectedCourt}
          courts={courts}
          assigningCourtToMatch={assigningCourtToMatch}
        />
        <div className="mt-ds-3xl shrink-0 pb-ds-xl">
          <Button
            variant="primary"
            size="lg"
            disabled={isDisabled}
            onClick={async () => {
              const previouslyAssignedCourt = courts.find(
                (court) =>
                  !!court.activeMatch?.id &&
                  !!assigningCourtToMatch?.id &&
                  court.activeMatch.id === assigningCourtToMatch.id,
              );
              const courtForAssignment = courts.find((court) => court.id === selectedCourt);

              if (previouslyAssignedCourt && assigningCourtToMatch?.id) {
                await updateRemoveCourtFromMatchMutation({
                  variables: {
                    matchId: assigningCourtToMatch.id,
                    courtId: previouslyAssignedCourt.id,
                  },
                });
              }

              if (courtForAssignment && assigningCourtToMatch?.id) {
                await assignCourtToMatchMutation({
                  variables: {
                    matchId: assigningCourtToMatch.id,
                    courtId: selectedCourt,
                    /**
                     * @note (Trey: 3/7/24) courtNumber should always exist but I haven't fully proved this logic is enforced
                     */
                    courtNumber:
                      typeof courtForAssignment.courtNumber === 'number'
                        ? courtForAssignment.courtNumber
                        : -1,
                  },
                });
                handleClose();
              }
            }}
          >
            Assign court
          </Button>
        </div>
      </div>
    </Modal>
  );
}
