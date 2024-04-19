import * as React from 'react';
import { NEW_PLAY_SESSION_PAGE } from 'constants/pages';
import { GetPlaySessionsByVenueIdAsAnonymousQuery } from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import CalendarPlus from 'svg/CalendarPlus';
import Link from 'components/Link';
import CardPlaySessionGroup from 'components/cards/CardPlaySessionGroup';
import { transformPlaySessionFeedToProps } from 'components/cards/CardPlaySessionGroup/transformers';
import { PLAY_SESSIONS_ID } from './types';

type PlaySessions = GetPlaySessionsByVenueIdAsAnonymousQuery['playSessions'][0];

interface PlaySessionsProps {
  venueTitle: string;
  openSignupModal: () => void;
  playSessions: PlaySessions[];
  setActivePlaySessionId: (id: string | null) => void;
}

export default function PlaySessions({
  venueTitle,
  openSignupModal,
  playSessions,
  setActivePlaySessionId,
}: PlaySessionsProps) {
  const { isSessionLoading, isAnonymousSession } = useViewer();
  const [isShowAll, setIsShowAll] = React.useState(false);
  const visiblePlaySessions = isShowAll ? playSessions : playSessions.slice(0, 2);
  const hasPlaySessions = !!visiblePlaySessions && visiblePlaySessions.length > 0;

  return (
    <div
      id={PLAY_SESSIONS_ID}
      className="border-t border-color-border-input-lightmode pt-ds-3xl dark:border-color-border-input-darkmode"
    >
      <div className="space-y-ds-xl">
        {hasPlaySessions ? (
          visiblePlaySessions.map((playSession) => {
            if (!playSession) {
              return null;
            }

            return (
              <button
                key={playSession.id}
                className="block w-full"
                type="button"
                onClick={() => setActivePlaySessionId(playSession.id)}
              >
                <CardPlaySessionGroup
                  {...transformPlaySessionFeedToProps({
                    currentUserAsParticipant: [],
                    ...playSession,
                  })}
                  isShowDate={true}
                />
              </button>
            );
          })
        ) : (
          <div>
            <div className="typography-product-caption flex min-h-[9.75rem] items-center justify-center rounded-lg bg-color-bg-lightmode-tertiary px-8 text-color-text-lightmode-tertiary dark:bg-color-bg-darkmode-tertiary dark:text-color-text-darkmode-tertiary">
              {isSessionLoading
                ? ''
                : isAnonymousSession
                ? `Sign up for Bounce to view, join, and create open plays`
                : 'No open plays scheduled yet'}
            </div>
          </div>
        )}
      </div>
      {!isSessionLoading && (
        <div className="mt-ds-xl flex">
          {hasPlaySessions && (
            <button
              type="button"
              className="button-rounded-inline-primary-inverted typography-product-button-label-medium flex min-h-[2.5rem] items-center px-8 leading-none"
              onClick={() => setIsShowAll(!isShowAll)}
            >
              {isShowAll ? 'Hide' : 'View all play sessions'}
            </button>
          )}
          {!hasPlaySessions &&
            (isAnonymousSession ? (
              <button
                type="button"
                className="button-rounded-inline-brand typography-product-button-label-medium flex min-h-[2.5rem] items-center px-8 leading-none"
                onClick={() => openSignupModal()}
              >
                Sign up for Bounce
              </button>
            ) : (
              <Link
                href={NEW_PLAY_SESSION_PAGE}
                className="button-rounded-inline-primary typography-product-button-label-medium flex min-h-[2.5rem] items-center justify-center px-8 leading-none"
              >
                <CalendarPlus className="mr-2 h-5 w-5" /> Create an open play
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
