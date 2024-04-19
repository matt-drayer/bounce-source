import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import {
  useGetEventTeamInvitationByIdLazyQuery,
  useGetUserEventRegistrationLazyQuery,
} from 'types/generated/client';
import { Response, SETUP_INTENT_API, getSetupIntent } from 'services/client/stripe/getSetupIntent';
import { calculateEventOrderTotal } from 'utils/shared/money/calculateEventOrderTotal';
import { useApiGateway } from 'hooks/useApi';
import { useAuthModals } from 'hooks/useAuthModals';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useStripe } from 'hooks/useStripe';
import { useViewer } from 'hooks/useViewer';
import ArrowRight from 'svg/ArrowRight';
import { ButtonText } from 'components/Button';
import { useModal } from 'components/modals/Modal';
import AddEvents from './AddEvents';
import Closed from './Closed';
import ConfirmWithoutPayment from './ConfirmWithoutPayment';
import CreateAccount from './CreateAccount';
import LoadingSkeleton from './LoadingSkeleton';
import Login from './Login';
import ModalAdditionalDetails from './ModalAdditionalDetails';
import Payment from './Payment';
import RequiredFields from './RequiredFields';
import UserEventList from './UserEventList';
import { REGISTER_API, RegistrationFormData } from './types';
import { EXIT_TEXT, EventProps, Steps } from '../types';

const useTournamentPayment = () => {
  const { userId } = useViewer();
  const router = useRouter();
  const [stripeKeys, setStripeKeys] = React.useState<undefined | Response>(undefined);
  const { stripe } = useStripe();

  const fetchSetupIntent = async () => {
    try {
      const response = await getSetupIntent();
      setStripeKeys(response);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    if (router.isReady && userId) {
      fetchSetupIntent();
    }
  }, [userId, router.isReady]);

  return {
    stripeKeys,
    stripe,
    fetchSetupIntent,
  };
};

const useReadyCheck = () => {
  const { get: checkRegisterReady } = useApiGateway<undefined>(REGISTER_API);
  const { get: checkSetupIntentReady } = useApiGateway<undefined>(SETUP_INTENT_API);
  const fetchReadyCheck = async () => {
    try {
      return await Promise.all([checkRegisterReady(), checkSetupIntentReady()]);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return { fetchReadyCheck };
};

const RegisterWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="hidden h-full flex-col rounded-xl border border-color-border-input-lightmode shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] dark:border-color-border-input-darkmode lg:flex">
        {children}
      </div>
      <div className="flex flex-col lg:hidden">{children}</div>
    </>
  );
};

const ResgisterExternal = ({ url }: { url: string }) => {
  const { isSessionLoading, isUserSession } = useViewer();
  const { openSignupModal, ModalLogin, ModalSignup } = useAuthModals();

  const redirectToTournament = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <div className="flex flex-col p-6">
        <div className="typography-product-heading-mobile text-color-brand-primary">Register</div>
        <div className="typography-product-body my-8 text-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          Registration for this tournament is hosted on another platform.
        </div>
        <div className="text-center">
          <ButtonText
            onClick={() => {
              if (isUserSession || isSessionLoading) {
                redirectToTournament();
              } else {
                openSignupModal();
              }
            }}
            className="typography-product-button-label-medium flex w-full items-center justify-center text-center text-color-brand-primary"
          >
            Leave Bounce and register <ArrowRight className="ml-1 h-4 w-4" />
          </ButtonText>
        </div>
      </div>
      <ModalSignup
        isShowLoginLink
        handleSignupSuccess={redirectToTournament}
        ignoreText={EXIT_TEXT}
        ignoreAction={redirectToTournament}
      />
      <ModalLogin isShowSignupLink />
    </>
  );
};

