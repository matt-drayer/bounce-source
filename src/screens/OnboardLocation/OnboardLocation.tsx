import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
// import Link from 'components/Link'; // NOTE: NEED THIS TO TOGGLE TO SIGN UP AND FORGOT PASSWORD
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import { COACH_ONBOARDING_STEPS, LOGIN_PAGE, PLAYER_ONBOARDING_STEPS } from 'constants/pages';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import { useSetUserLocationMutation } from 'types/generated/client';
import { filterSubdivisionsForCountry } from 'utils/shared/countries/filterSubdivisionsForCountry';
import { useViewer } from 'hooks/useViewer';
import OnboardingPage from 'layouts/OnboardingPage';
import OnboardNextButton from 'components/onboarding/OnboardNextButton';
import OnboardStepTracker from 'components/onboarding/OnboardStepTracker';
import OnboardStepTrackerPanel from 'components/onboarding/OnboardStepTrackerPanel';
import Head from 'components/utilities/Head';
import { Props } from './props';

const TITLE_PHRASE_COACH = 'Where do you coach?';
const TITLE_PHRASE_PLAYER = 'Where do you play?';

const OnboardLocation: React.FC<Props> = ({ isCoach, countries, subdivisionsByCountry }) => {
  const router = useRouter();
  const viewer = useViewer();
  const [setUserLocationMutation, { loading }] = useSetUserLocationMutation();
  const [country, setCountry] = React.useState(countries[0].id);
  const [countrySubdivision, setCountrySubdivision] = React.useState('');
  const [city, setCity] = React.useState('');
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const isDisabled =
    requestStatus === RequestStatus.InProgress ||
    requestStatus === RequestStatus.Success ||
    loading;
  const stepUrls = isCoach ? COACH_ONBOARDING_STEPS : PLAYER_ONBOARDING_STEPS;
  const onboardingStepIndex = stepUrls.map((s) => s.url).indexOf(router.asPath);
  const nextPageUrl = stepUrls[onboardingStepIndex + 1]?.url;
  const activeCountry = countries.find((c) => c.id === country);
  const activeSubdivision = subdivisionsByCountry[activeCountry?.id || ''];

  React.useEffect(() => {
    const isIdle =
      viewer.status !== AuthStatus.Loading &&
      requestStatus !== RequestStatus.InProgress &&
      requestStatus !== RequestStatus.Success;
    const hasViewer = viewer.status === AuthStatus.User && viewer.viewer;

    if (!hasViewer && isIdle) {
      const next = router.query.next as string;
      const redirectUrl = next ? decodeURIComponent(next) : LOGIN_PAGE;
      router.push(redirectUrl);
    }
  }, [viewer, requestStatus]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    async (e) => {
      e.preventDefault();

      // NOTE: These will be graphql so probably won't be tracking addition state
      if (requestStatus === RequestStatus.InProgress || requestStatus === RequestStatus.Success) {
        return;
      }

      console.log(country, countrySubdivision, city);

      try {
        await setUserLocationMutation({
          variables: {
            id: viewer.userId,
            countryId: country,
            countrySubdivisionId: countrySubdivision || null,
            cityName: city,
          },
        });
        router.push(nextPageUrl);
      } catch (error) {
        Sentry.captureException(error);
        setRequestStatus(RequestStatus.Error);
        toast.error('There was an error. Please try again or reach out to team@bounce');
      }

      setRequestStatus(RequestStatus.InProgress);
      router.push(nextPageUrl);
    },
    [country, countrySubdivision, city, requestStatus, nextPageUrl, router],
  );

  return (
    <>
      <Head
        noIndex
        title="Onboarding Location"
        description="Set your location to match coaches and players"
      />
      <OnboardingPage
        onboardSteps={
          <OnboardStepTrackerPanel currentStep={onboardingStepIndex} steps={stepUrls} />
        }
      >
        <form
          className="safearea-pad-y h-safe-screen flex w-full grow flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex h-full w-full grow flex-col items-center overflow-y-auto pb-4">
            <div className="w-full max-w-xl shrink-0 px-6 pt-8 lg:hidden lg:max-w-onboard-content-container">
              <OnboardStepTracker currentStep={onboardingStepIndex} totalSteps={stepUrls.length} />
            </div>
            <div className="flex w-full max-w-xl flex-auto flex-col items-center justify-center px-6 py-4">
              <div className="flex w-full max-w-xl flex-auto flex-col items-center justify-center lg:max-w-onboard-content-container">
                <img src="/images/ball/ball-location.svg" className="w-20" alt="logo" />
                <h1 className="mt-6 flex shrink-0 items-center justify-center">
                  <span className="text-center text-2xl text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {isCoach ? TITLE_PHRASE_COACH : TITLE_PHRASE_PLAYER}
                  </span>
                </h1>
                <div className="mt-2 text-center text-base font-normal leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  Please select your location
                </div>
                <div className="mt-6 flex w-full flex-col space-y-8">
                  <div className="w-full">
                    <label className="sr-only" htmlFor="country">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setCountrySubdivision('');
                      }}
                      placeholder="Country"
                      disabled={isDisabled}
                      className="input-form"
                      required
                    >
                      {countries.map((country) => {
                        return (
                          <option value={country.id} key={country.id}>
                            {country.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {!!activeSubdivision && (
                    <div className="w-full">
                      <label className="sr-only" htmlFor="region">
                        State/Region
                      </label>
                      <select
                        id="region"
                        name="region"
                        autoComplete="region"
                        value={countrySubdivision}
                        onChange={(e) => setCountrySubdivision(e.target.value)}
                        placeholder="State or Region"
                        disabled={isDisabled}
                        className="input-form"
                        required
                      >
                        <option value="">State or Region</option>
                        {filterSubdivisionsForCountry(
                          activeCountry?.id || '',
                          activeSubdivision || [],
                        ).map((subdivision) => {
                          return (
                            <option value={subdivision.id} key={subdivision.id}>
                              {subdivision.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                  <div className="w-full">
                    <label className="sr-only" htmlFor="city">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      type="text"
                      placeholder="City"
                      disabled={isDisabled}
                      className="input-form"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full shrink-0 px-6 pb-4 lg:px-0">
            <OnboardNextButton isDisabled={isDisabled} />
          </div>
        </form>
      </OnboardingPage>
    </>
  );
};

export default OnboardLocation;
