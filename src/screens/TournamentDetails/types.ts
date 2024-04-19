import { type GetEventDetailsQuery, GetUserEventRegistrationQuery } from 'types/generated/client';
import { type EventPageFieldsFragment } from 'types/generated/server';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';

export const PLAY_SESSIONS_ID = 'play-sessions';

export enum Steps {
  CreateAccount = 'CREATE_ACCOUNT',
  Login = 'LOGIN',
  AddEvent = 'ADD_EVENT',
  TournamentRequirements = 'TOURNAMENT_REQUIREMENTS',
  PaymentForm = 'PAYMENT_FORM',
  AdditionalDetails = 'ADDITIONAL_DETAILS',
  Closed = 'CLOSED',
  LoadingSkeleton = 'LOADING_SKELETON',
}

interface Faq {
  question: string;
  answer: string;
}

export interface PageProps {
  event: EventPageFieldsFragment;
  faqs: Faq[];
  jsonLd: string;
}

export type Event = Omit<
  Exclude<GetEventDetailsQuery['eventsByPk'], null | undefined>,
  '__typename'
>;

export interface Props {
  event: Event;
  faqs: Faq[];
  jsonLd?: string;
  isReview?: boolean;
  eventGroups?: Event['groups'];
  isPreview?: boolean;
}

export type EventProps = { event: Event };

export type EventPropsForForm = EventProps & {
  eventGroups?: Event['groups'];
  isReview?: boolean;
};

export interface RegisterProps {
  setSteps: React.Dispatch<React.SetStateAction<Steps>>;
  event: Event;
  registrations?: GetUserEventRegistrationQuery;
  user: ReturnType<typeof useGetCurrentUser>['user'];
  handleNext: () => void;
}

export const EXIT_TEXT = 'No thanks, take me to the tournament';

export const ENABLE_BIRTHDAY_REQUIREMENT = false;
