import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import MaterialSymbols from '../../components/widgets/material-icon';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Input } from '../../components/controls/input';
import { ScreenContainer } from '../../components/layouts/screen-container';
import { Typography } from '../../components/widgets/typography';
import { CustomSnackbar } from '../../global/utils/toast.util';
import { MotionView } from '../../motion';
import { SCREENS } from '../../navigation/navigation.constant';
import type { IAuthStackParamList } from '../../navigation/navigation.type';
import {
  mapPasswordResetError,
  RESET_EMAIL_PATTERN,
  requestPasswordReset,
} from './password-reset.util';

type Props = NativeStackScreenProps<IAuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({
  navigation,
}: Props): JSX.Element {
  const { colors, spacing } = useTheme();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [sending, setSending] = useState(false);

  const isValidEmail = useMemo(
    () => RESET_EMAIL_PATTERN.test(email.trim()),
    [email],
  );

  const handleEmailBlur = useCallback(() => setEmailTouched(true), []);

  const emailError =
    emailTouched && !isValidEmail ? 'Enter a valid email address' : undefined;

  const mailIcon = useMemo(
    () => <MaterialSymbols name="mail" size={20} color={colors.textTertiary} />,
    [colors.textTertiary],
  );

  const handleSend = async (): Promise<void> => {
    if (!isValidEmail) {
      CustomSnackbar.warning('Please enter a valid email address');
      return;
    }

    setSending(true);
    try {
      await requestPasswordReset(email);
      navigation.navigate(SCREENS.RESET_PASSWORD as 'ResetPassword', {
        email: email.trim(),
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'auth/user-not-found'
      ) {
        // Do not reveal whether the account exists (anti-enumeration).
        navigation.navigate(SCREENS.RESET_PASSWORD as 'ResetPassword', {
          email: email.trim(),
        });
        return;
      }
      CustomSnackbar.error(mapPasswordResetError(error));
    } finally {
      setSending(false);
    }
  };

  const handleBackToSignIn = (): void => {
    navigation.navigate(SCREENS.LOGIN as 'Login');
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { gap: spacing.xl }]}>
        <MotionView
          enter="fade-down"
          transition={{ type: 'spring', spring: 'snappy', delay: 40 }}
          style={[styles.header, { gap: spacing.sm }]}
        >
          <MaterialSymbols name="lock_reset" size={72} color={colors.accent} />
          <Typography
            variant="headingXl"
            color={colors.textPrimary}
            align="center"
          >
            Forgot Password
          </Typography>
          <Typography
            variant="bodyMd"
            color={colors.textSecondary}
            align="center"
          >
            Enter your email and we&apos;ll send you a reset link
          </Typography>
        </MotionView>

        <MotionView
          enter="fade-up"
          transition={{ duration: 'gentle', delay: 140 }}
          style={[styles.form, { gap: spacing.lg }]}
        >
          <Input
            label="Email address"
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            spellCheck={false}
            value={email}
            onChangeText={setEmail}
            onBlur={handleEmailBlur}
            error={emailError}
            leftIcon={mailIcon}
          />
          <Button
            title={sending ? 'Sending...' : 'Send Reset Link'}
            onPress={() => {
              void handleSend();
            }}
            variant="primary"
            fullWidth
            loading={sending}
          />
        </MotionView>

        <MotionView
          enter="fade"
          transition={{ duration: 'fast', delay: 220 }}
          style={[styles.footer, { gap: spacing.xs }]}
        >
          <Typography
            variant="bodyMd"
            color={colors.textSecondary}
            align="center"
          >
            Remembered your password?
          </Typography>
          <Typography
            variant="bodyMd"
            color={colors.accent}
            align="center"
            fontWeight="600"
            onPress={handleBackToSignIn}
          >
            Back to Sign In
          </Typography>
        </MotionView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  form: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
});
