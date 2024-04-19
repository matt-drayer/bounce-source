import { NextPage } from 'next';
import LessonPage from 'screens/LessonPage';
import { ServerProps } from 'screens/LessonPage/props';

const ExistingLessonPage: NextPage<ServerProps> = ({ injectedLessonId }) => (
  <LessonPage injectedLessonId={injectedLessonId} isNewLesson={false} />
);

ExistingLessonPage.getInitialProps = async (ctx) => {
  const { lessonId } = ctx.query;
  return { injectedLessonId: typeof lessonId === 'string' ? lessonId : '' };
};

export default ExistingLessonPage;
