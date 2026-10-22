import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

import {
  AUTO_LOCK_NEVER_MINUTES,
  DEFAULT_AUTO_LOCK_MINUTES,
  isValidAutoLockMinutes,
} from '../auto-lock.constants';
import { default as CustomSnackbar } from '../../../global/utils/toast.util';
import { FIREBASE_AUTH } from '../../../Firebase/firebase-config';

const rnBiometrics = new ReactNativeBiometrics();

class BiometricAuthService {
  static BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
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

  private static getUserScopedKey(uid: string, baseKey: string): string {
    return `${uid}_${baseKey}`;
  }

  static async setBiometricEnabled(enabled: boolean) {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        return false;
      }

      const { available } = await this.isBiometricAvailable();

      if (available) {
        const result = await this.authenticateWithBiometric(
          enabled
            ? 'Enable Biometric Authentication'
            : 'Disable Biometric Authentication',
          enabled
            ? 'Please verify your identity to enable biometric authentication'
            : 'Please verify your identity to disable biometric authentication',
        );

        if (!result.success) {
          return false;
        }
      } else if (enabled) {
        // Enabling requires a working sensor; disabling never gets blocked
        // so the user is not locked out of turning the lock off.
        CustomSnackbar.warning(
          'Biometric authentication is not available on this device.',
        );
        return false;
      }

      await AsyncStorage.setItem(
        this.getUserScopedKey(currentUser.uid, this.BIOMETRIC_ENABLED_KEY),
        String(enabled),
      );
      return true;
    } catch (error) {
      console.error('Error setting biometric enabled:', error);
      return false;
    }
  }

  static async isBiometricEnabled() {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        // No signed-in account: nothing to lock.
        return false;
      }
      const enabled = await AsyncStorage.getItem(
        this.getUserScopedKey(currentUser.uid, this.BIOMETRIC_ENABLED_KEY),
      );
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
      return await this.isBiometricEnabled();
    } catch (error) {
      console.error('Error checking lock methods:', error);
      return false;
    }
  }

  static async setAuthenticationState(isAuthenticated: boolean) {
    try {
      const uid = FIREBASE_AUTH.currentUser?.uid;
      if (!uid) {
        return;
      }
      await AsyncStorage.setItem(
        this.getUserScopedKey(uid, this.IS_AUTHENTICATED_KEY),
        isAuthenticated.toString(),
      );
      if (isAuthenticated) {
        await AsyncStorage.setItem(
          this.getUserScopedKey(uid, this.LAST_AUTH_TIME_KEY),
          Date.now().toString(),
        );
      } else {
        await AsyncStorage.removeItem(
          this.getUserScopedKey(uid, this.LAST_AUTH_TIME_KEY),
        );
      }
    } catch (error) {
      console.error('Error setting authentication state:', error);
    }
  }

  static async isAuthenticated() {
    try {
      const uid = FIREBASE_AUTH.currentUser?.uid;
      if (!uid) {
        return false;
      }
      const isAuth = await AsyncStorage.getItem(
        this.getUserScopedKey(uid, this.IS_AUTHENTICATED_KEY),
      );
      const lastAuthTime = await AsyncStorage.getItem(
        this.getUserScopedKey(uid, this.LAST_AUTH_TIME_KEY),
      );

      if (isAuth !== 'true' || !lastAuthTime) {
        return false;
      }

      const autoLockTimeout = await this.getAutoLockTimeout();
      if (autoLockTimeout === AUTO_LOCK_NEVER_MINUTES) {
        // Auto-lock disabled: the session never expires by itself.
        return true;
      }
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
