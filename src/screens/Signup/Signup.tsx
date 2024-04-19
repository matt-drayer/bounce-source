import * as React from 'react';
import { useRouter } from 'next/router';
import { AuthStatus } from 'constants/auth';
import { HOME_PAGE, SIGNUP_CODE_PAGE } from 'constants/pages';
import { AccountType } from 'constants/user';
import { useGetGroupByAccessCodeLazyQuery } from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import AuthPage from 'layouts/AuthPage';
import AuthSideContent from 'layouts/AuthPage/AuthSideContent';
import FormSignup from 'components/forms/FormSignup';
import Head from 'components/utilities/Head';

const COACH_CONTENT = {
  imageSrc: '/images/app/players-coach.svg',
  title: 'For coaches',
  description:
    'Attract new players and manage your entire business, from scheduling to collecting payments.',
};
const PLAYER_CONTENT = {
  imageSrc: '/images/app/players-one.svg',
  title: 'For players',
  description:
    'Playing racket sports is hard enough, finding great people to play with shouldn’t be.',
};

const Signup: React.FC = () => {
  const router = useRouter();
  const viewer = useViewer();
  const [initialNoUser, setInitialNoUser] = React.useState(false);
  const [accountType, setAccountType] = React.useState(AccountType.Player);
  const [
    getGroupByAccessCodeLazyQuery,
    { loading: isLoadingGetGroupByAccessCodeLazyQuery, error: errorGetGroupByAccessCodeLazyQuery },
  ] = useGetGroupByAccessCodeLazyQuery();
  const isCoach = accountType === AccountType.Coach;

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

  React.useEffect(() => {
    const fetchGroupAndRedirectIfInvalid = async (groupCode: string) => {
      const response = await getGroupByAccessCodeLazyQuery({
        variables: {
          accessCode: groupCode,
        },
      });

      const isValidGroup = (response?.data?.groups?.length || 0) >= 1;

      if (!isValidGroup) {
        router.push(SIGNUP_CODE_PAGE);
      }
    };

    if (router.isReady) {
      const groupCode = router.query.code as string;

      if (!groupCode) {
        router.push(SIGNUP_CODE_PAGE);
      } else {
        fetchGroupAndRedirectIfInvalid(groupCode);
      }
    }
  }, [router.isReady]);

  return (
    <>
      <Head title="Create an Account" description="Sign up for Bounce" />
      <AuthPage
        sideContent={
          <AuthSideContent
            imageSrc={isCoach ? COACH_CONTENT.imageSrc : PLAYER_CONTENT.imageSrc}
            title={isCoach ? COACH_CONTENT.title : PLAYER_CONTENT.title}
            description={isCoach ? COACH_CONTENT.description : PLAYER_CONTENT.description}
          />
        }
      >
        <div className="h-safe-screen flex w-full grow flex-col items-center lg:justify-center">
          <FormSignup isShowLoginLink shouldOnboard setAccountTypeParent={setAccountType} />
        </div>
      </AuthPage>
    </>
  );
};

export default Signup;
