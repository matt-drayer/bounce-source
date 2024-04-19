import * as React from 'react';
import { Registrant } from 'constants/tournaments';
import { GetCurrentUserQuery } from 'types/generated/client';

type Props = {
  user: GetCurrentUserQuery['usersByPk'];
  onRegister(): void;
  team: {
    partner: Registrant | null;
    player: Registrant | null;
  };
};

export default function WelcomeUser({ user, onRegister, team }: Props) {
  return (
    <>
      <p className="text-[1.25rem] font-medium italic text-brand-fire-500">
        Welcome, {user?.fullName}!
      </p>

      {!team.player && !team.partner && (
        <>
          <p className="mb-6 mt-8 text-brand-gray-800">
            You’ve successfully created your Bounce account. Please proceed to register for the
            tournament.{' '}
          </p>
          <button
            onClick={() => onRegister()}
            type="button"
            className="button-rounded-inline-background-bold flex h-[39px] w-full items-center justify-center text-[1rem] font-medium italic focus:shadow-none focus:ring-0"
          >
            Register
          </button>
        </>
      )}

      {team.player && (
        <>
          {!team.partner && (
            <p className="mb-6 mt-8 text-brand-gray-800">
              You have successfully registered for the tournament, but we are waiting for your
              partner to register.{' '}
            </p>
          )}

          {team.partner && (
            <p className="mb-6 mt-8 text-brand-gray-800">
              You and your partner are registered for the tournament!{' '}
            </p>
          )}

          <div className="h-[1px] w-full bg-brand-gray-25"></div>

          <div className="mt-6 flex items-center justify-between">
            <span className="font-medium text-brand-gray-800">
              {team.player.firstName}
              {team.player.lastName}
            </span>
            <button className="cursor-default rounded-xl bg-green-100 pb-1 pl-3 pr-3 pt-1 text-[0.8rem] font-medium text-brand-green-500">
              Registered
            </button>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="max-w-[250px] truncate font-medium text-brand-gray-800">
              {team.player.email}
            </span>

            {!team.partner && (
              <button className="cursor-default rounded-xl bg-yellow-100 pb-1 pl-3 pr-3 pt-1 text-[0.8rem] font-medium text-yellow-600">
                Pending
              </button>
            )}

            {team.partner && (
              <button className="cursor-default rounded-xl bg-green-100 pb-1 pl-3 pr-3 pt-1 text-[0.8rem] font-medium text-brand-green-500 ">
                Registered
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
