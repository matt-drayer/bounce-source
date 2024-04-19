import * as React from 'react';
import {
  LessonPrivacyEnum,
  UserProfileFieldsFragment,
  useGetActiveOwnerLessonsByIdLazyQuery,
} from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import LessonCalendar from 'components/LessonCalendar';

interface Props {
  profile?: UserProfileFieldsFragment;
}

const CoachLessonCalendar: React.FC<Props> = ({ profile }) => {
  const viewer = useViewer();
  const [getActiveOwnerLessonsByIdQuery, { data: lessonData }] =
    useGetActiveOwnerLessonsByIdLazyQuery();
  const lessons = lessonData?.lessons || [];
  const isOwner = viewer.userId === profile?.id;
  const filteredLessons = isOwner
    ? lessons
    : lessons.filter((lesson) => lesson.privacy === LessonPrivacyEnum.Public);

  React.useEffect(() => {
    if (profile?.id) {
      getActiveOwnerLessonsByIdQuery({
        variables: {
          ownerUserId: profile.id,
        },
      });
    }
  }, [profile?.id]);

  return (
    <div className="flex h-[calc(100vh_-_theme(space.tabs)_-_80px)] flex-col">
      <LessonCalendar
        lessons={filteredLessons}
        isTransparentHeader
        isOwner={viewer.userId === profile?.id}
      />
    </div>
  );
};

export default CoachLessonCalendar;
