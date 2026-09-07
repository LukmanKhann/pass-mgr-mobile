import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../hooks/use-theme.hook';
import MaterialSymbols from '../../components/widgets/material-icon';
import { Typography } from '../../components/widgets/typography';
import { PinCircles } from '../../components/Biometric/components/pin-circles.component';
import { NumericKeypad } from '../../components/Biometric/components/numeric-keypad.component';
import BiometricAuthService from '../../components/Biometric/service/BiometricAuth';
import { CustomSnackbar } from '../../global/utils/nitro-toast.util';
import type { ISettingsStackParamList } from '../../navigation/navigation.type';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<ISettingsStackParamList, 'NumericPassword'>;

export default function NumericPasswordScreen({
  navigation,
  route,
}: Props): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const mode = (route.params?.mode as 'verify' | 'set') || 'verify';
  const title =
    route.params?.title || (mode === 'set' ? 'Set Password' : 'Enter Password');
  const subtitle =
    route.params?.subtitle ||
    (mode === 'set'
      ? 'Create a 4-digit password'
      : 'Enter your 4-digit password');
  const maxLength = 4;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    setPassword('');
    setConfirmPassword('');
    setIsConfirmMode(false);
    setAttempts(0);
  }, [mode]);

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setIsConfirmMode(false);
    setAttempts(0);
  };

  const handleBackspace = () => {
    if (mode === 'set' && isConfirmMode) {
      if (confirmPassword.length > 0) {
        setConfirmPassword(confirmPassword.slice(0, -1));
      } else {
        setIsConfirmMode(false);
        setPassword('');
      }
    } else {
      if (password.length > 0) {
        setPassword(password.slice(0, -1));
      }
    }
  };

  const handlePasswordChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (mode === 'set' && isConfirmMode) {
      if (numericText.length <= maxLength) {
        setConfirmPassword(numericText);
        if (numericText.length === maxLength) {
          setTimeout(() => handleSubmit(numericText, true), 100);
        }
      }
    } else {
      if (numericText.length <= maxLength) {
        setPassword(numericText);
        if (numericText.length === maxLength) {
          setTimeout(() => handleSubmit(numericText, false), 100);
        }
      }
    }
  };

  const handleSubmit = async (
    inputPassword: string = '',
    isConfirm: boolean = false,
  ) => {
    if (mode === 'set') {
      if (!isConfirmMode && inputPassword.length === maxLength) {
        setIsConfirmMode(true);
        setPassword('');
        return;
      }
      if (isConfirmMode && confirmPassword.length === maxLength) {
        if (password === confirmPassword) {
          try {
            const success = await BiometricAuthService.setNumericPassword(
              password,
            );
            if (success) {
              CustomSnackbar.success('Password set successfully');
              navigation.goBack();
            } else {
              CustomSnackbar.error('Failed to set password');
            }
          } catch {
            CustomSnackbar.error('Failed to set password');
          }
        } else {
          setConfirmPassword('');
          setPassword('');
          setIsConfirmMode(false);
          setAttempts(a => a + 1);
        }
      }
    } else {
      try {
        const success = await BiometricAuthService.verifyNumericPassword(
          inputPassword || password,
        );
        if (success) {
          CustomSnackbar.success('Verified');
          navigation.goBack();
        } else {
          CustomSnackbar.error('Incorrect password');
          setPassword('');
          setAttempts(a => a + 1);
        }
      } catch {
        CustomSnackbar.error('Verification failed');
        setPassword('');
      }
    }
  };

  const getCurrentPassword = () =>
    mode === 'set' && isConfirmMode ? confirmPassword : password;
  const getTitle = () =>
    mode === 'set' && isConfirmMode ? 'Confirm Password' : title;
  const getSubtitle = () =>
    mode === 'set' && isConfirmMode
      ? 'Re-enter your password to confirm'
      : subtitle;

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.md,
          },
        ]}
      >
        <View
          style={[
            styles.headerIcon,
            {
              borderRadius: borderRadius.full,
              backgroundColor: colors.surfaceElevated,
            },
          ]}
        >
          <MaterialSymbols name="lock" size={36} color={colors.accent} />
        </View>
        <Typography
          variant="headingLg"
          color={colors.textPrimary}
          align="center"
        >
          {getTitle()}
        </Typography>
        <Typography
          variant="bodyMd"
          color={colors.textSecondary}
          align="center"
        >
          {getSubtitle()}
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PinCircles
          length={getCurrentPassword().length}
          maxLength={maxLength}
        />
        <NumericKeypad
          value={getCurrentPassword()}
          onChangeText={handlePasswordChange}
          onBackspace={handleBackspace}
          onSubmit={() => handleSubmit()}
          maxLength={maxLength}
          inputRef={inputRef}
        />

        <View
          style={[styles.footer, { gap: spacing.sm, marginTop: spacing.md }]}
        >
          {mode === 'verify' ? (
            <Typography
              variant="bodyMd"
              color={colors.warning}
              align="center"
              onPress={() => navigation.goBack()}
            >
              Forgot Password?
            </Typography>
          ) : null}
          {attempts > 0 ? (
            <Typography
              variant="caption"
              color={colors.textTertiary}
              align="center"
            >
              Attempts: {attempts}
            </Typography>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    position: 'relative',
  },
  headerIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  footer: {
    alignItems: 'center',
  },
});
