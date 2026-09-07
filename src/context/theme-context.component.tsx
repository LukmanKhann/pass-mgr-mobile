import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Appearance, Platform, StatusBar, useColorScheme } from 'react-native';

import { typography } from '../theme/typography.theme';
import { darkColors, IColorTokens, lightColors } from '../theme/colors.theme';
import { borderRadius, spacing } from '../theme/spacing.theme';

export type IThemeMode = 'light' | 'dark' | 'system';

interface IThemeContextValue {
  mode: IThemeMode;
  colors: IColorTokens;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  isDark: boolean;
  setMode: (mode: IThemeMode) => Promise<void>;
}

const THEME_KEY = '@pm_theme';

export const ThemeContext = createContext<IThemeContextValue>({
  mode: 'system',
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
  isDark: false,
  setMode: async () => {},
});

function applyNativeColorScheme(mode: IThemeMode) {
  if (mode === 'light') {
    Appearance.setColorScheme('light');
  } else if (mode === 'dark') {
    Appearance.setColorScheme('dark');
  } else {
    Appearance.setColorScheme('unspecified');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<IThemeMode>('system');
  const [initialized, setInitialized] = useState(false);

  const setMode = useCallback(async (newMode: IThemeMode) => {
    setModeState(newMode);
    applyNativeColorScheme(newMode);
    await AsyncStorage.setItem(THEME_KEY, newMode);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(stored => {
      const resolved =
        stored === 'light' || stored === 'dark' || stored === 'system'
          ? (stored as IThemeMode)
          : 'system';
      setModeState(resolved);
      applyNativeColorScheme(resolved);
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    const systemIsDark = systemScheme === 'dark';
    return (
      <ThemeContext.Provider
        value={{
          mode: 'system',
          colors: systemIsDark ? darkColors : lightColors,
          spacing,
          borderRadius,
          typography,
          isDark: systemIsDark,
          setMode,
        }}
      >
        <StatusBar
          barStyle={systemIsDark ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent={Platform.OS === 'android'}
        />
        {children}
      </ThemeContext.Provider>
    );
  }

  const isDark =
    mode === 'dark' ? true : mode === 'light' ? false : systemScheme === 'dark';

  const value: IThemeContextValue = {
    mode,
    colors: isDark ? darkColors : lightColors,
    spacing,
    borderRadius,
    typography,
    isDark,
    setMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />
      {children}
    </ThemeContext.Provider>
  );
}
