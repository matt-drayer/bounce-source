import * as React from 'react';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { HOME_PAGE } from 'constants/pages';
import { useViewer } from 'hooks/useViewer';
import AuthPage from 'layouts/AuthPage';
import AuthSideContent from 'layouts/AuthPage/AuthSideContent';
import FormLogin from 'components/forms/FormLogin';
import Head from 'components/utilities/Head';

const Login: React.FC = () => {
  const router = useRouter();
  const viewer = useViewer();
  const [initialNoUser, setInitialNoUser] = React.useState(false);

  React.useEffect(() => {
    const hasViewer = viewer.status === AuthStatus.User && viewer.viewer;

    if (initialNoUser) {
      return;
    }

    if (viewer.status === AuthStatus.Anonymous) {
      setInitialNoUser(true);
    }

    if (hasViewer) {
      const next = router.query.next as string;
      const redirectUrl = next ? decodeURIComponent(next) : HOME_PAGE;
      router.push(redirectUrl);
    }
  }, [viewer, initialNoUser, setInitialNoUser]);

  return (
    <>
      <Head title="Log In" description="Sign in to your Bounce account" />
      <AuthPage
        sideContent={
          <AuthSideContent
            imageSrc="/images/app/players-two.svg"
            title="Play ball"
            description="Are you a tennis junky or a pickleballer? It's all the same to us. Get your game on."
          />
        }
      >
        <div className="h-safe-screen flex w-full grow flex-col items-center lg:justify-center">
          <FormLogin isShowSignupLink loginSuccessUrl={HOME_PAGE} />
        </div>
      </AuthPage>
    </>
  );
};

export default Login;
