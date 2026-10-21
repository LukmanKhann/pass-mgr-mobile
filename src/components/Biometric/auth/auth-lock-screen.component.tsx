import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  AppState,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialSymbols from '../../widgets/material-icon';
import BiometricAuthService from '../service/BiometricAuth';
import NumericPasswordModal from '../components/numeric-password-modal.component';

import { useTheme } from '../../../hooks/use-theme.hook';
import { AppModal } from '../../../components/widgets/modal';
import { Typography } from '../../widgets/typography';
import { CustomSnackbar } from '../../../global/utils/nitro-toast.util';

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
  const { colors, spacing, borderRadius } = useTheme();
  const [showNumericModal, setShowNumericModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [authMethods, setAuthMethods] = useState({
    biometric: false,
    numeric: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: null as (() => void) | null,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasAttemptedBiometricRef = useRef(false);
  const wasBackgroundedRef = useRef(false);
  const promptTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const biometricInFlightRef = useRef(false);
  const pendingBiometricPromptRef = useRef(false);

  useEffect(() => {
    initializeAuth();

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        wasBackgroundedRef.current = true;
        if (promptTimeoutRef.current) {
          clearTimeout(promptTimeoutRef.current);
          promptTimeoutRef.current = null;
        }
        return;
      }

      if (nextAppState === 'active') {
        const shouldRetry =
          wasBackgroundedRef.current || pendingBiometricPromptRef.current;
        wasBackgroundedRef.current = false;
        pendingBiometricPromptRef.current = false;

        if (shouldRetry) {
          setAttempts(0);
          hasAttemptedBiometricRef.current = false;
          initializeAuth();
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
        promptTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const initializeAuth = async () => {
    setIsLoading(true);
    try {
      const [biometricEnabled, hasNumericPassword] = await Promise.all([
        BiometricAuthService.isBiometricEnabled(),
        BiometricAuthService.hasNumericPassword(),
      ]);

      setAuthMethods({
        biometric: biometricEnabled,
        numeric: hasNumericPassword,
      });

      if (!biometricEnabled && !hasNumericPassword) {
        onSetupRequired?.();
        return;
      }

      if (!biometricEnabled && hasNumericPassword) {
        setShowNumericModal(true);
        return;
      }

      if (biometricEnabled && !hasAttemptedBiometricRef.current) {
        hasAttemptedBiometricRef.current = true;
        if (promptTimeoutRef.current) {
          clearTimeout(promptTimeoutRef.current);
        }
        promptTimeoutRef.current = setTimeout(() => {
          promptTimeoutRef.current = null;
          if (AppState.currentState === 'active') {
            handleBiometricAuth();
          } else {
            pendingBiometricPromptRef.current = true;
          }
        }, 500);
      }
    } catch {
      // no-op
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async (): Promise<void> => {
    if (biometricInFlightRef.current) {
      return;
    }
    biometricInFlightRef.current = true;

    try {
      const result = await BiometricAuthService.authenticateWithBiometric(
        'Unlock SecureVault',
        'Use your biometric to unlock the app',
      );

      if (result.success) {
        setTimeout(() => {
          onAuthenticated();
        }, 200);
      } else if (!result.cancelled) {
        setAttempts(prev => prev + 1);
      }
    } catch {
      setAttempts(prev => prev + 1);
    } finally {
      biometricInFlightRef.current = false;
    }
  };

  const handleNumericAuth = async (password: string): Promise<boolean> => {
    try {
      const isValid = await BiometricAuthService.verifyNumericPassword(
        password,
      );

      if (isValid) {
        setShowNumericModal(false);
        setAttempts(0);
        setTimeout(() => {
          onAuthenticated();
        }, 200);
        return true;
      }

      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 5) {
        setModalConfig({
          title: 'Too Many Attempts',
          message:
            'Too many incorrect attempts. Please wait a moment and try again.',
          onConfirm: () => setShowCustomModal(false),
        });
        setShowCustomModal(true);
        setShowNumericModal(false);
      } else {
        const remaining = 5 - nextAttempts;
        CustomSnackbar.error(
          `Invalid PIN. ${remaining} attempt${
            remaining === 1 ? '' : 's'
          } remaining.`,
        );
      }
      return false;
    } catch {
      CustomSnackbar.error('Authentication failed. Please try again.');
      return false;
    }
  };

  const handleUseNumeric = () => {
    setShowNumericModal(true);
  };

  const handleForgotRequest = () => {
    setShowNumericModal(false);
    setShowForgotModal(true);
  };

  const handleForgotConfirm = () => {
    setShowForgotModal(false);
    setShowNumericModal(false);
    onForgotPin();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <View
            style={[
              styles.logoDim,
              { backgroundColor: colors.surfaceElevated },
            ]}
          />
          <Typography variant="bodyMd" color={colors.textSecondary}>
            Initializing...
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.logoContainer, { marginTop: spacing.xxl }]}>
        <View
          style={[
            styles.logo,
            {
              backgroundColor: colors.surfaceElevated,
              borderRadius: borderRadius.full,
            },
          ]}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <MaterialSymbols
              name="shield_lock"
              variant="filled"
              size={40}
              color={colors.accent}
            />
          </Animated.View>
        </View>
        <Typography variant="headingXl" color={colors.textPrimary}>
          SecureVault
        </Typography>
        <Typography variant="bodyMd" color={colors.textSecondary}>
          Your passwords, secured
        </Typography>
      </View>
      <View style={[styles.authContainer, { paddingHorizontal: spacing.xl }]}>
        <Typography variant="headingMd" color={colors.textPrimary}>
          Welcome Back
        </Typography>
        <Typography
          variant="bodyMd"
          color={colors.textSecondary}
          align="center"
        >
          Unlock your vault to access your passwords
        </Typography>
        {authMethods.biometric && (
          <TouchableOpacity
            style={[
              styles.biometricButton,
              {
                backgroundColor: colors.accent,
                borderRadius: borderRadius.md,
              },
            ]}
            onPress={handleBiometricAuth}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Unlock with biometrics"
          >
            <Typography variant="buttonMd" color={colors.textOnAccent}>
              Unlock with Biometrics
            </Typography>
          </TouchableOpacity>
        )}
        {authMethods.numeric && (
          <View style={[styles.helpContainer, { padding: spacing.md }]}>
            <Typography variant="bodyMd" color={colors.textSecondary}>
              {authMethods.biometric
                ? 'Having trouble with biometric authentication?'
                : 'Use your PIN to unlock your vault'}
            </Typography>
            <TouchableOpacity
              style={[
                styles.helpButton,
                {
                  backgroundColor: colors.accent,
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={handleUseNumeric}
            >
              <Typography variant="buttonMd" color={colors.textOnAccent}>
                {authMethods.biometric ? 'Use Numeric Password' : 'Enter PIN'}
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <NumericPasswordModal
        visible={showNumericModal}
        onClose={() => setShowNumericModal(false)}
        onSuccess={handleNumericAuth}
        onForgot={handleForgotRequest}
        title="Enter Password"
        subtitle="Enter your 4-digit password to unlock"
        mode="verify"
      />
      <AppModal
        visible={showForgotModal}
        title="Forgot your PIN?"
        message="To protect your vault, you'll be signed out. Sign in with your account and set a new PIN."
        confirmTitle="Sign out"
        cancelTitle="Cancel"
        confirmVariant="danger"
        onClose={() => setShowForgotModal(false)}
        onConfirm={handleForgotConfirm}
      />
      <AppModal
        visible={showCustomModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setShowCustomModal(false)}
        onConfirm={modalConfig.onConfirm ?? undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoDim: {
    width: 40,
    height: 40,
    borderRadius: 9999,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 4,
  },
  logo: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  helpContainer: {
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  helpButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  biometricButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
});
