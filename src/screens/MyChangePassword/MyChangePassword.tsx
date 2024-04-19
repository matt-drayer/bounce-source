import * as React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import * as Sentry from '@sentry/nextjs';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import { LOGIN_PAGE } from 'constants/pages';
import { ErrorResponse, RequestStatus } from 'constants/requests';
import { getIsValidPasswordFormat } from 'constants/user';
import { auth } from 'services/client/firebase';
import { useViewer } from 'hooks/useViewer';
import SafeAreaPage from 'layouts/SafeAreaPage';
import PageTitle from 'components/PageTitle';
import CardError from 'components/cards/CardError';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';

const MyChangePassword = () => {
  const router = useRouter();
  const viewer = useViewer();
  const newPasswordRef = React.useRef<HTMLInputElement>(null);
  const [isShowOldPassword, setIsShowOldPassword] = React.useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = React.useState(false);
  const [_isFocused, setIsFocused] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [requestStatus, setRequestStatus] = React.useState(RequestStatus.Idle);
  const [passwordError, setPasswordError] = React.useState('');
  const [error, setError] = React.useState<ErrorResponse | null>(null);
  const isNewPasswordInputFocused =
    typeof window !== 'undefined' && newPasswordRef?.current === document.activeElement;
  const isDisabled =
    requestStatus === RequestStatus.InProgress ||
    requestStatus === RequestStatus.Success ||
    viewer.status === AuthStatus.Loading;

  React.useEffect(() => {
    if (router.isReady && viewer.status === AuthStatus.Anonymous) {
      router.push(LOGIN_PAGE);
    }
  }, [router.isReady, viewer.status]);

  return (
    <>
      <Head title="Change password" />
      <SafeAreaPage>
        <div className="relative flex h-full grow flex-col">
          <div className="flex h-full w-full grow flex-col">
            <PageTitle title="Change Password" isPop isBackdropBlur />
            <main className="flex flex-auto flex-col items-center px-6 pt-2">
              <div className="flex w-full max-w-main-content-container grow flex-col justify-between pb-8">
                <h2 className="leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  We were tired of your old password too, let’s get it changed.
                </h2>
                <form
                  className="flex grow flex-col"
                  onSubmit={async (e) => {
                    e.preventDefault();

                    if (
                      requestStatus === RequestStatus.InProgress ||
                      requestStatus === RequestStatus.Success
                    ) {
                      return;
                    }

                    setRequestStatus(RequestStatus.InProgress);
                    setError(null);
                    setPasswordError('');

                    try {
                      const user = viewer.viewer;
                      const isValidPassword = getIsValidPasswordFormat(newPassword);

                      if (!user?.email || !auth.currentUser?.email) {
                        setError(new Error('Could not validate your email'));
                        return;
                      }

                      if (!isValidPassword) {
                        setPasswordError('Invalid password format');
                        return;
                      }

                      const cred = EmailAuthProvider.credential(
                        auth.currentUser.email,
                        oldPassword,
                      );
                      await reauthenticateWithCredential(user, cred);
                      await updatePassword(auth.currentUser, newPassword);
                      toast.success('Password successfully updated!');
                      setOldPassword('');
                      setNewPassword('');
                      setRequestStatus(RequestStatus.Idle);
                    } catch (errorResponse) {
                      Sentry.captureException(errorResponse);
                      // @ts-ignore
                      setError(errorResponse.code ? new Error(errorResponse.code) : errorResponse);
                      setRequestStatus(RequestStatus.Error);
                      return;
                    }
                  }}
                >
                  <div className="mt-6">
                    <div className="justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:mt-0 lg:flex lg:border-y lg:py-6">
                      <label
                        className="label-form lg:text-xl lg:font-semibold"
                        htmlFor="old-password"
                      >
                        Old Password
                      </label>
                      <div className="relative w-full lg:max-w-lg">
                        <input
                          id="old-password"
                          name="old-password"
                          autoComplete="password"
                          type={isShowOldPassword ? 'text' : 'password'}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          onFocus={() => {
                            setError(null);
                            setPasswordError('');
                          }}
                          minLength={8}
                          placeholder="Verify old password"
                          disabled={isDisabled}
                          className={classNames(
                            'input-form',
                            !!passwordError && 'text-color-error',
                          )}
                          required
                        />
                        <div className="absolute right-4 top-3 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                          {isShowOldPassword ? (
                            <button
                              className="h-4 w-4"
                              type="button"
                              onClick={() => setIsShowOldPassword(false)}
                            >
                              <EyeIcon />
                            </button>
                          ) : (
                            <button type="button" onClick={() => setIsShowOldPassword(true)}>
                              <EyeSlashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:mt-0 lg:flex lg:border-b lg:py-6">
                      <label
                        className="label-form lg:text-xl lg:font-semibold"
                        htmlFor="new-password"
                      >
                        New Password
                      </label>
                      <div className="w-full lg:max-w-lg">
                        <div className="relative">
                          <input
                            id="new-password"
                            name="new-password"
                            autoComplete="new-password"
                            type={isShowNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            ref={newPasswordRef}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onFocus={() => {
                              setError(null);
                              setIsFocused(true);
                              setPasswordError('');
                            }}
                            onBlur={() => setIsFocused(false)}
                            minLength={8}
                            placeholder="Enter new password"
                            disabled={isDisabled}
                            className={classNames(
                              'input-form',
                              !!passwordError && 'text-color-error',
                            )}
                            required
                          />
                          <div className="absolute right-4 top-3 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                            {isShowNewPassword ? (
                              <button
                                className="h-4 w-4"
                                type="button"
                                onClick={() => setIsShowNewPassword(false)}
                              >
                                <EyeIcon />
                              </button>
                            ) : (
                              <button type="button" onClick={() => setIsShowNewPassword(true)}>
                                <EyeSlashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        {!!passwordError && (
                          <div className="mt-2 flex max-w-xs text-xs lg:max-w-main-content-container">
                            <div className="mr-2">
                              {(!newPassword?.length ||
                                (isNewPasswordInputFocused &&
                                  !getIsValidPasswordFormat(newPassword))) && (
                                <UserCircleIcon className="h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                              )}
                              {!isNewPasswordInputFocused &&
                                !!newPassword?.length &&
                                !getIsValidPasswordFormat(newPassword) && (
                                  <ExclamationCircleIcon className="h-4 w-4 text-color-error" />
                                )}
                              {getIsValidPasswordFormat(newPassword) && (
                                <CheckCircleIcon className="h-4 w-4 text-color-tab-active" />
                              )}
                            </div>
                            <div className="max-w-xs text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:max-w-main-content-container">
                              {passwordError && (
                                <span className="text-color-error">{passwordError}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="safearea-pad-bot mt-4 flex grow flex-col justify-end lg:items-end lg:justify-start">
                    {!!error?.message && (
                      <div className="mb-4">
                        <CardError>{error.message}</CardError>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="button-rounded-full-primary lg:max-w-[196px]"
                      disabled={isDisabled}
                    >
                      Change password
                    </button>
                  </div>
                </form>
              </div>
            </main>
            <TabBar />
          </div>
        </div>
      </SafeAreaPage>
    </>
  );
};

export default MyChangePassword;
