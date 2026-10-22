import React, { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import MaterialSymbols from '../../components/widgets/material-icon';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { ScreenContainer } from '../../components/layouts/screen-container';
import { Typography } from '../../components/widgets/typography';
import { CustomSnackbar } from '../../global/utils/toast.util';
import { MotionView } from '../../motion';
import { SCREENS } from '../../navigation/navigation.constant';
import type { IAuthStackParamList } from '../../navigation/navigation.type';
import {
  mapPasswordResetError,
  RESEND_COOLDOWN_SECONDS,
  requestPasswordReset,
} from './password-reset.util';

type Props = NativeStackScreenProps<IAuthStackParamList, 'ResetPassword'>;

const MAIL_APP_URL_IOS = 'message://';
const MAIL_APP_URL_ANDROID = 'mailto:';

export default function ResetPasswordScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const { colors, spacing } = useTheme();
  const email = route.params?.email ?? '';

  const [resendInSeconds, setResendInSeconds] = useState(
    RESEND_COOLDOWN_SECONDS,
  );
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendInSeconds === 0) return undefined;
    const timer = setTimeout(
      () => setResendInSeconds(previous => Math.max(0, previous - 1)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [resendInSeconds]);

  const handleResend = async (): Promise<void> => {
    if (!email || resendInSeconds > 0 || resending) return;

    setResending(true);
    try {
      await requestPasswordReset(email);
      CustomSnackbar.success('Reset link sent again!');
      setResendInSeconds(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      CustomSnackbar.error(mapPasswordResetError(error));
    } finally {
      setResending(false);
    }
  };

  const handleOpenMailApp = async (): Promise<void> => {
    const mailUrl =
      Platform.OS === 'ios' ? MAIL_APP_URL_IOS : MAIL_APP_URL_ANDROID;
    try {
      await Linking.openURL(mailUrl);
    } catch {
      CustomSnackbar.error('Could not open your mail app');
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
          <MaterialSymbols
            name="mark_email_read"
            size={72}
            color={colors.accent}
          />
          <Typography
            variant="headingXl"
            color={colors.textPrimary}
            align="center"
          >
            Check your inbox
          </Typography>
          <Typography
            variant="bodyMd"
            color={colors.textSecondary}
            align="center"
          >
            {email
              ? `We sent a password reset link to ${email}`
              : 'We sent a password reset link to your email'}
          </Typography>
        </MotionView>

        <MotionView
          enter="fade-up"
          transition={{ duration: 'gentle', delay: 140 }}
          style={[styles.instructions, { gap: spacing.sm }]}
        >
          <Typography variant="bodyMd" color={colors.textPrimary}>
            1. Open the email and tap the reset link
          </Typography>
          <Typography variant="bodyMd" color={colors.textPrimary}>
            2. Enter and confirm your new password
          </Typography>
          <Typography variant="bodyMd" color={colors.textPrimary}>
            3. Come back here and sign in with the new password
          </Typography>
          <Typography variant="caption" color={colors.textTertiary}>
            Didn&apos;t receive it? Check your spam folder.
          </Typography>
        </MotionView>

        <MotionView
          enter="fade-up"
          transition={{ duration: 'gentle', delay: 200 }}
          style={[styles.actions, { gap: spacing.md }]}
        >
          <Button
            title="Open Mail App"
            onPress={() => {
              void handleOpenMailApp();
            }}
            variant="primary"
            fullWidth
            icon={
              <MaterialSymbols
                name="open_in_new"
                size={20}
                color={colors.textOnPrimary}
              />
            }
          />
          <Button
            title={
              resendInSeconds > 0
                ? `Resend Link (${resendInSeconds}s)`
                : 'Resend Link'
            }
            onPress={() => {
              void handleResend();
            }}
            variant="outline"
            fullWidth
            disabled={resendInSeconds > 0 || resending || !email}
            loading={resending}
          />
        </MotionView>

        <MotionView
          enter="fade"
          transition={{ duration: 'fast', delay: 280 }}
          style={[styles.footer, { gap: spacing.xs }]}
        >
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
  instructions: {
    width: '100%',
  },
  actions: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
});
