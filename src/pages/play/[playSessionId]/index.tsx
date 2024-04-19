import { NextPage } from 'next';
import PlaySessionPage from 'screens/PlaySessionPage';
import { ServerProps } from 'screens/PlaySessionPage/props';

const ExistingPlaySessionPage: NextPage<ServerProps> = ({ injectedPlaySessionId }) => (
  <PlaySessionPage injectedPlaySessionId={injectedPlaySessionId} isNewPlaySession={false} />
);

ExistingPlaySessionPage.getInitialProps = async (ctx) => {
  const { playSessionId } = ctx.query;
  return { injectedPlaySessionId: typeof playSessionId === 'string' ? playSessionId : '' };
};

export default ExistingPlaySessionPage;
