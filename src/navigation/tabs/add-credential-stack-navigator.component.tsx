import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddPasswordScreen from '../../screens/add-password/add-password-screen.component';

import { useTheme } from '../../hooks/use-theme.hook';
import { createDefaultScreenOptions } from '../shared/navigation.util';

type IAddCredentialStackParamList = {
  AddCredential: undefined;
};

const Stack = createNativeStackNavigator<IAddCredentialStackParamList>();

export function AddCredentialStackNavigator(): JSX.Element {
  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={createDefaultScreenOptions(colors)}>
      <Stack.Screen
        name="AddCredential"
        component={AddPasswordScreen}
        options={{
          title: 'Add Credential',
          headerLargeTitle: false,
          headerTitleAlign: 'center',
          headerLargeTitleShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
    </Stack.Navigator>
  );
}
