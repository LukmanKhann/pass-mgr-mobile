import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { AppState } from 'react-native';

import {
  DEFAULT_AUTO_LOCK_MINUTES,
  isValidAutoLockMinutes,
} from '../auto-lock.constants';
import { default as CustomSnackbar } from '../../../global/utils/toast.util';

const rnBiometrics = new ReactNativeBiometrics();

class BiometricAuthService {
  static BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
  static NUMERIC_PASSWORD_KEY = 'numeric_password';
  static NUMERIC_PASSWORD_SERVICE = 'com.securevault.numeric-password';
  static NUMERIC_PASSWORD_USERNAME = 'securevault';
  static AUTO_LOCK_TIMEOUT_KEY = 'auto_lock_timeout_minutes';
  static IS_AUTHENTICATED_KEY = 'is_authenticated';
  static LAST_AUTH_TIME_KEY = 'last_auth_time';

  static async isBiometricAvailable() {
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();
      return {
        available,
        biometryType,
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return { available: false, biometryType: null };
    }
  }

  static async setBiometricEnabled(enabled: boolean) {
    try {
      if (enabled) {
        const { available } = await this.isBiometricAvailable();
        if (!available) {
          CustomSnackbar.warning(
            'Biometric authentication is not available on this device.',
          );
          return false;
        }

        const result = await this.authenticateWithBiometric(
          'Enable Biometric Authentication',
          'Please verify your identity to enable biometric authentication',
        );

        if (result.success) {
          await AsyncStorage.setItem(this.BIOMETRIC_ENABLED_KEY, 'true');
          return true;
        }
        return false;
      } else {
        await AsyncStorage.setItem(this.BIOMETRIC_ENABLED_KEY, 'false');
        return true;
      }
    } catch (error) {
      console.error('Error setting biometric enabled:', error);
      return false;
    }
  }

  static async isBiometricEnabled() {
    try {
      const enabled = await AsyncStorage.getItem(this.BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric enabled:', error);
      return false;
    }
  }

  private static biometricPromptPromise: Promise<{
    success: boolean;
    error?: string;
    cancelled?: boolean;
  }> | null = null;

  private static isBiometricCancellation(error: unknown): boolean {
    const message =
      error instanceof Error ? error.message : String(error ?? '');
    return (
      /cancel/i.test(message) ||
      /code\s*=\s*-4/i.test(message) ||
      /\b-4\b/.test(message)
    );
  }

  static authenticateWithBiometric(
    promptTitle = 'Authenticate',
    promptMessage = 'Please verify your identity',
  ): Promise<{ success: boolean; error?: string; cancelled?: boolean }> {
    if (this.biometricPromptPromise) {
      return this.biometricPromptPromise;
    }

    const promise = this.runBiometricPrompt(promptTitle, promptMessage);
    this.biometricPromptPromise = promise;

    const clear = () => {
      if (this.biometricPromptPromise === promise) {
        this.biometricPromptPromise = null;
      }
    };
    promise.then(clear, clear);

    return promise;
  }

  private static async runBiometricPrompt(
    _promptTitle: string,
    promptMessage: string,
  ): Promise<{ success: boolean; error?: string; cancelled?: boolean }> {
    try {
      if (AppState.currentState !== 'active') {
        return {
          success: false,
          error: 'App is not active',
          cancelled: true,
        };
      }

      const { available } = await this.isBiometricAvailable();
      if (!available) {
        return { success: false, error: 'Biometric not available' };
      }

      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage,
        fallbackPromptMessage: 'Use Numeric Password',
      });

      if (success) {
        await this.setAuthenticationState(true);
        return { success: true };
      }

      return {
        success: false,
        error,
        cancelled: !!error && this.isBiometricCancellation(error),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const cancelled = this.isBiometricCancellation(error);
      if (!cancelled) {
        console.error('Biometric authentication error:', error);
      }
      return { success: false, error: message, cancelled };
    }
  }

  static async setNumericPassword(password: string) {
    try {
      if (!password || password.length === 0) {
        await Keychain.resetGenericPassword({
          service: this.NUMERIC_PASSWORD_SERVICE,
        });
        await AsyncStorage.removeItem(this.NUMERIC_PASSWORD_KEY);
        return true;
      }

      if (password.length < 4) {
        throw new Error('Password must be at least 4 digits');
      }

      const result = await Keychain.setGenericPassword(
        this.NUMERIC_PASSWORD_USERNAME,
        password,
        {
          service: this.NUMERIC_PASSWORD_SERVICE,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        },
      );

      if (!result) {
        return false;
      }

      await AsyncStorage.removeItem(this.NUMERIC_PASSWORD_KEY);
      return true;
    } catch (error) {
      console.error('Error setting numeric password:', error);
      return false;
    }
  }

