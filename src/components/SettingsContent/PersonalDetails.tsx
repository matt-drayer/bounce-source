import * as React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import * as Sentry from '@sentry/nextjs';
import { intlFormat, parse } from 'date-fns';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { AuthStatus } from 'constants/auth';
import { LOGIN_PAGE, LOGOUT_PAGE, MY_CHANGE_PASSWORD_PAGE } from 'constants/pages';
import { GenderEnum, useUpdateUserGenderMutation } from 'types/generated/client';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';
import { sleep } from 'utils/shared/sleep';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';
import { useViewer } from 'hooks/useViewer';
import LinkBoxButton from 'components/LinkBoxButton';
import ModalDeleteAccount from './ModalDeleteAccount';

const PersonalDetails = () => {
  const router = useRouter();
  const viewer = useViewer();
  const [updateUserGenderMutation] = useUpdateUserGenderMutation();
  const { user } = useGetCurrentUser();
  const [gender, setGender] = React.useState<null | GenderEnum>(null);
  const [preferredGender, setPreferredGender] = React.useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const birthday = user?.birthday ? parse(user?.birthday, 'yyyy-MM-dd', new Date()) : '';
  const isDisabled = false;

  React.useEffect(() => {
    if (router.isReady && viewer.status === AuthStatus.Anonymous) {
      router.push(LOGIN_PAGE);
    }
  }, [router.isReady, viewer.status]);

  React.useEffect(() => {
    setGender(user?.gender || null);
    setPreferredGender(user?.genderPreference || '');
  }, [user]);

  return (
    <>
      <div className="space-y-4 lg:space-y-0 lg:pt-2">
        <div className="block justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:flex lg:border-b lg:py-6">
          <label className="label-form lg:text-xl lg:font-semibold">Username</label>
          <input className="input-form lg:max-w-lg" value={user?.username || ''} readOnly />
        </div>
        <div className="block justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:flex lg:border-b lg:py-6">
          <label className="label-form lg:text-xl lg:font-semibold">Email</label>
          <input className="input-form lg:max-w-lg" value={user?.email || ''} readOnly />
        </div>
        <div className="block justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:flex lg:border-b lg:py-6">
          <label className="label-form lg:text-xl lg:font-semibold">Date of birth</label>
          <input
            className="input-form lg:max-w-lg"
            value={
              birthday
                ? intlFormat(birthday, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''
            }
            readOnly
          />
        </div>
        <div className="text-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:hidden">
          Email team@bounce.game to change your username, email, or birthday
        </div>
      </div>
      <div className="mt-6 block justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:mt-0 lg:flex lg:border-b lg:py-6">
        <label className="label-form lg:text-xl lg:font-semibold" htmlFor="gender">
          Gender
        </label>
        <div className="w-full lg:max-w-lg">
          <select
            id="gender"
            name="gender"
            autoComplete="gender"
            value={gender || ''}
            onChange={(e) => {
              setGender(e.target.value as GenderEnum);
              updateUserGenderMutation({
                variables: {
                  id: viewer.userId,
                  gender: e.target.value as GenderEnum,
                  genderPreference: e.target.value !== GenderEnum.Preferred ? '' : preferredGender,
                },
              })
                .then(() => toast.success('Gender changed'))
                .catch((error) => Sentry.captureException(error));
            }}
            placeholder="Not chosen"
            disabled={isDisabled}
            className="input-form w-full lg:max-w-lg"
            required
          >
            <option disabled value="">
              Not chosen
            </option>
            <option value={GenderEnum.Female}>Female</option>
            <option value={GenderEnum.Male}>Male</option>
            <option value={GenderEnum.Preferred}>State gender preference</option>
            <option value={GenderEnum.Private}>Choose not to disclose</option>
          </select>
          {gender === GenderEnum.Preferred && (
            <div className="mt-3">
              <input
                className="input-form w-full lg:max-w-lg"
                onChange={(e) => setPreferredGender(e.target.value)}
                onBlur={() => {
                  updateUserGenderMutation({
                    variables: {
                      id: viewer.userId,
                      gender: gender,
                      genderPreference: gender !== GenderEnum.Preferred ? '' : preferredGender,
                    },
                  }).catch((error) => Sentry.captureException(error));
                }}
                value={preferredGender}
                placeholder="Preferred gender"
                disabled={isDisabled}
                required
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 hidden text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary lg:block">
        Email team@bounce.game to change your username, email, or birthday
      </div>
      <div className="mt-8 block justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:mt-0 lg:flex lg:border-b lg:py-6">
        <label className="label-form lg:text-xl lg:font-semibold">Password</label>
        <div className="w-full lg:max-w-lg">
          <LinkBoxButton href={MY_CHANGE_PASSWORD_PAGE}>Change password</LinkBoxButton>
        </div>
      </div>
      {getIsNativePlatform() && (
        <div className="my-8 block justify-between border-color-border-card-lightmode dark:border-color-border-card-lightmode lg:mt-0 lg:flex lg:border-b lg:py-6">
          <label className="label-form lg:text-xl lg:font-semibold">Account</label>
          <div className="w-full lg:max-w-lg">
            <button
              className="input-base-form flex w-full items-center justify-between py-2.5 pl-3.5 pr-4 leading-6 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <div>Delete account</div>
              <div>
                <ChevronRightIcon className="h-5 w-5 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
              </div>
            </button>
          </div>
        </div>
      )}
      <ModalDeleteAccount
        isOpen={isDeleteModalOpen}
        handleClose={() => setIsDeleteModalOpen(false)}
        handleConfirm={async () => {
          setIsDeleteModalOpen(false);
          toast.success('Request to delete account received');
          await sleep(1000);
          router.push(LOGOUT_PAGE);
        }}
      />
    </>
  );
};

export default PersonalDetails;
