import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsScreen from '../../screens/settings';
import AppearanceScreen from '../../screens/settings/appearance.screen';

import { useTheme } from '../../hooks/use-theme.hook';
import { SCREENS } from '../navigation.constant';
import { createDefaultScreenOptions } from '../shared/navigation.util';
import type { ISettingsStackParamList } from '../navigation.type';

const Stack = createNativeStackNavigator<ISettingsStackParamList>();

export function SettingsStackNavigator(): JSX.Element {
  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={createDefaultScreenOptions(colors)}>
      <Stack.Screen
        name={SCREENS.SETTINGS as 'Settings'}
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerLargeTitle: false,
          headerTitleAlign: 'center',
          headerLargeTitleShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
      <Stack.Screen
        name={SCREENS.APPEARANCE as 'Appearance'}
        component={AppearanceScreen}
        options={{
          title: 'Appearance',
          headerLargeTitle: false,
          headerTitleAlign: 'center',
          headerLargeTitleShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
    </Stack.Navigator>
  );
}
