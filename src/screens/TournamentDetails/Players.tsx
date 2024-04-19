import React from 'react';
import { ADDITIONAL_PLAYERS_COUNT } from 'constants/tournaments';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useAuthModals } from 'hooks/useAuthModals';
import { useViewer } from 'hooks/useViewer';
import { Button } from 'components/Button/Button';
import { EventProps } from './types';

const MAX_REGISTRANTS_DISPLAYED = 6;
const IS_VIEW_ALL_ENABLED = false;

export default function Players({ event }: EventProps) {
  const { isUserSession, isSessionLoading } = useViewer();
  const { openSignupModal, ModalSignup, ModalLogin } = useAuthModals();

  if (!event) {
    return null;
  }

  const registrationCount = event.isExternal
    ? event.sourceRegistrationCount || 0
    : event?.registrations.length || 0;
  const displayedRegistrationCount = !event.isExternal
    ? /**
       * @todo remove this hack
       */
      registrationCount + ADDITIONAL_PLAYERS_COUNT
    : registrationCount;
  const shouldShowViewAll =
    registrationCount > MAX_REGISTRANTS_DISPLAYED && !event.isExternal && IS_VIEW_ALL_ENABLED;

  return (
    <>
      <div className="flex flex-col gap-8">
        <h2 className="typography-product-heading-compact text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Players going {displayedRegistrationCount}
        </h2>
        {isSessionLoading ? null : isUserSession ? (
          !event.isExternal &&
          registrationCount > 0 && (
            <div className="grid grid-cols-6 gap-4">
              {event.registrations.slice(0, MAX_REGISTRANTS_DISPLAYED).map((r) => (
                <div key={r.id} className="overflow-hidden">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <img
                      src={getProfileImageUrlOrPlaceholder({
                        path: r.userProfile?.profileImagePath,
                      })}
                      alt={`Player ${r.userProfile?.fullName}`}
                      className="object-fit h-12 w-12 rounded-full object-center"
                    />
                    <p className="typography-product-text-card text-center text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                      {r.userProfile?.fullName || 'Going'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="mt-4 rounded-md border bg-gray-100 p-8 text-center">
            <p className="mb-4">Create a Bounce account to view tournament players</p>
            <Button variant="brand" size="sm" isInline onClick={() => openSignupModal()}>
              Sign up for Bounce
            </Button>
          </div>
        )}
        {shouldShowViewAll && (
          <div className="items-center justify-start md:flex">
            <Button variant="secondary" size="md" isInline>
              View all players
            </Button>
          </div>
        )}
      </div>
      <ModalLogin isShowSignupLink />
      <ModalSignup isShowLoginLink />
    </>
  );
}