  static async getNumericPassword(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: this.NUMERIC_PASSWORD_SERVICE,
      });

      if (credentials && credentials.password) {
        return credentials.password;
      }

      const legacyPassword = await AsyncStorage.getItem(
        this.NUMERIC_PASSWORD_KEY,
      );
      if (legacyPassword && legacyPassword.length > 0) {
        await this.setNumericPassword(legacyPassword);
        return legacyPassword;
      }

      return null;
    } catch (error) {
      console.error('Error reading numeric password:', error);
      try {
        return await AsyncStorage.getItem(this.NUMERIC_PASSWORD_KEY);
      } catch {
        return null;
      }
    }
  }

  static async verifyNumericPassword(inputPassword: string) {
    try {
      const storedPassword = await this.getNumericPassword();
      const isValid =
        storedPassword !== null &&
        storedPassword.length > 0 &&
        storedPassword === inputPassword;

      if (isValid) {
        await this.setAuthenticationState(true);
      }

      return isValid;
    } catch (error) {
      console.error('Error verifying numeric password:', error);
      return false;
    }
  }

  static async hasNumericPassword() {
    try {
      const password = await this.getNumericPassword();
      return password !== null && password.length > 0;
    } catch (error) {
      console.error('Error checking numeric password:', error);
      return false;
    }
  }

  static async setAutoLockTimeout(minutes: number) {
    try {
      const value = isValidAutoLockMinutes(minutes)
        ? minutes
        : DEFAULT_AUTO_LOCK_MINUTES;
      await AsyncStorage.setItem(this.AUTO_LOCK_TIMEOUT_KEY, String(value));
      return true;
    } catch (error) {
      console.error('Error setting auto-lock timeout:', error);
      return false;
    }
  }

  static async getAutoLockTimeout(): Promise<number> {
    try {
      const stored = await AsyncStorage.getItem(this.AUTO_LOCK_TIMEOUT_KEY);
      if (stored !== null) {
        const minutes = Number.parseInt(stored, 10);
        if (Number.isFinite(minutes) && isValidAutoLockMinutes(minutes)) {
          return minutes;
        }
      }
      return DEFAULT_AUTO_LOCK_MINUTES;
    } catch (error) {
      console.error('Error getting auto-lock timeout:', error);
      return DEFAULT_AUTO_LOCK_MINUTES;
    }
  }

  static async hasLockMethod(): Promise<boolean> {
    try {
      const [biometricEnabled, hasNumericPassword] = await Promise.all([
        this.isBiometricEnabled(),
        this.hasNumericPassword(),
      ]);
      return biometricEnabled || hasNumericPassword;
    } catch (error) {
      console.error('Error checking lock methods:', error);
      return false;
    }
  }

  static async setAuthenticationState(isAuthenticated: boolean) {
    try {
      await AsyncStorage.setItem(
        this.IS_AUTHENTICATED_KEY,
        isAuthenticated.toString(),
      );
      if (isAuthenticated) {
        await AsyncStorage.setItem(
          this.LAST_AUTH_TIME_KEY,
          Date.now().toString(),
        );
      } else {
        await AsyncStorage.removeItem(this.LAST_AUTH_TIME_KEY);
      }
    } catch (error) {
      console.error('Error setting authentication state:', error);
    }
  }

  static async isAuthenticated() {
    try {
      const isAuth = await AsyncStorage.getItem(this.IS_AUTHENTICATED_KEY);
      const lastAuthTime = await AsyncStorage.getItem(this.LAST_AUTH_TIME_KEY);

      if (isAuth !== 'true' || !lastAuthTime) {
        return false;
      }

      const autoLockTimeout = await this.getAutoLockTimeout();
      if (autoLockTimeout === 0) {
        await this.setAuthenticationState(false);
        return false;
      }

      const authTime = parseInt(lastAuthTime, 10);
      const currentTime = Date.now();
      const timeDiff = currentTime - authTime;

      if (timeDiff >= autoLockTimeout * 60 * 1000) {
        await this.setAuthenticationState(false);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking authentication state:', error);
      return false;
    }
  }

  static async logout() {
    try {
      await this.setAuthenticationState(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  static async authenticate() {
    try {
      const isBiometricEnabled = await this.isBiometricEnabled();
      const hasNumericPassword = await this.hasNumericPassword();

      if (!isBiometricEnabled && !hasNumericPassword) {
        return { success: false, error: 'No authentication method configured' };
      }

      if (isBiometricEnabled) {
        const biometricResult = await this.authenticateWithBiometric(
          'Unlock SecureVault',
          'Use your biometric to unlock the app',
        );

        if (biometricResult.success) {
          return { success: true, method: 'biometric' };
        }

        if (hasNumericPassword) {
          return {
            success: false,
            error: 'biometric_failed',
            fallback: 'numeric',
          };
        }

        return { success: false, error: biometricResult.error };
      }

      if (hasNumericPassword) {
        return {
          success: false,
          error: 'numeric_required',
          fallback: 'numeric',
        };
      }

      return { success: false, error: 'No authentication method available' };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async getBiometryType() {
    try {
      const { biometryType } = await this.isBiometricAvailable();
      switch (biometryType) {
        case 'TouchID':
          return 'Touch ID';
        case 'FaceID':
          return 'Face ID';
        case 'Biometrics':
          return 'Fingerprint';
        default:
          return 'Biometric';
      }
    } catch {
      return 'Biometric';
    }
  }
}

export default BiometricAuthService;
