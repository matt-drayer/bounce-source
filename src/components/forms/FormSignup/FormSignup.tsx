import * as React from 'react';
import { useApolloClient } from '@apollo/client';
import { Combobox, Listbox, Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import * as Sentry from '@sentry/nextjs';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import {
  HOME_PAGE,
  LOGIN_PAGE,
  ONBOARDING_COACH,
  ONBOARDING_COMPLETE_PAGE,
  ONBOARDING_PLAYER,
  SIGNUP_CODE_PAGE,
} from 'constants/pages';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import {
  AccountType,
  MINIMUM_PASSWORD_LENGTH,
  getIsValidPasswordFormat,
  getIsValidUsernameCaseIncensitiveFormat,
  getIsValidUsernameFormat,
} from 'constants/user';
import {
  GetExistingUserQuery,
  useCheckUsernameAvailabilityLazyQuery,
  useGetClosestCitiesLazyQuery,
  useGetGroupByAccessCodeLazyQuery,
  useInsertSignupRequestMutation,
  useInsertUserGroupMembershipMutation,
} from 'types/generated/client';
import { auth } from 'services/client/firebase';
import { pollForNewUser } from 'services/client/pollForNewUser';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';
import { getPlatform } from 'utils/mobile/getPlatform';
import { calculateHaversineDistance } from 'utils/shared/geo/calculateHaversineDistance';
import { milesToMeters } from 'utils/shared/geo/milesToMeters';
import { splitNameToFirstLast } from 'utils/shared/name/splitNameToFirstLast';
import { validateEmail } from 'utils/shared/validateEmail';
import { useGeoLocation } from 'hooks/useGeoLocation';
import { useGetIpAddress } from 'hooks/useGetIpAddress';
import { useViewer } from 'hooks/useViewer';
import BounceLogoSplashShadow from 'svg/BounceLogoSplashShadow';
import { Button } from 'components/Button';
import { ButtonText } from 'components/Button';
import Link from 'components/Link';
import CardError from 'components/cards/CardError';
import AddressSearch from 'components/forms/AddressSearch';
import classNames from 'styles/utils/classNames';

const IS_USERNAME_INCLUDED = false;
const CITY_DISTANCE_MILES = 20;

interface Props {
  isShowLoginLink?: boolean;
  setAccountTypeParent?: (accountType: AccountType) => void;
  shouldOnboard?: boolean;
  setIsCloseBlocked?: (isCloseBlocked: boolean) => void;
  handleSignupSuccess?: ({ userId }: { userId: string }) => void | Promise<void>;
  toggleLogin?: () => void;
  title?: string;
  cta?: string;
  ignoreText?: string;
  ignoreAction?: () => void;
  defaultEmail?: string;
  defaultName?: string;
  isFormOnly?: boolean;
  formWrapperClassName?: string;
  buttonWrapperClassName?: string;
  spacerClassName?: string;
  shouldSkipReload?: boolean;
  handleAuthComplete?: () => void;
}

export default function FormSignup({
  isShowLoginLink = false,
  setAccountTypeParent = () => {},
  setIsCloseBlocked = () => {},
  shouldOnboard,
  handleSignupSuccess,
  toggleLogin,
  title = 'Never miss a tournament!',
  cta = 'We’ll ping you when there’s a tournament near you.',
  ignoreText,
  ignoreAction,
  defaultEmail = '',
  defaultName = '',
  isFormOnly,
  formWrapperClassName,
  buttonWrapperClassName,
  spacerClassName,
  shouldSkipReload,
  handleAuthComplete,
}: Props) {
  const router = useRouter();
  const viewer = useViewer();
  const client = useApolloClient();
  const {
    position,
    activeAutocompleteAddress,
    suggestedAddresses,
    addressString,
    handleSubmitAutocomplete,
    handleAutcompleteSuggestions,
    setAddressString,
  } = useGeoLocation();
  const [cityId, setCityId] = React.useState<null | string>(null);
  const [lastValidAddress, setLastValidAddress] = React.useState<null | string>(addressString);
  const { ipResponse } = useGetIpAddress();
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const [insertSignupRequestQuery, signupRequestResults] = useInsertSignupRequestMutation();
  const [fetchUsernameAvailability, { data, loading, called }] =
    useCheckUsernameAvailabilityLazyQuery();
  const [
    getGroupByAccessCodeLazyQuery,
    {
      data: groupData,
      loading: isLoadingGetGroupByAccessCodeLazyQuery,
      error: errorGetGroupByAccessCodeLazyQuery,
    },
  ] = useGetGroupByAccessCodeLazyQuery();
  const [getClosestCitiesLazyQuery, { data: cityData, loading: cityDataLoading }] =
    useGetClosestCitiesLazyQuery();
  const [insertUserGroupMembershipMutation] = useInsertUserGroupMembershipMutation();
  const [accountType, setAccountType] = React.useState(AccountType.Player);
  const [fullName, setFullName] = React.useState(defaultName);
  const [email, setEmail] = React.useState(defaultEmail);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [_isFocused, setIsFocused] = React.useState(false);
  // TODO: We should probably use a form manager so we're not handling these errors and validations ourselves
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [usernameError, setUsernameError] = React.useState('');
  const [locationError, setLocationError] = React.useState('');
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const [error, setError] = React.useState<ErrorResponse | null>(null);
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const isDisabled =
    /**
     * @note temporarily disable and check on UX
     */
    // cityDataLoading ||
    requestStatus === RequestStatus.InProgress ||
    requestStatus === RequestStatus.Success ||
    viewer.status === AuthStatus.User;
  const isHidden =
    !getIsNativePlatform() &&
    (viewer.status === AuthStatus.Loading || viewer.status === AuthStatus.User) &&
    !error &&
    requestStatus !== RequestStatus.InProgress &&
    requestStatus !== RequestStatus.Success;
  const isCoach = accountType === AccountType.Coach;
  const isAvailableUsername = !data?.usernamesActive?.length && !data?.usernamesClaimed?.length;
  const isValidUsername = getIsValidUsernameCaseIncensitiveFormat(username);
  const isUsernameAllowed = isAvailableUsername && isValidUsername;
  const isUsernameInputFocused =
    typeof window !== 'undefined' && usernameRef?.current === document.activeElement;
  const isPasswordInputFocused =
    typeof window !== 'undefined' && passwordRef?.current === document.activeElement;
  const group = groupData?.groups[0];

  React.useEffect(() => {
    if (router.isReady && position) {
      // find closest city to the position
      getClosestCitiesLazyQuery({
        variables: {
          distance: milesToMeters(CITY_DISTANCE_MILES),
          from: {
            type: 'Point',
            coordinates: [position.longitude, position.latitude],
          },
        },
      }).then((response) => {
        const cities = response?.data?.cities || [];
        const citiesByDistance = cities
          .map((city) => {
            const distance = calculateHaversineDistance({
              coord1: {
                latitude: position.latitude,
                longitude: position.longitude,
              },
              coord2: {
                latitude: city.latitude,
                longitude: city.longitude,
              },
            });
            return {
              ...city,
              distance,
            };
          })
          .sort((a, b) => a.distance - b.distance);
        const closestCity = citiesByDistance[0];

        if (closestCity) {
          setCityId(closestCity.id);
        }
      });
    }
  }, [router.isReady, position]);

  React.useEffect(() => {
    const fetchGroup = async (groupCode: string) => {
      getGroupByAccessCodeLazyQuery({
        variables: {
          accessCode: groupCode,
        },
      });
    };

    if (router.isReady) {
      const groupCode = router.query.code as string;

      if (groupCode) {
        fetchGroup(groupCode);
      }
    }
  }, [router.isReady]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (requestStatus === RequestStatus.InProgress || requestStatus === RequestStatus.Success) {
      return;
    }

    setIsCloseBlocked(true);
    setRequestStatus(RequestStatus.InProgress);
    setError(null);
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setLocationError('');

    const submissionUsername = username.toLowerCase().trim();

    try {
      const isValidEmail = validateEmail(email);
      const isValidUsername = getIsValidUsernameFormat(submissionUsername);
      const isValidPassword = getIsValidPasswordFormat(password);
      const claimedUsernameResponse = IS_USERNAME_INCLUDED
        ? await fetchUsernameAvailability({
            variables: {
              username: submissionUsername,
            },
          })
        : null;
      const isUsernameUnavailable = IS_USERNAME_INCLUDED
        ? (claimedUsernameResponse?.data?.usernamesClaimed?.length || 0) > 0 ||
          (claimedUsernameResponse?.data?.usernamesActive?.length || 0) > 0
        : false;
      const isValidLocation =
        !!position && !!position.latitude && !!position.longitude && !!addressString;
      console.log(
        'isValidLocation',
        isValidLocation,
        position,
        position?.latitude,
        position?.longitude,
        { addressString },
      );

      if (!isValidEmail) {
        setEmailError('Please enter a valid email address');
      }
      if (isUsernameUnavailable) {
        setUsernameError('Not available');
      }
      if (!isValidUsername && IS_USERNAME_INCLUDED) {
        setUsernameError('Invalid username format');
      }
      if (!isValidPassword) {
        setPasswordError(
          password.length < MINIMUM_PASSWORD_LENGTH
            ? 'Password must be at least 8 characters'
            : 'Invalid password format',
        );
      }
      if (!isValidLocation) {
        setLocationError('Please enter a valid location');
      }

      if (
        !isValidEmail ||
        (!isValidUsername && IS_USERNAME_INCLUDED) ||
        !isValidPassword ||
        isUsernameUnavailable ||
        !isValidLocation
      ) {
        setRequestStatus(RequestStatus.Idle);
        setIsCloseBlocked(false);
        return;
      }
    } catch (error) {
      Sentry.captureException(error);
      setRequestStatus(RequestStatus.Error);
      setIsCloseBlocked(false);
      // @ts-ignore
      setError(error);
      return;
    }

    try {
      await insertSignupRequestQuery({
        variables: {
          email: email.toLowerCase(),
          username: submissionUsername,
          fullName,
          preferredName: splitNameToFirstLast(fullName).firstName,
          accountType,
          ip: ipResponse?.ip || '',
          country: ipResponse?.country || '',
          region: ipResponse?.region || '',
          city: ipResponse?.city || '',
          fullDetails: ipResponse || null,
          platform: getPlatform(),
          // NOTE: These fields are from a previously paid API
          timezone: '', // I can get timezone in JS
          zip: '',
          cityId: cityId || null,
          latitude: position?.latitude || null,
          longitude: position?.longitude || null,
        },
      });
    } catch (error) {
      Sentry.captureException(error);
      setRequestStatus(RequestStatus.Error);
      setIsCloseBlocked(false);
      // @ts-ignore
      setError(error);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(function (user) {
        setRequestStatus(RequestStatus.Success);
        return user;
      })
      .then(async (user) => {
        sendEmailVerification(user.user);
        const databaseUser = (await pollForNewUser(
          client,
          user.user,
        )) as GetExistingUserQuery['users'][0];

        if (handleSignupSuccess && databaseUser.id) {
          await handleSignupSuccess({ userId: databaseUser.id });
        }

        const groupId = groupData?.groups[0]?.id;
        if (groupId && databaseUser) {
          await insertUserGroupMembershipMutation({
            variables: {
              userId: databaseUser.id,
              groupId: groupId,
            },
          });
        }

        setIsCloseBlocked(false);

        // const databaseUser = await pollForUser(client, user.user);
        // TODO: Check the database user and see if any fields are missing.
        // Send them to a pre-onboarding if so to collect them because we don't want them to sign up again.

        if (shouldOnboard) {
          /**
           * @note onboarding turned off
           */
          // const redirectUrl = isCoach ? ONBOARDING_COACH : ONBOARDING_PLAYER;
          const redirectUrl = ONBOARDING_COMPLETE_PAGE;
          router.push(redirectUrl);
        } else if (!shouldSkipReload) {
          router.reload();
        } else if (handleAuthComplete) {
          handleAuthComplete();
        }
      })
      .catch(function (errorResponse) {
        Sentry.captureException('Sign up / poll did not reach success state', errorResponse);
        setRequestStatus(RequestStatus.Error);
        setIsCloseBlocked(false);
        setError(errorResponse.code ? new Error(errorResponse.code) : errorResponse);
      });
  };

  return (
    <>
      <form
        className="flex h-full w-full grow flex-col items-center lg:justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex h-full w-full grow flex-col items-center overflow-y-auto lg:h-auto lg:grow-0">
          {!isFormOnly && (
            <>
              {shouldOnboard ? (
                <div
                  className={classNames(
                    'flex grow flex-col items-center justify-center pt-5 transition-opacity',
                    !group ? 'opacity-0' : 'opacity-100',
                  )}
                >
                  <p className="mb-3 text-sm text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                    Welcome to
                  </p>
                  <h1 className="text-2xl font-semibold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {group?.title || 'Bounce'}
                  </h1>
                  <h2 className="mt-[1px] font-medium">with {group?.ownerUserProfile?.fullName}</h2>
                </div>
              ) : (
                <>
                  <h1 className="flex shrink-0 items-center justify-center space-x-4 px-4 pt-12 text-center sm:px-[6.25rem] lg:pt-10">
                    <span className="text-2xl font-semibold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                      <BounceLogoSplashShadow className="h-[7.5rem]" aria-label="Bounce Logo" />
                    </span>
                  </h1>
                  <h2 className="typography-product-display mt-1 text-pretty px-2 text-center text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {title}
                  </h2>
                  <h3 className="typography-product-body mt-ds-md text-pretty px-2 text-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                    {cta}
                  </h3>
                </>
              )}
            </>
          )}
          <div
            className={classNames(
              'flex w-full flex-auto flex-col items-center justify-center transition-opacity duration-700',
              !isFormOnly && 'mt-4 px-4 py-4 sm:px-[6.25rem]',
              !!formWrapperClassName && formWrapperClassName,
              isHidden ? 'opacity-0' : 'opacity-100',
            )}
          >
            {/* <h2 className="font mb-6 text-xl lg:mt-4">Create your account</h2> */}
            {/* <div className="mb-8 flex w-full">
            <div className="flex w-full rounded-3xl bg-color-bg-input-lightmode-primary dark:bg-color-bg-input-darkmode-primary p-1 shadow-sm">
              <div className="relative flex w-full text-center">
                <div
                  className={classNames(
                    'absolute left-0 h-full w-1/2 rounded-3xl bg-color-button-brand-primary  shadow-sm transition-transform',
                    isCoach ? 'translate-x-full' : 'translate-x-0',
                    isDisabled && 'bg-opacity-50',
                  )}
                >
                  &nbsp;
                </div>
                <button
                  onClick={() => {
                    setAccountType(AccountType.Player);
                    setAccountTypeParent(AccountType.Player);
                  }}
                  type="button"
                  disabled={isDisabled}
                  className={classNames(
                    'relative h-10 w-1/2',
                    !isCoach
                      ? 'text-color-text-darkmode-primary'
                      : 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                  )}
                >
                  Player
                </button>
                <button
                  onClick={() => {
                    setAccountType(AccountType.Coach);
                    setAccountTypeParent(AccountType.Coach);
                  }}
                  type="button"
                  disabled={isDisabled}
                  className={classNames(
                    'relative h-10 w-1/2',
                    isCoach
                      ? 'text-color-text-darkmode-primary'
                      : 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary',
                  )}
                >
                  Coach
                </button>
              </div>
            </div>
          </div> */}
            <div
              className={classNames(
                'flex w-full flex-col',
                spacerClassName ? spacerClassName : 'space-y-ds-2xl',
              )}
            >
              <div className="w-full">
                <label className="sr-only" htmlFor="name">
                  First and last name
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  type="text"
                  value={fullName}
                  onFocus={() => setError(null)}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="First and last name"
                  disabled={isDisabled}
                  className="input-form"
                  required
                />
              </div>
              <div className="w-full">
                <AddressSearch
                  id="location"
                  name="location"
                  autoComplete="off"
                  type="text"
                  disabled={isDisabled}
                  onBlur={() => {
                    if (lastValidAddress && lastValidAddress !== addressString) {
                      setAddressString(lastValidAddress);
                    }
                  }}
                  onFocus={() => {
                    setError(null);
                    setLocationError('');
                  }}
                  handleSubmit={(a) => {
                    setLastValidAddress(a?.description || addressString);
                    handleSubmitAutocomplete(a);
                  }}
                  handleAutcompleteSuggestions={handleAutcompleteSuggestions}
                  addressString={addressString}
                  suggestedAddresses={suggestedAddresses.slice(0, 3)}
                  activeAutocompleteAddress={activeAutocompleteAddress}
                  className={classNames('input-form', !!locationError && 'text-color-error')}
                  placeholder="City or zip"
                />
                {!!locationError && (
                  <div className="mt-2 max-w-xs text-xs text-color-error">{locationError}</div>
                )}
              </div>
              <div className="w-full">
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => {
                    setError(null);
                    setEmailError('');
                  }}
                  placeholder="Email"
                  disabled={isDisabled}
                  className={classNames('input-form', !!emailError && 'text-color-error')}
                  required
                />
                {!!emailError && (
                  <div className="mt-2 max-w-xs text-xs text-color-error">{emailError}</div>
                )}
              </div>
              {IS_USERNAME_INCLUDED && (
                <div className="w-full">
                  <label className="sr-only" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    autoComplete="username"
                    autoCapitalize="off"
                    type="text"
                    value={username}
                    ref={usernameRef}
                    onChange={(e) => setUsername(e.target.value.trim())}
                    onFocus={() => {
                      setError(null);
                      setIsFocused(true);
                      setUsernameError('');
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                      fetchUsernameAvailability({
                        variables: {
                          username: username.toLowerCase(),
                        },
                      });
                    }}
                    placeholder="Username"
                    disabled={isDisabled}
                    className={classNames('input-form', !!usernameError && 'text-color-error')}
                    minLength={4}
                    maxLength={28}
                    required
                  />
                  <div className="mt-2 flex max-w-xs text-xs">
                    <div className="mr-2">
                      {(isUsernameInputFocused || (!called && !loading)) && (
                        <UserCircleIcon className="h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                      )}
                      {!isUsernameInputFocused && loading && (
                        <EllipsisHorizontalCircleIcon className="h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                      )}
                      {!isUsernameInputFocused && !loading && called && !isUsernameAllowed && (
                        <ExclamationCircleIcon className="h-4 w-4 text-color-error" />
                      )}
                      {!isUsernameInputFocused && !loading && called && isUsernameAllowed && (
                        <CheckCircleIcon className="h-4 w-4 text-color-success" />
                      )}
                    </div>
                    <div className="max-w-xs text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      {((!usernameError &&
                        !loading &&
                        isAvailableUsername &&
                        !isValidUsername &&
                        !isUsernameInputFocused) ||
                        !called) &&
                        'Minimum 4 characters. Letters, numbers, and underscores only.'}
                      {!usernameError &&
                        !isUsernameInputFocused &&
                        !loading &&
                        isUsernameAllowed &&
                        'Available'}
                      {!usernameError &&
                        !isUsernameInputFocused &&
                        !loading &&
                        !isAvailableUsername &&
                        'Not available'}
                      {!!usernameError && <span className="text-color-error">{usernameError}</span>}
                    </div>
                  </div>
                </div>
              )}
              <div className="relative w-full">
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    type={isShowPassword ? 'text' : 'password'}
                    value={password}
                    ref={passwordRef}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => {
                      setError(null);
                      setIsFocused(true);
                      setPasswordError('');
                    }}
                    onBlur={() => setIsFocused(false)}
                    minLength={MINIMUM_PASSWORD_LENGTH}
                    placeholder="Password"
                    disabled={isDisabled}
                    className={classNames(
                      'input-form ph-no-autocapture',
                      !!passwordError && 'text-color-error',
                    )}
                    required
                  />
                  <div className="absolute right-4 top-3 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                    {isShowPassword ? (
                      <button
                        className="h-4 w-4"
                        type="button"
                        onClick={() => setIsShowPassword(false)}
                      >
                        <EyeIcon />
                      </button>
                    ) : (
                      <button type="button" onClick={() => setIsShowPassword(true)}>
                        <EyeSlashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {!!passwordError && (
                  <div className="mt-2 flex max-w-xs text-xs">
                    <div className="mr-2">
                      {(!password?.length ||
                        (isPasswordInputFocused && !getIsValidPasswordFormat(password))) && (
                        <InformationCircleIcon className="h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                      )}
                      {!isPasswordInputFocused &&
                        !!password?.length &&
                        !getIsValidPasswordFormat(password) && (
                          <ExclamationCircleIcon className="h-4 w-4 text-color-error" />
                        )}
                      {getIsValidPasswordFormat(password) && (
                        <CheckCircleIcon className="h-4 w-4 text-color-success" />
                      )}
                    </div>
                    <div className="max-w-xs text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      {passwordError && <span className="text-color-error">{passwordError}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={classNames(
            'w-full shrink-0 transition-opacity duration-700',
            isHidden ? 'opacity-0' : 'opacity-100',
          )}
        >
          <div
            className={classNames(
              'w-full',
              !isFormOnly && 'px-4 pb-16 sm:px-[6.25rem]',
              !!buttonWrapperClassName && buttonWrapperClassName,
            )}
          >
            {isShowLoginLink && (
              <div className="mb-6 text-center text-sm">
                <span className="text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  Have an account?
                </span>{' '}
                {isDisabled ? (
                  <span className="font-medium text-color-brand-highlight opacity-50">Log in</span>
                ) : toggleLogin ? (
                  <button
                    onClick={() => toggleLogin()}
                    type="button"
                    className="font-medium text-color-brand-highlight"
                  >
                    Log in
                  </button>
                ) : (
                  <Link href={LOGIN_PAGE} className="font-medium text-color-brand-highlight">
                    Log in
                  </Link>
                )}
              </div>
            )}
            {!!error?.message && (
              <div className="mb-4">
                <CardError>{error.message}</CardError>
              </div>
            )}
            <Button variant="primary" size="lg" type="submit" disabled={isDisabled}>
              {isDisabled ? 'Creating account...' : 'Sign up'}
            </Button>
            {!!ignoreText && !!ignoreAction && (
              <div className="mt-6 text-center">
                <ButtonText
                  onClick={ignoreAction}
                  className="typography-product-button-label-medium text-color-text-brand"
                >
                  {ignoreText}
                </ButtonText>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
