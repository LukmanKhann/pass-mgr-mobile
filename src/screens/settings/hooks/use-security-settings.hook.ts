import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import BiometricAuthService from '../../../components/Biometric/service/BiometricAuth';

import { CustomSnackbar } from '../../../global/utils/nitro-toast.util';

export function useSecuritySettings() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState('Biometric');
  const [hasNumericPassword, setHasNumericPassword] = useState(false);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const initializeSettings = useCallback(async () => {
    try {
      setLoading(true);
      const [
        biometricEnabledStatus,
        biometricAvailability,
        biometryTypeResult,
        numericPasswordStatus,
        autoLockStatus,
      ] = await Promise.all([
        BiometricAuthService.isBiometricEnabled(),
        BiometricAuthService.isBiometricAvailable(),
        BiometricAuthService.getBiometryType(),
        BiometricAuthService.hasNumericPassword(),
        BiometricAuthService.isAutoLockEnabled(),
      ]);
      setBiometricEnabled(biometricEnabledStatus);
      setBiometricAvailable(biometricAvailability.available);
      setBiometryType(biometryTypeResult);
      setHasNumericPassword(numericPasswordStatus);
      setAutoLockEnabled(autoLockStatus);
    } catch (error) {
      CustomSnackbar.error('Failed to load security settings.');
    } finally {
      setLoading(false);
    }
  }, []);

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
      } catch (error) {
        if (!suppressSnackbar) {
          CustomSnackbar.error('Failed to update biometric settings.');
        }
        return false;
      }
    },
    [hasNumericPassword, biometricAvailable, biometryType],
  );

  const handleAutoLockToggle = useCallback(async (enabled: boolean) => {
    try {
      const success = await BiometricAuthService.setAutoLockEnabled(enabled);
      if (success) {
        setAutoLockEnabled(enabled);
        return true;
      }
      return false;
    } catch (error) {
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
    autoLockEnabled,
    loading,
    handleBiometricToggle,
    handleAutoLockToggle,
    initializeSettings,
    getAuthenticationStatus,
    canEnableBiometric,
    setHasNumericPassword,
  };
}
