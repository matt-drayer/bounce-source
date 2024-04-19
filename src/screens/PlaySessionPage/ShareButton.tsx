import * as React from 'react';
import { getPlaySessionPageUrl } from 'constants/pages';
import { useModal } from 'hooks/useModal';
import Share from 'svg/Share';
import Button from 'components/Button';
import ModalShare from 'components/modals/ModalShare';
import classNames from 'styles/utils/classNames';

interface Props {
  className?: string;
  isPrimary: boolean;
  isInline: boolean;
  id: string;
}

export default function ShareButton({ className, isPrimary, isInline, id }: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const playSessionPath = getPlaySessionPageUrl(id);
  const playSessionUrl = `${process.env.APP_URL}${playSessionPath}`;

  return (
    <>
      <Button
        sizeDesktop="md"
        sizeMobile="sm"
        isInline
        variant="primary"
        iconLeft={<Share className="w-4" />}
        onClick={() => {
          openModal();

          if (navigator.share) {
            navigator
              .share({
                title: `Play pickleball on Bounce`,
                text: `Join an open play near you on Bounce, the pickleball app.`,
                url: playSessionUrl,
              })
              .then(() => console.log('Successful share'))
              .catch((error) => console.log('Error sharing:', error));
          }
        }}
      >
        Invite
      </Button>
      <ModalShare
        shareUrl={playSessionUrl}
        isOpen={isOpen}
        closeModal={closeModal}
        title="Share play session"
      />
    </>
  );
}
