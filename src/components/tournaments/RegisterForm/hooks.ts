import * as React from 'react';
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import isMobile from 'is-mobile';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { Registrant } from 'constants/tournaments';
import { Viewer } from 'constants/user';
import { Response, getSetupIntent } from 'services/client/stripe/getSetupIntent';
import { getUserTeamByBounceId } from 'services/client/tournaments/getUserTeamByBounceId';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useStripe } from 'hooks/useStripe';
import { useViewer } from 'hooks/useViewer';
import { Steps } from 'components/tournaments/RegisterForm/constants';

const IS_USER_VIEWED_TOURNAMENT = 'isUserViewedTournament';

export const useRegisterForm = () => {
  const viewer = useViewer();
  const { user } = useGetCurrentUser();

  const [step, setStep] = useState<Steps>(Steps.CreateAccountForm);
  const isUserRegisteredInBounce = viewer.status === AuthStatus.User && user;

  useEffect(() => {
    const stepIsNotInitialSteps =
      step !== Steps.WelcomeModal && step !== Steps.TournamentRequirementForm;

    if (process.browser && isUserRegisteredInBounce && stepIsNotInitialSteps) {
      const isUserViewedTournament = !!localStorage.getItem(IS_USER_VIEWED_TOURNAMENT);

      console.log(isUserViewedTournament);

      if (isMobile()) {
        setStep(Steps.TournamentRequirementForm);
      } else {
        const initialStep = !isUserViewedTournament
          ? Steps.WelcomeModal
          : Steps.TournamentRequirementForm;

        setStep(initialStep);
      }

      localStorage.setItem(IS_USER_VIEWED_TOURNAMENT, JSON.stringify(true));
    }
  }, [viewer, user]);

  return {
    step,
    setStep,
  };
};

export const useTournamentPayment = (viewer: Viewer) => {
  const router = useRouter();
  const [stripeKeys, setStripeKeys] = React.useState<undefined | Response>(undefined);
  const { stripe } = useStripe();

  useEffect(() => {
    const fetchSetupIntent = async () => {
      try {
        const idToken = await viewer.viewer?.getIdToken();

        if (idToken) {
          const response = await getSetupIntent();

          setStripeKeys(response);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    if (router.isReady && viewer.userId) {
      fetchSetupIntent();
    }
  }, [viewer]);

  return {
    stripeKeys,
    stripe,
  };
};

export const useTeam = <T>(options: {
  viewer: Viewer;
  tournamentId?: string;
  teamApiUrl?: string;
  teamDefaults: T;
}) => {
  const { viewer, teamApiUrl, tournamentId, teamDefaults } = options;
  const [teamLoading, setTeamLoading] = useState<boolean>(false);
  const [playerTeam, setPlayerTeam] = useState<T>(teamDefaults);
  // const [playerTeam, setPlayerTeam] = useState<T>({ player: null, partner: null });

  const fetchTeam = () => {
    setTeamLoading(true);
    getUserTeamByBounceId(tournamentId, teamApiUrl)
      .then((data) => {
        console.log(data);
        setTeamLoading(false);
        setPlayerTeam(data.team);
      })
      .catch(() => {
        setTeamLoading(false);
      });
  };

  useEffect(() => {
    if (viewer.userId) {
      fetchTeam();
    }
  }, [viewer]);

  return {
    teamLoading,
    playerTeam,
    refetch: fetchTeam,
  };
};
