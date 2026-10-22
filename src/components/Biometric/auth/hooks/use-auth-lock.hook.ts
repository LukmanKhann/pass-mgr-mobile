import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import BiometricAuthService from '../../service/BiometricAuth';
import {
  AUTH_SUCCESS_DELAY_MS,
  BIOMETRIC_PROMPT_DELAY_MS,
  EMPTY_AUTH_METHODS,
} from '../constants/auth-lock.constant';
import type {
  IAuthMethods,
  IUseAuthLockParams,
  IUseAuthLockResult,
} from '../auth-lock.type';

export function useAuthLock({
  onAuthenticated,
  onSetupRequired,
}: IUseAuthLockParams): IUseAuthLockResult {
  const [isLoading, setIsLoading] = useState(true);
  const [authMethods, setAuthMethods] =
    useState<IAuthMethods>(EMPTY_AUTH_METHODS);

  const hasAttemptedBiometricRef = useRef(false);
  const wasBackgroundedRef = useRef(false);
  const pendingBiometricPromptRef = useRef(false);
  const biometricInFlightRef = useRef(false);
  const promptTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBiometricAuth = useCallback(async (): Promise<void> => {
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
        setTimeout(onAuthenticated, AUTH_SUCCESS_DELAY_MS);
      }
    } finally {
      biometricInFlightRef.current = false;
    }
  }, [onAuthenticated]);

  const scheduleBiometricPrompt = useCallback((): void => {
    if (promptTimeoutRef.current) {
      clearTimeout(promptTimeoutRef.current);
    }

    promptTimeoutRef.current = setTimeout(() => {
      promptTimeoutRef.current = null;
      if (AppState.currentState === 'active') {
        void handleBiometricAuth();
        return;
      }
      pendingBiometricPromptRef.current = true;
    }, BIOMETRIC_PROMPT_DELAY_MS);
  }, [handleBiometricAuth]);

  const initializeAuth = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [biometricEnabled, biometryType] = await Promise.all([
        BiometricAuthService.isBiometricEnabled(),
        BiometricAuthService.getBiometryType(),
      ]);

      const methods: IAuthMethods = { biometric: biometricEnabled, biometryType };
      setAuthMethods(methods);

      if (!methods.biometric) {
        onSetupRequired();
        return;
      }

      if (!hasAttemptedBiometricRef.current) {
        hasAttemptedBiometricRef.current = true;
        scheduleBiometricPrompt();
      }
    } catch {
      // Keep the lock screen closed by failing safe.
    } finally {
      setIsLoading(false);
    }
  }, [onSetupRequired, scheduleBiometricPrompt]);

  useEffect(() => {
    initializeAuth();

    const handleAppStateChange = (nextAppState: string): void => {
      if (nextAppState === 'background') {
        wasBackgroundedRef.current = true;
        if (promptTimeoutRef.current) {
          clearTimeout(promptTimeoutRef.current);
          promptTimeoutRef.current = null;
        }
        return;
      }

      if (nextAppState !== 'active') {
        return;
      }

      const shouldRetry =
        wasBackgroundedRef.current || pendingBiometricPromptRef.current;
      wasBackgroundedRef.current = false;
      pendingBiometricPromptRef.current = false;

      if (shouldRetry) {
        hasAttemptedBiometricRef.current = false;
        initializeAuth();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
        promptTimeoutRef.current = null;
      }
    };
  }, [initializeAuth]);

  return {
    isLoading,
    authMethods,
    handleBiometricAuth,
  };
}
