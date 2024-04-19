import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CompetitionGenderEnum } from 'types/generated/client';
import { useGeoLocation } from 'hooks/useGeoLocation';
import { useModal } from 'hooks/useModal';
import Check from 'svg/Check';
import ChevronDown from 'svg/ChevronDown';
import FilterIcon from 'svg/FilterIcon';
import Location from 'svg/Location';
import SearchIcon from 'svg/SearchIcon';
import { Button, ButtonText } from 'components/Button/Button';
import AddressSearch from 'components/forms/AddressSearch';
import { SliderNumberRange } from 'components/forms/Slider';
import classNames from 'styles/utils/classNames';
import ContactModal from './ContactForm/ContactModal';
import Dropdown from './DropDowns';
import TournamentFilterModal from './TournamentFilterModal';
import {
  COMPETITION_GENDER_MENU,
  FilterProps,
  MAXIMUM_AGE,
  MAXIMUM_COST,
  MINIMUM_AGE,
  MINIMUM_COST,
  TOURNAMENT_DISTANCE_IMPERIAL_OPTIONS,
} from './types';

interface Props extends FilterProps {
  distance: {
    name: string;
    id: number;
  };
  setDistance: (distance: { name: string; id: number }) => void;
  competitionGender: Record<CompetitionGenderEnum, boolean>;
  setCompetitionGender: React.Dispatch<
    React.SetStateAction<Record<CompetitionGenderEnum, boolean>>
  >;
  isOpenDivision: boolean;
  setIsOpenDivision: React.Dispatch<React.SetStateAction<boolean>>;
  isUsingSkillRange: boolean;
  setIsUsingSkillRange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActiveBadge = ({ count }: { count: number }) => {
  return (
    <div className="absolute -left-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-color-bg-lightmode-invert text-[.5rem] font-medium leading-none text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert lg:-left-2 lg:-top-1">
      {count}
    </div>
  );
};

export default function FilterBar({
  distance,
  setDistance,
  competitionGender,
  setCompetitionGender,
  isOpenDivision,
  setIsOpenDivision,
  isUsingSkillRange,
  setIsUsingSkillRange,
  selectedDate,
  setSelectedDate,
  skillLevelMinimum,
  setSkillLevelMinimum,
  skillLevelMaximum,
  setSkillLevelMaximum,
  isPrizeMoney,
  setIsPrizeMoney,
  costMinimum,
  setCostMinimum,
  costMaximum,
  setCostMaximum,
  ageMinimum,
  setAgeMinimum,
  ageMaximum,
  setAgeMaximum,
  teamType,
  setTeamType,
  competitionFormat,
  setCompetitionFormat,
}: Props) {
  const {
    addressString,
    suggestedAddresses,
    activeAutocompleteAddress,
    handleSubmitAutocomplete,
    handleAutcompleteSuggestions,
  } = useGeoLocation();
  const { isOpen: isModalOpen, openModal: openModal, closeModal: closeModal } = useModal();
  const isDisabled = false;

  let filterCount = 0;

  let skillCount = 0;
  if (isUsingSkillRange) {
    skillCount = skillCount + 1;
    filterCount = filterCount + 1;
  }
  if (isOpenDivision) {
    skillCount = skillCount + 1;
    filterCount = filterCount + 1;
  }
  if (Object.values(competitionGender).some((v) => v)) {
    filterCount = filterCount + 1;
  }
  if (isPrizeMoney) {
    filterCount = filterCount + 1;
  }
  if (costMinimum > MINIMUM_COST || costMaximum < MAXIMUM_COST) {
    filterCount = filterCount + 1;
  }
  if (ageMinimum > MINIMUM_AGE || ageMaximum < MAXIMUM_AGE) {
    filterCount = filterCount + 1;
  }
  if (teamType) {
    filterCount = filterCount + 1;
  }
  if (competitionFormat) {
    filterCount = filterCount + 1;
  }
  if (selectedDate) {
    filterCount = filterCount + 1;
  }
  if (skillLevelMinimum > 0 || skillLevelMaximum < 6) {
    filterCount = filterCount + 1;
  }

  const genderCount = Object.values(competitionGender).reduce((acc, curr) => {
    if (curr) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handleSubmit = async (address?: google.maps.places.AutocompletePrediction | null) => {
    const position = await handleSubmitAutocomplete(address);
  };

  return (
    <>
      <div className="fixed left-0 top-topnav z-10 flex h-marketplace-nav w-full grow border-b border-color-border-input-lightmode bg-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary">
        <div className="relative flex w-full items-center justify-between px-4 py-ds-lg lg:px-ds-2xl">
          <div className="relative z-10 hidden items-center justify-center gap-4 lg:flex">
            <div className="relative">
              {!!genderCount && <ActiveBadge count={genderCount} />}
              <Dropdown className="min-w-[16rem]" label="Gender">
                {COMPETITION_GENDER_MENU.map((option) => (
                  <label
                    key={option.id}
                    className={classNames('flex cursor-pointer items-center gap-ds-sm px-2 py-1.5')}
                  >
                    <input
                      type="checkbox"
                      checked={competitionGender[option.id]}
                      onChange={(e) => {
                        setCompetitionGender((prevOptions) => ({
                          ...prevOptions,
                          [option.id]: e.target.checked,
                        }));
                      }}
                      className={classNames(
                        'h-4 w-4 cursor-pointer rounded border-color-border-input-lightmode text-color-bg-lightmode-invert focus:outline-none focus:ring-2 focus:ring-color-text-lightmode-primary focus:ring-offset-2 focus:ring-offset-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:focus:ring-color-text-darkmode-primary dark:focus:ring-offset-color-bg-darkmode-primary',
                      )}
                    />
                    <span
                      className={classNames(
                        'typography-product-body text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder',
                        competitionGender[option.id]
                          ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
                          : 'text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder',
                      )}
                    >
                      {option.name}
                    </span>
                  </label>
                ))}
              </Dropdown>
            </div>
            <div className="relative">
              {!!skillCount && <ActiveBadge count={skillCount} />}
              <Dropdown label="Skill level" className="max-w-[21.5rem]">
                <label
                  className={classNames('flex cursor-pointer items-center gap-ds-sm px-2 py-1.5')}
                >
                  <input
                    type="checkbox"
                    checked={isOpenDivision}
                    onChange={(e) => {
                      setIsOpenDivision(e.target.checked);
                    }}
                    className={classNames(
                      'h-4 w-4 cursor-pointer rounded border-color-border-input-lightmode text-color-bg-lightmode-invert focus:outline-none focus:ring-2 focus:ring-color-text-lightmode-primary focus:ring-offset-2 focus:ring-offset-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:focus:ring-color-text-darkmode-primary dark:focus:ring-offset-color-bg-darkmode-primary',
                    )}
                  />
                  <span
                    className={classNames(
                      'typography-product-body text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder',
                      isOpenDivision
                        ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
                        : 'text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder',
                    )}
                  >
                    Open division
                  </span>
                </label>
                <label
                  className={classNames('flex cursor-pointer items-center gap-ds-sm px-2 py-1.5')}
                >
                  <input
                    type="checkbox"
                    checked={isUsingSkillRange}
                    onChange={(e) => {
                      setIsUsingSkillRange(e.target.checked);
                    }}
                    className={classNames(
                      'h-4 w-4 cursor-pointer rounded border-color-border-input-lightmode text-color-bg-lightmode-invert focus:outline-none focus:ring-2 focus:ring-color-text-lightmode-primary focus:ring-offset-2 focus:ring-offset-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:focus:ring-color-text-darkmode-primary dark:focus:ring-offset-color-bg-darkmode-primary',
                    )}
                  />
                  <span
                    className={classNames(
                      'typography-product-body text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder',
                      isUsingSkillRange
                        ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
                        : 'text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder',
                    )}
                  >
                    Skill level
                  </span>
                </label>
                <div className="px-2 pb-3 pt-11">
                  <SliderNumberRange
                    rangeMinimum={0}
                    rangeMaximum={6}
                    valueMinimum={skillLevelMinimum}
                    valueMaximum={skillLevelMaximum}
                    setValueMinumum={(newMinimum) => setSkillLevelMinimum(newMinimum)}
                    setValueMaximum={(newMaximum) => setSkillLevelMaximum(newMaximum)}
                    step={0.25}
                    decimals={2}
                    isDisabled={!isUsingSkillRange}
                  />
                </div>
              </Dropdown>
            </div>
            <ButtonText
              className="flex cursor-pointer items-center gap-2 rounded-full px-ds-lg py-2.5 transition-colors hover:bg-color-bg-lightmode-secondary hover:dark:bg-color-bg-darkmode-secondary"
              onClick={() => openModal()}
            >
              <FilterIcon className="h-4 w-4 text-color-bg-lightmode-invert dark:text-color-bg-darkmode-invert" />
              <span className="typography-product-button-label-medium text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                Filters
              </span>
            </ButtonText>
          </div>
          <div className="flex h-full w-full items-center justify-center space-x-2 lg:w-auto lg:px-ds-lg">
            <div className="flex w-full grow select-none items-center rounded-full bg-color-bg-input-lightmode-primary py-ds-xs pl-ds-md pr-ds-xs dark:bg-color-bg-input-darkmode-primary lg:w-[26.25rem]">
              <Location className="h-5 w-5 text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder" />
              <AddressSearch
                handleSubmit={handleSubmit}
                handleAutcompleteSuggestions={handleAutcompleteSuggestions}
                addressString={addressString}
                suggestedAddresses={suggestedAddresses}
                activeAutocompleteAddress={activeAutocompleteAddress}
                className="input-unstyled typography-product-body w-full border-none bg-transparent py-0 outline-none outline-0 outline-transparent ring-transparent focus:outline-none focus:outline-0 active:outline-0"
                placeholder="Search by location"
              />
              <Button type="submit" variant="brand" isInline className="p-2">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="hidden shrink-0 md:block">
              <Listbox value={distance} onChange={setDistance}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="hidden">Distance</Listbox.Label>
                    <div className="relative z-20">
                      <Listbox.Button className="typography-product-body focus-on-tab flex min-w-[8.25rem] items-center p-1 text-color-text-lightmode-primary outline-none ring-0 ring-offset-0 dark:text-color-text-darkmode-primary">
                        <span className="mr-ds-sm">{distance.name}</span>
                        <ChevronDown className="h-4 w-4 text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder" />
                      </Listbox.Button>
                      <Transition
                        show={open}
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="focus-on-tab absolute top-8 z-20 mt-1 w-full min-w-[12rem] overflow-auto rounded-lg border border-color-border-input-lightmode bg-color-bg-lightmode-primary shadow-popover dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary">
                          {TOURNAMENT_DISTANCE_IMPERIAL_OPTIONS.map((d) => (
                            <Listbox.Option
                              key={d.id}
                              className={({ active }) =>
                                classNames(
                                  'group relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-color-bg-lightmode-invert hover:text-color-text-lightmode-invert hover:dark:bg-color-bg-darkmode-invert hover:dark:text-color-text-darkmode-invert',
                                  active &&
                                    'bg-color-bg-lightmode-invert text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert',
                                )
                              }
                              value={d}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={classNames(
                                      'group-hover:text-color-text-lightmode-invert group-hover:dark:text-color-text-darkmode-invert',
                                      active
                                        ? 'bg-color-bg-lightmode-invert text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert'
                                        : selected
                                        ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
                                        : 'text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary',
                                      'block pr-8',
                                    )}
                                  >
                                    {d.name}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={classNames(
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                      )}
                                    >
                                      <Check className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
            <div className="relative block lg:hidden">
              {!!filterCount && <ActiveBadge count={filterCount} />}
              <ButtonText
                className="flex cursor-pointer items-center rounded-full border border-color-text-lightmode-primary p-2 dark:border-color-text-darkmode-primary"
                onClick={() => openModal()}
                aria-label="Filters"
              >
                <FilterIcon className="h-4 w-4 text-color-bg-lightmode-invert dark:text-color-bg-darkmode-invert" />
              </ButtonText>
            </div>
          </div>
          <div className="relative z-10 hidden items-center justify-center lg:flex">
            <ContactModal isCTA={false} title={'List your tournament'}/>
          </div>
        </div>
      </div>
      <div className="h-marketplace-nav">&nbsp;</div>
      <TournamentFilterModal
        title="Filters"
        isOpen={isModalOpen}
        closeModal={() => closeModal()}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isPrizeMoney={isPrizeMoney}
        setIsPrizeMoney={setIsPrizeMoney}
        costMinimum={costMinimum}
        setCostMinimum={setCostMinimum}
        costMaximum={costMaximum}
        setCostMaximum={setCostMaximum}
        ageMinimum={ageMinimum}
        setAgeMinimum={setAgeMinimum}
        ageMaximum={ageMaximum}
        setAgeMaximum={setAgeMaximum}
        teamType={teamType}
        setTeamType={setTeamType}
        competitionFormat={competitionFormat}
        setCompetitionFormat={setCompetitionFormat}
        skillLevelMinimum={skillLevelMinimum}
        setSkillLevelMinimum={setSkillLevelMinimum}
        skillLevelMaximum={skillLevelMaximum}
        setSkillLevelMaximum={setSkillLevelMaximum}
        distance={distance}
        setDistance={setDistance}
        competitionGender={competitionGender}
        setCompetitionGender={setCompetitionGender}
        isOpenDivision={isOpenDivision}
        setIsOpenDivision={setIsOpenDivision}
        isUsingSkillRange={isUsingSkillRange}
        setIsUsingSkillRange={setIsUsingSkillRange}
      />
    </>
  );
}
