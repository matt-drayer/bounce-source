import * as React from 'react';
import { FC, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { auth } from 'services/client/firebase';

type Form = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup.string().required('Email address is required').email('Email should be valid'),
    password: yup.string().required('Password is required'),
  })
  .required();

const Login: FC<{ goToSignUp(): void }> = ({ goToSignUp }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          setIsLoading(true);
          await signInWithEmailAndPassword(auth, data.email, data.password);

          const loggedInUser = auth.currentUser;
          await loggedInUser?.getIdToken(true);
          setIsLoading(false);

          router.reload();
        } catch (e) {
          setIsLoading(false);
          setError('email', { message: 'Incorrect password or email' });
        }
      })}
    >
      <p className="mb-8 mt-8 flex text-[1.12rem] font-semibold text-brand-gray-1000">
        Login to your account
      </p>
      <div className="relative">
        <input
          placeholder="Email"
          autoComplete="email"
          id="email"
          className="border-0 text-brand-gray-700::placeholder h-11 w-full rounded-md bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-1000 focus:outline-0"
          {...register('email')}
        />
        <p className="bottom-1 mb-5  mt-1 text-[0.75rem] text-color-error">
          {errors?.email?.message}
        </p>
      </div>

      <div className="relative">
        <input
          id="password"
          placeholder="Password"
          autoComplete="password"
          type="password"
          className="box- text-brand-gray-700::placeholder h-11 w-full rounded-md border-0 bg-brand-gray-50 pl-3 pr-3 font-light text-brand-gray-1000 focus:outline-0"
          {...register('password')}
          style={{ boxShadow: 'none' }}
        />
        <p className="bottom-1 mb-5  mt-1 text-[0.75rem] text-color-error">
          {errors?.password?.message}
        </p>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="button-rounded-inline-background-bold flex h-[39px] w-full items-center justify-center text-[1rem] font-medium italic"
      >
        {isLoading ? 'Logging in...' : 'Next'}
      </button>

      <p className="mt-8 text-center font-normal text-brand-gray-700">
        New to Bounce?{' '}
        <button type="button" onClick={goToSignUp} className="font-medium text-brand-fire-500">
          Sign Up
        </button>
      </p>
    </form>
  );
};

export default Login;
