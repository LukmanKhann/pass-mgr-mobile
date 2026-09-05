import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../../hooks/use-theme.hook';
import SettingsScreen from '../../screens/settings';
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
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
    </Stack.Navigator>
  );
}
