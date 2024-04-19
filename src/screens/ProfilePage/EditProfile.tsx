import * as React from 'react';
import { ChevronDownIcon, CurrencyDollarIcon, PlusIcon } from '@heroicons/react/24/solid';
import * as Sentry from '@sentry/nextjs';
import { useFieldArray, useForm } from 'react-hook-form';
import { COUNTRY_USA } from 'constants/countries';
import { CURRENCY_USD } from 'constants/currency';
import {
  ImageWideForLessonType,
  NORMALIZED_RATING_SYSTEM_SHORT_NAME,
  lessonDisplayName,
} from 'constants/sports';
import {
  CoachQualificationStatusesEnum,
  GetCountriesAndActiveSubdivisionsQuery,
  LessonTypesEnum,
  UserProfileFieldsFragment,
  useGetAvailableCoachQualificationsQuery,
  useGetCountriesAndActiveSubdivisionsQuery,
  useGetTennisRatingScalesQuery,
  useUpdateCoachProfileMutation,
  useUpdatePlayerProfileMutation,
} from 'types/generated/client';
import { fixIosValidationScrollBug } from 'utils/mobile/fixIosValidationScrollBug';
import { filterSubdivisionsForCountry } from 'utils/shared/countries/filterSubdivisionsForCountry';
import { getOrderedCountries } from 'utils/shared/countries/getOrderedCountries';
import { convertFormattedPriceToUnitAmount } from 'utils/shared/money/convertFormattedPriceToUnitAmount';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { normalizeRating } from 'utils/shared/tennis/normalizeRating';
import { getBadgeTextForQualification } from 'utils/shared/user/getBadgeTextForQualification';
import { getFullTextForQualification } from 'utils/shared/user/getFullTextForQualification';
import { useViewer } from 'hooks/useViewer';
import classNames from 'styles/utils/classNames';

const COACH_SERVICES_LIST_NAME = 'coachServices';

interface Props {
  profile: UserProfileFieldsFragment;
  isLoading: boolean;
  isCoachProfile: boolean;
  updateCoachProfileMutation: ReturnType<typeof useUpdateCoachProfileMutation>[0];
  updatePlayerProfileMutation: ReturnType<typeof useUpdatePlayerProfileMutation>[0];
  handleToggle: () => void;
  refetchProfile?: () => void;
}

type FormValues = {
  fullName: string;
  preferredName: string;
  aboutMe: string;
  countryId: string | null;
  countrySubdivisionId: string | null;
  cityName: string;
  ratingScale: string;
  rating: number | null;
  [COACH_SERVICES_LIST_NAME]: (UserProfileFieldsFragment['coachServices'][0] & {
    priceDisplay?: number | string;
  })[];
};

const validateTrimmedLength = (value: string = '') =>
  value.trim().length > 0 || 'You must fill out this field';

