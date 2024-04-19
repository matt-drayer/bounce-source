import React, { ReactElement } from 'react';
import { CourtSurfacesEnum, VenueAccessTypesEnum } from 'types/generated/client';
import { milesToMeters } from 'utils/shared/geo/milesToMeters';
import { useGeoLocation } from 'hooks/useGeoLocation';
import CloseIcon from 'svg/CloseIcon';
import EraseIcon from 'svg/Erase';
import { Button, ButtonText } from 'components/Button';
import FilterBox from 'components/forms/FilterBox/FilterBox';
import { SliderNumberRange } from 'components/forms/Slider';
import Switch from 'components/forms/Switch/Switch';
import Modal from 'components/modals/Modal/Modal';
import {
  FilterProps,
  VENUE_ACCESS_OPTIONS,
  VENUE_COURT_TYPE_OPTIONS,
  VENUE_DISTANCE_IMPERIAL_OPTIONS,
  VENUE_NETS_OPTIONS,
  VENUE_SURFACE_OPTIONS,
} from './types';

interface Props extends FilterProps {
  surface: CourtSurfacesEnum[];
  title: string;
  isOpen: boolean;
  closeModal: () => void;
  courtLimit: number;
  distance: {
    name: string;
    id: number;
  };
  setDistance: (distance: { name: string; id: number }) => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }): ReactElement => {
  return (
    <p className="typography-product-subheading mb-2 text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
      {children}
    </p>
  );
};

export default function FilterModal({
  title,
  isOpen,
  closeModal,
  setAccessType,
  accessType,
  setCourtType,
  courtType,
  nets,
  setNets,
  surface,
  setSurface,
  courtsMinNumber,
  courtsMaxNumber,
  setShowFreeCourts,
  setShowOnlyDedicatedCourts,
  showOnlyDedicatedCourts,
  setCourtsMaxNumber,
  setCourtsMinNumber,
  courtLimit,
  distance,
  setDistance,
  fetchCourts,
}: Props) {
  const { centerLatitude, centerLongitude } = useGeoLocation();

  const clearAll = () => {
    setNets([]);
    setAccessType([]);
    setCourtType([]);
    setSurface([]);
    setShowOnlyDedicatedCourts(false);
    setShowFreeCourts(false);
    setCourtsMaxNumber(courtLimit);
    setCourtsMinNumber(1);
    setDistance(VENUE_DISTANCE_IMPERIAL_OPTIONS[1]);
    fetchCourts({
      longitude: centerLongitude,
      latitude: centerLatitude,
      distance: milesToMeters(VENUE_DISTANCE_IMPERIAL_OPTIONS[1].id),
    });
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
                <p className="typography-product-subheading text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
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
            <div className="flex justify-between gap-2 lg:hidden">
              <SectionTitle>Dedicated courts</SectionTitle>
              <Switch
                isActive={showOnlyDedicatedCourts}
                toggleIsActive={() => setShowOnlyDedicatedCourts(!showOnlyDedicatedCourts)}
              />
            </div>
            <div className="flex justify-between gap-2 lg:hidden">
              <SectionTitle>Free courts</SectionTitle>
              <Switch
                isActive={accessType.length === 1 && accessType[0] === VenueAccessTypesEnum.Free}
                toggleIsActive={() =>
                  accessType.length === 1 && accessType[0] === VenueAccessTypesEnum.Free
                    ? setAccessType([])
                    : setAccessType([VenueAccessTypesEnum.Free])
                }
              />
            </div>
            <div className="md:hidden">
              <SectionTitle>Distance</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {VENUE_DISTANCE_IMPERIAL_OPTIONS.map((newDistance) => (
                  <FilterBox
                    key={newDistance.id}
                    label={newDistance.name}
                    onClick={() => {
                      setDistance(newDistance);
                      fetchCourts({
                        longitude: centerLongitude,
                        latitude: centerLatitude,
                        distance: milesToMeters(newDistance.id),
                      });
                    }}
                    isSelected={distance.id === newDistance.id}
                  />
                ))}
              </div>
            </div>
            <div className="block xl:hidden">
              <div className="mb-12">
                <SectionTitle>Number of Courts</SectionTitle>
              </div>
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
            </div>
            <div>
              <SectionTitle>Access</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {VENUE_ACCESS_OPTIONS.map((access) => (
                  <FilterBox
                    key={access.id}
                    label={access.name}
                    onClick={() =>
                      setAccessType((prev) => {
                        if (prev.includes(access.id)) {
                          return prev.filter((item) => item !== access.id);
                        }
                        return [...prev, access.id];
                      })
                    }
                    isSelected={accessType.includes(access.id)}
                  />
                ))}
              </div>
            </div>
            <div>
              <SectionTitle>Court type</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {VENUE_COURT_TYPE_OPTIONS.map((type) => (
                  <FilterBox
                    key={type.id}
                    label={type.name}
                    onClick={() =>
                      setCourtType((prev) => {
                        if (prev.includes(type.id)) {
                          return prev.filter((item) => item !== type.id);
                        }
                        return [...prev, type.id];
                      })
                    }
                    isSelected={courtType.includes(type.id)}
                  />
                ))}
              </div>
            </div>
            <div>
              <SectionTitle>Nets</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {VENUE_NETS_OPTIONS.map((net) => (
                  <FilterBox
                    key={net.id}
                    label={net.name}
                    onClick={() =>
                      setNets((prev) => {
                        if (prev.includes(net.id)) {
                          return prev.filter((item) => item !== net.id);
                        }
                        return [...prev, net.id];
                      })
                    }
                    isSelected={nets.includes(net.id)}
                  />
                ))}
              </div>
            </div>
            {/**
             * @note the lines data is bad. It says most lines are permanent, but our assumption is that this is including tennis lines
             */}
            {/* <div>
              <SectionTitle>Lines</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {VENUE_LINES_OPTIONS.map((line) => {
                  return (
                    <FilterBox
                      key={line.id}
                      label={line.name}
                      onClick={() => setLines(line.name)}
                      isSelected={lines === line.name}
                    />
                  );
                })}
              </div>
            </div> */}
            <div>
              <SectionTitle>Surface</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {VENUE_SURFACE_OPTIONS.map((surfaces) => {
                  return (
                    <FilterBox
                      key={surfaces.id}
                      label={surfaces.name}
                      onClick={() =>
                        setSurface((prev) => {
                          if (prev.includes(surfaces.id)) {
                            return prev.filter((item) => item !== surfaces.id);
                          }
                          return [...prev, surfaces.id];
                        })
                      }
                      isSelected={surface.includes(surfaces.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-b border-t border-solid border-color-border-input-lightmode px-4 py-6 dark:border-color-border-input-darkmode md:px-ds-3xl">
            <div className="flex items-center">
              <ButtonText
                onClick={clearAll}
                className="typography-product-button-label-medium flex items-center rounded-full hover:bg-color-bg-lightmode-secondary hover:dark:bg-color-bg-darkmode-secondary md:px-3 md:py-2"
              >
                <EraseIcon className="mr-1 w-4" />
                Clear all
              </ButtonText>
            </div>
            <div className="md:w-1/2">
              <Button variant="primary" size="lg" onClick={() => closeModal()}>
                Show Courts
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
