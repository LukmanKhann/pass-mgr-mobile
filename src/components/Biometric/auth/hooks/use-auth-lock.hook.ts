import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import BiometricAuthService from '../../service/BiometricAuth';
import {
  AUTH_SUCCESS_DELAY_MS,
  BIOMETRIC_PROMPT_DELAY_MS,
  EMPTY_AUTH_METHODS,
  MAX_PIN_ATTEMPTS,
} from '../constants/auth-lock.constant';
import type {
  IAuthMethods,
  IUseAuthLockParams,
  IUseAuthLockResult,
} from '../auth-lock.type';

export function useAuthLock({
  onAuthenticated,
  onSetupRequired,
  onForgotPin,
}: IUseAuthLockParams): IUseAuthLockResult {
  const [isLoading, setIsLoading] = useState(true);
  const [authMethods, setAuthMethods] =
    useState<IAuthMethods>(EMPTY_AUTH_METHODS);
  const [showPinSheet, setShowPinSheet] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const hasAttemptedBiometricRef = useRef(false);
  const wasBackgroundedRef = useRef(false);
  const pendingBiometricPromptRef = useRef(false);
  const biometricInFlightRef = useRef(false);
  const limitPendingRef = useRef(false);
  const pinSheetVisibleRef = useRef(false);
  const promptTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPinSheetVisibility = useCallback((visible: boolean): void => {
    pinSheetVisibleRef.current = visible;
    setShowPinSheet(visible);
  }, []);

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
        setPinSheetVisibility(false);
        setTimeout(onAuthenticated, AUTH_SUCCESS_DELAY_MS);
      }
    } finally {
      biometricInFlightRef.current = false;
    }
  }, [onAuthenticated, setPinSheetVisibility]);

  const scheduleBiometricPrompt = useCallback((): void => {
    if (promptTimeoutRef.current) {
      clearTimeout(promptTimeoutRef.current);
    }

    promptTimeoutRef.current = setTimeout(() => {
      promptTimeoutRef.current = null;
      if (AppState.currentState === 'active') {
        handleBiometricAuth();
        return;
      }
      pendingBiometricPromptRef.current = true;
    }, BIOMETRIC_PROMPT_DELAY_MS);
  }, [handleBiometricAuth]);

  const initializeAuth = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [biometricEnabled, hasNumericPassword, biometryType] =
        await Promise.all([
          BiometricAuthService.isBiometricEnabled(),
          BiometricAuthService.hasNumericPassword(),
          BiometricAuthService.getBiometryType(),
        ]);

      const methods: IAuthMethods = {
        biometric: biometricEnabled,
        numeric: hasNumericPassword,
        biometryType,
      };
      setAuthMethods(methods);

      if (!methods.biometric && !methods.numeric) {
        onSetupRequired();
        return;
      }

      if (!methods.biometric && methods.numeric) {
        setPinSheetVisibility(true);
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
  }, [onSetupRequired, scheduleBiometricPrompt, setPinSheetVisibility]);

  useEffect(() => {
    initializeAuth();

    const handleAppStateChange = (nextAppState: string): void => {
      if (nextAppState === 'background') {
        wasBackgroundedRef.current = true;
        setPinSheetVisibility(false);
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
        setAttempts(0);
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
  }, [initializeAuth, setPinSheetVisibility]);

  const handleVerifyPin = useCallback(
    async (pin: string): Promise<boolean> => {
      const isValid = await BiometricAuthService.verifyNumericPassword(pin);

      if (isValid) {
        setPinSheetVisibility(false);
        setAttempts(0);
        setTimeout(onAuthenticated, AUTH_SUCCESS_DELAY_MS);
        return true;
      }

      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= MAX_PIN_ATTEMPTS) {
        if (pinSheetVisibleRef.current) {
          limitPendingRef.current = true;
          setPinSheetVisibility(false);
        } else {
          setShowLimitModal(true);
        }
      }

      return false;
    },
    [attempts, onAuthenticated, setPinSheetVisibility],
  );

  const handlePinSheetDismissed = useCallback((): void => {
    if (!limitPendingRef.current) {
      return;
    }
    limitPendingRef.current = false;
    setShowLimitModal(true);
  }, []);

  const handleUsePin = useCallback((): void => {
    setPinSheetVisibility(true);
  }, [setPinSheetVisibility]);

  const handleClosePinSheet = useCallback((): void => {
    setPinSheetVisibility(false);
  }, [setPinSheetVisibility]);

  const handleForgotRequest = useCallback((): void => {
    setPinSheetVisibility(false);
    setShowForgotModal(true);
  }, [setPinSheetVisibility]);

  const handleCloseForgotModal = useCallback((): void => {
    setShowForgotModal(false);
  }, []);

  const handleForgotConfirm = useCallback((): void => {
    setShowForgotModal(false);
    setPinSheetVisibility(false);
    onForgotPin();
  }, [onForgotPin, setPinSheetVisibility]);

  const handleCloseLimitModal = useCallback((): void => {
    setShowLimitModal(false);
  }, []);

  return {
    isLoading,
    authMethods,
    showPinSheet,
    showForgotModal,
    showLimitModal,
    handleBiometricAuth,
    handleUsePin,
    handleClosePinSheet,
    handleVerifyPin,
    handlePinSheetDismissed,
    handleForgotRequest,
    handleCloseForgotModal,
    handleForgotConfirm,
    handleCloseLimitModal,
  };
}
