import React from 'react';
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
          headerStyle: { backgroundColor: colors.background },
          headerSearchBarOptions: {
            placeholder: 'Search credentials',
            barTintColor: colors.surface,
            textColor: colors.textPrimary,
            tintColor: colors.surface,
            hintTextColor: isDark ? colors.primary : '#000000',
            headerIconColor: isDark ? colors.primary : '#000000',
            hideWhenScrolling: false,
            autoCapitalize: 'none',
          },
        }}
      />
    </Stack.Navigator>
  );
}
