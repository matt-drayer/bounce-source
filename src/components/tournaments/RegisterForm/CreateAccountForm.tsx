import { FC, useState } from 'react';
import * as React from 'react';
import { useApolloClient } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { AccountType, PASSWORD_REGEX, USERNAME_REGEX_CASE_INSENSITIVE } from 'constants/user';
import { GetExistingUserQuery } from 'types/generated/client';
import {
  GenderEnum,
  useCheckUsernameAvailabilityLazyQuery,
  useInsertSignupRequestMutation,
  useUpdateUserGenderMutation,
} from 'types/generated/client';
import { auth } from 'services/client/firebase';
import { pollForNewUser } from 'services/client/pollForNewUser';
import { getPlatform } from 'utils/mobile/getPlatform';
import { splitNameToFirstLast } from 'utils/shared/name/splitNameToFirstLast';
import { useGetIpAddress } from 'hooks/useGetIpAddress';
import BaseInput from 'components/tournaments/RegisterForm/BaseInput';
import GenderSelect from 'components/tournaments/RegisterForm/GenderSelect';

type Form = { name: string; gender: string; email: string; username: string; password: string };

const schema = yup
  .object({
    name: yup.string().required('Full name is required'),
    gender: yup.string().required('Gender is required'),
    email: yup.string().required('Email address is required').email('Enter a valid email'),
    username: yup
      .string()
      .required('Username is required')
      .matches(USERNAME_REGEX_CASE_INSENSITIVE, {
        message: 'Username can only contain letters, numbers, and underscores',
      }),
    password: yup.string().required('Password is required').matches(PASSWORD_REGEX, {
      message:
        'Minimum password requirements: At least 8 characters, uppercase letter, lowercase letter, number. Special characters are encouraged.',
    }),
  })
  .required();

const CreateAccountForm: FC<{ goToLogin(): void; onSubmit(): void }> = ({
  goToLogin,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    control,
  } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const client = useApolloClient();
  const [updateUserGenderMutation] = useUpdateUserGenderMutation();
  const [insertSignupRequestQuery, signupRequestResults] = useInsertSignupRequestMutation();
  const [fetchUsernameAvailability, { data, loading, called }] =
    useCheckUsernameAvailabilityLazyQuery();

  const { ipResponse } = useGetIpAddress();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          setIsLoading(true);
          const submissionUsername = data.username.toLowerCase().trim();

          const claimedUsernameResponse = await fetchUsernameAvailability({
            variables: {
              username: submissionUsername,
            },
          });

          const isUsernameUnavailable =
            (claimedUsernameResponse?.data?.usernamesClaimed?.length || 0) > 0 ||
            (claimedUsernameResponse?.data?.usernamesActive?.length || 0) > 0;

          if (isUsernameUnavailable) {
            setError('username', {
              message: 'This username already taken',
            });

            setIsLoading(false);
            return;
          }

          await insertSignupRequestQuery({
            variables: {
              email: data.email.toLowerCase(),
              username: submissionUsername,
              fullName: data.name,
              preferredName: splitNameToFirstLast(data.name).firstName,
              accountType: AccountType.Player,
              ip: ipResponse?.ip || '',
              country: ipResponse?.country || '',
              region: ipResponse?.region || '',
              city: ipResponse?.city || '',
              fullDetails: ipResponse || null,
              platform: getPlatform(),
              // NOTE: These fields are from a previously paid API
              timezone: '', // I can get timezone in JS
              zip: '',
            },
          });

          const firebaseUser = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password,
          );

          const databaseUser = await pollForNewUser(client, firebaseUser.user);

          const user = databaseUser as GetExistingUserQuery['users'][0];

          await updateUserGenderMutation({
            variables: {
              id: user.id,
              gender: data.gender as GenderEnum,
              genderPreference: '',
            },
          });

          // await sendEmailVerification(user.user);

          setIsLoading(false);

          onSubmit();
        } catch (error) {
          const err = error as Error;
          setIsLoading(false);
          alert(err.message);
        }
      })}
    >
      <p className="mb-8 mt-8 text-[1.12rem] font-semibold text-brand-gray-1000">
        Create an account
      </p>
      <div className="relative mb-5">
        <BaseInput
          placeholder="First and last name"
          inputProps={{
            autoComplete: 'name',
            id: 'name',
          }}
          name="name"
          errors={errors as any}
          register={register}
        />
      </div>
      <div>
        <GenderSelect onChange={(value) => setValue('gender', value)} />
        <p className="bottom-1 mb-5  mt-1 text-[0.75rem] text-color-error">
          {errors?.gender?.message}
        </p>
      </div>
      <div className="relative mb-5">
        <BaseInput
          placeholder="Email"
          inputProps={{
            autoComplete: 'email',
            id: 'email',
          }}
          name="email"
          errors={errors as any}
          register={register}
        />
      </div>
      <div className="relative">
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              placeholder="Unique username"
              autoComplete="username"
              id="username"
              autoCapitalize="off"
              className="text-brand-gray-700::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-1000 focus:outline-0"
              {...field}
              onChange={(e) => {
                e.target.value = e.target.value.trim();
                field.onChange(e);
              }}
            />
          )}
        />
        <p className="bottom-1 mb-5 mt-1 text-[0.75rem] text-color-error">
          {errors?.username?.message}
        </p>
      </div>
      <div className="relative mb-5">
        <BaseInput
          placeholder="Create password"
          inputProps={{
            autoComplete: 'new-password',
            id: 'password',
            type: 'password',
            style: { boxShadow: 'none' },
          }}
          name="password"
          errors={errors as any}
          register={register}
        />

        <p className="bottom-1 mb-5  mt-1 text-[0.75rem] text-color-error">
          {errors?.password?.message}
        </p>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="button-rounded-inline-background-bold flex h-[39px] w-full items-center justify-center text-[1rem] font-medium italic shadow-none"
      >
        {isLoading ? 'Creating account...' : 'Next'}
      </button>
      <p className="mb-8 mt-8 text-[0.75rem] font-normal text-brand-gray-700">
        By registering for the event, you create a Bounce account
      </p>
      <p className="text-center font-normal text-brand-gray-700">
        Already have an account?{' '}
        <button onClick={goToLogin} type="button" className="font-medium text-brand-fire-500">
          Log In
        </button>
      </p>
    </form>
  );
};

export default CreateAccountForm;
