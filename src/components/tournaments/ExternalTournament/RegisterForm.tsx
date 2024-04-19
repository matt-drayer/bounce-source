import * as React from 'react';
import { FC, ReactElement, ReactNode, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import isMobile from 'is-mobile';
import Sticky from 'react-sticky-el';
import { ExternalRegistrant, ExternalTournament } from 'constants/tournaments';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useModal } from 'hooks/useModal';
import { useViewer } from 'hooks/useViewer';
import CloseIcon from 'svg/CloseIcon';
import Modal from 'components/modals/Modal';
import Payment from 'components/tournaments/ExternalTournament/Payment';
import SuccessStep from 'components/tournaments/ExternalTournament/SuccessStep';
import TournamentRequirement from 'components/tournaments/ExternalTournament/TournamentRequirement';
import WelcomeUser from 'components/tournaments/ExternalTournament/WelcomeUser';
import CreateAccountForm from 'components/tournaments/RegisterForm/CreateAccountForm';
import Login from 'components/tournaments/RegisterForm/Login';
import { Steps } from 'components/tournaments/RegisterForm/constants';
import {
  useRegisterForm,
  useTeam,
  useTournamentPayment,
} from 'components/tournaments/RegisterForm/hooks';
import { GetCurrentUserQuery } from '../../../types/generated/client';

export type TournamentRequirements = {
  duprId: string;
  amount: number;
  events: { email: string; eventType: string; rating: string }[];
};

type PlayerTeam = {
  player: ExternalRegistrant | null;
  primaryPartner: ExternalRegistrant | null;
  secondaryPartner: ExternalRegistrant | null;
};

const RegisterForm = ({
  tournament,
  tournamentSlug,
  customWelcomeUser,
  customRequirements,
}: {
  tournament: ExternalTournament;
  tournamentSlug: string;
  customRequirements?(onSubmit: (values: any) => void): ReactElement;
  customWelcomeUser?(
    team: PlayerTeam,
    user: GetCurrentUserQuery['usersByPk'],
    onSubmit: () => void,
  ): ReactElement;
}) => {
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const { isOpen, openModal, closeModal } = useModal();

  const { step, setStep } = useRegisterForm();
  const { playerTeam, teamLoading, refetch } = useTeam<PlayerTeam>({
    viewer,
    teamApiUrl: `${tournamentSlug}/team`,
    tournamentId: tournament.airtableId,
    teamDefaults: {
      player: null,
      secondaryPartner: null,
      primaryPartner: null,
    },
  });
  const { stripeKeys, stripe } = useTournamentPayment(viewer);

  const isUserRegisteredForTournament = !!playerTeam.player;

  const [requirements, setRequirements] = useState<TournamentRequirements | null>(null);

  useEffect(() => {
    if (isUserRegisteredForTournament) {
      setStep(Steps.WelcomeModal);
    }
  }, [isUserRegisteredForTournament]);

  if (!viewer) return null;

  if (teamLoading)
    return (
      <div className="mb-5 hidden w-full self-start rounded-xl bg-color-bg-lightmode-primary p-6 text-color-text-lightmode-tertiary dark:bg-color-bg-darkmode-primary dark:text-color-text-darkmode-tertiary sm:mb-0 sm:w-[38%] md:block md:w-[28%]">
        Loading your registration details...
      </div>
    );

  const Form = () => (
    <>
      {step === Steps.CreateAccountForm && (
        <CreateAccountForm
          goToLogin={() => setStep(Steps.LoginForm)}
          onSubmit={() => setStep(Steps.TournamentRequirementForm)}
        />
      )}
      {step === Steps.LoginForm && <Login goToSignUp={() => setStep(Steps.CreateAccountForm)} />}
      {step === Steps.TournamentRequirementForm && (
        <>
          {customRequirements ? (
            customRequirements((values) => {
              setRequirements(values as TournamentRequirements);
              setStep(Steps.PaymentForm);
            })
          ) : (
            <TournamentRequirement
              onSubmit={(values) => {
                setRequirements(values as TournamentRequirements);
                setStep(Steps.PaymentForm);
              }}
              tournament={tournament}
            />
          )}
        </>
      )}
      {step === Steps.PaymentForm && (
        <>
          {stripeKeys?.setupIntentClientSecret && (
            <Elements
              stripe={stripe}
              options={{
                clientSecret: stripeKeys?.setupIntentClientSecret,
                appearance: {
                  labels: undefined,
                },
              }}
            >
              {requirements && (
                <Payment
                  tournamentSlug={tournamentSlug}
                  requirements={requirements}
                  tournament={tournament}
                  onSubmit={() => {
                    refetch();
                    setStep(Steps.SuccessModal);
                  }}
                  back={() => setStep(Steps.TournamentRequirementForm)}
                />
              )}
            </Elements>
          )}
        </>
      )}
      {step === Steps.SuccessModal && <SuccessStep />}
      {step === Steps.WelcomeModal && user && (
        <>
          {customWelcomeUser ? (
            customWelcomeUser(playerTeam, user, () => {
              setStep(Steps.TournamentRequirementForm);
            })
          ) : (
            <WelcomeUser
              team={playerTeam}
              onRegister={() => setStep(Steps.TournamentRequirementForm)}
              user={user}
            />
          )}
        </>
      )}
    </>
  );

  return (
    <>
      {isUserRegisteredForTournament && (
        <div className="mb-6 block rounded-xl bg-color-bg-lightmode-primary pb-8 pl-6 pr-6 pt-8 dark:bg-color-bg-darkmode-primary md:hidden">
          {customWelcomeUser ? (
            customWelcomeUser(playerTeam, user, () => {
              setStep(Steps.TournamentRequirementForm);
            })
          ) : (
            <WelcomeUser
              team={playerTeam}
              onRegister={() => setStep(Steps.TournamentRequirementForm)}
              user={user}
            />
          )}
        </div>
      )}

      <div className="mb-5 hidden w-full self-start sm:mb-0 sm:w-[38%] md:block md:w-[28%]">
        <Sticky disabled={isMobile()} wrapperClassName="h-full overflow-scroll">
          <div className="sticky rounded-xl bg-color-bg-lightmode-primary pb-8 pl-6 pr-6 pt-8 dark:bg-color-bg-darkmode-primary">
            {step !== Steps.WelcomeModal && step !== Steps.SuccessModal && (
              <p className="text-[1.25rem] font-medium italic text-brand-fire-500">Register</p>
            )}

            <Form />
          </div>
        </Sticky>
      </div>

      {!isUserRegisteredForTournament && (
        <div className="block md:hidden">
          {!isOpen && (
            <div className="fixed bottom-3 left-[50%] flex w-full translate-x-[-50%] justify-center">
              <button
                type="button"
                onClick={() => openModal()}
                className="button-rounded-inline-background-bold z-20 mx-auto flex h-[61px] w-[80%] items-center justify-center text-[1.5rem] font-medium italic"
              >
                Register
              </button>
            </div>
          )}
          <Modal isOpen={isOpen} handleClose={() => closeModal(false)} className="">
            <div className="rounded-xl bg-color-bg-lightmode-primary pb-8 pl-6 pr-6 pt-8 dark:bg-color-bg-darkmode-primary">
              {step !== Steps.WelcomeModal && (
                <p className="flex items-center justify-between text-[1.25rem] font-medium italic text-brand-fire-500">
                  Register{' '}
                  <span className="ml-2 text-gray-500" onClick={() => closeModal()}>
                    <CloseIcon />
                  </span>
                </p>
              )}
              <Form />
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default RegisterForm;
