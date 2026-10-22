import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  type MD3Theme,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthLockScreen from './src/components/Biometric/auth/auth-lock-screen.component';
import BiometricAuthService from './src/components/Biometric/service/BiometricAuth';
import LoadingScreen from './src/screens/loading/loading-screen.component';
import AppNavigator from './src/navigation/app-navigator.component';

import { ThemeProvider } from './src/context/theme-context.component';
import { useTheme } from './src/hooks/use-theme.hook';
import { AuthProvider, AuthContext } from './src/Auth/AuthContext';
import { PasswordProvider } from './src/context/PasswordContext/password-context.component';
import type { IColorTokens } from './src/theme/colors.theme';

function AppContent(): JSX.Element {
  const { user, loading, signOut } = useContext(AuthContext);
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] =
    useState(false);
  const [needsBiometricAuth, setNeedsBiometricAuth] = useState(false);
  const [checkingBiometric, setCheckingBiometric] = useState(true);
  const [minimumLoading, setMinimumLoading] = useState(true);
  const backgroundedAtRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const checkBiometricAuthState = useCallback(async (): Promise<void> => {
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
    } catch {
      setIsBiometricAuthenticated(false);
      setNeedsBiometricAuth(false);
    } finally {
      setCheckingBiometric(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      checkBiometricAuthState();
    }
  }, [loading, checkBiometricAuthState]);

  useEffect(() => {
    const lockApp = async (): Promise<void> => {
      const hasLockMethod = await BiometricAuthService.hasLockMethod();
      if (!hasLockMethod) {
        return;
      }
      await BiometricAuthService.setAuthenticationState(false);
      setIsBiometricAuthenticated(false);
      setNeedsBiometricAuth(true);
    };

    const handleAppStateChange = async (nextState: string): Promise<void> => {
      if (nextState === 'background') {
        if (backgroundedAtRef.current !== null) {
          return;
        }

        backgroundedAtRef.current = Date.now();
        const timeoutMinutes = await BiometricAuthService.getAutoLockTimeout();
        if (timeoutMinutes === 0) {
          await lockApp();
        }
        return;
      }

      if (nextState !== 'active') {
        return;
      }

      const backgroundedAt = backgroundedAtRef.current;
      if (backgroundedAt === null) {
        return;
      }
      backgroundedAtRef.current = null;

      const timeoutMinutes = await BiometricAuthService.getAutoLockTimeout();
      const elapsedMs = Date.now() - backgroundedAt;

      if (timeoutMinutes === 0 || elapsedMs >= timeoutMinutes * 60 * 1000) {
        await lockApp();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  const handleForgotPin = useCallback(async (): Promise<void> => {
    try {
      await BiometricAuthService.setNumericPassword('');
      await BiometricAuthService.setBiometricEnabled(false);
      await BiometricAuthService.setAuthenticationState(false);
    } finally {
      await signOut();
    }
  }, [signOut]);

  const handleBiometricAuthenticated = useCallback((): void => {
    setIsBiometricAuthenticated(true);
    setNeedsBiometricAuth(false);
  }, []);

  const handleBiometricSetupRequired = useCallback((): void => {
    setIsBiometricAuthenticated(true);
    setNeedsBiometricAuth(false);
  }, []);

  if (loading || checkingBiometric || minimumLoading) {
    return <LoadingScreen />;
  }

  if (user && needsBiometricAuth && !isBiometricAuthenticated) {
    return (
      <AuthLockScreen
        onAuthenticated={handleBiometricAuthenticated}
        onSetupRequired={handleBiometricSetupRequired}
        onForgotPin={handleForgotPin}
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
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PasswordProvider>
            <ThemedPaperProvider>
              <AppContent />
            </ThemedPaperProvider>
          </PasswordProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
