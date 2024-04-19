import { NextPage } from 'next';
import LessonPage from 'screens/LessonPage';
import { ServerProps } from 'screens/LessonPage/props';

const NewLessonPage: NextPage<ServerProps> = ({ injectedLessonId }) => (
  <LessonPage injectedLessonId={injectedLessonId} isNewLesson={true} />
);

NewLessonPage.getInitialProps = async (ctx) => {
  const { lessonId } = ctx.query;
  return { injectedLessonId: typeof lessonId === 'string' ? lessonId : '' };
};

export default NewLessonPage;
