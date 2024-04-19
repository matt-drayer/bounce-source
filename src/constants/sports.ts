import {
  LessonEquipmentOptionsEnum,
  LessonTypesEnum,
  PlaySessionFormatsEnum,
  SportsEnum,
} from 'types/generated/client';
import HeartRate from 'svg/HeartRate';
// import LessonCampSquareCover from 'svg/LessonCampSquareCover';
// import LessonCampWideCover from 'svg/LessonCampWideCover';
// import LessonCardioSquareCover from 'svg/LessonCardioSquareCover';
// import LessonCardioWideCover from 'svg/LessonCardioWideCover';
// import LessonClinicSquareCover from 'svg/LessonClinicSquareCover';
// import LessonClinicWideCover from 'svg/LessonClinicWideCover';
// import LessonIndividualSquareCover from 'svg/LessonIndividualSquareCover';
// import LessonIndividualWideCover from 'svg/LessonIndividualWideCover';
import Racket from 'svg/Racket';
import Shoes from 'svg/Shoes';
import Towel from 'svg/Towel';
import WaterBottle from 'svg/WaterBottle';

export enum SkillLevels {
  DoNotPlay = 'DO_NOT_PLAY',
  BrandNew = 'BRAND_NEW',
  Beginner = 'BEGINNER',
  Intermediate = 'INTERMEDIATE',
  Advanced = 'ADVANCED',
  Pro = 'PRO',
  NoResponse = 'NO_RESPONSE',
}

export const ImageSquareForLessonType = {
  [LessonTypesEnum.Custom]: '/images/lessons/individual-square.svg',
  [LessonTypesEnum.Individual]: '/images/lessons/individual-square.svg',
  [LessonTypesEnum.Clinic]: '/images/lessons/clinic-square.svg',
  [LessonTypesEnum.Cardio]: '/images/lessons/cardio-square.svg',
  [LessonTypesEnum.Camp]: '/images/lessons/camp-square.svg',
};

export const ImageWideForLessonType = {
  [LessonTypesEnum.Custom]: '/images/lessons/individual-cover.svg',
  [LessonTypesEnum.Individual]: '/images/lessons/individual-cover.svg',
  [LessonTypesEnum.Clinic]: '/images/lessons/clinic-cover.svg',
  [LessonTypesEnum.Cardio]: '/images/lessons/cardio-cover.svg',
  [LessonTypesEnum.Camp]: '/images/lessons/camp-cover.svg',
};

export const defaultParticipantLimitByClassType = {
  '': 1,
  [LessonTypesEnum.Individual]: 1,
  [LessonTypesEnum.Clinic]: 10,
  [LessonTypesEnum.Cardio]: 8,
  [LessonTypesEnum.Camp]: 20,
  [LessonTypesEnum.Custom]: 20,
};

export const defaultNameForLessonType = {
  '': '',
  [LessonTypesEnum.Individual]: 'Private Lesson',
  [LessonTypesEnum.Clinic]: 'Group Clinic [specify skill level]',
  [LessonTypesEnum.Cardio]: 'CardioTennis',
  [LessonTypesEnum.Camp]: 'Tennis Camp [specify age or skill level]',
  [LessonTypesEnum.Custom]: '',
};

export const lessonDisplayName = {
  [LessonTypesEnum.Individual]: 'Individual',
  [LessonTypesEnum.Clinic]: 'Clinic',
  [LessonTypesEnum.Cardio]: 'CardioTennis',
  [LessonTypesEnum.Camp]: 'Camp',
  [LessonTypesEnum.Custom]: 'Custom',
};

export const lessonShortName = {
  [LessonTypesEnum.Individual]: 'Individual',
  [LessonTypesEnum.Clinic]: 'Clinic',
  [LessonTypesEnum.Cardio]: 'Cardio',
  [LessonTypesEnum.Camp]: 'Camp',
  [LessonTypesEnum.Custom]: 'Custom',
};

// Rating
export const NTRP_SHORT_NAME = 'NTRP';
export const UTR_SHORT_NAME = 'UTR';
export const NORMALIZED_RATING_SYSTEM_SHORT_NAME = UTR_SHORT_NAME;

// Qualifications
export const USPTA_DISPLAY_KEY = 'USPTA';
export const PTR_DISPLAY_KEY = 'PTR';
export const GPTCA_DISPLAY_KEY = 'GPTCA';
export const CARDIO_TENNIS_DISPLAY_KEY = 'CARDIO_TENNIS';
export const FORMER_COLLEGE_PLAYER_D1_DISPLAY_KEY = 'FORMER_COLLEGE_PLAYER_D1';
export const FORMER_COLLEGE_PLAYER_D2_DISPLAY_KEY = 'FORMER_COLLEGE_PLAYER_D2';
export const FORMER_COLLEGE_PLAYER_D3_DISPLAY_KEY = 'FORMER_COLLEGE_PLAYER_D3';
export const CURRENT_COLLEGE_PLAYER_D1_DISPLAY_KEY = 'CURRENT_COLLEGE_PLAYER_D1';
export const CURRENT_COLLEGE_PLAYER_D2_DISPLAY_KEY = 'CURRENT_COLLEGE_PLAYER_D2';
export const CURRENT_COLLEGE_PLAYER_D3_DISPLAY_KEY = 'CURRENT_COLLEGE_PLAYER_D3';
export const FORMER_PROFESSIONAL_DISPLAY_KEY = 'FORMER_PROFESSIONAL';

