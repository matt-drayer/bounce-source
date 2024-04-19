import * as React from 'react';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { set } from 'date-fns';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import {
  CompetitionGenderEnum,
  EventPrivacyEnum,
  TeamTypesEnum,
  useUpdateEventContentsMutation,
  useUpdateEventGroupsByPkMutation,
  useUpdateEventSponsorsByPkMutation,
  useUpdateFaqByIdMutation,
} from 'types/generated/client';
import { buildTournamentEventName } from 'utils/shared/string/buildTournamentEventName';
import { EVENT_FORMAT_OPTIONS, SCORING_TYPE_OPTIONS } from 'utils/shared/string/tournamentBuilder';
import {
  eventFormatEnumToString,
  eventTypeEnumToString,
  scoringTypeEnumToString,
} from 'utils/shared/string/tournamentBuilder';
import { Button } from 'components/Button';
import Settings from 'components/tournaments-builder/CompetitionForm/Settings';
import { settingsSchema } from 'components/tournaments-builder/CompetitionForm/Settings';
import TimeSlot from 'components/tournaments-builder/CompetitionForm/TimeSlot';
import { timeSlotSchema } from 'components/tournaments-builder/CompetitionForm/TimeSlot';
import FieldWrapper from 'components/tournaments-builder/FieldWrapper';
import InputField from 'components/tournaments-builder/InputField';
import { InputType } from 'components/tournaments-builder/InputField/InputField';
import RadioList from 'components/tournaments-builder/RadioList';
import FilledEvent from '../TournamentEvent';

type Props = {
  onChangeEvents(events: any[]): void;
  isEdit: boolean;
  basicForm: any;
  tournamentData: any;
};

interface EventData {
  eventFormat: string;
  gamePerMatch?: number | null;
  gender: string;
  maxAge?: number | null;
  minAge?: number | null;
  maxRating?: number | null;
  minRating?: number | null;
  minGamesNumber?: number | null;
  eventFee?: number | null;
  totalPoints?: number | null;
  winBy?: string | null;
  scoringType: string;
  timeSlotFrom: string;
}

const EMPTY_EVENT = {
  gender: CompetitionGenderEnum.Male,
  minRating: 2,
  maxRating: 3,
  eventType: TeamTypesEnum.Doubles,
  rating: 'UTPR',
  timeSlotDate: new Date(),
  filled: false,
  isNew: true,
  eventFee: 0,
  timeSlotFrom: set(new Date(), {
    hours: 8,
    minutes: 0,
  }),
  timeSlotTo: set(new Date(), {
    hours: 20,
    minutes: 0,
  }),
};

const schema = z.object({
  events: z.array(
    z.object({
      ...settingsSchema,
      ...timeSlotSchema,

      eventFormat: z.string(),
      minGamesNumber: z.number(),

      scoringType: z.string(),
      gamePerMatch: z.number(),
      totalPoints: z.number(),
      winBy: z.number(),
    }),
  ),
});

