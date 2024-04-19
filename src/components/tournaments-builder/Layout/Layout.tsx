import * as React from 'react';
import { useState } from 'react';
import { set } from 'date-fns';
import Link from 'next/link';
import { HOME_PAGE } from 'constants/pages';
import { TOURNAMENT_ORGANIZER_DASHBOARD } from 'constants/pages';
import { EventCreatePayload } from 'constants/payloads/events';
import { EventCreateResponse } from 'constants/payloads/events';
import { SponsorCreatePayload } from 'constants/payloads/events';
import { PostRequestPayload } from 'constants/payloads/images';
import { PostResponsePayload } from 'constants/payloads/images';
import { useApiGateway } from 'hooks/useApi';
import { useModal } from 'hooks/useModal';
import ChevronLeft from 'svg/ChevronLeft';
import Dashboard from 'svg/Dashboard';
import LogoWithSplash from 'svg/LogoWithSplash';
import Notification from 'svg/Notification';
import Tournament from 'svg/Tournament';
import { Button } from 'components/Button';
import BasicsForm from 'components/tournaments-builder/BasicsForm/BasicsForm';
import CompetitionForm from 'components/tournaments-builder/CompetitionForm';
import Review from 'components/tournaments-builder/Review';
import Stepper from 'components/tournaments-builder/Stepper';

type Props = {
  isEdit: boolean;
  eventData: any;
};

const nav = [
  {
    ref: TOURNAMENT_ORGANIZER_DASHBOARD,
    text: 'Dashboard',
    renderIcon: (classes: string) => <Dashboard className={classes} />,
  },
  {
    ref: '/',
    text: 'Tournaments',
    renderIcon: (classes: string) => <Tournament className={classes} />,
  },
  {
    ref: '/',
    text: 'Notification',
    renderIcon: (classes: string) => <Notification className={classes} />,
  },
];

// TODO add types
const useCreateEvent = (event: any, eventGroups: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { post: postUploadSponsor } = useApiGateway<PostRequestPayload, PostResponsePayload>(
    '/v1/images/sponsors',
  );

  const { post: postUploadBanner } = useApiGateway<PostRequestPayload, PostResponsePayload>(
    '/v1/images/event-banner',
  );

  const { post: postCreateEvent } = useApiGateway<EventCreatePayload, EventCreateResponse>(
    '/v1/tournaments/create',
  );

  return {
    isLoading,
    createEvent: async () => {
      try {
        setIsLoading(true);

        const bannerFormData: PostRequestPayload = new FormData();

        bannerFormData.append('banner', event.banner);

        const sponsorsData = await Promise.all(
          // TODO update type
          event.sponsors.map(async (sponsor: any): Promise<SponsorCreatePayload> => {
            const sponsorFormData: PostRequestPayload = new FormData();

            sponsorFormData.append('sponsor', event.banner);

            const fileResponse = await postUploadSponsor({
              payload: sponsorFormData,
            });

            return {
              name: sponsor.name,
              sponsorUrl: sponsor.url,
              isFeatured: sponsor.isFeatured,
              ...(fileResponse.data as PostResponsePayload),
            };
          }),
        );

        const { data: banner } = await postUploadBanner({
          payload: bannerFormData,
        });

        const payload = {
          ...event,
          banner,
          eventGroups,
          sponsors: sponsorsData,
          startDateTime: set(event.from, {
            hours: 8,
            minutes: 0,
            seconds: 0,
          }),
          endDateTime: set(event.to, {
            hours: 21,
            minutes: 0,
            seconds: 0,
          }),
        } as EventCreatePayload;

        const { data } = await postCreateEvent({
          payload,
        });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
  };
};

const Layout = ({ isEdit, eventData }: Props) => {
  const [eventGroups, setEventGroups] = useState<any[]>([]);
  const [basicForm, setBasicForm] = useState<Record<string, any> | null>(null);
  const { createEvent, isLoading } = useCreateEvent(basicForm, eventGroups);
  const [currentStep, setCurrentStep] = useState(0);
  const [isBasicFormValid, setIsBasicFormValid] = useState(false);

  const {
    openModal: openWizardModal,
    isOpen: isWizardModalOpen,
    closeModal: closeWizardModal,
  } = useModal();

  const steps = [
    { title: 'Tournament', description: 'Setup the tournament' },
    {
      title: 'Events',
      description: 'Create individual events',
    },
    {
      title: 'Review',
      description: 'Preview before publshing',
    },
  ];

  const isNextDisabled = () => {
    if (isLoading) return true;

    if (currentStep === 0) return !isBasicFormValid || !basicForm?.venue;

    if (currentStep === 1) return eventGroups.length <= 0;
  };

  const back = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <main className="flex h-full">
      <aside className="max-w-[225px] border-r border-color-border-input-lightmode bg-gray-50 p-4">
        <a href={HOME_PAGE} className="flex p-4">
          <LogoWithSplash className="h-7 w-full max-w-[130px]" />
        </a>

        <nav>
          <ul>
            {nav.map(({ ref, text, renderIcon }, index) => {
              return (
                <li
                  key={index}
                  className="
                    group
                    flex
                    cursor-pointer
                    items-center
                    p-4
                    text-color-text-lightmode-secondary transition-all
                    hover:bg-color-bg-lightmode-tertiary
                    dark:text-color-text-darkmode-secondary"
                >
                  {renderIcon(
                    'mr-2 group-hover:[&>path]:fill-color-bg-lightmode-brand fill-color-text-lightmode-secondary w-6 h-6',
                  )}
                  <Link href={ref} className="group-hover:text-color-text-brand">
                    {text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <section className="w-full">
        <header className="flex items-center justify-between border-b border-color-border-input-lightmode pb-4 pl-8 pr-8 pt-4">
          <button className="flex items-center" onClick={back}>
            <ChevronLeft className="mr-4 h-[24px] w-[24px]" />
            {isEdit ? (
              <h1 className="text-2xl font-bold">Edit tournament</h1>
            ) : (
              <h1 className="text-2xl font-bold">Create tournament</h1>
            )}
          </button>
          <div className="flex justify-end gap-x-3">
            <Button isInline variant="inverted" size={'sm'} onClick={back}>
              Back
            </Button>

            <Button
              isInline
              disabled={isNextDisabled()}
              variant="primary"
              size={'sm'}
              onClick={async () => {
                if (currentStep < 2) {
                  setCurrentStep(currentStep + 1);
                } else {
                  await createEvent();
                  setCurrentStep(0);
                }
              }}
            >
              {isLoading ? 'Loading...' : 'Next'}
            </Button>
          </div>
        </header>
        <div className="mt-4 flex justify-center">
          <Stepper currentStep={currentStep} steps={steps} />
        </div>
        {/*<CreateTournamentWizard onClose={closeWizardModal} isOpen={true} totalEvents={12} />*/}
        <div className="mx-auto w-full max-w-[1024px] p-4 pt-9">
          {currentStep === 0 && (
            <BasicsForm
              onChange={(form, isValid) => {
                setIsBasicFormValid(isValid);
                setBasicForm(form);
              }}
              tournamentData={eventData}
            />
          )}
          {currentStep === 1 && eventData && (
            <CompetitionForm
              tournamentData={eventData}
              basicForm={basicForm}
              onChangeEvents={(eventGroups: any[]) => setEventGroups(eventGroups)}
              isEdit={isEdit}
            />
          )}
          {currentStep === 2 && (
            <Review
              data={
                {
                  ...basicForm,
                  eventGroups,
                } as any
              }
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default Layout;
