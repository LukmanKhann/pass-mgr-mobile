import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PasswordListScreen from '../../screens/password-list';

import { useTheme } from '../../hooks/use-theme.hook';
import { SCREENS } from '../navigation.constant';
import { createDefaultScreenOptions } from '../shared/navigation.util';
import type { IVaultStackParamList } from '../navigation.type';

const Stack = createNativeStackNavigator<IVaultStackParamList>();

export function VaultStackNavigator(): JSX.Element {
  const { colors, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={createDefaultScreenOptions(colors)}>
      <Stack.Screen
        name={SCREENS.VAULT as 'Vault'}
        component={PasswordListScreen}
        options={{
          title: 'Vault',
          headerLargeTitle: false,
          headerTitleAlign: 'center',
          headerLargeTitleShadowVisible: false,
          // ── Native search bar (replaces the custom JS TextInput SearchBar) ──
          headerSearchBarOptions: {
            placeholder: 'Search credentials',
            barTintColor: colors.surface,
            textColor: colors.textPrimary,
            tintColor: colors.accent,
            hintTextColor: colors.textTertiary,
            headerIconColor: colors.accent,
            // Keeps list visible while typing on iOS
            hideWhenScrolling: false,
            autoCapitalize: 'none',
          },
          // Glass-blur header on iOS; plain surface on Android
          ...Platform.select({
            ios: {
              headerTransparent: true,
              headerBlurEffect: isDark ? 'dark' : 'light',
            },
            android: {
              headerStyle: { backgroundColor: colors.background },
            },
          }),
        }}
      />
    </Stack.Navigator>
  );
}
