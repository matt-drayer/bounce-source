import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import * as nextImage from 'next/image';
import '../src/styles/globals.css';

// Object.defineProperty(nextImage, 'default', {
//   configurable: true,
//   value: (props) => <img {...props} />,
// });

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
];

export default preview;
