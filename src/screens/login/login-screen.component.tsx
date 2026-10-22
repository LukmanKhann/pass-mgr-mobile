import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import MaterialSymbols from '../../components/widgets/material-icon';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Input } from '../../components/controls/input';
import { ScreenContainer } from '../../components/layouts/screen-container';
import { Typography } from '../../components/widgets/typography';
import { FIREBASE_AUTH } from '../../Firebase/firebase-config';
import { CustomSnackbar } from '../../global/utils/toast.util';
import { MotionView } from '../../motion';
import { SCREENS } from '../../navigation/navigation.constant';
import type { IAuthStackParamList } from '../../navigation/navigation.type';

type Props = NativeStackScreenProps<IAuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props): JSX.Element {
  const { colors, spacing } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const mailIcon = useMemo(
    () => <MaterialSymbols name="mail" size={20} color={colors.textTertiary} />,
    [colors.textTertiary],
  );
  const lockIcon = useMemo(
    () => <MaterialSymbols name="lock" size={20} color={colors.textTertiary} />,
    [colors.textTertiary],
  );
  const visibilityIcon = useMemo(
    () => (
      <MaterialSymbols
        name={showPassword ? 'visibility_off' : 'visibility'}
        size={20}
        color={colors.textTertiary}
      />
    ),
    [showPassword, colors.textTertiary],
  );
  const togglePassword = useCallback(
    () => setShowPassword(previous => !previous),
    [],
  );

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      CustomSnackbar.warning('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      CustomSnackbar.success('Login successful! Redirecting...');
    } catch {
      CustomSnackbar.error('Login Failed: Check your email and password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { gap: spacing.xl }]}>
        <MotionView
          enter="fade-down"
          transition={{ type: 'spring', spring: 'snappy', delay: 40 }}
          style={[styles.logoContainer, { gap: spacing.sm }]}
        >
          <MaterialSymbols
            name="shield_lock"
            variant="filled"
            size={80}
            color={colors.accent}
          />
          <Typography
            variant="headingXl"
            color={colors.textPrimary}
            align="center"
          >
            SecureVault
          </Typography>
          <Typography
            variant="bodyMd"
            color={colors.textSecondary}
            align="center"
          >
            Your passwords, protected
          </Typography>
        </MotionView>

        <MotionView
          enter="fade-up"
          transition={{ duration: 'gentle', delay: 140 }}
          style={[styles.formContainer, { gap: spacing.lg }]}
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
            leftIcon={mailIcon}
          />
          <Input
            label="Password"
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            leftIcon={lockIcon}
            rightIcon={visibilityIcon}
            onRightIconPress={togglePassword}
          />
          <Typography
            variant="bodyMd"
            color={colors.accent}
            align="right"
            fontWeight="600"
            onPress={() => navigation.navigate(SCREENS.FORGOT_PASSWORD)}
          >
            Forgot Password?
          </Typography>
          <Button
            title={loading ? 'Signing in...' : 'Sign In'}
            onPress={handleLogin}
            variant="primary"
            fullWidth
            loading={loading}
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
            Don&apos;t have an account?
          </Typography>
          <Typography
            variant="bodyMd"
            color={colors.accent}
            align="center"
            fontWeight="600"
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign Up
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
  logoContainer: {
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
});
