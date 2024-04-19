// TODO: Use tailwind to construct theme palette
// import colors from 'tailwindcss/colors';
import colors from 'styles/colors.json';

const paletteBrandBlue = colors.paletteBrandBlue;
const paletteBrandFire = colors.paletteBrandFire;
const paletteBrandPurple = colors.paletteBrandPurple;
const paletteBrandGreen = colors.paletteBrandGreen;

export const palette = {
  lessonIndividual: paletteBrandFire.colors[100],
  lessonCardio: paletteBrandFire.colors[200],
  lessonClinic: paletteBrandBlue.colors[200],
  lessonCamp: paletteBrandGreen.colors[200],
  lessonOther: paletteBrandPurple.colors[200],
};

export const themeLight = {
  colors: {
    primary: '#0070f3',
    secondary: '#0070f3',
  },
};
export const themeDark = {
  colors: {
    primary: '#0070f3',
    secondary: '#0070f3',
  },
};

export enum ThemeNames {
  Light = 'LIGHT',
  Dark = 'DARK',
}

export const themeMap = {
  [ThemeNames.Light]: themeLight,
  [ThemeNames.Dark]: themeDark,
};
