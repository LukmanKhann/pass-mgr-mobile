import React, { useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  type MD3Theme,
} from 'react-native-paper';

import AuthLockScreen from './src/components/Biometric/auth/auth-lock-screen.component';
import BiometricAuthService from './src/components/Biometric/service/BiometricAuth';
import LoadingScreen from './src/screens/loading/loading-screen.component';
import AppNavigator from './src/navigation/app-navigator.component';

import { ThemeProvider } from './src/context/theme-context.component';
import { useTheme } from './src/hooks/use-theme.hook';
import { AuthProvider, AuthContext } from './src/Auth/AuthContext';
import { PasswordProvider } from './src/context/PasswordContext/password-context.component';
import { ToastHost } from './src/global/utils/nitro-toast.util';
import type { IColorTokens } from './src/theme/colors.theme';

function AppContent(): JSX.Element {
  const { user, loading } = useContext(AuthContext);
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] =
    useState(false);
  const [needsBiometricAuth, setNeedsBiometricAuth] = useState(false);
  const [checkingBiometric, setCheckingBiometric] = useState(true);
  const [minimumLoading, setMinimumLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      checkBiometricAuthState();
    }
  }, [user, loading]);

  useEffect(() => {
    let lastState: string = AppState.currentState ?? 'active';
    const handleAppStateChange = async (nextAppState: string) => {
      if (lastState.match(/inactive|background/) && nextAppState === 'active') {
        // App is returning from background, do NOT reset biometric unless app was killed
      }
      lastState = nextAppState;
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  const checkBiometricAuthState = async (): Promise<void> => {
    try {
      setCheckingBiometric(true);

      if (user) {
        const biometricEnabled =
          await BiometricAuthService.isBiometricEnabled();
        const hasNumericPassword =
          await BiometricAuthService.hasNumericPassword();

        if (biometricEnabled || hasNumericPassword) {
          setNeedsBiometricAuth(true);
          setIsBiometricAuthenticated(false);
        } else {
          setIsBiometricAuthenticated(true);
          setNeedsBiometricAuth(false);
        }
      } else {
        setIsBiometricAuthenticated(false);
        setNeedsBiometricAuth(false);
      }
    } catch (error) {
      setIsBiometricAuthenticated(false);
      setNeedsBiometricAuth(false);
    } finally {
      setCheckingBiometric(false);
    }
  };

  const handleBiometricAuthenticated = (): void => {
    setIsBiometricAuthenticated(true);
    setNeedsBiometricAuth(false);
  };

  const handleBiometricSetupRequired = (): void => {
    setIsBiometricAuthenticated(true);
    setNeedsBiometricAuth(false);
  };

  if (loading || checkingBiometric || minimumLoading) {
    return <LoadingScreen />;
  }

  if (user && needsBiometricAuth && !isBiometricAuthenticated) {
    return (
      <AuthLockScreen
        onAuthenticated={handleBiometricAuthenticated}
        onSetupRequired={handleBiometricSetupRequired}
      />
    );
  }

  return <AppNavigator />;
}

function getPaperTheme(isDark: boolean, colors: IColorTokens): MD3Theme {
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      surface: colors.surface,
      surfaceVariant: colors.surfaceElevated,
      surfaceDisabled: colors.surfaceElevated,
      onSurface: colors.textPrimary,
      onSurfaceVariant: colors.textSecondary,
      outline: colors.border,
      outlineVariant: colors.borderLight,
      error: colors.error,
      onError: colors.textInverse,
      onPrimary: colors.textOnPrimary,
      onSecondary: colors.textInverse,
      elevation: {
        level0: 'transparent',
        level1: colors.surfaceElevated,
        level2: colors.surfaceElevated,
        level3: colors.surfaceElevated,
        level4: colors.surface,
        level5: colors.surface,
      },
    },
  };
}

function ThemedPaperProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { colors, isDark } = useTheme();
  return (
    <PaperProvider theme={getPaperTheme(isDark, colors)}>
      {children}
    </PaperProvider>
  );
}

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PasswordProvider>
          <ThemedPaperProvider>
            <ToastHost />
            <AppContent />
          </ThemedPaperProvider>
        </PasswordProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