export const equipmentOrder = [
  {
    id: LessonEquipmentOptionsEnum.Racket,
    name: 'Racket',
    Icon: Racket,
    isDefault: true,
  },
  {
    id: LessonEquipmentOptionsEnum.CourtShoes,
    name: 'Court shoes',
    Icon: Shoes,
    isDefault: true,
  },
  {
    id: LessonEquipmentOptionsEnum.WaterBottle,
    name: 'Water bottle',
    Icon: WaterBottle,
    isDefault: false,
  },
  {
    id: LessonEquipmentOptionsEnum.Towel,
    name: 'Towel',
    Icon: Towel,
    isDefault: false,
  },
  {
    id: LessonEquipmentOptionsEnum.HeartRateMonitor,
    name: 'Heart rate monitor',
    Icon: HeartRate,
    isDefault: false,
  },
];

export const defaultFormatForSport = {
  [SportsEnum.Tennis]: PlaySessionFormatsEnum.Singles,
  [SportsEnum.Pickleball]: PlaySessionFormatsEnum.OpenPlay,
};

export const playSessionFormatDisplayName = {
  [PlaySessionFormatsEnum.Singles]: 'Singles',
  [PlaySessionFormatsEnum.Doubles]: 'Doubles',
  [PlaySessionFormatsEnum.OpenPlay]: 'Open Play',
};

interface RatingPreset {
  min: number | null;
  max: number | null;
  scaleTitle: string;
  displayName: string;
  image: string;
  isRange: boolean;
}

export const DUPR_PRESETS: RatingPreset[] = [
  {
    min: null,
    max: null,
    scaleTitle: '',
    displayName: 'Custom',
    image: '',
    isRange: false,
  },
  {
    min: null,
    max: null,
    scaleTitle: 'DUPR',
    displayName: 'All Levels',
    image: '',
    isRange: true,
  },
  {
    min: 2.0,
    max: 2.99,
    scaleTitle: 'DUPR',
    displayName: '',
    image: '',
    isRange: true,
  },
  {
    min: 3.0,
    max: 3.99,
    scaleTitle: 'DUPR',
    displayName: '',
    image: '',
    isRange: true,
  },
  {
    min: 4.0,
    max: 4.99,
    scaleTitle: 'DUPR',
    displayName: '',
    image: '',
    isRange: true,
  },
  {
    min: 5.0,
    max: 8.0,
    scaleTitle: 'DUPR',
    displayName: '',
    image: '',
    isRange: true,
  },
];

export const DUPR_IMAGES = [
  {
    desktopHeaderPath: '/images/open-play/header/all_levels_header_desktop.png',
    mobileHeaderPath: '/images/open-play/header/all_levels_header_mobile.png',
    desktopSquarePath: '/images/open-play/square/all_levels_desktop.png',
    mobileSquarePath: '/images/open-play/square/all_levels_mobile.png',
    maxRating: null,
  },
  {
    desktopHeaderPath: '/images/open-play/header/2_29_header_desktop.png',
    mobileHeaderPath: '/images/open-play/header/2_29_header_mobile.png',
    desktopSquarePath: '/images/open-play/square/2_29_desktop.png',
    mobileSquarePath: '/images/open-play/square/2_29_mobile.png',
    maxRating: 2.99,
  },
  {
    desktopHeaderPath: '/images/open-play/header/3_39_header_desktop.png',
    mobileHeaderPath: '/images/open-play/header/3_39_header_mobile.png',
    desktopSquarePath: '/images/open-play/square/3_39_desktop.png',
    mobileSquarePath: '/images/open-play/square/3_39_mobile.png',
    maxRating: 3.99,
  },
  {
    desktopHeaderPath: '/images/open-play/header/4_49_header_desktop.png',
    mobileHeaderPath: '/images/open-play/header/4_49_header_mobile.png',
    desktopSquarePath: '/images/open-play/square/4_49_desktop.png',
    mobileSquarePath: '/images/open-play/square/4_49_mobile.png',
    maxRating: 4.99,
  },
  {
    desktopHeaderPath: '/images/open-play/header/5_80_header_desktop.png',
    mobileHeaderPath: '/images/open-play/header/5_80_header_mobile.png',
    desktopSquarePath: '/images/open-play/square/5_80_desktop.png',
    mobileSquarePath: '/images/open-play/square/5_80_mobile.png',
    maxRating: 9999999,
  },
];
