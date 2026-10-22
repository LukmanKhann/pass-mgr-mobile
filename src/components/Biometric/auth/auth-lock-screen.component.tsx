import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/use-theme.hook';
import { LockActions } from './components/lock-actions.component';
import { LockScreenHero } from './components/lock-screen-hero.component';
import { LockScreenLoading } from './components/lock-screen-loading.component';
import { useAuthLock } from './hooks/use-auth-lock.hook';

interface IProps {
  onAuthenticated: () => void;
  onSetupRequired: () => void;
}

export default function AuthLockScreen({
  onAuthenticated,
  onSetupRequired,
}: IProps): JSX.Element {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    isLoading,
    authMethods,
    handleBiometricAuth,
  } = useAuthLock({ onAuthenticated, onSetupRequired });

  if (isLoading) {
    return <LockScreenLoading />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <LockScreenHero />
      <LockActions
        authMethods={authMethods}
        onBiometricPress={() => {
          void handleBiometricAuth();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
