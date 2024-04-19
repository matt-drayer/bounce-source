import * as React from 'react';
import { format } from 'date-fns';
import { SkillLevels } from 'constants/sports';
import {
  PlaySessionCourtBookingStatusesEnum,
  PlaySessionFieldsFragment,
  SportsEnum,
} from 'types/generated/client';
import { splitNameToFirstLast } from 'utils/shared/name/splitNameToFirstLast';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import CheckCircle from 'svg/CheckCircle';
import Clock from 'svg/Clock';
import Location from 'svg/Location';
import Card from 'components/cards/Card';

interface Props {
  playSession: PlaySessionFieldsFragment;
}

// TODO: Finalize these colors and add to the Tailwind config theme
const SkillLevel = ({ targetSkillLevel }: { targetSkillLevel?: string | null }) => {
  return (
    <div className="mt-1 text-xs font-medium">
      {!targetSkillLevel && (
        <div className="inline-flex h-5 items-center rounded-xl bg-[#EFF9DB] px-2 text-[#155E75]">
          All Skill Levels
        </div>
      )}
      {targetSkillLevel === SkillLevels.BrandNew && (
        <div className="inline-flex h-5 items-center rounded-xl bg-[#EFF9DB] px-2 text-[#155E75]">
          Brand New
        </div>
      )}
      {targetSkillLevel === SkillLevels.Beginner && (
        <div className="inline-flex h-5 items-center rounded-xl bg-[#F0F9FF] px-2 text-[##316BDA]">
          Beginner
        </div>
      )}
      {targetSkillLevel === SkillLevels.Intermediate && (
        <div className="inline-flex h-5 items-center rounded-xl bg-[#FBF8E5] px-2 text-[#AF7400]">
          Intermediate
        </div>
      )}
      {targetSkillLevel === SkillLevels.Advanced && (
        <div className="inline-flex h-5 items-center rounded-xl bg-[#FFECDE] px-2 text-[#ED4F2F]">
          Advanced
        </div>
      )}
      {targetSkillLevel === SkillLevels.Pro && (
        <div className="inline-flex h-5 items-center rounded-xl bg-[#FFEEF4] px-2 text-[#86175A]">
          Pro
        </div>
      )}
    </div>
  );
};

const CardPlayFeed: React.FC<Props> = ({ playSession }) => {
  const organizerProfile = playSession.organizerProfile;
  const { firstName, lastName } = splitNameToFirstLast(organizerProfile?.fullName || '');

  return (
    <Card>
      <div className="p-2 sm:p-4">
        <div className="flex items-center justify-between border-b border-color-border-input-lightmode pb-2 dark:border-color-border-input-darkmode">
          <div className="text-xl font-semibold">Open Play</div>
          {!!playSession?.sport && (
            <div className="text-xs font-medium">
              {playSession.sport === SportsEnum.Tennis && (
                <div className="flex h-5 items-center rounded-2xl bg-[#EFF9DB] px-2 text-cyan-800">
                  Tennis
                </div>
              )}
              {playSession.sport === SportsEnum.Pickleball && (
                <div className="flex h-5 items-center rounded-2xl bg-[#EBF2FF] px-2 text-[#4D38AB]">
                  Pickleball
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex w-full flex-col pt-2 sm:flex-row">
          <div className="flex w-full shrink-0 grow justify-evenly sm:max-w-[250px] sm:justify-between">
            <div className="flex flex-col items-center text-center">
              <img
                src={getProfileImageUrlOrPlaceholder({ path: organizerProfile?.profileImagePath })}
                className="h-16 w-16 rounded-full"
              />
              <div className="mt-1 text-sm font-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                {firstName} {lastName ? `${lastName[0]}.` : ''}
              </div>
              <SkillLevel targetSkillLevel={playSession.targetSkillLevel} />
            </div>
            <div className="flex items-center text-sm font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              &
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mt-1 text-xl text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                <div className="font-bold">
                  {playSession.participantsAggregate.aggregate?.count || 0}/
                  {playSession.participantLimit || '∞'}{' '}
                </div>
                <div>{playSession.participantLimit === 1 ? 'spot' : 'spots'}</div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex w-full flex-col sm:mt-0 sm:flex-row sm:justify-evenly">
            <div className="">
              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4 text-color-text-lightmode-inactive" />{' '}
                <div className="flex items-center text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  {format(new Date(playSession.startDateTime), 'p')} -{' '}
                  {format(new Date(playSession.endDateTime), 'p')}
                </div>
              </div>
            </div>
            <div>
              {!!playSession?.userCustomCourt?.title && (
                <div className="mt-1 flex items-start justify-between sm:mt-0 sm:flex-col">
                  <div className="flex items-center">
                    <Location className="mr-1.5 h-4 w-4 text-color-text-lightmode-inactive" />{' '}
                    <div className="flex items-center text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      {playSession?.userCustomCourt?.title}
                    </div>
                  </div>
                  {playSession.courtBookingStatus ===
                    PlaySessionCourtBookingStatusesEnum.Booked && (
                    <div className="inline-flex h-5 shrink-0 items-center rounded-2xl bg-color-bg-lightmode-secondary px-2 sm:mt-4">
                      <CheckCircle className="mr-0.5 h-3 w-3 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                      <div className="text-xs font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                        Booked
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardPlayFeed;