const CompetitionForm = ({ onChangeEvents, isEdit, basicForm, tournamentData }: Props) => {
  const [updateEventByIdMutation] = useUpdateEventContentsMutation();
  const [updateFaqByIdMutation] = useUpdateFaqByIdMutation();
  const [updateEventSponsorsByPk] = useUpdateEventSponsorsByPkMutation();
  const [updateEventGroupsByPk] = useUpdateEventGroupsByPkMutation();

  const {
    gender,
    maximumAge,
    minimumAge,
    maximumRating,
    minimumRating,
    minimumNumberOfGames,
    priceUnitAmount,
    totalPoints,
    winBy,
    endsAt,
    startsAt,
  } = tournamentData?.groups[0] || {};

  const FILLED_EVENT = {
    gender: gender,
    minRating: minimumRating,
    maxRating: maximumRating,
    maxAge: maximumAge,
    minAge: minimumAge,
    minGamesNumber: minimumNumberOfGames,
    eventType: TeamTypesEnum.Doubles,
    totalPoints: totalPoints,
    winBy: winBy,
    rating: 'UTPR',
    eventFee: priceUnitAmount,
    timeSlotFrom: startsAt,
    timeSlotTo: endsAt,
  };

  const defaultValues = tournamentData?.groups.length > 0 ? [FILLED_EVENT] : [EMPTY_EVENT];

  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    setValue,
    formState: { errors, isValid, isValidating, isDirty, dirtyFields },
  } = useForm({
    resolver: zodResolver(schema, undefined, {
      rawValues: true,
    }),
    mode: 'onChange',
    defaultValues: {
      events: defaultValues,
    } as any,
  });

  const { fields, update, insert, append, remove } = useFieldArray({
    control,
    name: 'events',
  });

  const isAllEventsFilled = (fields as any[]).every(({ filled }) => filled);

  const isSubmittable = isDirty && isValid;

  useEffect(() => {
    onChangeEvents(getValues('events'));
  }, [isValid, isValidating]);

  const buildEventObject = () => {
    const { title, overview, registrationFee, registrationDeadline, sanctioned, hasPrizes } =
      basicForm;

    return {
      title,
      description: overview,
      registrationPriceUnitAmount: registrationFee,
      registrationDeadlineDate: registrationDeadline,
      privacy: basicForm.private ? EventPrivacyEnum.Private : EventPrivacyEnum.Public,
      isSanctioned: sanctioned,
      hasPrizes,
    };
  };

  const buildGroupObject = () => {
    const {
      eventFormat,
      gamePerMatch,
      gender,
      maxAge,
      minAge,
      maxRating,
      minRating,
      minGamesNumber,
      eventFee,
      totalPoints,
      winBy,
      scoringType,
      timeSlotFrom,
    } = getValues('events')[0] as EventData;

    return {
      format: eventFormat || '',
      gamesPerMatch: gamePerMatch || null,
      gender: gender || '',
      maximumAge: maxAge || null,
      minimumAge: minAge || null,
      maximumRating: maxRating || null,
      minimumRating: minRating || null,
      minimumNumberOfGames: minGamesNumber || null,
      priceUnitAmount: eventFee || null,
      totalPoints: totalPoints || null,
      winBy: winBy || null,
      scoringFormat: scoringType || '',
      endsAt: timeSlotFrom || '',
      startsAt: timeSlotFrom || '',
    };
  };

  const updateData = async (id: string, updateFunction: any, inputObj: any) => {
    try {
      const response = await updateFunction({
        variables: {
          id: id,
          input: inputObj,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleUpdate = () => {
    const id = tournamentData.id;
    const groupId = tournamentData.groups[0]?.id;
    const faqId = tournamentData.faqs[0]?.id;

    const eventObj = buildEventObject();
    const groupObj = buildGroupObject();

    groupId && updateData(groupId, updateEventGroupsByPk, groupObj);
    faqId && updateData(faqId, updateFaqByIdMutation, basicForm.faqs);
    updateData(id, updateEventByIdMutation, eventObj);
  };

  return (
    <form>
      {isEdit ? (
        <h2 className="mb-4 text-size-product-heading-compact-desktop font-bold">Edit events</h2>
      ) : (
        <h2 className="mb-4 text-size-product-heading-compact-desktop font-bold">Create events</h2>
      )}
      {fields.map((item: any, index) => {
        const field = `events.${index}`;

        const {
          eventType,
          gender,
          maxRating,
          minRating,
          timeSlotDate,
          scoringType,
          totalPoints,
          winBy,
          eventFee,
          maxNumOfTeams,
          eventFormat,
          gamePerMatch,
          minGamesNumber,
          timeSlotFrom,
          timeSlotTo,
        } = getValues(field);

        watch(timeSlotDate);

        const eventName = buildTournamentEventName({
          eventType: eventTypeEnumToString(eventType),
          gender,
          maxRating,
          minRating,
        });

        if (item.filled) {
          const scoring = `${scoringTypeEnumToString(scoringType)} ${totalPoints} win by ${winBy}`;

          const eventDay = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
          }).format(timeSlotDate);

          return (
            <FilledEvent
              className="mb-4"
              key={index}
              format={eventFormatEnumToString(eventFormat)}
              eventName={eventName}
              time={`${eventDay} ${format(timeSlotFrom, 'hh:mma')} - ${format(
                timeSlotTo,
                'hh:mm a',
              )}`}
              gamePerMatch={gamePerMatch}
              minGames={minGamesNumber}
              scoring={scoring}
              eventFee={eventFee}
              teamsCount={maxNumOfTeams}
              onEdit={() => {
                update(index, { ...getValues(field), filled: false });
              }}
              onDelete={() => {
                remove(index);
              }}
              onDuplicate={() => {
                append(getValues(field));
                update(index, { ...getValues(field), filled: false });
              }}
            />
          );
        }

        return (
          <div
            className="mb-4 rounded-md border border-color-border-input-lightmode p-6"
            key={index}
          >
            <FieldWrapper label="Event title">
              <div className="flex">
                <div className="mr-6 flex w-full rounded-md border border-color-border-brand bg-color-brand-secondary bg-opacity-5 p-3">
                  <span className="font-medium text-color-text-lightmode-primary">{eventName}</span>
                </div>
                <div className="shrink-0 text-size-informative-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  This is pre-populated.
                </div>
              </div>
            </FieldWrapper>

            <Settings
              errors={errors}
              control={control}
              register={register}
              fieldName={field}
              getValues={getValues}
            />

            <TimeSlot control={control} getValues={getValues} fieldName={field} />

            <FieldWrapper label="Format">
              <div className="flex gap-x-4">
                <div className="flex w-[70%] flex-wrap gap-x-4 [&>div]:max-w-[21em]">
                  <RadioList
                    control={control}
                    errors={errors}
                    name={`${field}.eventFormat`}
                    listHeader={'Event format'}
                    shouldRenderOthers
                    otherInputPlaceholder="Specify tournament format"
                    options={EVENT_FORMAT_OPTIONS}
                  />
                </div>
                <div className="w-[30%] text-size-informative-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  These are the most common types of tournament. If you’re format isn’t here, select
                  “other” a type the format.{' '}
                </div>
              </div>
              <div className="mt-12 flex gap-x-4">
                <div className="flex w-[70%] flex-wrap gap-x-4">
                  <div className="w-1/2">
                    <InputField
                      fieldLabel="Number of min games"
                      errors={errors}
                      placeholder="Number of min games"
                      name={`${field}.minGamesNumber`}
                      inputProps={{
                        type: 'number',
                      }}
                      register={register}
                      inputType={InputType.LabelInput}
                    />
                  </div>
                  <div className="w-1/2" />
                </div>
                <div className="w-[30%] text-size-informative-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  This is the number of games that you are guaranteeing players.
                </div>
              </div>
            </FieldWrapper>

            <FieldWrapper isLast label="Game details">
              <div className="flex gap-x-4">
                <div className="flex w-[70%] gap-x-4">
                  <div className="w-1/2">
                    <RadioList
                      listHeader={'Scoring type'}
                      control={control}
                      errors={errors}
                      name={`${field}.scoringType`}
                      options={SCORING_TYPE_OPTIONS}
                    />
                  </div>
                  <div className="w-1/2">
                    <RadioList
                      listHeader={'Games per match'}
                      control={control}
                      errors={errors}
                      name={`${field}.gamePerMatch`}
                      options={[
                        { value: 1, label: 1 },
                        { value: 3, label: 3 },
                        { value: 5, label: 5 },
                      ]}
                    />
                  </div>
                </div>
                <div className="w-[30%] text-size-informative-caption text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
                  Help players understand exactly how they’ll compete.
                </div>
              </div>
              <div className="mt-12 flex gap-x-4">
                <div className="flex w-[70%] gap-x-4">
                  <div className="w-1/2">
                    <RadioList
                      listHeader={'Total points'}
                      control={control}
                      errors={errors}
                      name={`${field}.totalPoints`}
                      options={[
                        { value: 11, label: 11 },
                        { value: 15, label: 15 },
                        { value: 21, label: 21 },
                      ]}
                    />
                  </div>
                  <div className="w-1/2">
                    <RadioList
                      listHeader={'Win by?'}
                      control={control}
                      errors={errors}
                      name={`${field}.winBy`}
                      options={[
                        { value: 1, label: 1 },
                        { value: 2, label: 2 },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </FieldWrapper>

            <div className="mt-6 flex justify-end gap-x-3">
              <Button isInline variant="inverted" size={'sm'} onClick={() => remove(index)}>
                Cancel
              </Button>

              <Button
                isInline
                variant="primary"
                size={'sm'}
                onClick={() => {
                  handleUpdate();
                  update(index, {
                    ...getValues(field),
                    filled: true,
                    isNew: false,
                  });
                }}
              >
                {!isEdit
                  ? item.isNew
                    ? 'Create event'
                    : 'Save'
                  : item.isNew
                  ? 'Edit event'
                  : 'Save'}
              </Button>
            </div>
          </div>
        );
      })}

      {isAllEventsFilled && (
        <div
          className="mb-6 cursor-pointer font-medium text-color-brand-primary"
          onClick={() => append(EMPTY_EVENT)}
        >
          + Add Event
        </div>
      )}
    </form>
  );
};

export default CompetitionForm;
