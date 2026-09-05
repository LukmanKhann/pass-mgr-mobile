import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Input } from '../../components/controls/input';
import { ScreenContainer } from '../../components/layouts/screen-container';
import { Typography } from '../../components/widgets/typography';
import MaterialSymbols from '../../components/widgets/material-icon';
import { FIREBASE_AUTH } from '../../Firebase/firebase-config';
import { CustomSnackbar } from '../../global/utils/snackbar.util';
import { MotionView } from '../../motion';

interface IProps {
  navigation: { navigate: (screen: string) => void };
}

export default function LoginScreen({ navigation }: IProps): JSX.Element {
  const { colors, spacing } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
          <MaterialSymbols name="shield_lock" variant="filled" size={80} color={colors.accent} />
          <Typography variant="headingXl" color={colors.textPrimary} align="center">
            SecureVault
          </Typography>
          <Typography variant="bodyMd" color={colors.textSecondary} align="center">
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
            value={email}
            onChangeText={setEmail}
            leftIcon={
              <MaterialSymbols name="mail" size={20} color={colors.textTertiary} />
            }
          />
          <Input
            label="Password"
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            leftIcon={
              <MaterialSymbols name="lock" size={20} color={colors.textTertiary} />
            }
            rightIcon={
              <MaterialSymbols
                name={showPassword ? 'visibility_off' : 'visibility'}
                size={20}
                color={colors.textTertiary}
              />
            }
            onRightIconPress={() => setShowPassword(prev => !prev)}
          />
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
          <Typography variant="bodyMd" color={colors.textSecondary} align="center">
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