export default function MultiStepForm({ event }: EventProps) {
  const router = useRouter();
  const [steps, setSteps] = useState(Steps.AddEvent);
  const [isIgnoreInvitation, setIsIgnoreInvitation] = useState(false);
  const { fetchReadyCheck } = useReadyCheck();
  const [registrationFormData, setRegistrationFormData] = useState<RegistrationFormData>({
    duprId: '',
    birthday: '',
    groups: [{ groupId: '', partnerEmail: '', partnerName: '' }],
  });
  const { isUserSession, isAnonymousSession, userId } = useViewer();
  const { user, loading: isUserLoading, called: userCalled } = useGetCurrentUser();
  const [
    getUserEventRegistrationLazyQuery,
    { data, loading: isRegistrationLoading, called: isRegistrationCalled },
  ] = useGetUserEventRegistrationLazyQuery();
  const [
    getEventTeamInvitationByIdLazyQuery,
    { data: teamInvitationData, loading: isTeamInvitationLoading, called: isTeamInvitationCalled },
  ] = useGetEventTeamInvitationByIdLazyQuery();
  const [invitationId, setInvitationId] = useState<string | undefined>(undefined);
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const isLoadingAuth = !isUserSession && !isAnonymousSession;
  const isLoadingUserDetails = isLoadingAuth || (isUserSession && (isUserLoading || !userCalled));
  const isLoadingTeam =
    router.isReady && !!router.query.team && (!isTeamInvitationCalled || isTeamInvitationLoading);
  const isLoadingGroupsDetails =
    isRegistrationLoading || (isUserSession && !isRegistrationCalled) || isLoadingTeam;
  const { stripeKeys, stripe, fetchSetupIntent } = useTournamentPayment();
  const {
    isOpen: isAdditionalDetailsOpen,
    openModal: openAdditionalDetailsModal,
    closeModal: closeAdditionalDetailsModal,
  } = useModal();

  useEffect(() => {
    if (userId && event.id) {
      getUserEventRegistrationLazyQuery({
        variables: {
          userId,
          eventId: event.id,
        },
      });

      fetchReadyCheck().catch(() => {});
    }
  }, [userId, event.id]);

  useEffect(() => {
    if (router.isReady && router.query.invite) {
      setInvitationId(router.query.invite as string);
    }
    if (router.isReady && router.query.team) {
      setTeamId(router.query.team as string);
      getEventTeamInvitationByIdLazyQuery({
        variables: {
          id: router.query.team as string,
        },
      }).then((resp) => {
        const matchedTeam = resp.data?.eventTeamsByPk;
        if (!matchedTeam?.id) {
          setTeamId(undefined);
        }
      });
    }
  }, [router.isReady, router.query.invite, router.query.team]);

  if (event.isExternal) {
    return (
      <RegisterWrapper>
        <ResgisterExternal url={event.externalUrl || ''} />
      </RegisterWrapper>
    );
  }

  if (isLoadingUserDetails || isLoadingGroupsDetails) {
    return (
      <RegisterWrapper>
        <LoadingSkeleton />
      </RegisterWrapper>
    );
  }

  const existingRegistrations = data;
  const hasPreviousEventRegistration = !!existingRegistrations?.eventRegistrations?.length;
  const hasPreviousGroupRegistration = !!existingRegistrations?.eventGroupRegistrations?.length;
  const orderTotal = calculateEventOrderTotal({
    event,
    registration: registrationFormData.groups,
    isFirstTournamentRegistration:
      !existingRegistrations?.eventRegistrations ||
      !existingRegistrations?.eventRegistrations.length,
  });
  const hasCost = !!orderTotal.total;
  const now = Date.now();
  const isPastDeadline =
    !!event.registrationDeadlineDateTime &&
    new Date(event.registrationDeadlineDateTime).getTime() < now;
  const isBeforeOpen =
    !!event.registrationOpenDateTime && new Date(event.registrationOpenDateTime).getTime() > now;
  const isPastClosed =
    !!event.registrationClosedAt && new Date(event.registrationClosedAt).getTime() < now;

  console.log(teamInvitationData);

  return (
    <>
      <RegisterWrapper>
        {steps === Steps.LoadingSkeleton && <LoadingSkeleton />}
        {steps === Steps.AddEvent &&
          (isPastDeadline || isBeforeOpen || isPastClosed ? (
            <Closed
              setSteps={setSteps}
              event={event}
              user={user}
              registrations={data}
              handleNext={() => {}}
            />
          ) : hasPreviousEventRegistration || hasPreviousGroupRegistration ? (
            <UserEventList
              setSteps={setSteps}
              event={event}
              user={user}
              registrations={data}
              setRegistrationFormData={setRegistrationFormData}
              name={user?.fullName || ''}
              handleNext={() => {
                setSteps(Steps.PaymentForm);
              }}
              hasPreviousEventRegistration={hasPreviousEventRegistration}
              hasPreviousGroupRegistration={hasPreviousGroupRegistration}
              isIgnoreInvitation={isIgnoreInvitation}
              setIsIgnoreInvitation={setIsIgnoreInvitation}
              invitationGroupId={teamInvitationData?.eventTeamsByPk?.groupId}
              invitationTeamMembers={teamInvitationData?.eventTeamsByPk?.members.map((member) => ({
                groupId: teamInvitationData?.eventTeamsByPk?.groupId,
                name: member.userProfile?.fullName || '',
                id: member.id,
              }))}
            />
          ) : (
            <AddEvents
              setSteps={setSteps}
              event={event}
              user={user}
              registrations={data}
              setRegistrationFormData={setRegistrationFormData}
              isIgnoreInvitation={isIgnoreInvitation}
              setIsIgnoreInvitation={setIsIgnoreInvitation}
              invitationGroupId={teamInvitationData?.eventTeamsByPk?.groupId}
              invitationTeamMembers={teamInvitationData?.eventTeamsByPk?.members.map((member) => ({
                groupId: teamInvitationData?.eventTeamsByPk?.groupId,
                name: member.userProfile?.fullName || '',
                id: member.id,
              }))}
              handleNext={() => {
                if (!userId) {
                  setSteps(Steps.CreateAccount);
                } else if (event.isRatingRequired) {
                  setSteps(Steps.TournamentRequirements);
                } else {
                  setSteps(Steps.PaymentForm);
                }
              }}
            />
          ))}
        {steps === Steps.Login && (
          <Login
            setSteps={setSteps}
            event={event}
            user={user}
            registrations={data}
            handleNext={() => {
              if (event.isRatingRequired) {
                setSteps(Steps.TournamentRequirements);
              } else {
                setSteps(Steps.PaymentForm);
              }
            }}
          />
        )}
        {steps === Steps.CreateAccount && (
          <CreateAccount
            setSteps={setSteps}
            event={event}
            user={user}
            registrations={data}
            handleNext={() => {
              if (event.isRatingRequired) {
                setSteps(Steps.TournamentRequirements);
              } else {
                setSteps(Steps.PaymentForm);
              }
            }}
          />
        )}
        {steps === Steps.TournamentRequirements && (
          <RequiredFields
            setSteps={setSteps}
            event={event}
            user={user}
            registrations={data}
            setRegistrationFormData={setRegistrationFormData}
            handleNext={() => {
              setSteps(Steps.PaymentForm);
            }}
          />
        )}
        {steps === Steps.PaymentForm &&
          (hasCost ? (
            stripeKeys?.setupIntentClientSecret ? (
              <Elements
                stripe={stripe}
                options={{
                  clientSecret: stripeKeys?.setupIntentClientSecret,
                  appearance: {
                    labels: undefined,
                  },
                }}
              >
                <Payment
                  invitationId={isIgnoreInvitation ? '' : invitationId}
                  teamId={isIgnoreInvitation ? '' : teamId}
                  registrationFormData={registrationFormData}
                  setSteps={setSteps}
                  event={event}
                  user={user}
                  orderTotal={orderTotal}
                  handleNext={() => {
                    setSteps(Steps.AddEvent);
                  }}
                  onSubmit={() => {
                    getUserEventRegistrationLazyQuery({
                      fetchPolicy: 'network-only',
                      variables: {
                        userId,
                        eventId: event.id,
                      },
                    });

                    setSteps(Steps.AddEvent);
                    fetchSetupIntent();

                    /**
                     * @todo enable
                     */
                    // openAdditionalDetailsModal();
                  }}
                  back={() => {
                    if (event.isRatingRequired) {
                      setSteps(Steps.TournamentRequirements);
                    } else {
                      setSteps(Steps.AddEvent);
                    }
                  }}
                />
              </Elements>
            ) : (
              <RegisterWrapper>
                <LoadingSkeleton />
              </RegisterWrapper>
            )
          ) : (
            <ConfirmWithoutPayment
              invitationId={isIgnoreInvitation ? '' : invitationId}
              teamId={isIgnoreInvitation ? '' : teamId}
              registrationFormData={registrationFormData}
              setSteps={setSteps}
              event={event}
              user={user}
              orderTotal={orderTotal}
              handleNext={() => {
                setSteps(Steps.AddEvent);
              }}
              onSubmit={() => {
                getUserEventRegistrationLazyQuery({
                  fetchPolicy: 'network-only',
                  variables: {
                    userId,
                    eventId: event.id,
                  },
                });

                setSteps(Steps.AddEvent);

                /**
                 * @todo enable
                 */
                // openAdditionalDetailsModal();
              }}
              back={() => {
                if (event.isRatingRequired) {
                  setSteps(Steps.TournamentRequirements);
                } else {
                  setSteps(Steps.AddEvent);
                }
              }}
            />
          ))}
        {steps === Steps.Closed && (
          <Closed
            setSteps={setSteps}
            event={event}
            user={user}
            registrations={data}
            handleNext={() => {}}
          />
        )}
      </RegisterWrapper>
      <ModalAdditionalDetails
        isOpen={isAdditionalDetailsOpen}
        handleClose={closeAdditionalDetailsModal}
      />
    </>
  );
}
