import { CourtSurfacesEnum } from 'types/generated/server';

const surfaceToName = {
  [CourtSurfacesEnum.Clay]: 'Hard',
  [CourtSurfacesEnum.Hard]: 'Hard',
  [CourtSurfacesEnum.Concrete]: 'Hard',
  [CourtSurfacesEnum.Asphalt]: 'Hard',
  [CourtSurfacesEnum.Acrylic]: 'Hard',
  [CourtSurfacesEnum.Grass]: 'Other',
  [CourtSurfacesEnum.Carpet]: 'Other',
  [CourtSurfacesEnum.Wood]: 'Wood',
};

export const surfaceEnumToFilter = (surface: CourtSurfacesEnum) => {
  return surfaceToName[surface] || '';
};
