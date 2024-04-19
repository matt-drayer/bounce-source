import * as React from 'react';
import { RadioGroup } from '@headlessui/react';
import { CreditCardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import * as Sentry from '@sentry/nextjs';
import { Elements } from '@stripe/react-stripe-js';
import { SetupIntent } from '@stripe/stripe-js';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { getLessonJoinPageUrl, getLessonJoinSuccessPageUrl } from 'constants/pages';
import { CardBrandsDisplayName } from 'constants/payments';
import { RequestStatus } from 'constants/requests';
import {
  GetUserCreditCardsQuery,
  useGetLessonByIdLazyQuery,
  useGetUserCreditCardsLazyQuery,
} from 'types/generated/client';
import { createLessonOnPlatformPayment } from 'services/client/payments/createLessonOnPlatformPayment';
import { LessonPricing, getLessonPricing } from 'services/client/payments/getLessonPricing';
import { Response, getSetupIntent } from 'services/client/stripe/getSetupIntent';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { getLessonImageUrl } from 'utils/shared/user/getLessonImageUrl';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useStripe } from 'hooks/useStripe';
import { useViewer } from 'hooks/useViewer';
import SafeAreaPage from 'layouts/SafeAreaPage';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import Modal from 'components/modals/Modal';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import AddCardForm from './AddCardForm';
import CardLesson from './CardLesson';
import Pricing from './Pricing';

const IS_HIDE_SIDEBAR = true;

