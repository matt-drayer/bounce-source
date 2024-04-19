import * as React from 'react';
import { RadioGroup } from '@headlessui/react';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import { getLessonJoinPageUrl, getLessonJoinSuccessPageUrl } from 'constants/pages';
import { PaymentFulfillmentChannelsEnum, useGetLessonByIdLazyQuery } from 'types/generated/client';
import { createLessonOffPlatformPayment } from 'services/client/payments/createLessonOffPlatformPayment';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import PaymentLogo from 'svg/PaymentLogo';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Link from 'components/Link';
import FixedPageTitle from 'components/PageTitle/FixedPageTitle';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';
import InfoBox from './InfoBox';

const IS_HIDE_SIDEBAR = true;
const INFO_ON_PLATFORM =
  'Bounce will process the payment and refund. A 10% service fee will be charged.';
const INFO_OFF_PLATFORM = 'You must coordinate with the coach to pay for the lesson.';
const DISABLED_ON_PLATFORM = 'The coach has disabled this option';

const LessonJoinPaymentFulfillmentChannel = () => {
  const router = useRouter();
  const viewer = useViewer();
  const { user } = useGetCurrentUser();
  const [paymentMethodIndex, setPaymentMethodIndex] = React.useState(
    PaymentFulfillmentChannelsEnum.OnPlatform,
  );
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [getLessonByIdQuery, { data: lessonData, loading, called }] = useGetLessonByIdLazyQuery();
  const isDisabled = loading || !called || isFetching;
  const lesson = lessonData?.lessonsByPk;
  const isOnlyOffPlatform =
    lesson?.paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.OffPlatform;

  React.useEffect(() => {
    const fetchLesson = async (id: string) => {
      try {
        const response = await getLessonByIdQuery({
          variables: { id },
        });
        const paymentFulfillmentChannel = response.data?.lessonsByPk?.paymentFulfillmentChannel;
        if (
          !!paymentFulfillmentChannel &&
          paymentFulfillmentChannel === PaymentFulfillmentChannelsEnum.OffPlatform
        ) {
          setPaymentMethodIndex(paymentFulfillmentChannel);
        }
        setIsPageLoaded(true);
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

  return (
    <>
      <Head noIndex title="Join Lesson" description="Join your lesson on Bounce" />
      <SafeAreaPage isHideSidebar={IS_HIDE_SIDEBAR}>
        <div className="relative flex h-full grow flex-col pb-8">
          <div className="flex h-full w-full grow flex-col">
            <div className="w-full">
              <FixedPageTitle title="" isPop isBackdropBlur isHideSidebar={IS_HIDE_SIDEBAR} />
            </div>
            <div className="flex h-full grow flex-col px-6">
              <div className="mx-auto w-full max-w-md lg:hidden">
                <h1 className="text-center text-3xl font-bold leading-7 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  Payment
                </h1>
              </div>
              <div className="flex w-full grow flex-col justify-between lg:grow-0">
                <div className="mx-auto mt-4 w-full max-w-md lg:pb-8 lg:pr-6">
                  <h2 className="text-lg font-bold leading-7 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                    Select payment method
                  </h2>
                  <div className={classNames('')}>
                    <div className="mt-4">
                      <RadioGroup value={paymentMethodIndex} onChange={setPaymentMethodIndex}>
                        <RadioGroup.Label className="sr-only">Payment method</RadioGroup.Label>
                        <div className="space-y-6">
                          <RadioGroup.Option
                            value={PaymentFulfillmentChannelsEnum.OnPlatform}
                            disabled={isDisabled || isOnlyOffPlatform}
                          >
                            {({ active, checked }) => (
                              <>
                                <div
                                  className={classNames(
                                    isOnlyOffPlatform || isDisabled
                                      ? 'cursor-not-allowed opacity-50'
                                      : 'cursor-pointer',
                                    checked
                                      ? 'border-color-brand-primary bg-color-bg-lightmode-primary shadow-brand dark:bg-color-bg-darkmode-primary'
                                      : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                                    'flex flex-col rounded-md border px-4 py-3 transition-shadow focus:outline-none',
                                  )}
                                >
                                  <div className="flex w-full items-center justify-between">
                                    <div>
                                      <RadioGroup.Label className="sr-only">
                                        Pay through Bounce
                                      </RadioGroup.Label>
                                      <RadioGroup.Description as="span" className="text-sm">
                                        <PaymentLogo />
                                      </RadioGroup.Description>
                                      {isOnlyOffPlatform && isPageLoaded && (
                                        <div className="mt-1 text-sm text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                                          {DISABLED_ON_PLATFORM}
                                        </div>
                                      )}
                                    </div>
                                    <span
                                      className={classNames(
                                        checked
                                          ? 'border-transparent bg-color-brand-primary'
                                          : 'border-gray-300 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                                        active
                                          ? 'ring-2 ring-color-brand-primary ring-offset-2'
                                          : '',
                                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                                      )}
                                      aria-hidden="true"
                                    >
                                      <span className="h-1.5 w-1.5 rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                                    </span>
                                  </div>
                                </div>
                                {checked && isPageLoaded && <InfoBox>{INFO_ON_PLATFORM}</InfoBox>}
                              </>
                            )}
                          </RadioGroup.Option>
                          <RadioGroup.Option value={PaymentFulfillmentChannelsEnum.OffPlatform}>
                            {({ active, checked }) => (
                              <>
                                <div
                                  className={classNames(
                                    isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                                    checked
                                      ? 'border-color-brand-primary bg-color-bg-lightmode-primary shadow-brand dark:bg-color-bg-darkmode-primary'
                                      : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                                    'flex flex-col rounded-md border px-4 py-3 transition-shadow focus:outline-none',
                                  )}
                                >
                                  <div className="flex w-full items-center justify-between">
                                    <div>
                                      <RadioGroup.Label className="sr-only">
                                        Pay independently
                                      </RadioGroup.Label>
                                      <RadioGroup.Description
                                        as="span"
                                        className="text-sm font-medium"
                                      >
                                        Independent payment between you and the coach
                                      </RadioGroup.Description>
                                    </div>
                                    <span
                                      className={classNames(
                                        checked
                                          ? 'border-transparent bg-color-brand-primary'
                                          : 'border-gray-300 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                                        active
                                          ? 'ring-2 ring-color-brand-primary ring-offset-2'
                                          : '',
                                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                                      )}
                                      aria-hidden="true"
                                    >
                                      <span className="h-1.5 w-1.5 rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                                    </span>
                                  </div>
                                </div>
                                {checked && isPageLoaded && <InfoBox>{INFO_OFF_PLATFORM}</InfoBox>}
                              </>
                            )}
                          </RadioGroup.Option>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                <div className="mx-auto mt-6 w-full max-w-md justify-end lg:flex">
                  {paymentMethodIndex === PaymentFulfillmentChannelsEnum.OffPlatform ? (
                    <button
                      type="button"
                      className="button-rounded-full-primary relative lg:w-auto lg:px-8"
                      disabled={isDisabled}
                      onClick={async () => {
                        setIsFetching(true);
                        try {
                          await createLessonOffPlatformPayment({
                            lessonId: lesson?.id || '',
                          });
                          router.push(getLessonJoinSuccessPageUrl(lesson?.id || ''));
                        } catch (error) {
                          Sentry.captureException(error);
                          // @ts-ignore
                          toast.error(error.message);
                          setIsFetching(false);
                        }
                      }}
                    >
                      Join Lesson
                    </button>
                  ) : (
                    <Link
                      href={getLessonJoinPageUrl(lesson?.id || '')}
                      className="button-rounded-full-primary relative lg:w-auto lg:px-8"
                    >
                      Join Lesson
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SafeAreaPage>
    </>
  );
};

export default LessonJoinPaymentFulfillmentChannel;
