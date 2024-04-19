import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from 'styles/GlobalStyle';
import { ThemeNames, themeMap } from 'styles/theme';

export const ThemeToggleContext = React.createContext({
  theme: ThemeNames.Light,
  setTheme: (_theme: ThemeNames) => {},
});

const ThemeToggleContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = React.useState(ThemeNames.Light);

  return (
    <ThemeToggleContext.Provider value={{ setTheme, theme }}>
      {children}
    </ThemeToggleContext.Provider>
  );
};

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ThemeToggleContextProvider>{children}</ThemeToggleContextProvider>;
};

const ThemeProviderWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { theme } = React.useContext(ThemeToggleContext);
  const themeObject = themeMap[theme];

  return (
    <Wrapper>
      <ThemeProvider theme={themeObject}>
        <>
          <GlobalStyle />
          {children}
        </>
      </ThemeProvider>
    </Wrapper>
  );
};

export default ThemeProviderWrapper;
