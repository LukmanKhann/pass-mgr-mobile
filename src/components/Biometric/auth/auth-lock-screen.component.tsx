import React, { useState, useEffect } from 'react';
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
}

export default function AuthLockScreen({
  onAuthenticated,
  onSetupRequired,
}: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const [showNumericModal, setShowNumericModal] = useState(false);
  const [biometryType, setBiometryType] = useState('Biometric');
  const [authMethods, setAuthMethods] = useState({
    biometric: false,
    numeric: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [hasAttemptedBiometric, setHasAttemptedBiometric] = useState(false);
  const [showBiometricCancelled, setShowBiometricCancelled] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: null as (() => void) | null,
  });
  const fadeAnim = new Animated.Value(0);
  const shakeAnim = new Animated.Value(0);

  useEffect(() => {
    initializeAuth();

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setAttempts(0);
        setHasAttemptedBiometric(false);
        setShowBiometricCancelled(false);
        initializeAuth();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    try {
      const [biometricEnabled, hasNumericPassword, biometryTypeResult] =
        await Promise.all([
          BiometricAuthService.isBiometricEnabled(),
          BiometricAuthService.hasNumericPassword(),
          BiometricAuthService.getBiometryType(),
        ]);

      setAuthMethods({
        biometric: biometricEnabled,
        numeric: hasNumericPassword,
      });
      setBiometryType(biometryTypeResult);

      if (!biometricEnabled && !hasNumericPassword) {
        onSetupRequired?.();
        return;
      }

      if (biometricEnabled && !hasAttemptedBiometric) {
        setHasAttemptedBiometric(true);
        setTimeout(() => {
          handleBiometricAuth();
        }, 500);
      }
    } catch (error) {
      // no-op
    } finally {
      setIsLoading(false);
    }
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBiometricAuth = async (
    isCancelled: boolean = false,
  ): Promise<void> => {
    if (isCancelled) {
      setShowBiometricCancelled(true);
      return;
    }

    try {
      const result = await BiometricAuthService.authenticateWithBiometric(
        'Unlock SecureVault',
        'Use your biometric to unlock the app',
      );

      if (result.success) {
        setShowBiometricCancelled(false);
        setTimeout(() => {
          onAuthenticated();
        }, 200);
      } else {
        setAttempts(prev => prev + 1);
        if (authMethods.numeric) {
          setShowBiometricCancelled(true);
        }
      }
    } catch (error) {
      setAttempts(prev => prev + 1);
      if (authMethods.numeric) {
        setShowBiometricCancelled(true);
      }
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
        setShowBiometricCancelled(false);
        setTimeout(() => {
          onAuthenticated();
        }, 200);
        return true;
      } else {
        setAttempts(prev => prev + 1);

        if (attempts >= 4) {
          setModalConfig({
            title: 'Too Many Attempts',
            message: 'Please try again later or contact support.',
            onConfirm: () => setShowCustomModal(false),
          });
          setShowCustomModal(true);
        } else {
          CustomSnackbar.error(
            `Invalid password. ${5 - attempts - 1} attempts remaining.`,
          );
        }
        return false;
      }
    } catch (error) {
      CustomSnackbar.error('Authentication failed. Please try again.');
      return false;
    }
  };

  const handleUseNumeric = () => {
    setShowBiometricCancelled(false);
    setShowNumericModal(true);
  };

  const handleRetryBiometric = () => {
    setShowBiometricCancelled(false);
    handleBiometricAuth();
  };

  const handleForgotPassword = () => {
    setTimeout(async () => {
      try {
        await BiometricAuthService.setBiometricEnabled(false);
        await BiometricAuthService.setNumericPassword('');
        setTimeout(() => {
          onSetupRequired?.();
        }, 1000);
      } catch (error) {
        // no-op
      }
    }, 2000);
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
        {authMethods.numeric && !showBiometricCancelled && (
          <View style={[styles.helpContainer, { padding: spacing.md }]}>
            <Typography variant="bodyMd" color={colors.textSecondary}>
              Having trouble with biometric authentication?
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
                Use Numeric Password
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <NumericPasswordModal
        visible={showNumericModal}
        onClose={() => setShowNumericModal(false)}
        onSuccess={(password: string) => void handleNumericAuth(password)}
        onForgot={handleForgotPassword}
        title="Enter Password"
        subtitle="Enter your 4-digit password to unlock"
        mode="verify"
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
});
