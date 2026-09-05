import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../../hooks/use-theme.hook';
import PasswordGenerator from '../../screens/password-generator';
import { SCREENS } from '../navigation.constant';
import { createDefaultScreenOptions } from '../shared/navigation.util';
import type { IGeneratorStackParamList } from '../navigation.type';

const Stack = createNativeStackNavigator<IGeneratorStackParamList>();

export function GeneratorStackNavigator(): JSX.Element {
  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={createDefaultScreenOptions(colors)}>
      <Stack.Screen
        name={SCREENS.GENERATOR as 'Generator'}
        component={PasswordGenerator}
        options={{
          title: 'Generator',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
    </Stack.Navigator>
  );
}
