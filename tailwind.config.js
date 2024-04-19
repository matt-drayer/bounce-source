const colors = require('./src/styles/colors.json');
const tailwindTheme = require('tailwindcss/defaultTheme');

// TODO: Define colors in object here and then apply them to classes below
// TODO: NAMING - should "dark" or "light" refer to the mode you're in or if the color itself is dark or light? Probably the mode
// TODO: Spread all the extended theme into the safe list (attach the regex so it handles things like bg- and text-)

const TABS_HEIGHT = '3.5rem';
const SIDEBAR_WIDTH = '16rem';
const TOP_NAV_HEIGHT = '4rem';
const MARKETPLACE_NAV_HEIGHT = '4.5rem';
const PAGE_TITLE_HEIGHT_MOBILE = '4rem';
const PAGE_TITLE_HEIGHT_DESKTOP = '5.25rem';
const CARD_IMAGE_DIMENSIONS = '3rem';
const MAIN_CONTENT = '48.75rem';
const paletteBrandGray = colors.paletteBrandGray;
const paletteBrandFire = colors.paletteBrandFire;
const paletteBrandGreen = colors.paletteBrandGreen;
const paletteBrandPurple = colors.paletteBrandPurple;
const paletteBrandBlue = colors.paletteBrandBlue;
const paletteBrandYellow = colors.paletteBrandYellow;
const paletteBrandGrass = colors.paletteBrandGrass;
const paletteBrandRed = colors.paletteBrandRed;
const paletteBrandSeaBlue = colors.paletteBrandSeaBlue;

const converPaletteToTailwind = (palette) => {
  const name = palette.name;
  const colors = palette.colors;

  return Object.entries(colors).reduce((acc, [key, color]) => {
    return {
      ...acc,
      [`${name}-${key}`]: color,
    };
  }, {});
};

const textColors = {
  'color-text-brand': paletteBrandFire.colors[500],
  // Lightmode
  'color-text-lightmode-primary': paletteBrandGray.colors[900],
  'color-text-lightmode-secondary': paletteBrandGray.colors[600],
  'color-text-lightmode-tertiary': paletteBrandGray.colors[400],
  'color-text-lightmode-inactive': paletteBrandGray.colors[200],
  'color-text-lightmode-invert': paletteBrandGray.colors[25],
  'color-text-lightmode-placeholder': paletteBrandGray.colors[500],
  'color-text-lightmode-disabled': paletteBrandGray.colors[200],
  'color-text-lightmode-icon': paletteBrandGray.colors[400],
  'color-text-lightmode-error': paletteBrandRed.colors[500],
  // Darkmode
  'color-text-darkmode-primary': paletteBrandGray.colors[25],
  'color-text-darkmode-secondary': paletteBrandGray.colors[200],
  'color-text-darkmode-tertiary': paletteBrandGray.colors[400],
  'color-text-darkmode-inactive': paletteBrandGray.colors[400],
  'color-text-darkmode-invert': paletteBrandGray.colors[900],
  'color-text-darkmode-placeholder': paletteBrandGray.colors[300],
  'color-text-darkmode-disabled': paletteBrandGray.colors[600],
  'color-text-darkmode-icon': paletteBrandGray.colors[400],
  'color-text-darkmode-error': paletteBrandRed.colors[500],
};

const surfaceColors = {
  // Lightmode
  'color-bg-lightmode-primary': paletteBrandGray.colors[0],
  'color-bg-lightmode-secondary': paletteBrandGray.colors[50],
  'color-bg-lightmode-tertiary': paletteBrandGray.colors[25],
  'color-bg-lightmode-highlighted': paletteBrandGray.colors[100],
  'color-bg-lightmode-invert': paletteBrandGray.colors[1000],
  'color-bg-lightmode-brand': paletteBrandFire.colors[500],
  'color-bg-lightmode-brand-secondary': paletteBrandFire.colors[50],
  'color-bg-lightmode-inactive': paletteBrandGray.colors[100],
  'color-bg-lightmode-section': paletteBrandGray.colors[50],
  'color-bg-input-lightmode-primary': paletteBrandGray.colors[50],
  'color-bg-lightmode-icon': paletteBrandGray.colors[300],
  'color-bg-lightmode-icon-error': paletteBrandRed.colors[500],
  'color-bg-lightmode-error': paletteBrandRed.colors[100],
  'color-bg-lightmode-error-secondary': paletteBrandRed.colors[400],
  // Darkmode
  'color-bg-darkmode-primary': paletteBrandGray.colors[1000],
  'color-bg-darkmode-secondary': paletteBrandGray.colors[800],
  'color-bg-darkmode-tertiary': paletteBrandGray.colors[800],
  'color-bg-darkmode-highlighted': paletteBrandGray.colors[500],
  'color-bg-darkmode-invert': paletteBrandGray.colors[0],
  'color-bg-darkmode-brand': paletteBrandFire.colors[500],
  'color-bg-darkmode-brand-secondary': paletteBrandFire.colors[900],
  'color-bg-input-darkmode-primary': paletteBrandGray.colors[800],
  'color-bg-darkmode-icon': paletteBrandGray.colors[500],
  'color-bg-darkmode-icon-error': paletteBrandRed.colors[500],
  'color-bg-darkmode-error': paletteBrandRed.colors[900],
  'color-bg-darkmode-error-secondary': paletteBrandRed.colors[700],
  // Backward compatability & surface misc
  'color-checkbox-active': paletteBrandFire.colors[500],
};

