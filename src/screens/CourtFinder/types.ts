import { CourtSurfacesEnum, VenueAccessTypesEnum, VenueNetsEnum } from 'types/generated/client';
import { accessEnumToFilter } from 'utils/shared/sports/accessEnumToFilter';
import { netsEnumToFilter } from 'utils/shared/sports/netsEnumToFilter';
import { surfaceEnumToFilter } from 'utils/shared/sports/surfaceEnumToFilter';

export const ANY_OPTION = 'Any';

export interface FilterProps {
  setShowFreeCourts: (showFreeCourts: boolean) => void;
  setSurface: React.Dispatch<React.SetStateAction<CourtSurfacesEnum[]>>;
  setNets: React.Dispatch<React.SetStateAction<VenueNetsEnum[]>>;
  setAccessType: React.Dispatch<React.SetStateAction<VenueAccessTypesEnum[]>>;
  setShowOnlyDedicatedCourts: (showOnlyDedicatedCourts: boolean) => void;
  setCourtsMinNumber: (courtsMinNumber: number) => void;
  setCourtsMaxNumber: (courtsMaxNumber: number) => void;
  setCourtType: React.Dispatch<React.SetStateAction<CourtType[]>>;
  courtsMaxNumber: number;
  courtType: CourtType[];
  courtsMinNumber: number;
  showOnlyDedicatedCourts: boolean;
  showFreeCourts: boolean;
  accessType: VenueAccessTypesEnum[];
  nets: VenueNetsEnum[];
  surface: CourtSurfacesEnum[];
  courtLimit: number;
  fetchCourts: (vars: { longitude: number; latitude: number; distance: number }) => void;
}

export const VENUE_DISTANCE_IMPERIAL_OPTIONS = [
  {
    name: '10 miles',
    id: 10,
  },
  {
    name: '25 miles',
    id: 25,
  },
  {
    name: '50 miles',
    id: 50,
  },
  {
    name: '100 miles',
    id: 100,
  },
];

export const VENUE_DISTANCE_METRIC_OPTIONS = [
  {
    name: '10 km',
    id: 10,
  },
  {
    name: '25 km',
    id: 25,
  },
  {
    name: '50 km',
    id: 50,
  },
  {
    name: '100 km',
    id: 100,
  },
];

export const VENUE_ACCESS_OPTIONS = [
  {
    name: accessEnumToFilter(VenueAccessTypesEnum.Free),
    id: VenueAccessTypesEnum.Free,
    includedValues: [VenueAccessTypesEnum.Free],
  },
  {
    name: accessEnumToFilter(VenueAccessTypesEnum.Membership),
    id: VenueAccessTypesEnum.Membership,
    includedValues: [VenueAccessTypesEnum.Membership, VenueAccessTypesEnum.Private],
  },
  {
    name: accessEnumToFilter(VenueAccessTypesEnum.OneTime),
    id: VenueAccessTypesEnum.OneTime,
    includedValues: [VenueAccessTypesEnum.OneTime],
  },
];

export enum CourtType {
  Indoor = 'INDOOR',
  Outdoor = 'OUTDOOR',
}
export const VENUE_COURT_TYPE_OPTIONS = [
  {
    name: 'Indoor',
    id: CourtType.Indoor,
  },
  {
    name: 'Outdoor',
    id: CourtType.Outdoor,
  },
];
export const VENUE_NETS_OPTIONS = [
  {
    name: netsEnumToFilter(VenueNetsEnum.Permanent),
    id: VenueNetsEnum.Permanent,
    includedValues: [VenueNetsEnum.Permanent],
  },
  {
    name: netsEnumToFilter(VenueNetsEnum.Portable),
    id: VenueNetsEnum.Portable,
    includedValues: [VenueNetsEnum.Portable],
  },
  {
    name: netsEnumToFilter(VenueNetsEnum.BringYourOwn),
    id: VenueNetsEnum.BringYourOwn,
    includedValues: [VenueNetsEnum.BringYourOwn],
  },
  // {
  //   name: VenueNetsEnum.Tennis,
  //   id: 3,
  // },
];

// export const VENUE_LINES_OPTIONS = [
//   {
//     name: 'PERMANENT',
//     id: 1,
//   },
//   {
//     name: 'TEMPORARY',
//     id: 2,
//   },
//   {
//     name: 'TAPE',
//     id: 3,
//   },
//   {
//     name: 'CHALK',
//     id: 4,
//   },
// ];

export const VENUE_SURFACE_OPTIONS = [
  {
    name: surfaceEnumToFilter(CourtSurfacesEnum.Hard),
    id: CourtSurfacesEnum.Hard,
    includedValues: [
      CourtSurfacesEnum.Hard,
      CourtSurfacesEnum.Concrete,
      CourtSurfacesEnum.Asphalt,
      CourtSurfacesEnum.Acrylic,
      CourtSurfacesEnum.Clay,
    ],
  },
  {
    name: surfaceEnumToFilter(CourtSurfacesEnum.Wood),
    id: CourtSurfacesEnum.Wood,
    includedValues: [CourtSurfacesEnum.Wood],
  },
  {
    name: 'Other',
    id: CourtSurfacesEnum.Grass,
    includedValues: [CourtSurfacesEnum.Grass, CourtSurfacesEnum.Carpet],
  },
];
export const DEFAULT_COURT_DISTANCE_IMPERIAL = VENUE_DISTANCE_IMPERIAL_OPTIONS[1];
export const DEFAULT_COURT_DISTANCE_METRIC = VENUE_DISTANCE_METRIC_OPTIONS[1];
