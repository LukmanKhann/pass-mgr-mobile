import React, { useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '../hooks/use-theme.hook';
import MaterialSymbols from '../components/widgets/material-icon';
import { AuthContext } from '../Auth/AuthContext';
import LoadingScreen from '../screens/loading/loading-screen.component';
import LoginScreen from '../screens/login/login-screen.component';
import SignUpScreen from '../screens/sign-up/sign-up-screen.component';
import PasswordListScreen from '../screens/password-list';
import AddPasswordScreen from '../screens/add-password/add-password-screen.component';
import PasswordGenerator from '../screens/password-generator';
import SettingsScreen from '../screens/settings';
import { SCREENS } from './navigation.constant';
import type { IAuthStackParamList, IMainTabParamList } from './navigation.type';

const Stack = createNativeStackNavigator<IAuthStackParamList>();
const Tab = createBottomTabNavigator<IMainTabParamList>();

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

function TabNavigator(): JSX.Element {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tab.Screen
        name={SCREENS.VAULT_TAB}
        component={PasswordListScreen}
        options={{
          title: 'Vault',
          tabBarLabel: 'Vault',
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialSymbols name="shield_lock" variant="filled" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.ADD_CREDENTIAL_TAB}
        component={AddPasswordScreen}
        options={{
          title: 'Credentials',
          tabBarLabel: 'Add',
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialSymbols name="add" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.GENERATOR_TAB}
        component={PasswordGenerator}
        options={{
          title: 'Generator',
          tabBarLabel: 'Generator',
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialSymbols name="verified_user" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.SETTINGS_TAB}
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialSymbols name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigatorInner(): JSX.Element {
  const { user } = useContext(AuthContext);
  const navigationRef = useRef(null);
  const [navState, setNavState] = useState<unknown>(undefined);

  useEffect(() => {
    const restoreState = async (): Promise<void> => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;
        if (state) setNavState(state);
      } catch (error) {
        // ignore restore errors
      }
    };
    restoreState();
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={navState as never}
      onStateChange={(state: unknown) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      {user ? (
        <TabNavigator />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name={SCREENS.LOGIN}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREENS.SIGN_UP}
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function AppNavigator(): JSX.Element {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return <AppNavigatorInner />;
}
