import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

type ThemeMode = 'light' | 'dark' | 'amoled';

export interface ThemeContextType {
  colors: typeof colors.dark;
  spacing: typeof spacing;
  typography: typeof typography;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: colors.dark,
  spacing,
  typography,
  isDark: true,
  themeMode: 'dark',
  setThemeMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>((colorScheme as ThemeMode) || 'dark');
  
  const isDark = themeMode === 'dark' || themeMode === 'amoled';
  
  const theme = {
    colors: themeMode === 'amoled' ? colors.amoled : (themeMode === 'light' ? colors.light : colors.dark),
    spacing,
    typography,
    isDark,
    themeMode,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
