import { FC } from 'react';
import * as React from 'react';
import { ExternalRegistrant } from 'constants/tournaments';
import { GetCurrentUserQuery } from 'types/generated/client';

type Team = {
  player: ExternalRegistrant | null;
  primaryPartner: ExternalRegistrant | null;
  secondaryPartner: ExternalRegistrant | null;
};

const WelcomeUser: FC<{
  user: GetCurrentUserQuery['usersByPk'];
  onRegister(): void;
  team: Team;
}> = ({ user, onRegister, team }) => {
  const haveTwoEvents = team.player?.primaryEvent && team.player?.secondaryEvent;

  const bothAreRegistered = haveTwoEvents
    ? team.primaryPartner?.primaryEvent && team.secondaryPartner?.secondaryEvent
    : !!team.primaryPartner?.primaryEvent;

  if (!team.player) {
    return (
      <>
        <p className="text-[1.25rem] font-medium italic text-brand-fire-500">
          Welcome, {user?.fullName}!
        </p>
        <p className="mb-6 mt-8 text-brand-gray-800">
          You’ve successfully created your Bounce account. Please proceed to register for the
          tournament.
        </p>

        <button
          onClick={() => onRegister()}
          type="button"
          className="button-rounded-inline-background-bold flex h-[39px] w-full items-center justify-center text-[1rem] font-medium italic focus:shadow-none focus:ring-0"
        >
          Register
        </button>
      </>
    );
  }

  return (
    <>
      <p className="text-[1.25rem] font-medium italic text-brand-fire-500">
        Welcome, {user?.fullName}!
      </p>

      {bothAreRegistered ? (
        <p className="mb-6 mt-8 text-brand-gray-800">
          You and your partner are registered for the tournament!{' '}
        </p>
      ) : (
        <p className="mb-6 mt-8 text-brand-gray-800">
          You have successfully registered for the tournament, but we are waiting for your partner
          to register.{' '}
        </p>
      )}

      <div className="h-[1px] w-full bg-brand-gray-25"></div>

      {team.player?.primaryEvent && (
        <>
          <div className="mb-4 mt-6 flex justify-between font-semibold">
            <span>Event 1</span>
            <span className="flex items-center">{team.player.primaryEvent}</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-medium text-brand-gray-800">
              {team.player.firstName} {team.player.lastName}
            </span>
            <button className="cursor-default rounded-xl bg-green-100 pb-1 pl-3 pr-3 pt-1 text-[0.8rem] font-medium text-brand-green-500">
              Registered
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-medium text-brand-gray-800">
              {team.player.primaryPartnerEmail}
            </span>
            {team.primaryPartner?.primaryEvent && (
              <button className="cursor-default rounded-xl bg-green-100 pb-1 pl-3 pr-3 pt-1 text-[0.8rem] font-medium text-brand-green-500">
                Registered
              </button>
            )}
            {!team.primaryPartner?.primaryEvent && (
              <button className="cursor-default rounded-xl bg-yellow-100 pb-1 pl-3 pr-3 pt-1 text-[0.8rem] font-medium text-yellow-600">
                Pending
              </button>
            )}
          </div>
        </>
      )}

      {team.player?.secondaryEvent && team.player.secondaryPartnerEmail && (
        <>
          <div className="mb-4 mt-8 flex justify-between font-semibold">
            <span>Event 2</span>
            <span className="flex items-center">{team.player.secondaryEvent}</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-medium text-brand-gray-800">
              {team.player.firstName} {team.player.lastName}
            </span>
            <button className="cursor-default rounded-xl bg-green-100 pb-1 pl-3 pr-3 pt-1 text-[0.8rem] font-medium text-brand-green-500">
              Registered
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-medium text-brand-gray-800">
              {team.player.secondaryPartnerEmail}
            </span>
            {team.secondaryPartner?.secondaryEvent && (
              <button className="cursor-default rounded-xl bg-green-100 pb-1 pl-3 pr-3 pt-1 text-[0.8rem] font-medium text-brand-green-500">
                Registered
              </button>
            )}
            {!team.secondaryPartner?.secondaryEvent && (
              <button className="cursor-default rounded-xl bg-yellow-100 pb-1 pl-3 pr-3 pt-1 text-[0.8rem] font-medium text-yellow-600">
                Pending
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default WelcomeUser;