const LessonJoin = () => {
  const { stripe } = useStripe();
  const router = useRouter();
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const [isAddCardOpen, setIsAddCardOpen] = React.useState(false);
  const [addedCards, setAddedCards] = React.useState<GetUserCreditCardsQuery['userCreditCards']>(
    [],
  );
  const [selectedCardIndex, setSelectedCardIndex] = React.useState(0);
  const [stripeKeys, setStripeKeys] = React.useState<undefined | Response>(undefined);
  const [stripeKeyFetchStatus, setStripeKeyFetchStatus] = React.useState(RequestStatus.InProgress);
  const [paymentRequestStatus, setPaymentRequestStatus] = React.useState(RequestStatus.Idle);
  const [paymentError, setPaymentError] = React.useState<Error | null>(null);
  const [lessonPricing, setLessonPricing] = React.useState<LessonPricing | undefined>();
  const [getLessonByIdQuery, { data: lessonData, loading, called }] = useGetLessonByIdLazyQuery();
  const [getUserCreditCardQuery, { data: creditCardData }] = useGetUserCreditCardsLazyQuery();
  const lesson = lessonData?.lessonsByPk;
  const creditCards = creditCardData?.userCreditCards || [];
  const defaultCardId = user
    ? creditCards.find((card) => card.id === user.defaultCreditCardId)
    : null;
  const restOfCards = creditCards.filter((card) => card.id !== defaultCardId?.id);
  const sortedCards = [defaultCardId, ...restOfCards];
  const displayCards = [...addedCards, ...sortedCards].filter((card) => !!card);
  const hasCards = displayCards.length > 0;

  React.useEffect(() => {
    const fetchLesson = async (id: string) => {
      try {
        const lesson = await getLessonByIdQuery({
          variables: { id },
        });
        const pricingInformation = await getLessonPricing({
          priceUnitAmount: lesson.data?.lessonsByPk?.priceUnitAmount || 0,
        });
        setLessonPricing(pricingInformation);
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    if (router.isReady && viewer.status !== AuthStatus.Loading) {
      if (router.query.lessonId && typeof router.query.lessonId === 'string') {
        fetchLesson(router.query.lessonId);
      }
    }
  }, [router.isReady, viewer.status]);

  React.useEffect(() => {
    const fetchSetupIntent = async () => {
      try {
        const idToken = await viewer.viewer?.getIdToken();
        if (idToken) {
          const response = await getSetupIntent();
          setStripeKeys(response);
          setStripeKeyFetchStatus(RequestStatus.Idle);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    const fetchCreditCards = async () => {
      try {
        getUserCreditCardQuery({
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'network-only',
          variables: {
            userId: viewer.userId,
          },
        });
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    if (router.isReady && viewer.userId) {
      fetchCreditCards();
      fetchSetupIntent();
    }
  }, [router.isReady, viewer.userId]);

  const handleCompleteSetupIntent = async (setupIntent: SetupIntent) => {
    setIsAddCardOpen(false);
    setStripeKeyFetchStatus(RequestStatus.InProgress);

    const paymentMehod =
      typeof setupIntent?.payment_method !== 'string' ? setupIntent?.payment_method : null;

    if (paymentMehod) {
      setAddedCards((cards) => [
        {
          __typename: 'UserCreditCards',
          id: '',
          last4: paymentMehod?.card?.last4 || '',
          provider: 'STRIPE',
          providerCardId: paymentMehod.id,
          expireYear: paymentMehod?.card?.exp_year || 0,
          expireMonth: paymentMehod?.card?.exp_month || 0,
          brand: paymentMehod?.card?.brand || '',
          billingName: '',
          billingPostalCode: '',
        },
        ...cards,
      ]);
    }

    setSelectedCardIndex(0);

    try {
      const idToken = await viewer.viewer?.getIdToken();
      if (idToken) {
        const response = await getSetupIntent();
        setStripeKeys(response);
      }
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setStripeKeyFetchStatus(RequestStatus.Idle);
    }
  };

  const handleSubmitPayment = async () => {
    if (paymentRequestStatus === RequestStatus.InProgress) {
      return;
    }

    setPaymentError(null);

    if (lesson && displayCards[selectedCardIndex]?.providerCardId) {
      setPaymentRequestStatus(RequestStatus.InProgress);
      try {
        await createLessonOnPlatformPayment({
          lessonId: lesson.id,
          providerCardId: displayCards[selectedCardIndex]?.providerCardId,
        });
        router.replace(getLessonJoinSuccessPageUrl(lesson.id));
      } catch (error) {
        Sentry.captureException(error);
        setPaymentError(error as Error);
        setPaymentRequestStatus(RequestStatus.Idle);
      }
    }
  };

  return (
    <>
      <Head noIndex title="Join Lesson" description="Join your lesson on Bounce" />
      <SafeAreaPage isHideSidebar={IS_HIDE_SIDEBAR}>
        <div className="relative flex h-full grow flex-col pb-8">
          <div className="flex h-full w-full grow flex-col">
            <div className="w-full">
              <FixedPageTitle
                title="Join lesson"
                isPop
                isBackdropBlur
                isHideSidebar={IS_HIDE_SIDEBAR}
              />
            </div>
            {!!lesson ? (
              <div className="flex h-full flex-col px-6">
                <div className="mx-auto w-full max-w-md lg:hidden">
                  {/* <h1 className="text-2xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  Reserve your spot
                </h1> */}
                  <div>
                    <CardLesson
                      useShortName
                      title={lesson.title}
                      imageUrl={getLessonImageUrl({ path: lesson.coverImagePath })}
                      date={format(new Date(lesson.startDateTime), 'iii MMM d')}
                      startTime={format(new Date(lesson.startDateTime), 'p')}
                      endTime={format(new Date(lesson.endDateTime), 'p')}
                      type={lesson.type}
                      courtName={lesson.userCustomCourt?.title || ''}
                      coachName={lesson.ownerProfile?.fullName || ''}
                      coachProfileImage={lesson.ownerProfile?.profileImagePath || ''}
                    />
                  </div>
                  <Pricing lessonPricing={lessonPricing} />
                </div>
                <div className="flex w-full justify-center">
                  <div className="mt-4 w-full max-w-md border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:border-r lg:pb-8 lg:pr-6">
                    <h2 className="text-2xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                      Select payment method
                    </h2>
                    <div
                      className={classNames(
                        paymentRequestStatus === RequestStatus.InProgress && 'opacity-50',
                      )}
                    >
                      {displayCards.length > 0 ? (
                        <div className="mt-4">
                          <RadioGroup value={selectedCardIndex} onChange={setSelectedCardIndex}>
                            <RadioGroup.Label className="sr-only">Credit card</RadioGroup.Label>
                            <div className="space-y-3">
                              {displayCards.map((card, index) => {
                                if (!card) {
                                  return null;
                                }

                                return (
                                  <RadioGroup.Option
                                    key={card.providerCardId}
                                    value={index}
                                    className={({ checked }) =>
                                      classNames(
                                        checked
                                          ? 'border-color-brand-primary bg-color-bg-lightmode-primary shadow-brand dark:bg-color-bg-darkmode-primary'
                                          : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                                        'flex cursor-pointer flex-col rounded-md border px-4 py-3 transition-shadow focus:outline-none',
                                      )
                                    }
                                  >
                                    {({ active, checked }) => (
                                      <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                          <span
                                            className={classNames(
                                              checked
                                                ? 'border-transparent bg-color-brand-primary'
                                                : 'border-gray-300 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                                              active
                                                ? 'ring-2 ring-color-brand-primary ring-offset-2'
                                                : '',
                                              'flex h-5 w-5 items-center justify-center rounded-full border',
                                            )}
                                            aria-hidden="true"
                                          >
                                            <span className="h-1.5 w-1.5 rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                                          </span>
                                          <RadioGroup.Label className="ml-3 text-sm">
                                            {CardBrandsDisplayName[card.brand]}{' '}
                                            <span className="ml-2">••••</span> {card.last4}
                                          </RadioGroup.Label>
                                        </div>
                                        <RadioGroup.Description as="span" className="text-sm">
                                          {card.expireMonth}/{card.expireYear}
                                        </RadioGroup.Description>
                                      </div>
                                    )}
                                  </RadioGroup.Option>
                                );
                              })}
                            </div>
                          </RadioGroup>
                        </div>
                      ) : (
                        <div className="mt-4 text-center text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                          Please add a credit card to pay and join the lesson
                        </div>
                      )}
                    </div>
                    <div className="mt-6 justify-end lg:flex">
                      <button
                        type="button"
                        className="button-rounded-full-primary-inverted lg:button-rounded-inline-brand-inverted relative lg:w-auto lg:pl-20 lg:pr-7"
                        onClick={() => setIsAddCardOpen(!isAddCardOpen)}
                        disabled={
                          stripeKeyFetchStatus === RequestStatus.InProgress ||
                          paymentRequestStatus === RequestStatus.InProgress
                        }
                      >
                        <CreditCardIcon className="absolute left-6 top-1/2 h-7 w-7 -translate-y-1/2" />{' '}
                        Add credit card
                      </button>
                    </div>
                  </div>
                  <div className="ml-6 hidden w-full max-w-sm lg:block">
                    <div className="w-full">
                      <div>
                        <CardLesson
                          useShortName
                          title={lesson.title}
                          imageUrl={getLessonImageUrl({ path: lesson.coverImagePath })}
                          date={format(new Date(lesson.startDateTime), 'MMM d')}
                          startTime={format(new Date(lesson.startDateTime), 'p')}
                          endTime={format(new Date(lesson.endDateTime), 'p')}
                          type={lesson.type}
                          courtName={lesson.userCustomCourt?.title || ''}
                          coachName={lesson.ownerProfile?.fullName || ''}
                          coachProfileImage={lesson.ownerProfile?.profileImagePath || ''}
                        />
                      </div>
                      <Pricing lessonPricing={lessonPricing} />
                      <div className="mt-8">
                        <button
                          className="button-rounded-full-primary w-full"
                          disabled={
                            !hasCards ||
                            !lesson ||
                            paymentRequestStatus === RequestStatus.InProgress
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmitPayment();
                          }}
                        >
                          {hasCards
                            ? `Pay and join ${
                                !!lessonPricing?.orderTotal &&
                                ` ${
                                  convertUnitPriceToFormattedPrice(lessonPricing.orderTotal)
                                    .priceDisplay
                                }`
                              }`
                            : 'Add a credit card to continue'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>&nbsp;</div>
            )}
            <div className="lg:hidden">
              <div className="safearea-pad-bot">
                <div className="pb-14">
                  <div className="h-16">&nbsp;</div>
                </div>
              </div>
              <div className="fixed bottom-0 left-0 w-full bg-color-bg-lightmode-primary bg-opacity-50 px-6 backdrop-blur-sm dark:bg-color-bg-darkmode-primary">
                <div className="safearea-pad-bot mx-auto max-w-md">
                  <div className="pb-14">
                    {!!paymentError?.message && (
                      <div className="mb-3 rounded border border-color-error p-4 text-center text-sm text-color-error">
                        {paymentError.message}
                      </div>
                    )}
                    <button
                      className="button-rounded-inline-primary h-14 w-full"
                      disabled={
                        !hasCards || !lesson || paymentRequestStatus === RequestStatus.InProgress
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmitPayment();
                      }}
                    >
                      {hasCards
                        ? `Pay and join ${
                            !!lessonPricing?.orderTotal &&
                            ` ${
                              convertUnitPriceToFormattedPrice(lessonPricing.orderTotal)
                                .priceDisplay
                            }`
                          }`
                        : 'Add a credit card to continue...'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SafeAreaPage>
      {!!stripeKeys?.setupIntentClientSecret && (
        <div style={{ display: 'none' }}>
          <Elements
            stripe={stripe}
            options={{
              clientSecret: stripeKeys?.setupIntentClientSecret,
              loader: 'always',
              appearance: {
                theme: 'flat',
              },
            }}
          >
            <AddCardForm
              handleCompleteSetupIntent={handleCompleteSetupIntent}
              returnUrl={`${process.env.APP_URL}${getLessonJoinPageUrl(
                lesson?.id,
              )}?card-added=true`}
            />
          </Elements>
        </div>
      )}
      <Modal isOpen={isAddCardOpen} handleClose={() => setIsAddCardOpen(false)}>
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Add credit card
            </h2>
            <button type="button" className="outline-none" onClick={() => setIsAddCardOpen(false)}>
              <XMarkIcon className="h-7 w-7 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
            </button>
          </div>
          <Elements
            stripe={stripe}
            options={{
              clientSecret: stripeKeys?.setupIntentClientSecret,
              loader: 'always',
              appearance: {
                theme: 'flat',
              },
            }}
          >
            <AddCardForm
              handleCompleteSetupIntent={handleCompleteSetupIntent}
              returnUrl={`${process.env.APP_URL}${getLessonJoinPageUrl(
                lesson?.id,
              )}?card-added=true`}
            />
          </Elements>
        </div>
      </Modal>
    </>
  );
};

export default LessonJoin;
