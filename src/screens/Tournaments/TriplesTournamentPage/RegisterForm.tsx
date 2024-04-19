import { useEffect, useState } from 'react';
import * as React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Sentry from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { MAX_TRIPLES_TEAMS } from 'constants/tournaments';
import {
  getTournamentDetails,
  registerTeamForTripleTournament,
} from 'services/client/tournaments/triplesTournaments';

const isTournamentFull = (teamsCount: number) => teamsCount >= MAX_TRIPLES_TEAMS;

type Form = {
  name: string;
  email: string;
  member1: string;
  member2: string;
  member3: string;
};

const schema = yup
  .object({
    name: yup.string().required('Full name is required'),
    email: yup.string().required('Email address is required').email('Email should be valid'),
    member1: yup.string().required('Member 1 full name is required'),
    member2: yup.string().required('Member 2 full name is required'),
    member3: yup.string().required('Member 3 full name is required'),
  })
  .required();

interface Props {
  teamsCount: number;
  tournamentId: string;
}

const RegisterForm = ({ teamsCount, tournamentId }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const [step, setStep] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getTournamentDetails(tournamentId)
      .then(({ tournament }: any) => {
        const teams = tournament['Triple tournament teams'];

        if (isTournamentFull(teams?.length || 0)) {
          setStep(2);
        }
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  }, []);

  if (step === 0) {
    return (
      <form
        onSubmit={handleSubmit(async (data) => {
          setIsLoading(true);

          try {
            await registerTeamForTripleTournament({ ...data, tournamentId });

            setIsLoading(false);
            setStep(1);
          } catch (e) {
            setIsLoading(false);
            Sentry.captureException(e);
            alert(
              'There was an error registering for the tournament. Refresh the page and try again.',
            );
          }
        })}
      >
        <p className="text-[1.25rem] font-medium italic text-brand-fire-500">Register</p>

        <p className="mb-6 mt-8 text-brand-gray-1000">Team captain</p>

        <div className="relative">
          <span className="font-light text-brand-gray-600">Your name</span>
          <input
            placeholder="Full name"
            className="p h-11 w-full rounded-sm bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-700 focus:outline-0"
            {...register('name')}
          />
          <p className="bottom-1 mb-6  mt-1 text-[0.75rem] text-color-error">
            {errors?.name?.message}
          </p>
        </div>

        <div className="relative">
          <span className="font-light text-brand-gray-600">Your email</span>
          <input
            placeholder="Your email"
            className="h-11 w-full rounded-sm bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-700 focus:outline-0"
            {...register('email')}
          />
          <p className="bottom-1 mb-6  mt-1 text-[0.75rem] text-color-error">
            {errors?.email?.message}
          </p>
        </div>

        <p className="mb-6 mt-8 text-brand-gray-1000">Team members</p>

        <div className="relative">
          <span className="font-light text-brand-gray-600">Team member 1</span>
          <input
            placeholder="Full name"
            className="h-11 w-full rounded-sm bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-700 focus:outline-0"
            {...register('member1')}
          />
          <p className="bottom-1 mb-6  mt-1 text-[0.75rem] text-color-error">
            {errors?.member1?.message}
          </p>
        </div>

        <div className="relative">
          <span className="font-light text-brand-gray-600">Team member 2</span>
          <input
            placeholder="Full name"
            className="h-11 w-full rounded-sm bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-700 focus:outline-0"
            {...register('member2')}
          />
          <p className="bottom-1 mb-6  mt-1 text-[0.75rem] text-color-error">
            {errors?.member2?.message}
          </p>
        </div>

        <div className="relative">
          <span className="font-light text-brand-gray-600">Team member 3</span>
          <input
            placeholder="Full name"
            className="h-11 w-full rounded-sm bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-700 focus:outline-0"
            {...register('member3')}
          />
          <p className="bottom-1 mb-8  mt-1 text-[0.75rem] text-color-error">
            {errors?.member3?.message}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="button-rounded-inline-background-bold flex h-[39px] w-full items-center justify-center text-[1rem] font-medium italic"
        >
          {isLoading ? 'Loading...' : 'Sign up'}
        </button>
      </form>
    );
  }

  if (step === 1) {
    return (
      <div>
        <p className="text-[1.25rem] font-medium italic text-brand-fire-500">Hooray!</p>

        <div>
          <p className="mb-6 mt-8 text-brand-gray-800">
            You’ve successfully registered your team to the Triples tournament!
          </p>
          <p className="text-brand-gray-800">
            We looking forward to seeing you on the court. Good luck! 🏆
          </p>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <p className="text-[1.25rem] font-medium italic text-brand-fire-500">Register</p>

        <div>
          <p className="mb-6 mt-8 text-brand-gray-800">Registration closed</p>
        </div>
      </div>
    );
  }

  return null;
};

export default RegisterForm;