const borderColors = {
  'color-border-brand': paletteBrandFire.colors[500],
  //Lightmode
  'color-border-input-lightmode': paletteBrandGray.colors[100],
  'color-border-card-lightmode': paletteBrandGray.colors[50],
  //Darkmode
  'color-border-input-darkmode': paletteBrandGray.colors[700],
  'color-border-card-darkmode': paletteBrandGray.colors[800],
};

const buttonSurfaceColors = {
  'color-button-brand-primary': paletteBrandGray.colors[1000],
  'color-button-fire': paletteBrandFire.colors[500],
  'color-button-darkmode': paletteBrandGray.colors[0],
  'color-button-lightmode': paletteBrandGray.colors[1000],
};
const buttonTextColors = {};

const appColors = {
  // Brand
  'color-brand-primary': paletteBrandFire.colors[500],
  'color-brand-secondary': paletteBrandFire.colors[400],
  'color-brand-heavy': paletteBrandFire.colors[700],
  'color-brand-active': paletteBrandFire.colors[100],
  'color-tab-active': paletteBrandFire.colors[500],
  'color-brand-highlight': paletteBrandFire.colors[500],
  'color-brand-background': paletteBrandFire.colors[50],
  // Status
  'color-success': paletteBrandGreen.colors[400],
  'color-success-background': paletteBrandGreen.colors[100],
  'color-error': paletteBrandRed.colors[500],
  // Misc
  'color-connections': paletteBrandBlue.colors[500],
  'color-lesson-individual': paletteBrandFire.colors[100],
  'color-lesson-cardio': paletteBrandFire.colors[200],
  'color-lesson-clinic': paletteBrandSeaBlue.colors[200],
  'color-lesson-camp': paletteBrandGreen.colors[200],
  'color-lesson-other': paletteBrandPurple.colors[200],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/screens/**/*.{js,ts,jsx,tsx}',
    './src/svg/**/*.{js,ts,jsx,tsx}',
    './src/stories/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      'family-poppins': ["'Poppins'", "'Inter'", 'sans-serif'],
    },
    extend: {
      screens: {
        'lp-hero': '1600px',
        xs: '320px',
        xmd: '1266px',
      },
      colors: {
        ...converPaletteToTailwind(paletteBrandGray),
        ...converPaletteToTailwind(paletteBrandFire),
        ...converPaletteToTailwind(paletteBrandGreen),
        ...converPaletteToTailwind(paletteBrandPurple),
        ...converPaletteToTailwind(paletteBrandBlue),
        ...converPaletteToTailwind(paletteBrandYellow),
        ...converPaletteToTailwind(paletteBrandGrass),
        ...converPaletteToTailwind(paletteBrandRed),
        ...converPaletteToTailwind(paletteBrandSeaBlue),
        ...appColors,
        ...buttonSurfaceColors,
        ...textColors,
        ...surfaceColors,
        ...borderColors,
      },
      maxWidth: {
        'onboard-content-container': '360px',
        'details-content-container': '360px',
        'main-content-container': MAIN_CONTENT,
        'play-container': MAIN_CONTENT,
      },
      spacing: {
        tabs: TABS_HEIGHT,
        sidebar: SIDEBAR_WIDTH,
        topnav: TOP_NAV_HEIGHT,
        'marketplace-nav': MARKETPLACE_NAV_HEIGHT,
        'button-tall': tailwindTheme.spacing[4],
        'button-short': tailwindTheme.spacing[4],
        'gutter-base': tailwindTheme.spacing[6], // NOTE: Use this instead of px-6 everywhere
        'card-image': CARD_IMAGE_DIMENSIONS,
        'mobile-page-title': PAGE_TITLE_HEIGHT_MOBILE,
        'desktop-page-title': PAGE_TITLE_HEIGHT_DESKTOP,
        /**
         * @note ds = design system. Is this good naming? Seems easy to search and replace later if needed.
         */
        'ds-none': tailwindTheme.spacing[0],
        'ds-xs': tailwindTheme.spacing[1],
        'ds-sm': tailwindTheme.spacing[2],
        'ds-md': tailwindTheme.spacing[3],
        'ds-lg': tailwindTheme.spacing[4],
        'ds-xl': tailwindTheme.spacing[6],
        'ds-2xl': tailwindTheme.spacing[8],
        'ds-3xl': tailwindTheme.spacing[10],
      },
      fontSize: {
        '2xs': ['10px', '12px'],
        //
        // Typography Product
        'size-product-display': ['2rem', '150%'],
        'size-product-heading-desktop': ['1.5rem', '150%'],
        'size-product-heading-mobile': ['1.25rem', '120%'],
        'size-product-heading-compact-desktop': ['1.25rem', '120%'],
        'size-product-subheading': ['1rem', '150%'],
        'size-product-body-highlight': ['1rem', '150%'],
        'size-product-button-label-large': ['1rem', '120%'],
        'size-product-button-label-medium': ['1rem', '120%'],
        'size-product-body': ['1rem', '150%'],
        'size-product-button-label-small': ['0.875rem', '120%'],
        'size-product-link': ['0.875rem', '150%'],
        'size-product-element-label': ['0.875rem', '150%'],
        'size-product-caption': ['0.875rem', '1.125rem'],
        'size-product-button-label-xs': ['0.75rem', '120%'],
        'size-product-chips-filters': ['0.75rem', '150%'],
        'size-product-text-card': ['0.75rem', '1rem'],
        'size-product-tabbar-mobile': ['0.625rem', '0.75rem'],
        //
        // Typography Informative
        'size-informative-display-mega-primary-desktop': ['5rem', '120%'],
        'size-informative-display-mega-primary-mobile': ['3rem', '120%'],
        'size-informative-display-mega-secondary-desktop': ['5rem', '120%'],
        'size-informative-display-mega-secondary-mobile': ['3rem', '120%'],
        'size-informative-display-primary-desktop': ['4rem', '120%'],
        'size-informative-display-primary-mobile': ['2.5rem', '120%'],
        'size-informative-display-secondary-desktop': ['4rem', '120%'],
        'size-informative-display-secondary-mobile': ['2.5rem', '120%'],
        'size-informative-heading-desktop': ['3rem', 'normal'],
        'size-informative-heading-mobile': ['2rem', 'normal'],
        'size-informative-heading-compact-desktop': ['2rem'],
        'size-informative-subheading': ['1.5rem', '150%'],
        'size-informative-quote': ['1.25rem', '150%'],
        'size-informative-subheading-compact': ['1.125rem', '150%'],
        'size-informative-body-highlight': ['1rem', '150%'],
        'size-informative-button-label': ['1rem', '150%'],
        'size-informative-body': ['1rem', '150%'],
        'size-informative-caption-highlight': ['0.875rem', '150%'],
        'size-informative-caption': ['0.875rem', 'normal'],
      },
      boxShadow: {
        'lightmode-primary': '0px 4px 8px rgba(0, 0, 0, 0.04)',
        'lightmode-secondary': '2px 4px 8px rgba(0, 0, 0, 0.04)',
        'option-active': '0px 4px 8px rgba(0, 0, 0, 0.16)',
        fab: '0px 4px 20px rgba(0, 0, 0, 0.16)',
        popover: '0px 4px 16px rgba(0, 0, 0, 0.16)',
        tabs: '0px -4px 20px rgba(0, 0, 0, 0.06)',
        'bottom-sheet': '0 -5px 60px 0 rgb(38 89 115 / 11%), 0 -1px 0 rgb(38 89 115 / 5%)',
        'mobile-top-nav': '0px 4px 10px 0px rgba(0, 0, 0, 0.02)',
        'tab-slider': '0px 1px 2px rgba(0, 0, 0, 0.16)',
        checkbox: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        brand: '0px 4px 8px rgba(104, 102, 207, 0.32)',
        sidebar: '2px 0px 16px rgba(0, 0, 0, 0.04)',
        'feed-card': '0px 4px 40px rgba(0, 0, 0, 0.08)',
        indicator: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  safelist: [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'p-3',
    'pb-tabs',
    'mb-tabs',
    'h-tabs',
    'bottom-tabs',
    'block',
    'w-full',
    'h-screen',
    'min-h-screen',
    'rounded',
    'rounded-full',
    'rounded-md',
    'mb-2',
    'py-4',
    'px-2',
    'px-3',
    'px-4',
    'px-3.5',
    'py-2',
    'py-1.5',
    'h-6',
    'w-6',
    'w-1/2',
    'w-1/3',
    'w-1/4',
    'w-1/5',
    'h-14',
    'bottom-14',
    'text-center',
    'font-medium',
    'leading-6',
    'text-gray-700',
    'border-gray-700',
    'shadow-fab',
    'bg-color-button-brand-primary',
    'bg-color-button-darkmode',
    'bg-color-button-lightmode',
    'bg-color-button-fire',
    'text-color-text-darkmode-primary',
    'color-text-lightmode-primary',
    'color-text-darkmode-primary',
    'color-bg-input-lightmode-primary',
    'bg-color-bg-input-lightmode-primary',
    'disabled:opacity-50 ',
    'disabled:cursor-not-allowed',
    'read-only:opacity-50 ',
    'read-only:cursor-not-allowed',
    'border-0',
    'border-none',
    'bg-color-checkbox-active',
    'text-color-checkbox-active',
    'focus:ring-color-checkbox-active',
    'ring-color-checkbox-active',
    'border-color-border',
    'text-color-text-lightmode-label',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-color-checkbox-active',
    'border',
    'border-color-brand-highlight',
    'text-color-brand-highlight',
    'bg-color-bg-lightmode-primary',
    'text-color-bg-lightmode-section',
    'bg-color-button-lightmode',
    'bg-brand-fire-50',
    'text-brand-fire-500',
  ],
};
