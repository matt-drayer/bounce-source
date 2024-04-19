import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { VenueAccessTypesEnum } from 'types/generated/client';
import { milesToMeters } from 'utils/shared/geo/milesToMeters';
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
import Switch from 'components/forms/Switch/Switch';
import classNames from 'styles/utils/classNames';
import FilterModal from './FilterModal';
import { FilterProps, VENUE_DISTANCE_IMPERIAL_OPTIONS } from './types';

const ActiveBadge = ({ count }: { count: number }) => {
  return (
    <div className="absolute -left-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-color-bg-lightmode-invert text-[.5rem] font-medium leading-none text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert lg:left-1.5 lg:top-1">
      {count}
    </div>
  );
};

interface Props extends FilterProps {
  distance: {
    name: string;
    id: number;
  };
  setDistance: (distance: { name: string; id: number }) => void;
}

export default function FilterBar({
  setShowFreeCourts,
  showFreeCourts,
  accessType,
  setAccessType,
  showOnlyDedicatedCourts,
  setShowOnlyDedicatedCourts,
  setCourtsMinNumber,
  courtsMinNumber,
  setCourtsMaxNumber,
  courtsMaxNumber,
  distance,
  setDistance,
  setCourtType,
  courtType,
  nets,
  setNets,
  surface,
  setSurface,
  courtLimit,
  fetchCourts,
}: Props) {
  const {
    addressString,
    centerLatitude,
    centerLongitude,
    suggestedAddresses,
    activeAutocompleteAddress,
    handleSubmitAutocomplete,
    handleAutcompleteSuggestions,
  } = useGeoLocation();
  const { isOpen: isModalOpen, openModal: openModal, closeModal: closeModal } = useModal();

  const handleSubmit = async (address?: google.maps.places.AutocompletePrediction | null) => {
    const position = await handleSubmitAutocomplete(address);
    if (position) {
      fetchCourts({
        longitude: position.longitude,
        latitude: position.latitude,
        distance: milesToMeters(distance.id),
      });
    }
  };

  let filterCount = 0;

  if (accessType.length) {
    filterCount += 1;
  }
  if (showOnlyDedicatedCourts) {
    filterCount += 1;
  }
  if (courtType.length) {
    filterCount += 1;
  }
  if (nets.length) {
    filterCount += 1;
  }
  if (surface.length) {
    filterCount += 1;
  }

  return (
    <>
      <div className="fixed left-0 top-topnav z-10 flex h-marketplace-nav w-full grow border-b border-color-border-input-lightmode bg-color-bg-lightmode-primary dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary">
        <div className="relative flex w-full items-center justify-between px-4 py-ds-lg sm:px-8">
          <div className="inline-flex h-full w-full items-center justify-center space-x-2 lg:w-auto">
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
            <div className="hidden md:block">
              <Listbox
                value={distance}
                onChange={(value) => {
                  setDistance(value);
                  fetchCourts({
                    longitude: centerLongitude,
                    latitude: centerLatitude,
                    distance: milesToMeters(value.id),
                  });
                }}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="hidden">Distance</Listbox.Label>
                    <div className="relative z-20">
                      <Listbox.Button className="typography-product-body focus-on-tab flex min-w-[7rem] items-center p-1 text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder">
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
                        <Listbox.Options className="focus-on-tab absolute top-8 z-20 mt-1 w-full min-w-[10rem] overflow-auto rounded-lg border border-color-border-input-lightmode bg-color-bg-lightmode-primary shadow-popover dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary">
                          {VENUE_DISTANCE_IMPERIAL_OPTIONS.map((d) => (
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
          </div>
          <div className="relative ml-1 block md:ml-0 lg:hidden">
            {!!filterCount && <ActiveBadge count={filterCount} />}
            <ButtonText
              className="flex cursor-pointer items-center rounded-full border border-color-text-lightmode-primary p-2 dark:border-color-text-darkmode-primary"
              onClick={() => openModal()}
              aria-label="Filters"
            >
              <FilterIcon className="h-4 w-4 text-color-bg-lightmode-invert dark:text-color-bg-darkmode-invert" />
            </ButtonText>
          </div>
          <div className="flex items-center gap-ds-3xl">
            <Listbox
              value={{ min: courtsMinNumber, max: courtsMaxNumber }}
              onChange={(value) => {
                setCourtsMinNumber(value.min);
                setCourtsMaxNumber(value.max);
              }}
            >
              {({ open }) => (
                <>
                  <div className="relative z-20 hidden xl:block">
                    <Listbox.Button
                      className={classNames(
                        'focus-on-tab typography-product-body flex min-w-[12.5rem] items-center p-1',
                        open
                          ? 'text-color-text-lightmode-primary dark:text-color-text-darkmode-primary'
                          : 'text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder',
                      )}
                    >
                      <span className="mr-ds-sm">
                        Number of courts ({courtsMinNumber}-{courtsMaxNumber})
                      </span>
                      <ChevronDown
                        className={classNames(
                          'h-4 w-4 text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder',
                          open ? 'rotate-180 transform' : '',
                        )}
                      />
                    </Listbox.Button>
                    <Transition
                      show={open}
                      as={React.Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="focus-on-tab absolute top-8 z-20 mt-1 w-full min-w-[21.5rem] overflow-auto rounded-lg border border-color-border-input-lightmode bg-color-bg-lightmode-primary p-4 pt-[60px] shadow-popover dark:border-color-border-input-darkmode dark:bg-color-bg-darkmode-primary">
                        <SliderNumberRange
                          rangeMinimum={1}
                          rangeMaximum={courtLimit}
                          valueMinimum={courtsMinNumber}
                          valueMaximum={courtsMaxNumber}
                          setValueMinumum={(newMinimum) => setCourtsMinNumber(newMinimum)}
                          setValueMaximum={(newMaximum) => setCourtsMaxNumber(newMaximum)}
                          step={1}
                          decimals={2}
                        />
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
            <div className="hidden lg:block">
              <div className="flex gap-ds-3xl">
                <Switch
                  labelLeft={
                    <div className="typography-product-body mr-ds-sm select-none text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder">
                      Dedicated courts
                    </div>
                  }
                  isActive={showOnlyDedicatedCourts}
                  toggleIsActive={() => setShowOnlyDedicatedCourts(!showOnlyDedicatedCourts)}
                />
                <Switch
                  labelLeft={
                    <div className="typography-product-body mr-ds-sm select-none text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder">
                      Free courts
                    </div>
                  }
                  isActive={accessType.length === 1 && accessType[0] === VenueAccessTypesEnum.Free}
                  toggleIsActive={() =>
                    accessType.length === 1 && accessType[0] === VenueAccessTypesEnum.Free
                      ? setAccessType([])
                      : setAccessType([VenueAccessTypesEnum.Free])
                  }
                />
              </div>
            </div>
          </div>
          <div className="relative z-10 hidden items-center justify-center gap-4 lg:flex">
            {!!filterCount && <ActiveBadge count={filterCount} />}
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
        </div>
      </div>
      <div className="h-marketplace-nav">&nbsp;</div>
      <FilterModal
        title="Filters"
        isOpen={isModalOpen}
        closeModal={() => closeModal()}
        setAccessType={setAccessType}
        accessType={accessType}
        courtType={courtType}
        setCourtType={setCourtType}
        setNets={setNets}
        nets={nets}
        setSurface={setSurface}
        surface={surface}
        courtsMinNumber={courtsMinNumber}
        setCourtsMinNumber={setCourtsMinNumber}
        showOnlyDedicatedCourts={showOnlyDedicatedCourts}
        setShowOnlyDedicatedCourts={setShowOnlyDedicatedCourts}
        setShowFreeCourts={setShowFreeCourts}
        showFreeCourts={showFreeCourts}
        courtsMaxNumber={courtsMaxNumber}
        setCourtsMaxNumber={setCourtsMaxNumber}
        courtLimit={courtLimit}
        distance={distance}
        setDistance={setDistance}
        fetchCourts={fetchCourts}
      />
    </>
  );
}
