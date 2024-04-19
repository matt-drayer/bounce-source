import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { addWeeks, format, startOfToday } from 'date-fns';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { HOME_PAGE } from 'constants/pages';
import { useGetLessonByIdLazyQuery } from 'types/generated/client';
import { LessonStatusesEnum, useInsertRepeatLessonsMutation } from 'types/generated/client';
import { getLessonImageUrl } from 'utils/shared/user/getLessonImageUrl';
import { getProfileImageUrlOrPlaceholder } from 'utils/shared/user/getProfileImageUrlOrPlaceholder';
import { useViewer } from 'hooks/useViewer';
import SafeAreaPage from 'layouts/SafeAreaPage';
import DateGroupHeader from 'components/DateGroupHeader';
import PageTitle from 'components/PageTitle';
import SectionHeading from 'components/SectionHeading';
import Card from 'components/cards/Card';
import CardLessonFeed from 'components/cards/CardLessonFeed';
import TabBar from 'components/nav/TabBar';
import Head from 'components/utilities/Head';
import classNames from 'styles/utils/classNames';

const NewLessonRepeat = () => {
  const today = startOfToday();
  const router = useRouter();
  const viewer = useViewer();
  const [fetchLessonByIdQuery, { data }] = useGetLessonByIdLazyQuery();
  const [insertRepeatLessonsMutation, { loading, called, error }] =
    useInsertRepeatLessonsMutation();
  const lesson = data?.lessonsByPk;
  const [lessonRepeatCount, setLessonRepeatCount] = React.useState(0);
  const repeatList = new Array(lessonRepeatCount)
    .fill(null)
    .map((_, index) => {
      if (!lesson) {
        return null;
      }

      const startDateTime = addWeeks(new Date(lesson.startDateTime), index + 1);
      const endDateTime = addWeeks(new Date(lesson.endDateTime), index + 1);

      return {
        coverImageUrl: '',
        currency: lesson.currency,
        description: lesson.description,
        endDateTime: endDateTime,
        ownerUserId: lesson.ownerUserId,
        paymentFulfillmentChannel: lesson.paymentFulfillmentChannel,
        participantLimit: lesson.participantLimit,
        priceUnitAmount: lesson.priceUnitAmount,
        privacy: lesson.privacy,
        startDateTime: startDateTime,
        status: LessonStatusesEnum.Active,
        times: {
          data: [
            {
              startDateTime: startDateTime.toISOString(),
              endDateTime: endDateTime.toISOString(),
            },
          ],
        },
        equipment: {
          data: lesson.equipment.map((item) => {
            return {
              equipmentOptionId: item.equipmentOptionId,
            };
          }),
        },
        title: lesson.title,
        type: lesson.type,
        typeCustom: lesson.typeCustom,
        usedTemplateId: lesson.usedTemplateId,
        userCustomCourtId: lesson.userCustomCourtId,
        publishedAt: 'now()',
        timezoneName: lesson.timezoneName,
        timezoneAbbreviation: lesson.timezoneAbbreviation,
        timezoneOffsetMinutes: lesson.timezoneOffsetMinutes,
        locale: lesson.locale,
      };
    })
    .filter((l) => !!l);

  React.useEffect(() => {
    const fetchLesson = async (id: string) => {
      try {
        fetchLessonByIdQuery({
          variables: { id },
        });
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    if (router.isReady && viewer.userId) {
      if (router.query.lessonId && typeof router.query.lessonId === 'string') {
        fetchLesson(router.query.lessonId);
      }
    }
  }, [router.isReady, viewer.userId]);

  return (
    <>
      <Head title="Repeat Lesson" description="Repeat your Bounce lesson" noIndex />
      <SafeAreaPage>
        <div className="flex h-full grow flex-col">
          <div className="relative flex h-full grow flex-col">
            <div className="relative shrink-0 bg-color-bg-lightmode-primary shadow-mobile-top-nav dark:bg-color-bg-darkmode-primary">
              <PageTitle title="Lesson repeat" isPop />
              <div className="w-full items-center justify-center px-6 pb-6 lg:flex">
                <div className="w-full max-w-main-content-container items-center justify-center lg:flex">
                  <div className="shrink-0 lg:mr-8">
                    <h2 className="leading-6 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary lg:text-lg lg:text-color-text-lightmode-primary dark:lg:text-color-text-darkmode-primary">
                      Repeat for
                    </h2>
                  </div>
                  <div className="mt-2 grid w-full grid-cols-4 gap-3 lg:mt-0">
                    <button
                      className={classNames(
                        'rounded-md py-1.5 text-xs lg:py-2.5',
                        lessonRepeatCount === 0
                          ? 'bg-color-brand-primary text-color-button-darkmode'
                          : 'bg-color-bg-input-lightmode-primary dark:bg-color-bg-input-darkmode-primary',
                      )}
                      onClick={() => setLessonRepeatCount(0)}
                      type="button"
                    >
                      None
                    </button>
                    <button
                      className={classNames(
                        'rounded-md py-1.5 text-xs lg:py-2.5',
                        lessonRepeatCount === 1
                          ? 'bg-color-brand-primary text-color-button-darkmode'
                          : 'bg-color-bg-input-lightmode-primary dark:bg-color-bg-input-darkmode-primary',
                      )}
                      onClick={() => setLessonRepeatCount(1)}
                      type="button"
                    >
                      1{' '}
                      <span>
                        <br className="lg:hidden" />{' '}
                      </span>
                      week
                    </button>
                    <button
                      className={classNames(
                        'rounded-md py-1.5 text-xs lg:py-2.5',
                        lessonRepeatCount === 2
                          ? 'bg-color-brand-primary text-color-button-darkmode'
                          : 'bg-color-bg-input-lightmode-primary dark:bg-color-bg-input-darkmode-primary',
                      )}
                      onClick={() => setLessonRepeatCount(2)}
                      type="button"
                    >
                      2
                      <span>
                        <br className="lg:hidden" />{' '}
                      </span>
                      weeks
                    </button>
                    <button
                      className={classNames(
                        'rounded-md py-1.5 text-xs lg:py-2.5',
                        lessonRepeatCount === 3
                          ? 'bg-color-brand-primary text-color-button-darkmode'
                          : 'bg-color-bg-input-lightmode-primary dark:bg-color-bg-input-darkmode-primary',
                      )}
                      onClick={() => setLessonRepeatCount(3)}
                      type="button"
                    >
                      3{' '}
                      <span>
                        <br className="lg:hidden" />{' '}
                      </span>
                      weeks
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-full w-full grow flex-col items-center overflow-y-auto bg-color-bg-lightmode-secondary px-6 dark:bg-color-bg-darkmode-secondary">
              <div className="flex w-full max-w-main-content-container grow flex-col pb-32">
                {!!lesson && (
                  <>
                    <div className="space-y-2">
                      <div className="my-2">
                        <SectionHeading>Lesson already scheduled</SectionHeading>
                      </div>
                      <DateGroupHeader date={new Date(lesson.startDateTime)} today={today} />
                      {!!lesson && (
                        <CardLessonFeed
                          useShortName
                          title={lesson.title}
                          imageUrl={getLessonImageUrl({ path: lesson.coverImagePath })}
                          startTime={format(new Date(lesson.startDateTime), 'p')}
                          endTime={format(new Date(lesson.endDateTime), 'p')}
                          type={lesson.type}
                          courtName={lesson.userCustomCourt?.title || ''}
                          participantCount={lesson.participantsAggregate?.aggregate?.count}
                          participantLimit={lesson.participantLimit}
                          participants={lesson.participants.map((participant) => {
                            return {
                              id: participant.id,
                              name: participant?.userProfile?.preferredName || '',
                              image: getProfileImageUrlOrPlaceholder({
                                path: participant?.userProfile?.profileImagePath,
                              }),
                            };
                          })}
                          coachName={lesson.ownerProfile?.fullName || ''}
                          coachImagePath={lesson.ownerProfile?.profileImagePath || ''}
                          isCoach={true}
                          isParticipant={false}
                          priceUnitAmount={lesson.priceUnitAmount}
                        />
                      )}
                    </div>
                    <div>
                      <div className="mb-2 mt-6">
                        <SectionHeading>Additional lessons to schedule</SectionHeading>
                      </div>
                      <div className="space-y-4">
                        {!!lesson && repeatList.length > 0 ? (
                          repeatList.map((repeatLesson, index) =>
                            !repeatLesson ? null : (
                              <div className="space-y-2">
                                <DateGroupHeader
                                  date={new Date(repeatLesson.startDateTime)}
                                  today={today}
                                />
                                <CardLessonFeed
                                  key={index}
                                  useShortName
                                  title={repeatLesson.title}
                                  imageUrl={getLessonImageUrl({ path: lesson.coverImagePath })}
                                  startTime={format(new Date(lesson.startDateTime), 'p')}
                                  endTime={format(new Date(lesson.endDateTime), 'p')}
                                  type={repeatLesson.type}
                                  courtName={
                                    lesson.userCustomCourt?.title ||
                                    lesson.userCustomCourt?.fullAddress ||
                                    ''
                                  }
                                  participantCount={lesson.participantsAggregate?.aggregate?.count}
                                  participantLimit={lesson.participantLimit}
                                  participants={lesson.participants.map((participant) => {
                                    return {
                                      id: participant.id,
                                      name: participant?.userProfile?.preferredName || '',
                                      image: getProfileImageUrlOrPlaceholder({
                                        path: participant?.userProfile?.profileImagePath,
                                      }),
                                    };
                                  })}
                                  coachName={lesson.ownerProfile?.fullName || ''}
                                  coachImagePath={lesson.ownerProfile?.profileImagePath || ''}
                                  isCoach={true}
                                  isParticipant={false}
                                  priceUnitAmount={lesson.priceUnitAmount}
                                />
                              </div>
                            ),
                          )
                        ) : (
                          <Card>
                            <div className="flex items-center justify-center p-6 text-center text-sm text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                              Use the buttons above to select the number of times you want to repeat
                              the lesson you just published
                            </div>
                          </Card>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {!!lessonRepeatCount && (
            <div className="fixed bottom-0 right-0 hidden w-[calc(100vw_-_theme(space.sidebar))] px-6 backdrop-blur-md lg:flex">
              <div className="mx-auto w-full max-w-main-content-container">
                <div className="flex items-center justify-end">
                  <div className="flex items-center py-4">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          if (repeatList) {
                            await insertRepeatLessonsMutation({
                              variables: {
                                // @ts-ignore This won't have nulls but TS is not recognizing that
                                objects: repeatList.filter((l) => !!l),
                              },
                            });
                          }
                        } catch (error) {
                          toast.error(
                            'We had trouble creating your new lessons. Please try again later.',
                          );
                          Sentry.captureException(error);
                        } finally {
                          router.push(HOME_PAGE);
                        }
                      }}
                      className="button-rounded-full-primary px-8"
                      disabled={loading && called && !error}
                    >
                      Publish {lessonRepeatCount} new{' '}
                      {lessonRepeatCount !== 1 ? 'lessons' : 'lesson'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <TabBar
          aboveTabContent={
            !!lessonRepeatCount && (
              <div className="safearea-pad-bot absolute bottom-tabs w-full">
                <div className="flex w-full items-center px-6 backdrop-blur-sm">
                  <div className="flex w-full items-center pb-6">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          if (repeatList) {
                            await insertRepeatLessonsMutation({
                              variables: {
                                // @ts-ignore This won't have nulls but TS is not recognizing that
                                objects: repeatList.filter((l) => !!l),
                              },
                            });
                          }
                        } catch (error) {
                          toast.error(
                            'We had trouble creating your new lessons. Please try again later.',
                          );
                          Sentry.captureException(error);
                        } finally {
                          router.push(HOME_PAGE);
                        }
                      }}
                      className="button-rounded-full-primary"
                      disabled={loading && called && !error}
                    >
                      Publish {lessonRepeatCount} new{' '}
                      {lessonRepeatCount !== 1 ? 'lessons' : 'lesson'}
                    </button>
                  </div>
                </div>
              </div>
            )
          }
        />
      </SafeAreaPage>
    </>
  );
};

export default NewLessonRepeat;
