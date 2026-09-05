import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import type { IColorTokens } from '../../theme/colors.theme';

export function createDefaultScreenOptions(
  colors: IColorTokens,
): NativeStackNavigationOptions {
  return {
    headerShown: true,
    animation: 'slide_from_right',
    contentStyle: { backgroundColor: colors.background },
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.accent,
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal',
  };
}

export function createNoHeaderScreenOptions(
  colors: IColorTokens,
): NativeStackNavigationOptions {
  return {
    headerShown: false,
    animation: 'slide_from_right',
    contentStyle: { backgroundColor: colors.background },
  };
}

export function createAuthScreenOptions(
  colors: IColorTokens,
): NativeStackNavigationOptions {
  return {
    headerShown: false,
    animation: 'slide_from_right',
    contentStyle: { backgroundColor: colors.background },
  };
}

export function createModalScreenOptions(
  colors: IColorTokens,
): NativeStackNavigationOptions {
  return {
    headerShown: true,
    presentation: 'modal',
    animation: 'slide_from_bottom',
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.accent,
    headerShadowVisible: false,
  };
}
