import * as React from 'react';
import { getProfilePageUrl } from 'constants/pages';
import { nameToLastInitials } from 'utils/shared/name/nameToLastInitials';
import { getNavigatorLanguage } from 'utils/shared/time/getNavigatorLanguage';
import { useModal } from 'hooks/useModal';
import Lightbox from 'components/Lightbox';
import Link from 'components/Link';

const DATE_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

interface Props {
  id: string;
  senderName?: string | null;
  senderUsername?: string | null;
  timestamp: string;
  commentLink?: string;
  // Generic
  titleNote?: string;
  titleLinkText?: string;
  titleLinkUrl?: string;
  // OR give an optional play session ID that will generator it?
  playSessionId?: string;
  //
  senderProfileImageUrl: string;
  content: string;
  type: 'play' | 'group';
  imageUrls?: string[];
  actions?: React.ReactNode;
  files?: string[];
}

const MaybeLink = ({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  if (!href) {
    if (className) {
      return <span className={className}>{children}</span>;
    } else {
      return <>{children}</>;
    }
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
};

export default function Comment({
  id,
  senderName,
  senderUsername,
  senderProfileImageUrl,
  timestamp,
  commentLink,
  titleNote,
  titleLinkText,
  titleLinkUrl,
  playSessionId,
  content,
  type,
  imageUrls,
  actions,
  files,
}: Props) {
  const { openModal, isOpen, closeModal } = useModal();
  const formattedDate = React.useMemo(
    // @ts-ignore DATE_OPTIONS should be fine
    () => new Intl.DateTimeFormat(getNavigatorLanguage(), DATE_OPTIONS).format(new Date(timestamp)),
    [timestamp],
  );

  return (
    <>
      <div className="flex w-full">
        <MaybeLink className="shrink-0" href={getProfilePageUrl(senderUsername)}>
          <img src={senderProfileImageUrl} className="mr-3 h-8 w-8 shrink-0 rounded-full" />
        </MaybeLink>
        <div className="w-full">
          <div>
            <MaybeLink href={getProfilePageUrl(senderUsername)}>
              {!!senderName && (
                <span className="text-base font-medium">{nameToLastInitials(senderName)}</span>
              )}
            </MaybeLink>
          </div>
          <MaybeLink href={commentLink}>
            {!!formattedDate && (
              <div className="mt-1 text-xs text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                {formattedDate}
              </div>
            )}
            {!!content && (
              <p className="mt-2 whitespace-pre-wrap break-words text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                {content.trim()}
              </p>
            )}
            {!!files && files.length > 0 && (
              <img
                src={files[0]}
                className="mt-2 h-auto w-full cursor-pointer rounded-md object-cover"
                onClick={() => {
                  if (commentLink) {
                    return null;
                  }

                  openModal();
                }}
              />
            )}
          </MaybeLink>
          {!!actions && <>{actions}</>}
        </div>
      </div>
      <Lightbox
        isOpen={isOpen}
        onClose={closeModal}
        items={[
          <img
            src={files?.[0] || ''}
            className="mx-auto h-auto w-full max-w-3xl rounded-lg object-cover"
          />,
        ]}
      />
    </>
  );
}
