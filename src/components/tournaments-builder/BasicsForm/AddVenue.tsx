import * as React from 'react';
import { useState } from 'react';
import Sticky from 'react-sticky-el';
import { GetVenuesByGeoQuery } from 'types/generated/client';
import { GetVenueBySlugQuery } from 'types/generated/server';
import { useApiGateway } from 'hooks/useApi';
import { useGeoLocation } from 'hooks/useGeoLocation';
import CloseIcon from 'svg/CloseIcon';
import { Button } from 'components/Button';
import SearchVenueLocationInput from 'components/SearchVenueLocationInput';
import CardVenue from 'components/cards/CardVenue';
import CardVenueSelected from 'components/cards/CardVenueSelected/CardVenueSelected';
import Modal from 'components/modals/Modal';

type Props = {
  isOpen: boolean;

  onClose(): void;
  onSubmit(venue: GetVenueBySlugQuery['venues'][0]): void;
};

const AddVenue = ({ onClose, isOpen, onSubmit }: Props) => {
  const [venues, setVenues] = useState<GetVenuesByGeoQuery['venues']>([]);

  const { get: fetchVenueBySlug, data: selectedVenue } = useApiGateway<
    {},
    GetVenueBySlugQuery['venues'][0]
  >(`/v1/venues`);

  return (
    <Modal isOpen={isOpen} handleClose={() => onClose()} classNameMaxWidth="max-w-7xl">
      <div className="flex justify-between border-b border-color-border-input-lightmode p-6">
        <h3 className="text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Add a venue
        </h3>
        <button
          className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
          type="button"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex">
        <div className="flex max-h-[100vh] w-1/2 flex-col overflow-y-scroll p-ds-3xl pb-ds-xl pt-ds-xl">
          <SearchVenueLocationInput onSearch={(venues) => setVenues(venues)} />

          <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-8 pt-8 lg:grid-cols-2">
            {venues.map((venue) => (
              <div
                className="cursor-pointer pb-8"
                onClick={async () => {
                  await fetchVenueBySlug({
                    endpoint: venue.slug,
                  });
                }}
              >
                <CardVenue
                  isLink={false}
                  key={venue.id}
                  id={venue.id}
                  slug={venue.slug}
                  imageUrl={venue?.images?.[0]?.url}
                  title={venue.title}
                  addressString={venue.addressString}
                  accessType={venue.accessType}
                  totalCourtCount={venue.indoorCourtCount + venue.outdoorCourtCount}
                  pickleballNets={venue.pickleballNets}
                />
              </div>
            ))}
          </div>
          <span className="mt-ds-xl self-center">
            Don't see your venue? Email us at{' '}
            <a className="text-color-text-brand" href="mailto:team@bounce.game">
              team@bounce.game
            </a>
          </span>
        </div>

        <div className="flex w-1/2 flex-col items-center bg-brand-gray-50 p-ds-3xl pb-ds-xl pt-ds-xl">
          {selectedVenue && (
            <Sticky topOffset={-4} wrapperClassName="h-full overflow-scroll">
              <div className="mt-8 w-full max-w-md">
                <CardVenueSelected
                  venue={selectedVenue}
                  imageUrl={selectedVenue.images?.[0]?.url}
                />
              </div>
            </Sticky>
          )}
        </div>
      </div>
      <div className="flex justify-end border-t border-color-border-input-lightmode p-ds-3xl pb-ds-xl pt-ds-xl">
        <Button
          disabled={!selectedVenue}
          isInline
          variant="primary"
          size="md"
          onClick={() => {
            if (selectedVenue) {
              onSubmit(selectedVenue);
            }
          }}
        >
          Add venue
        </Button>
      </div>
    </Modal>
  );
};

export default AddVenue;
