import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppModal } from '../../widgets/modal';
import { useTheme } from '../../../hooks/use-theme.hook';
import { PinUnlockSheet } from './components/pin-unlock-sheet.component';
import { LockActions } from './components/lock-actions.component';
import { LockScreenHero } from './components/lock-screen-hero.component';
import { LockScreenLoading } from './components/lock-screen-loading.component';
import { useAuthLock } from './hooks/use-auth-lock.hook';
import {
  LIMIT_REACHED_MESSAGE,
  LIMIT_REACHED_TITLE,
} from './constants/auth-lock.constant';

interface IProps {
  onAuthenticated: () => void;
  onSetupRequired: () => void;
  onForgotPin: () => Promise<void> | void;
}

export default function AuthLockScreen({
  onAuthenticated,
  onSetupRequired,
  onForgotPin,
}: IProps): JSX.Element {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    isLoading,
    authMethods,
    showPinSheet,
    showForgotModal,
    showLimitModal,
    handleBiometricAuth,
    handleUsePin,
    handleClosePinSheet,
    handleVerifyPin,
    handlePinSheetDismissed,
    handleForgotRequest,
    handleCloseForgotModal,
    handleForgotConfirm,
    handleCloseLimitModal,
  } = useAuthLock({ onAuthenticated, onSetupRequired, onForgotPin });

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
        onBiometricPress={handleBiometricAuth}
        onPinPress={handleUsePin}
      />

      <PinUnlockSheet
        visible={showPinSheet}
        onClose={handleClosePinSheet}
        onVerify={handleVerifyPin}
        onForgot={handleForgotRequest}
        onDismissed={handlePinSheetDismissed}
      />

      <AppModal
        visible={showForgotModal}
        title="Forgot your PIN?"
        message="To protect your vault, you'll be signed out. Sign in with your account and set a new PIN."
        confirmTitle="Sign out"
        cancelTitle="Cancel"
        confirmVariant="danger"
        onClose={handleCloseForgotModal}
        onConfirm={handleForgotConfirm}
      />

      <AppModal
        visible={showLimitModal}
        title={LIMIT_REACHED_TITLE}
        message={LIMIT_REACHED_MESSAGE}
        cancelTitle="OK"
        onClose={handleCloseLimitModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
