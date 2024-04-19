export interface ServerProps {
  injectedLessonId: string;
}

export interface Props extends ServerProps {
  isNewLesson: boolean;
}
