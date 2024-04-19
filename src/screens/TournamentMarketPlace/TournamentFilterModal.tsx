import React, { ReactElement } from 'react';
import { CompetitionGenderEnum } from 'types/generated/client';
import CloseIcon from 'svg/CloseIcon';
import EraseIcon from 'svg/Erase';
import { Button, ButtonText } from 'components/Button';
import FilterBox from 'components/forms/FilterBox/FilterBox';
import { SliderNumberRange } from 'components/forms/Slider';
import Switch from 'components/forms/Switch/Switch';
import Modal from 'components/modals/Modal/Modal';
import classNames from 'styles/utils/classNames';
import {
  COMPETITION_FORMATS,
  COMPETITION_GENDER_MENU,
  FilterProps,
  MAXIMUM_AGE,
  MAXIMUM_COST,
  MINIMUM_AGE,
  MINIMUM_COST,
  TEAM_TYPES,
  TOURNAMENT_DATES,
  TOURNAMENT_DISTANCE_IMPERIAL_OPTIONS,
} from './types';

interface Props extends FilterProps {
  title: string;
  isOpen: boolean;
  closeModal: () => void;
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

const SectionTitle = ({ children }: { children: React.ReactNode }): ReactElement => {
  return (
    <p className="typography-product-subheading mb-2 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
      {children}
    </p>
  );
};

export default function TournamentFilterModal({
  title,
  isOpen,
  closeModal,
  selectedDate,
  setSelectedDate,
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
  distance,
  setDistance,
  competitionGender,
  setCompetitionGender,
  isOpenDivision,
  setIsOpenDivision,
  isUsingSkillRange,
  setIsUsingSkillRange,
  skillLevelMinimum,
  setSkillLevelMinimum,
  skillLevelMaximum,
  setSkillLevelMaximum,
}: Props) {
  const clearAll = () => {
    setIsPrizeMoney(false);
    setTeamType(null);
    setCompetitionFormat(null);
    setSelectedDate(null);
    setAgeMinimum(MINIMUM_AGE);
    setAgeMaximum(MAXIMUM_AGE);
    setCostMinimum(MINIMUM_COST);
    setCostMaximum(MAXIMUM_COST);
    Object.keys(competitionGender).forEach((key) => {
      setCompetitionGender((prevOptions) => ({
        ...prevOptions,
        [key]: false,
      }));
    });
    setDistance(TOURNAMENT_DISTANCE_IMPERIAL_OPTIONS[0]);
    setIsOpenDivision(false);
    setIsUsingSkillRange(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        handleClose={() => closeModal()}
        classNameRounded="rounded-t-3xl sm:rounded-3xl"
        classNamePosition="relative"
        classNameMaxWidth="max-w-2xl"
      >
        <div className="relative flex h-full max-h-[90vh] flex-col overflow-hidden">
          <div>
            <div className="border-b border-color-border-input-lightmode dark:border-color-border-input-darkmode">
              <div className="flex items-center justify-between px-4 py-ds-xl md:px-ds-3xl">
                <p className="typography-product-subheading text-2xl text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                  {title}
                </p>
                <ButtonText
                  onClick={() => closeModal()}
                  className="right-5 top-5 rounded-full p-2 font-medium transition-colors hover:bg-color-bg-lightmode-secondary dark:hover:bg-color-bg-darkmode-secondary"
                >
                  <CloseIcon className="h-6 w-6" />
                </ButtonText>
              </div>
            </div>
          </div>
          <div className="flex flex-auto flex-col gap-8 overflow-y-auto px-4 py-6 md:px-ds-3xl">
            <div className="md:hidden">
              <SectionTitle>Distance</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {TOURNAMENT_DISTANCE_IMPERIAL_OPTIONS.map((newDistance) => (
                  <FilterBox
                    key={newDistance.id}
                    label={newDistance.name}
                    onClick={() => setDistance(newDistance)}
                    isSelected={distance.id === newDistance.id}
                  />
                ))}
              </div>
            </div>
            <div className="lg:hidden">
              <SectionTitle>Gender</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {COMPETITION_GENDER_MENU.map((gender) => (
                  <FilterBox
                    key={gender.id}
                    label={gender.name}
                    onClick={() =>
                      setCompetitionGender((prevOptions) => ({
                        ...prevOptions,
                        [gender.id]: !prevOptions[gender.id],
                      }))
                    }
                    isSelected={competitionGender[gender.id]}
                  />
                ))}
              </div>
            </div>
            <div className="lg:hidden">
              <SectionTitle>Skill level</SectionTitle>
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
                    'h-4 w-4 cursor-pointer rounded border-color-border-input-lightmode text-color-bg-lightmode-invert focus:outline-none focus:ring-2 focus:ring-color-text-lightmode-primary focus:ring-offset-2 focus:ring-offset-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:text-color-bg-darkmode-invert dark:focus:ring-color-text-darkmode-primary dark:focus:ring-offset-color-bg-darkmode-primary',
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
                    'h-4 w-4 cursor-pointer rounded border-color-border-input-lightmode text-color-bg-lightmode-invert focus:outline-none focus:ring-2 focus:ring-color-text-lightmode-primary focus:ring-offset-2 focus:ring-offset-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:text-color-bg-darkmode-invert dark:focus:ring-color-text-darkmode-primary dark:focus:ring-offset-color-bg-darkmode-primary',
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
            </div>
            <div>
              <SectionTitle>Date</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {TOURNAMENT_DATES.map((date) => (
                  <FilterBox
                    key={date.id}
                    label={date.name}
                    onClick={() => setSelectedDate(date.id)}
                    isSelected={date.id === selectedDate}
                  />
                ))}
              </div>
            </div>
            <div>
              <SectionTitle>Format</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {COMPETITION_FORMATS.map((newCompetitionType) => {
                  return (
                    <FilterBox
                      key={newCompetitionType.id}
                      label={newCompetitionType.name}
                      onClick={() => setCompetitionFormat(newCompetitionType.id)}
                      isSelected={newCompetitionType.id === competitionFormat}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <SectionTitle>Type</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {TEAM_TYPES.map((newTeamType) => {
                  return (
                    <FilterBox
                      key={newTeamType.id}
                      label={newTeamType.name}
                      onClick={() => setTeamType(newTeamType.id)}
                      isSelected={newTeamType.id === teamType}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <SectionTitle>Cost</SectionTitle>
              <div className="pt-10">
                <SliderNumberRange
                  rangeMinimum={MINIMUM_COST}
                  rangeMaximum={MAXIMUM_COST}
                  valueMinimum={costMinimum}
                  valueMaximum={costMaximum}
                  setValueMinumum={(newMinimum) => setCostMinimum(newMinimum)}
                  setValueMaximum={(newMaximum) => setCostMaximum(newMaximum)}
                  step={5}
                  decimals={0}
                  prefix="$"
                />
              </div>
            </div>
            <div>
              <SectionTitle>Age</SectionTitle>
              <div className="pt-10">
                <SliderNumberRange
                  rangeMinimum={MINIMUM_AGE}
                  rangeMaximum={MAXIMUM_AGE}
                  valueMinimum={ageMinimum}
                  valueMaximum={ageMaximum}
                  setValueMinumum={(newMinimum) => setAgeMinimum(newMinimum)}
                  setValueMaximum={(newMaximum) => setAgeMaximum(newMaximum)}
                  step={1}
                  decimals={0}
                />
              </div>
            </div>
            <div className="flex-start flex justify-between gap-4">
              <SectionTitle>Prize money only</SectionTitle>
              <Switch
                isActive={isPrizeMoney}
                toggleIsActive={() => setIsPrizeMoney(!isPrizeMoney)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-b border-t border-solid border-color-border-input-lightmode px-4 py-6 dark:border-color-border-input-darkmode md:px-ds-3xl">
            <div className="flex items-center">
              <ButtonText
                onClick={clearAll}
                className="flex items-center rounded-full font-medium hover:bg-color-bg-lightmode-secondary hover:dark:bg-color-bg-darkmode-secondary md:px-3 md:py-2"
              >
                <EraseIcon className="mr-1 w-4" />
                Clear all
              </ButtonText>
            </div>
            <div className="md:w-1/2">
              <Button variant="primary" size="lg" onClick={() => closeModal()}>
                Show Tournaments
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
