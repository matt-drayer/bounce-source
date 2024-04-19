import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { HOME_PAGE } from 'constants/pages';
import { useGetLessonByIdLazyQuery } from 'types/generated/client';
import { useViewer } from 'hooks/useViewer';
import Link from 'components/Link';
import Head from 'components/utilities/Head';

const LessonJoinSuccess = () => {
  const viewer = useViewer();
  const router = useRouter();
  const [fetchExistingLesson, { data: existingLessonData }] = useGetLessonByIdLazyQuery();
  const [date, setDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  let displayDate = date;
  let displayTime = startTime;

  if (existingLessonData?.lessonsByPk?.startDateTime) {
    const lessonDate = new Date(existingLessonData.lessonsByPk.startDateTime);
    displayDate = format(lessonDate, 'EEEE MMM d');
    displayTime = format(lessonDate, 'p');
  }

  React.useEffect(() => {
    if (router.isReady) {
      const datetime = router.query.datetime;

      if (datetime && typeof datetime === 'string') {
        const parsedLessonDate = new Date(parseInt(datetime, 10));
        const date = format(parsedLessonDate, 'EEEE MMM d');
        const time = format(parsedLessonDate, 'p');

        setDate(date);
        setStartTime(time);
      }
    }
  }, [router.isReady]);

  React.useEffect(() => {
    if (router.isReady && viewer.userId) {
      if (router.query.lessonId && typeof router.query.lessonId === 'string') {
        fetchExistingLesson({
          variables: {
            id: router.query.lessonId,
          },
        });
      }
    }
  }, [router.isReady, viewer.userId]);

  return (
    <>
      <Head
        title="Successfully Joined Lesson"
        description="You have successfully joined a lesson on Bounce"
        noIndex
      />
      <div className="flex h-full grow flex-col">
        <div className="mx-auto flex h-full w-full max-w-lg grow flex-col items-center lg:max-w-details-content-container">
          <div className="flex h-full w-full grow flex-col lg:grow-0">
            <div className="flex h-full w-full grow flex-col items-center overflow-y-auto px-6 pt-28 text-center lg:grow-0 lg:px-0">
              <img src="/images/ball/ball-payment.svg" className="w-32" alt="logo" />
              <div className="flex h-full flex-col justify-center pb-32">
                <h1 className="mt-12 text-2xl leading-7">Your lesson is booked!</h1>
                <div className="mt-4 max-w-xs text-center leading-6 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  See you on {displayDate} @ {displayTime}.
                </div>
              </div>
            </div>
          </div>
          <div className="w-full pb-14">
            <div className="flex w-full flex-col items-center px-6 lg:px-0">
              <div className="mt-10 flex w-full flex-col items-center space-y-6 pb-6">
                <Link href={HOME_PAGE} className="button-rounded-full-primary">
                  View my lessons
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonJoinSuccess;
