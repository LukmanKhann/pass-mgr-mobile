import React, { useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../hooks/use-theme.hook';
import type { IColorTokens } from '../theme/colors.theme';
import { AuthContext } from '../Auth/AuthContext';
import LoadingScreen from '../screens/loading/loading-screen.component';
import LoginScreen from '../screens/login/login-screen.component';
import SignUpScreen from '../screens/sign-up/sign-up-screen.component';
import { BottomTabNavigator } from './tabs/bottom-tab-navigator.component';
import { SCREENS } from './navigation.constant';
import { createAuthScreenOptions } from './shared/navigation.util';
import type { IAuthStackParamList } from './navigation.type';

const AuthStack = createNativeStackNavigator<IAuthStackParamList>();

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

function getNavigationTheme(
  isDark: boolean,
  colors: IColorTokens,
): NavigationTheme {
  const base = isDark ? NavigationDarkTheme : NavigationDefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.error,
    },
  };
}

function AppNavigatorInner(): JSX.Element {
  const { user } = useContext(AuthContext);
  const { colors, isDark } = useTheme();
  const navigationRef = useRef(null);
  const [navState, setNavState] = useState<unknown>(undefined);

  useEffect(() => {
    const restoreState = async (): Promise<void> => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;
        if (state) {
          setNavState(state);
        }
      } catch {
        // ignore restore errors
      }
    };
    restoreState();
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={navState as never}
      theme={getNavigationTheme(isDark, colors)}
      onStateChange={(state: unknown) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      {user ? (
        <BottomTabNavigator />
      ) : (
        <AuthStack.Navigator screenOptions={createAuthScreenOptions(colors)}>
          <AuthStack.Screen
            name={SCREENS.LOGIN as 'Login'}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <AuthStack.Screen
            name={SCREENS.SIGN_UP as 'SignUp'}
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function AppNavigator(): JSX.Element {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return <AppNavigatorInner />;
}
