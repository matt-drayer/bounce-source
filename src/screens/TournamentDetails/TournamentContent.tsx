import React from 'react';
import NextImage from 'next/image';
import { getImageUrl } from 'services/client/cloudflare/getImageUrl';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { useModal } from 'hooks/useModal';
import Calendar from 'svg/Calendar';
import Dot from 'svg/Dot';
import Fee from 'svg/Fee';
import Share from 'svg/Share';
import Star from 'svg/Star';
import UserCheck from 'svg/UserCheck';
import { Button, ButtonText } from 'components/Button';
import Faqs from 'components/Faqs';
import ModalShare from 'components/modals/ModalShare';
import Contacts from './Contacts';
import Events from './Events';
import Players from './Players';
import Sponsored from './Sponsored';
import Venue from './Venue';
import { Props } from './types';
import {
  DEFAULT_TIMEZONE,
  formatDate,
  formatDateRange,
  getGroupFormatName,
  isShowGroupFormat,
} from './utils';

const DEFAULT_EVENT_IMAGE = '/images/app/default-event.png';

const IS_REVIEWS_ENABLED = false;
const IS_SPONSORS_ENABLED = false;
const IS_CONTACT_ENABLED = false;

const DetailCard = ({
  Icon,
  title,
  description,
}: {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-color-border-input-lightmode p-ds-md text-center dark:border-color-border-input-darkmode">
      <Icon className="h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
      <p className="typography-product-body-highlight mt-ds-xs text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
        {title}
      </p>
      <p className="typography-product-subheading mt-ds-md text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
        {description}
      </p>
    </div>
  );
};
export default function TournamentContent({
  event,
  faqs,
  isPreview,
  isReview = false,
  eventGroups,
}: Props) {
  const {
    openModal: openShareModal,
    closeModal: closeShareModal,
    isOpen: isShareModalOpen,
  } = useModal();
  const hasOrganizerImage = !!event.organizerImageUrl && !!event.organizerImagePath;
  const hasProfileImage =
    !!event.hostUserProfile?.profileImagePath && !!event.hostUserProfile?.profileImageProviderUrl;
  const timeZone = event.timezoneName || event.venue?.timezone || DEFAULT_TIMEZONE;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareAction = () => {
    openShareModal();
    if (navigator.share) {
      navigator
        .share({
          title: `Tournament on Bounce: ${event.title}`,
          text: `Compete in the ${event.title} tournament, in ${
            event.city?.name && event.city?.countrySubdivision?.code
              ? `${event.city?.name}, ${event.city?.countrySubdivision?.code}`
              : event.displayLocation
          }! More details at ${shareUrl}`,
          url: shareUrl,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    }
  };

  const getBannerImage = () => {
    if (isReview && event.coverImageUrl) return event.coverImageUrl;

    return event.coverImageUrl && event.coverImagePath
      ? getImageUrl({ url: event.coverImageUrl, path: event.coverImagePath })
      : DEFAULT_EVENT_IMAGE;
  };

  return (
    <>
      <div className="">
        <div className="mb-ds-lg hidden items-center justify-between gap-ds-lg lg:flex">
          <div className="flex items-center gap-ds-lg">
            <p className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Organizer
            </p>
            {(hasOrganizerImage || hasProfileImage) && (
              <NextImage
                src={
                  event.organizerImageUrl && event.organizerImagePath
                    ? getImageUrl({
                        url: event.organizerImageUrl,
                        path: event.organizerImagePath,
                      })
                    : event.hostUserProfile?.profileImagePath &&
                      event.hostUserProfile?.profileImageProviderUrl
                    ? getImageUrl({
                        url: event.hostUserProfile.profileImageProviderUrl,
                        path: event.hostUserProfile.profileImagePath,
                      })
                    : ''
                }
                alt={event.sourceOrganizerTitle || 'Organizer'}
                className="h-6 rounded"
                height={24}
                width={38}
              />
            )}
            {!event.organizerImageUrl &&
              !event.organizerImagePath &&
              !event.hostUserProfile?.profileImagePath &&
              !event.hostUserProfile?.profileImageProviderUrl &&
              !!event.sourceOrganizerTitle && (
                <div className="typography-product-element-label truncate pr-1 text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder">
                  {event.sourceOrganizerTitle}
                </div>
              )}
            {!event.isExternal && IS_REVIEWS_ENABLED && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-color-text-lightmode-secondary" />
                <div className="flex items-center gap-1">
                  <p className="typography-product-element-label text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"></p>
                  <Dot className="dark: h-1 w-1 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                  <p className="typography-product-element-label text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                    reviews
                  </p>
                </div>
              </div>
            )}
          </div>
          {!isPreview && (
            <div className="flex items-center gap-1">
              <ButtonText
                size="sm"
                className="flex items-center text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
                onClick={shareAction}
              >
                <Share className="mr-1 h-4 w-4" /> Share
              </ButtonText>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="absolute right-4 top-4 block lg:hidden">
            <Button
              variant="secondary"
              isInline
              size="sm"
              iconLeft={<Share className="w-4" />}
              onClick={shareAction}
            >
              Share
            </Button>
          </div>
          <NextImage
            src={getBannerImage()}
            alt={event.title}
            className="h-[12.5rem] w-full object-cover object-center lg:h-[20.625rem] lg:rounded-xl"
            height={330}
            width={700}
          />
        </div>
        <div className="px-4 lg:p-0">
          <div className="mt-4 flex items-center gap-ds-lg lg:hidden">
            <p className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
              Organizer
            </p>
            {(hasOrganizerImage || hasProfileImage) && (
              <img
                src={
                  event.organizerImageUrl && event.organizerImagePath
                    ? getImageUrl({
                        url: event.organizerImageUrl,
                        path: event.organizerImagePath,
                      })
                    : event.hostUserProfile?.profileImagePath &&
                      event.hostUserProfile?.profileImageProviderUrl
                    ? getImageUrl({
                        url: event.hostUserProfile.profileImageProviderUrl,
                        path: event.hostUserProfile.profileImagePath,
                      })
                    : ''
                }
                alt="Organizer"
                className="h-6 rounded"
              />
            )}
            {!event.organizerImageUrl &&
              !event.organizerImagePath &&
              !event.hostUserProfile?.profileImagePath &&
              !event.hostUserProfile?.profileImageProviderUrl &&
              !!event.sourceOrganizerTitle && (
                <div className="typography-product-element-label truncate pr-1 text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder">
                  {event.sourceOrganizerTitle}
                </div>
              )}
            {!event.isExternal && IS_REVIEWS_ENABLED && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-color-text-lightmode-secondary" />
                <div className="flex items-center gap-1">
                  <p className="typography-product-element-label text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary"></p>
                  <Dot className="dark: h-1 w-1 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                  <p className="typography-product-element-label text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                    reviews
                  </p>
                </div>
              </div>
            )}
          </div>
          <h1 className="typography-product-heading mt-4 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary lg:mt-ds-xl">
            {event.title}
          </h1>
          {!event.isExternal && !!event.groupFormat && isShowGroupFormat(event.groupFormat) && (
            <p className="typography-product-subheading mt-ds-md inline-flex rounded-full bg-color-bg-lightmode-brand-secondary px-ds-lg py-ds-sm text-color-brand-primary dark:bg-color-bg-lightmode-brand-secondary lg:mt-ds-lg">
              {getGroupFormatName(event.groupFormat)}
            </p>
          )}
          <div className="mt-ds-2xl grid grid-cols-1 gap-ds-xl lg:grid-cols-3">
            <DetailCard
              Icon={Calendar}
              title="Tournament Date"
              description={formatDateRange({
                startDate: event.startDateTime,
                endDate: event.endDateTime,
                timeZone: timeZone,
              })}
            />
            <DetailCard
              Icon={UserCheck}
              title="Registration Deadline"
              description={formatDate({
                date:
                  event.registrationDeadlineDateTime ||
                  event.registrationDeadlineDate ||
                  event.startDateTime,
                timeZone: timeZone,
              })}
            />
            <DetailCard
              Icon={Fee}
              title="Registration Fee"
              description={`$${
                convertUnitPriceToFormattedPrice(event.registrationPriceUnitAmount || 0)
                  .priceFormatted
              }`}
            />
          </div>
          {!!event.description && (
            <p className="typography-product-body mt-ds-2xl text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
              {event.description}
            </p>
          )}
          <div className="mt-ds-3xl border-y border-color-border-input-lightmode py-ds-3xl dark:border-color-border-input-darkmode">
            <Players event={event} />
          </div>
          {!event.isExternal &&
            ((!!eventGroups?.length && isReview) || (!!event?.groups && !isReview)) && (
              <div className="border-b border-color-border-input-lightmode py-ds-3xl dark:border-color-border-input-darkmode">
                <Events event={event} eventGroups={eventGroups} isReview={isReview} />
              </div>
            )}
          {event.venue && event.venue.id && (
            <div className="py-ds-3xl">
              <Venue event={event} />
            </div>
          )}
          {IS_SPONSORS_ENABLED && (
            <div className="border-t border-color-border-input-lightmode py-ds-3xl dark:border-color-border-input-darkmode">
              <Sponsored />
            </div>
          )}
          {faqs && faqs.length > 0 && (
            <div className="border-t border-color-border-input-lightmode py-ds-3xl dark:border-color-border-input-darkmode">
              <Faqs questionsAnswers={faqs} />
            </div>
          )}
          {IS_CONTACT_ENABLED && <Contacts />}
        </div>
      </div>
      <ModalShare
        isOpen={isShareModalOpen}
        closeModal={closeShareModal}
        shareUrl={shareUrl}
        title="Share tournament"
      />
    </>
  );
}
