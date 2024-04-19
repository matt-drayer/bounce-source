import { LessonParticipants, Lessons, UserCustomCourts, Users } from 'types/generated/client';

type CustomCourt = Pick<UserCustomCourts, 'id' | 'title' | 'fullAddress'>;
type Participants = Pick<LessonParticipants, 'userProfile'>;

export type Lesson = Pick<
  Lessons,
  | 'id'
  | 'description'
  | 'participantLimit'
  | 'title'
  | 'startDateTime'
  | 'endDateTime'
  | 'type'
  | 'coverImagePath'
  | 'priceUnitAmount'
> & { userCustomCourt?: CustomCourt | null } & {
  ownerProfile?: {
    __typename?: 'UserProfiles';
    id?: any | null;
    preferredName?: string | null;
    profileImageFileName?: string | null;
    profileImagePath?: string | null;
    profileImageProviderUrl?: string | null;
    fullName?: string | null;
    username?: string | null;
  } | null;
} & {
  participants?:
    | null
    | {
        userProfile?: {
          preferredName?: string | null | undefined;
          fullName?: string | null | undefined;
          profileImagePath?: string | null | undefined;
        } | null;
      }[];
};

export type LessonWithLocale = Lesson & {
  startTimestamp: number;
  endTimestamp: number;
  date: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  durationMinutes: number;
  numberInInterval: number;
  indexOfInterval: number;
};

export interface LessonInterval {
  start: number;
  end: number;
  count: number;
}

export interface LessonsByStartDate {
  lessons: LessonWithLocale[];
  intervals: LessonInterval[];
}

export interface Props {
  lessons: Lesson[];
  isOwner: boolean;
  isTransparentHeader?: boolean;
}

export interface CalendarBlock {
  time: number;
  date: string;
}

export interface CalendarWeekProps {
  index: number;
  slideContent: Date[];
  now: Date | null | undefined;
  hours: number | null | undefined;
  minutes: number | null | undefined;
  toggleBottomSheet: () => void;
  scrollHeight: number;
  setScrollHeight: (height: number) => void;
  slideRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  hasSetInitialScroll: boolean;
  setHasSetInitialScroll: (hasSetInitialScroll: boolean) => void;
  activeCalendarBlock: CalendarBlock | null;
  setActiveCalendarBlock: (block: CalendarBlock | null) => void;
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
  lessonsByStartDate: { [key: string]: LessonsByStartDate };
  isOwner: boolean;
}

export interface CalendarSwiperProps extends Props {
  setSwiperRef: (swiperRef: any) => void;
  setMonth: (month: number) => void;
  setYear: (year: string) => void;
  toggleBottomSheet: () => void;
  activeCalendarBlock: CalendarBlock | null;
  setActiveCalendarBlock: (block: CalendarBlock | null) => void;
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
  isOwner: boolean;
}
