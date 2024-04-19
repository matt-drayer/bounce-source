import {
  CARDIO_TENNIS_DISPLAY_KEY,
  CURRENT_COLLEGE_PLAYER_D1_DISPLAY_KEY,
  CURRENT_COLLEGE_PLAYER_D2_DISPLAY_KEY,
  CURRENT_COLLEGE_PLAYER_D3_DISPLAY_KEY,
  FORMER_COLLEGE_PLAYER_D1_DISPLAY_KEY,
  FORMER_COLLEGE_PLAYER_D2_DISPLAY_KEY,
  FORMER_COLLEGE_PLAYER_D3_DISPLAY_KEY,
  FORMER_PROFESSIONAL_DISPLAY_KEY,
  GPTCA_DISPLAY_KEY,
  PTR_DISPLAY_KEY,
  USPTA_DISPLAY_KEY,
} from 'constants/sports';

interface Params {
  displayKey: string;
  name: string;
}

export const getBadgeTextForQualification = ({ displayKey, name }: Params) => {
  switch (displayKey) {
    case USPTA_DISPLAY_KEY:
    case PTR_DISPLAY_KEY:
    case GPTCA_DISPLAY_KEY:
    case CARDIO_TENNIS_DISPLAY_KEY:
      return name;

    case FORMER_COLLEGE_PLAYER_D1_DISPLAY_KEY:
    case FORMER_COLLEGE_PLAYER_D2_DISPLAY_KEY:
    case FORMER_COLLEGE_PLAYER_D3_DISPLAY_KEY:
      return `Former ${name}`;

    case CURRENT_COLLEGE_PLAYER_D1_DISPLAY_KEY:
    case CURRENT_COLLEGE_PLAYER_D2_DISPLAY_KEY:
    case CURRENT_COLLEGE_PLAYER_D3_DISPLAY_KEY:
      return `Current ${name}`;

    case FORMER_PROFESSIONAL_DISPLAY_KEY:
      return 'Former Pro';

    default:
      return name;
  }
};