const EditProfile: React.FC<Props> = ({
  profile,
  isLoading,
  updateCoachProfileMutation,
  updatePlayerProfileMutation,
  handleToggle,
  refetchProfile,
  isCoachProfile,
}) => {
  const viewer = useViewer();
  const { data: countryData, loading: countriesLoading } =
    useGetCountriesAndActiveSubdivisionsQuery({
      variables: {
        countryId: COUNTRY_USA,
      },
    });
  const { data: qualificationData, loading: qualificationsLoading } =
    useGetAvailableCoachQualificationsQuery();
  const { data: ratingScaleData, loading: ratingScalesLoading } = useGetTennisRatingScalesQuery();
  const [isServicesLoaded, setIsServicesLoaded] = React.useState(false);
  const [isQualificationsOpen, setIsQualificationsOpen] = React.useState(false);
  const { register, handleSubmit, control, watch, setValue } = useForm<FormValues>({
    shouldUseNativeValidation: true,
    reValidateMode: 'onBlur',
    defaultValues: {
      fullName: profile?.fullName || '',
      preferredName: profile?.preferredName || '',
      aboutMe: profile?.aboutMe || '',
      countryId: profile?.country?.id || COUNTRY_USA,
      countrySubdivisionId: profile?.countrySubdivision?.id || null,
      cityName: profile?.cityName || '',
      ratingScale: profile?.tennisRatingScale?.id || '',
      rating: profile?.tennisRating || null,
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: COACH_SERVICES_LIST_NAME,
  });
  const activeCountryId = watch('countryId');
  const values = watch();
  const countries = countryData?.countries
    ? (getOrderedCountries(
        countryData.countries,
      ) as GetCountriesAndActiveSubdivisionsQuery['countries'])
    : ([] as GetCountriesAndActiveSubdivisionsQuery['countries']);
  const countrySubdivisions =
    activeCountryId === COUNTRY_USA ? countryData?.countrySubdivisions : null;
  const qualifications = qualificationData?.coachQualifications;
  const coachQualifications = (profile?.coachQualifications || []).filter(
    (qualification) => qualification.status === CoachQualificationStatusesEnum.Active,
  );
  const tennisRatingScales = ratingScaleData?.tennisRatingScales || [];
  const activeRatingScale = tennisRatingScales.find((scale) => scale.id === values.ratingScale);
  const isDisabled = isLoading || countriesLoading || qualificationsLoading || ratingScalesLoading;

  React.useEffect(() => {
    if (profile.coachQualifications) {
      profile.coachQualifications.forEach((qualification) => {
        setValue(
          qualification.qualification.id,
          qualification.status === CoachQualificationStatusesEnum.Active,
        );
      });
    }
  }, [profile.coachQualifications]);

  React.useEffect(() => {
    if (profile.coachServices && !isServicesLoaded) {
      setIsServicesLoaded(true);
      const fieldItems = profile.coachServices.map((coachService) => {
        return {
          ...coachService,
          priceDisplay: convertUnitPriceToFormattedPrice(coachService.priceUnitAmount)
            .priceFormatted,
        };
      });
      append(fieldItems);
    }
  }, [profile.coachServices, isServicesLoaded]);

  return (
    <form
      className="mx-auto w-full max-w-2xl"
      onSubmit={handleSubmit(async (data) => {
        try {
          const qualificationObjects =
            qualifications?.map((qualification) => {
              return {
                userId: viewer.userId,
                coachQualificationId: qualification.id,
                // @ts-ignore need to account for ids in form data types
                status: data[qualification.id]
                  ? CoachQualificationStatusesEnum.Active
                  : CoachQualificationStatusesEnum.Inactive,
              };
            }) || [];
          const existingCoachServices = data[COACH_SERVICES_LIST_NAME].filter(
            (service) => !!service.id,
          ).map((service) => {
            const priceUnitAmount =
              service.priceDisplay && typeof service.priceDisplay === 'number'
                ? convertFormattedPriceToUnitAmount(service.priceDisplay)
                : 0;
            const title = service.title;
            const type = service.type;
            const description = service.description;

            return {
              where: {
                id: { _eq: service.id },
              },
              _set: {
                title,
                type,
                description,
                priceUnitAmount,
              },
            };
          });
          const newCoachServices = data[COACH_SERVICES_LIST_NAME].filter(
            (service) => !service.id,
          ).map((service) => {
            const priceUnitAmount =
              service.priceDisplay && typeof service.priceDisplay === 'number'
                ? convertFormattedPriceToUnitAmount(service.priceDisplay)
                : 0;
            const title = service.title;
            const type = service.type;
            const description = service.description;

            return {
              title,
              type,
              description,
              priceUnitAmount,
              userId: viewer.userId,
            };
          });

          if (isCoachProfile) {
            const coachVariables = {
              id: profile.id,
              fullName: data.fullName,
              preferredName: data.preferredName,
              aboutMe: data.aboutMe || '',
              countryId: data.countryId!,
              countrySubdivisionId:
                data.countryId === COUNTRY_USA ? data.countrySubdivisionId || null : null,
              cityName: data.cityName || '',
              existingCoachServices,
              newCoachServices,
              qualificationObjects,
            };
            await updateCoachProfileMutation({
              variables: coachVariables,
            });
          } else {
            const normalizedRatingScale = tennisRatingScales.find(
              (scale) => scale.shortName === NORMALIZED_RATING_SYSTEM_SHORT_NAME,
            );
            const selectedRatingScale = tennisRatingScales?.find(
              (scale) => scale.id === data.ratingScale,
            );
            const normalizedRating =
              selectedRatingScale?.shortName && data.rating
                ? normalizeRating({
                    ratingScaleShortName: selectedRatingScale?.shortName || '',
                    rating: data.rating,
                    gender: profile?.gender,
                  })
                : null;
            const playerVariables = {
              id: profile.id,
              fullName: data.fullName,
              preferredName: data.preferredName,
              aboutMe: data.aboutMe || '',
              countryId: data.countryId!,
              countrySubdivisionId:
                data.countryId === COUNTRY_USA ? data.countrySubdivisionId || null : null,
              cityName: data.cityName || '',
              tennisRating: data.rating || null,
              tennisRatingScaleId: data.ratingScale || null,
              normalizedTennisRating: normalizedRating || null,
              normalizedTennisRatingScaleId: normalizedRatingScale?.id || null,
            };
            await updatePlayerProfileMutation({
              variables: playerVariables,
            });
          }

          if (refetchProfile) {
            refetchProfile();
          }

          handleToggle();
        } catch (error) {
          Sentry.captureException(error);
        }
      })}
    >
      <div className="mt-4 space-y-6 px-6">
        <div>
          <label className="label-form" htmlFor="fullName">
            Your full name
          </label>
          <input
            className="input-form"
            disabled={isDisabled}
            {...register('fullName', {
              required: 'Full name is required',
              validate: validateTrimmedLength,
            })}
          />
        </div>
        <div>
          <label className="label-form" htmlFor="preferredName">
            Your preferred name
          </label>
          <input
            className="input-form"
            disabled={isDisabled}
            onFocus={fixIosValidationScrollBug}
            {...register('preferredName', {
              required: 'Preferred name is required',
              validate: validateTrimmedLength,
            })}
          />
        </div>
        {/* <div>
          <label className="label-form">Your location</label>
          <div className="space-y-2">
            <div className="w-full">
              <label className="sr-only" htmlFor="countryId">
                Country
              </label>
              {!!countries ? (
                countries.length > 0 && (
                  <select
                    autoComplete="country"
                    {...register('countryId', { required: true })}
                    onFocus={fixIosValidationScrollBug}
                    placeholder="Country"
                    disabled={isDisabled}
                    className="input-form"
                  >
                    {(countries || []).map((country) => {
                      return (
                        <option value={country.id} key={country.id}>
                          {country.name}
                        </option>
                      );
                    })}
                  </select>
                )
              ) : (
                <input className="input-form" disabled={isDisabled} />
              )}
            </div>
            {!!countrySubdivisions ? (
              <div className="w-full">
                <label className="sr-only" htmlFor="countrySubdivisionId">
                  State/Region
                </label>
                <select
                  autoComplete="region"
                  {...register('countrySubdivisionId')}
                  placeholder="State or Region"
                  disabled={isDisabled}
                  className="input-form"
                >
                  <option value="">State or Region</option>
                  {filterSubdivisionsForCountry(
                    activeCountryId || '',
                    countrySubdivisions || [],
                  ).map((subdivision) => {
                    return (
                      <option value={subdivision.id} key={subdivision.id}>
                        {subdivision.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : countriesLoading ? (
              <input className="input-form" disabled={isDisabled} />
            ) : null}
            <div className="w-full">
              <label className="sr-only" htmlFor="city">
                City
              </label>
              <input
                {...register('cityName', { required: true })}
                onFocus={fixIosValidationScrollBug}
                autoComplete="address-level2"
                placeholder="City"
                disabled={isDisabled}
                className="input-form"
              />
            </div>
          </div>
        </div> */}
        {/* {!isCoachProfile && (
          <div>
            <div className="w-full">
              <label className="label-form" htmlFor="ratingScale">
                Rating scale
              </label>
              <select
                id="ratingScale"
                {...register('ratingScale', { required: true })}
                placeholder="Choose rating system"
                disabled={isDisabled}
                className="input-form"
              >
                <option disabled value="">
                  Choose rating system
                </option>
                {tennisRatingScales?.map((scale) => {
                  return (
                    <option key={scale.id} value={scale.id}>
                      {scale.shortName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="w-full">
              <label className="label-form" htmlFor="rating">
                Rating
              </label>
              <input
                id="rating"
                {...register('rating', { required: true, valueAsNumber: true })}
                type="number"
                onWheel={(e) => {
                  // NOTE: Prevent wheel scroll from changing number
                  e.preventDefault();
                  e.currentTarget.blur();
                  return false;
                }}
                placeholder={
                  activeRatingScale
                    ? `${activeRatingScale.minimum} - ${activeRatingScale.maximum}`
                    : '0.0'
                }
                min={activeRatingScale ? activeRatingScale.minimum : 0}
                max={activeRatingScale ? activeRatingScale.maximum : 100}
                step="0.01"
                disabled={isDisabled}
                className="input-form"
              />
            </div>
          </div>
        )} */}
        {isCoachProfile && (
          <div>
            <div className="label-base">Your qualifications</div>
            {coachQualifications.length > 0 && (
              <div className="flex">
                <div className="flex flex-wrap">
                  {coachQualifications.map((coachQualification) => {
                    return (
                      <span
                        key={coachQualification.id}
                        className="mr-2 mt-2 rounded-xl bg-color-brand-active px-3 py-0.5 text-sm leading-5 text-color-brand-primary"
                      >
                        {getBadgeTextForQualification(coachQualification.qualification)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="relative mt-4">
              <button
                type="button"
                className="input-base-form flex items-center justify-between px-3.5 py-2 text-left"
                onClick={() => {
                  setIsQualificationsOpen(!isQualificationsOpen);
                }}
              >
                <span>Qualifications</span>
                <ChevronDownIcon
                  className={classNames(
                    'h-6 w-6 transition-transform',
                    isQualificationsOpen && 'rotate-180',
                  )}
                />
              </button>
            </div>
            <div className={classNames(isQualificationsOpen ? 'block' : 'hidden')}>
              {!qualificationsLoading ? (
                <div className="mt-2 space-y-2 rounded-md bg-color-bg-input-lightmode-primary p-2 dark:bg-color-bg-input-darkmode-primary">
                  {qualifications?.map((qualification) => {
                    return (
                      <button
                        key={qualification.id}
                        type="button"
                        onClick={() => {
                          // @ts-ignore
                          setValue(qualification.id, !values[qualification.id]);
                        }}
                        className={classNames(
                          'relative flex w-full items-center rounded-md border px-4 py-2',
                          // @ts-ignore
                          values[qualification.id]
                            ? 'border-color-brand-highlight'
                            : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                        )}
                      >
                        <div className="flex h-5 items-center">
                          <input
                            {...register(qualification.id)}
                            type="checkbox"
                            className="checkbox-form"
                          />
                        </div>
                        <div className="ml-2 leading-6">
                          <label htmlFor={qualification.id} className="leading-6">
                            {getFullTextForQualification(qualification)}
                          </label>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        )}
        <div>
          <label className="label-form" htmlFor="aboutMe">
            About you
          </label>
          <div>
            <textarea
              className="input-form"
              disabled={isDisabled}
              onFocus={fixIosValidationScrollBug}
              {...register('aboutMe', {
                // required: false,
                // validate: validateTrimmedLength,
              })}
            />
          </div>
        </div>
        {isCoachProfile && (
          <div>
            <label className="label-form">Your services</label>
            <div className="space-y-8">
              {fields.map((field, index) => {
                const updatedFieldType = values?.[COACH_SERVICES_LIST_NAME]?.[index].type;
                const serviceImageUrl =
                  ImageWideForLessonType[updatedFieldType || LessonTypesEnum.Custom];
                return (
                  <div key={field.id}>
                    <div>
                      <select
                        {...register(`${COACH_SERVICES_LIST_NAME}.${index}.type`, {
                          required: true,
                        })}
                        placeholder="Lesson type"
                        disabled={isDisabled}
                        className="input-form"
                      >
                        <option value="" disabled>
                          Lesson type
                        </option>
                        <option value={LessonTypesEnum.Individual}>
                          {lessonDisplayName[LessonTypesEnum.Individual]}
                        </option>
                        <option value={LessonTypesEnum.Clinic}>
                          {lessonDisplayName[LessonTypesEnum.Clinic]}
                        </option>
                        <option value={LessonTypesEnum.Cardio}>
                          {lessonDisplayName[LessonTypesEnum.Cardio]}
                        </option>
                        {/* <option value={LessonTypesEnum.Camp}>Camp</option> */}
                        <option value={LessonTypesEnum.Custom}>
                          {lessonDisplayName[LessonTypesEnum.Custom]}
                        </option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <img src={serviceImageUrl} className="rounded-lg" />
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="relative">
                        <input
                          className="input-form"
                          placeholder="Price"
                          type="number"
                          onWheel={(e) => {
                            // NOTE: Prevent wheel scroll from changing number
                            e.preventDefault();
                            e.currentTarget.blur();
                            return false;
                          }}
                          disabled={isDisabled}
                          {...register(`${COACH_SERVICES_LIST_NAME}.${index}.priceDisplay`, {
                            valueAsNumber: true,
                            required: true,
                          })}
                        />
                        <CurrencyDollarIcon className="absolute right-4 top-3 h-4 w-4 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary" />
                      </div>
                      <div>
                        <input
                          className="input-form"
                          placeholder="Name (optional)"
                          disabled={isDisabled}
                          {...register(`${COACH_SERVICES_LIST_NAME}.${index}.title`, {
                            maxLength: 52,
                          })}
                        />
                      </div>
                      <div>
                        <textarea
                          className="input-form"
                          placeholder="Description"
                          style={{ resize: 'none' }}
                          disabled={isDisabled}
                          rows={3}
                          {...register(`${COACH_SERVICES_LIST_NAME}.${index}.description`, {
                            required: true,
                          })}
                        />
                      </div>
                      <div className="hidden">
                        <input {...register(`${COACH_SERVICES_LIST_NAME}.${index}.id`)} readOnly />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="h-10 w-10 rounded-full bg-color-bg-lightmode-primary p-3 shadow-fab dark:bg-color-bg-darkmode-primary"
                onClick={() => {
                  append({
                    __typename: 'UserCoachServices',
                    description: '',
                    title: '',
                    type: null,
                    currency: CURRENCY_USD,
                    priceUnitAmount: 0,
                    priceDisplay: '',
                    id: '',
                    coverImageFileName: '',
                    coverImagePath: '',
                    coverImageProviderUrl: '',
                  });
                }}
              >
                <PlusIcon />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 flex items-center space-x-4 px-6 pb-12">
        <button
          type="button"
          disabled={isDisabled}
          className="button-rounded-full-brand-inverted"
          onClick={handleToggle}
        >
          Discard
        </button>
        <button type="submit" disabled={isDisabled} className="button-rounded-full-primary">
          Save changes
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
