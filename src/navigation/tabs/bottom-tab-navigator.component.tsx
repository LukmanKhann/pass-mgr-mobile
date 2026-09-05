import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Platform } from 'react-native';
import React from 'react';

import { useTheme } from '../../hooks/use-theme.hook';
import { SCREENS } from '../navigation.constant';
import { VaultStackNavigator } from './vault-stack-navigator.component';
import { AddCredentialStackNavigator } from './add-credential-stack-navigator.component';
import { GeneratorStackNavigator } from './generator-stack-navigator.component';
import { SettingsStackNavigator } from './settings-stack-navigator.component';

import type { IMainTabParamList } from '../navigation.type';

const Tab = createNativeBottomTabNavigator<IMainTabParamList>();

const getIcon = (name: string) => Icon.getImageSourceSync(name);

export function BottomTabNavigator(): JSX.Element {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      labeled={true}
      disablePageAnimations={Platform.OS === 'ios' ? false : true}
      tabBarActiveTintColor={colors.accent}
      tabBarInactiveTintColor={colors.textSecondary}
      tabBarStyle={{
        backgroundColor: colors.surface,
      }}
    >
      <Tab.Screen
        name={SCREENS.VAULT_TAB as 'VaultTab'}
        component={VaultStackNavigator}
        options={{
          tabBarLabel: 'Vault',
          tabBarIcon: () => getIcon('shield-lock'),
        }}
      />
      <Tab.Screen
        name={SCREENS.ADD_CREDENTIAL_TAB as 'AddCredentialTab'}
        component={AddCredentialStackNavigator}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: () => getIcon('plus-circle'),
        }}
      />
      <Tab.Screen
        name={SCREENS.GENERATOR_TAB as 'GeneratorTab'}
        component={GeneratorStackNavigator}
        options={{
          tabBarLabel: 'Generator',
          tabBarIcon: () => getIcon('shield-check'),
        }}
      />
      <Tab.Screen
        name={SCREENS.SETTINGS_TAB as 'SettingsTab'}
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: () => getIcon('cog'),
        }}
      />
    </Tab.Navigator>
  );
}
