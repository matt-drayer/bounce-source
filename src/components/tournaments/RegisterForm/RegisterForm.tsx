import * as React from 'react';
import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import isMobile from 'is-mobile';
import Sticky from 'react-sticky-el';
import { Registrant, Tournament } from 'constants/tournaments';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useModal } from 'hooks/useModal';
import { useViewer } from 'hooks/useViewer';
import CloseIcon from 'svg/CloseIcon';
import Modal from 'components/modals/Modal';
import WelcomeUser from 'components/tournaments/RegisterForm/WelcomeUser';
import { Steps } from 'components/tournaments/RegisterForm/constants';
import {
  useRegisterForm,
  useTeam,
  useTournamentPayment,
} from 'components/tournaments/RegisterForm/hooks';
import CreateAccountForm from './CreateAccountForm';
import Login from './Login';
import Payment from './Payment';
import SuccessStep from './SuccessStep';
import TournamentRequirement from './TournamentRequirement';

const RegisterForm = ({ tournament }: { tournament: Tournament }) => {
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const { isOpen, openModal, closeModal } = useModal();

  const { step, setStep } = useRegisterForm();
  const { playerTeam, teamLoading, refetch } = useTeam<{
    player: Registrant | null;
    partner: Registrant | null;
  }>({
    viewer,
    tournamentId: tournament.airtableId,
    teamDefaults: {
      player: null,
      partner: null,
    },
  });
  const { stripeKeys, stripe } = useTournamentPayment(viewer);

  const isUserRegisteredForTournament = !!playerTeam.player;

  useEffect(() => {
    if (isUserRegisteredForTournament) {
      setStep(Steps.WelcomeModal);
    }
  }, [isUserRegisteredForTournament]);

  const [requirements, setRequirements] = useState<{
    duprId: string;
    partnerEmail: string;
  } | null>(null);

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
        <TournamentRequirement
          onSubmit={({ partnerEmail, duprId }) => {
            setRequirements({
              partnerEmail,
              duprId,
            });
            setStep(Steps.PaymentForm);
          }}
        />
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
        <WelcomeUser
          team={playerTeam}
          onRegister={() => setStep(Steps.TournamentRequirementForm)}
          user={user}
        />
      )}
    </>
  );

  return (
    <>
      {isUserRegisteredForTournament && (
        <div className="mb-6 block rounded-xl bg-color-bg-lightmode-primary pb-8 pl-6 pr-6 pt-8 dark:bg-color-bg-darkmode-primary md:hidden">
          <WelcomeUser
            team={playerTeam}
            onRegister={() => setStep(Steps.TournamentRequirementForm)}
            user={user}
          />
        </div>
      )}

      <div className="mb-5 hidden w-full self-start sm:mb-0 sm:w-[38%] md:block md:w-[28%]">
        <Sticky
          disabled={isMobile()}
          wrapperClassName="bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary rounded-xl pt-8 pb-8 pr-6 pl-6"
        >
          {step !== Steps.WelcomeModal && step !== Steps.SuccessModal && (
            <p className="text-[1.25rem] font-medium italic text-brand-fire-500">Register</p>
          )}
          <Form />
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
