import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import BiometricAuthService from '../../../components/Biometric/service/BiometricAuth';
import { DEFAULT_AUTO_LOCK_MINUTES } from '../../../components/Biometric/auto-lock.constants';

import { CustomSnackbar } from '../../../global/utils/toast.util';

export function useSecuritySettings() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState('Biometric');
  const [hasNumericPassword, setHasNumericPassword] = useState(false);
  const [autoLockTimeout, setAutoLockTimeout] = useState(
    DEFAULT_AUTO_LOCK_MINUTES,
  );
  const [loading, setLoading] = useState(true);

  const loadSecurityState = useCallback(async (showLoading: boolean) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const [
        biometricEnabledStatus,
        biometricAvailability,
        biometryTypeResult,
        numericPasswordStatus,
        autoLockTimeoutStatus,
      ] = await Promise.all([
        BiometricAuthService.isBiometricEnabled(),
        BiometricAuthService.isBiometricAvailable(),
        BiometricAuthService.getBiometryType(),
        BiometricAuthService.hasNumericPassword(),
        BiometricAuthService.getAutoLockTimeout(),
      ]);
      setBiometricEnabled(biometricEnabledStatus);
      setBiometricAvailable(biometricAvailability.available);
      setBiometryType(biometryTypeResult);
      setHasNumericPassword(numericPasswordStatus);
      setAutoLockTimeout(autoLockTimeoutStatus);
    } catch {
      if (showLoading) {
        CustomSnackbar.error('Failed to load security settings.');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  const initializeSettings = useCallback(
    () => loadSecurityState(true),
    [loadSecurityState],
  );

  const refreshSettings = useCallback(
    () => loadSecurityState(false),
    [loadSecurityState],
  );

  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  const handleBiometricToggle = useCallback(
    async (enabled: boolean, suppressSnackbar: boolean = false) => {
      try {
        if (enabled && !hasNumericPassword) {
          Alert.alert(
            'Numeric Password Required',
            'You must set up a numeric password before enabling biometric authentication.',
            [{ text: 'OK', style: 'default' }],
          );
          return false;
        }
        if (enabled && !biometricAvailable) {
          if (!suppressSnackbar) {
            CustomSnackbar.warning(
              'Biometric authentication is not available on this device.',
            );
          }
          return false;
        }
        const success = await BiometricAuthService.setBiometricEnabled(enabled);
        if (success) {
          setBiometricEnabled(enabled);
          if (!suppressSnackbar) {
            if (enabled) {
              CustomSnackbar.success(
                `${biometryType} authentication has been enabled successfully.`,
              );
            } else {
              CustomSnackbar.error(
                'Biometric authentication has been disabled.',
              );
            }
          }
          return true;
        }
        return false;
      } catch {
        if (!suppressSnackbar) {
          CustomSnackbar.error('Failed to update biometric settings.');
        }
        return false;
      }
    },
    [hasNumericPassword, biometricAvailable, biometryType],
  );

  const handleAutoLockChange = useCallback(async (minutes: number) => {
    try {
      const success = await BiometricAuthService.setAutoLockTimeout(minutes);
      if (success) {
        setAutoLockTimeout(minutes);
        CustomSnackbar.success('Auto-lock setting updated.');
        return true;
      }
      CustomSnackbar.error('Failed to update auto-lock settings.');
      return false;
    } catch {
      CustomSnackbar.error('Failed to update auto-lock settings.');
      return false;
    }
  }, []);

  const getAuthenticationStatus = useCallback((): string => {
    if (biometricEnabled && hasNumericPassword) {
      return `${biometryType} + Numeric`;
    }
    if (biometricEnabled) return biometryType;
    if (hasNumericPassword) return 'Numeric Only';
    return 'Not Configured';
  }, [biometricEnabled, hasNumericPassword, biometryType]);

  const canEnableBiometric = useCallback((): boolean => {
    return biometricAvailable && hasNumericPassword;
  }, [biometricAvailable, hasNumericPassword]);

  return {
    biometricEnabled,
    biometricAvailable,
    biometryType,
    hasNumericPassword,
    autoLockTimeout,
    loading,
    handleBiometricToggle,
    handleAutoLockChange,
    initializeSettings,
    refreshSettings,
    getAuthenticationStatus,
    canEnableBiometric,
    setHasNumericPassword,
  };
}
