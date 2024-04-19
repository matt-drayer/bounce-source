import * as React from 'react';
import { getProfilePageUrl } from 'constants/pages';
import { nameToLastInitials } from 'utils/shared/name/nameToLastInitials';
import Link from 'components/Link';
import classNames from 'styles/utils/classNames';

interface Props {
  name: string;
  avatarUrl: string;
  isCurrentUser: boolean;
  isDisabledImage?: boolean;
  username?: string | null;
}

const ParticipantAvatar: React.FC<Props> = ({
  name,
  avatarUrl,
  isCurrentUser,
  isDisabledImage,
  username,
}) => {
  return username ? (
    <Link href={getProfilePageUrl(username)} className="flex flex-col items-center">
      <img
        src={avatarUrl}
        className={classNames('h-10 w-10 rounded-full', isDisabledImage && 'grayscale')}
      />
      <div className="mt-1 text-center text-2xs text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
        {nameToLastInitials(name)}
        {isCurrentUser && ' (You)'}
      </div>
    </Link>
  ) : (
    <div className="flex flex-col items-center">
      <img
        src={avatarUrl}
        className={classNames('h-10 w-10 rounded-full', isDisabledImage && 'grayscale')}
      />
      <div className="mt-1 text-2xs text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
        {nameToLastInitials(name)}
        {isCurrentUser && ' (You)'}
      </div>
    </div>
  );
};

export default ParticipantAvatar;
