import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import React from 'react';
import { Platform } from 'react-native';

import { useTheme } from '../../hooks/use-theme.hook';
import AddPasswordScreen from '../../screens/add-password/add-password-screen.component';
import { SCREENS } from '../navigation.constant';
import type { IMainTabParamList } from '../navigation.type';
import { VaultStackNavigator } from './vault-stack-navigator.component';
import { GeneratorStackNavigator } from './generator-stack-navigator.component';
import { SettingsStackNavigator } from './settings-stack-navigator.component';

const Tab = createNativeBottomTabNavigator<IMainTabParamList>();

/**
 * SF Symbol names (iOS) and Android drawable URI names for each tab.
 * Android URIs map to Material Design icon names bundled with the
 * react-native-bottom-tabs native module.
 */
const TAB_ICONS: Record<string, { sfSymbol: string; androidUri: string }> = {
  [SCREENS.VAULT_TAB]: {
    sfSymbol: 'lock.shield.fill',
    androidUri: 'shield_lock',
  },
  [SCREENS.ADD_CREDENTIAL_TAB]: {
    sfSymbol: 'plus.circle.fill',
    androidUri: 'add_circle',
  },
  [SCREENS.GENERATOR_TAB]: {
    sfSymbol: 'checkmark.shield.fill',
    androidUri: 'verified_user',
  },
  [SCREENS.SETTINGS_TAB]: {
    sfSymbol: 'gearshape.fill',
    androidUri: 'settings',
  },
};

export function BottomTabNavigator(): JSX.Element {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
      }}
    >
      <Tab.Screen
        name={SCREENS.VAULT_TAB as 'VaultTab'}
        component={VaultStackNavigator}
        options={{
          tabBarLabel: 'Vault',
          tabBarIcon: () =>
            Platform.select({
              ios: { sfSymbol: TAB_ICONS[SCREENS.VAULT_TAB].sfSymbol },
              default: { uri: TAB_ICONS[SCREENS.VAULT_TAB].androidUri },
            }),
        }}
      />
      <Tab.Screen
        name={SCREENS.ADD_CREDENTIAL_TAB as 'AddCredentialTab'}
        component={AddPasswordScreen}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: () =>
            Platform.select({
              ios: { sfSymbol: TAB_ICONS[SCREENS.ADD_CREDENTIAL_TAB].sfSymbol },
              default: { uri: TAB_ICONS[SCREENS.ADD_CREDENTIAL_TAB].androidUri },
            }),
        }}
      />
      <Tab.Screen
        name={SCREENS.GENERATOR_TAB as 'GeneratorTab'}
        component={GeneratorStackNavigator}
        options={{
          tabBarLabel: 'Generator',
          tabBarIcon: () =>
            Platform.select({
              ios: { sfSymbol: TAB_ICONS[SCREENS.GENERATOR_TAB].sfSymbol },
              default: { uri: TAB_ICONS[SCREENS.GENERATOR_TAB].androidUri },
            }),
        }}
      />
      <Tab.Screen
        name={SCREENS.SETTINGS_TAB as 'SettingsTab'}
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: () =>
            Platform.select({
              ios: { sfSymbol: TAB_ICONS[SCREENS.SETTINGS_TAB].sfSymbol },
              default: { uri: TAB_ICONS[SCREENS.SETTINGS_TAB].androidUri },
            }),
        }}
      />
    </Tab.Navigator>
  );
}
