import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DataScreen from '../../screens/settings/data.screen';
import SecurityScreen from '../../screens/settings/security.screen';
import SettingsScreen from '../../screens/settings';
import SupportScreen from '../../screens/settings/support.screen';

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
        name={SCREENS.SECURITY as 'Security'}
        component={SecurityScreen}
        options={{ title: 'Security' }}
      />
      <Stack.Screen
        name={SCREENS.DATA as 'Data'}
        component={DataScreen}
        options={{ title: 'Data' }}
      />
      <Stack.Screen
        name={SCREENS.SUPPORT as 'Support'}
        component={SupportScreen}
        options={{ title: 'Support' }}
      />
    </Stack.Navigator>
  );
}
