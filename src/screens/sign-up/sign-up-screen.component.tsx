import React, { useState } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Input } from '../../components/controls/input';
import { ScreenContainer } from '../../components/layouts/screen-container';
import { ScrollContainer } from '../../components/layouts/scroll-container';
import { Typography } from '../../components/widgets/typography';
import MaterialSymbols from '../../components/widgets/material-icon';
import { FIREBASE_AUTH } from '../../Firebase/firebase-config';
import { CustomSnackbar } from '../../global/utils/snackbar.util';

interface IProps {
  navigation: { navigate: (screen: string) => void; goBack: () => void };
}

export default function SignUpScreen({ navigation }: IProps): JSX.Element {
  const { colors, spacing } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInputs = (): boolean => {
    if (!name.trim()) {
      CustomSnackbar.info('Please enter your name');
      return false;
    }
    if (!email.trim()) {
      CustomSnackbar.info('Please enter your email');
      return false;
    }
    if (password.length < 6) {
      CustomSnackbar.warning('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      CustomSnackbar.warning('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async (): Promise<void> => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName: name });
      CustomSnackbar.success('Account created successfully!');
    } catch (error) {
      CustomSnackbar.error(`Sign Up Failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (value: string): string => {
    if (value.length === 0) return '';
    if (value.length < 6) return 'Weak';
    if (value.length < 10) return 'Medium';
    return 'Strong';
  };

  return (
    <ScreenContainer>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollContainer contentContainerStyle={styles.scrollContent}>
          <View style={[styles.header, { gap: spacing.sm }]}>
            <MaterialSymbols name="account_circle" size={72} color={colors.accent} />
            <Typography variant="headingXl" color={colors.textPrimary} align="center">
              Create Account
            </Typography>
            <Typography variant="bodyMd" color={colors.textSecondary} align="center">
              Join SecureVault today
            </Typography>
          </View>

          <View style={[styles.form, { gap: spacing.lg }]}>
            <Input
              label="Full name"
              placeholder="Your name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              leftIcon={
                <MaterialSymbols name="person" size={20} color={colors.textTertiary} />
              }
            />
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
            <View style={[styles.field, { gap: spacing.xs }]}>
              <Input
                label="Password"
                placeholder="Password"
                secureTextEntry={!showPassword}
                autoComplete="password-new"
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
              {password.length > 0 ? (
                <Typography variant="caption" color={colors.textTertiary}>
                  Password strength: {getPasswordStrength(password)}
                </Typography>
              ) : null}
            </View>
            <Input
              label="Confirm password"
              placeholder="Confirm password"
              secureTextEntry={!showConfirmPassword}
              autoComplete="password-new"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon={
                <MaterialSymbols name="lock" size={20} color={colors.textTertiary} />
              }
              rightIcon={
                <MaterialSymbols
                  name={showConfirmPassword ? 'visibility_off' : 'visibility'}
                  size={20}
                  color={colors.textTertiary}
                />
              }
              onRightIconPress={() => setShowConfirmPassword(prev => !prev)}
            />
            <Button
              title={loading ? 'Creating Account...' : 'Create Account'}
              onPress={handleSignUp}
              variant="primary"
              fullWidth
              loading={loading}
            />
          </View>

          <View style={[styles.footer, { gap: spacing.xs }]}>
            <Typography variant="bodyMd" color={colors.textSecondary} align="center">
              Already have an account?
            </Typography>
            <Typography
              variant="bodyMd"
              color={colors.accent}
              align="center"
              fontWeight="600"
              onPress={() => navigation.navigate('Login')}
            >
              Sign In
            </Typography>
          </View>
        </ScrollContainer>
      </TouchableWithoutFeedback>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  field: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
});
