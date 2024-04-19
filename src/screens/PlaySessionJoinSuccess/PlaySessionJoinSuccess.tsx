import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import copy from 'copy-to-clipboard';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { PLAY_PAGE, getPlaySessionPageUrl } from 'constants/pages';
import { useGetPlaySessionByIdLazyQuery } from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import SuccessIcon from 'svg/SuccessIcon';
import Link from 'components/Link';
import Head from 'components/utilities/Head';

const PlaySessionJoinSuccess = () => {
  const viewer = useViewer();
  const router = useRouter();
  const [fetchExistingPlaySession, { data: existingPlaySessionData }] =
    useGetPlaySessionByIdLazyQuery();
  const [date, setDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const playSessionId = existingPlaySessionData?.playSessionsByPk?.id || router?.query?.id || '';
  const playSessionPath = getPlaySessionPageUrl(playSessionId as string);
  const playSessionUrl = `${process.env.APP_URL}${playSessionPath}`;
  let displayDate = date;
  let displayTime = startTime;

  if (existingPlaySessionData?.playSessionsByPk?.startDateTime) {
    const lessonDate = new Date(existingPlaySessionData.playSessionsByPk.startDateTime);
    displayDate = format(lessonDate, 'EEEE MMM d');
    displayTime = format(lessonDate, 'p');
  }

  React.useEffect(() => {
    if (router.isReady) {
      const datetime = router.query.datetime;

      if (datetime && typeof datetime === 'string') {
        const parsedPlaySessionDate = new Date(parseInt(datetime, 10));
        const date = format(parsedPlaySessionDate, 'EEEE MMM d');
        const time = format(parsedPlaySessionDate, 'p');

        setDate(date);
        setStartTime(time);
      }
    }
  }, [router.isReady]);

  React.useEffect(() => {
    if (router.isReady && viewer.userId) {
      if (router.query.playSessionId && typeof router.query.playSessionId === 'string') {
        fetchExistingPlaySession({
          variables: {
            id: router.query.playSessionId,
          },
        });
      }
    }
  }, [router.isReady, viewer.userId]);

  return (
    <>
      <Head
        title="Successfully Joined Play Session"
        description="You have successfully joined a play session on Bounce"
        noIndex
      />
      <div className="flex h-full grow flex-col">
        <div className="mx-auto flex h-full w-full max-w-lg grow flex-col items-center lg:max-w-details-content-container">
          <div className="flex h-full w-full grow flex-col lg:grow-0">
            <div className="flex h-full w-full grow flex-col items-center overflow-y-auto px-6 pt-28 text-center lg:grow-0 lg:px-0">
              <SuccessIcon className="w-28" />
              <div className="flex h-full flex-col justify-center">
                <h1 className="mt-12 text-3xl font-bold italic leading-7">You're in!</h1>
                <div className="mt-4 max-w-md text-center leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  See you on {displayDate} @ {displayTime}.
                </div>
              </div>
            </div>
          </div>
          <div className="w-full pb-14">
            <div className="flex w-full flex-col items-center px-6 lg:px-0">
              <div className="flex w-full flex-col items-center space-y-6 pb-6">
                <div className="flex justify-center py-8">
                  <QRCode value={playSessionUrl} size={128} />
                </div>
                <div className="mt-6 w-full">
                  <button
                    onClick={() => {
                      try {
                        copy(playSessionUrl);
                        toast.success('Link copied');

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
                      } catch (error) {
                        Sentry.captureException(error);
                        toast.error('Could not copy');
                      }
                    }}
                    type="button"
                    className="button-rounded-full-primary-inverted"
                  >
                    Invite to play session
                  </button>
                </div>
                <Link href={`${PLAY_PAGE}?mygames=true`} className="button-rounded-full-primary">
                  View my sessions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaySessionJoinSuccess;
