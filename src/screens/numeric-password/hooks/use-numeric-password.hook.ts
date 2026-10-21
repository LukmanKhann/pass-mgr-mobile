import { useCallback, useRef, useState } from 'react';

import BiometricAuthService from '../../../components/Biometric/service/BiometricAuth';

import type { INumericPasswordMode } from '../../../navigation/navigation.type';
import { CustomSnackbar } from '../../../global/utils/nitro-toast.util';

export type INumericPasswordStep = 'verify' | 'create' | 'confirm';

interface IParams {
  mode: INumericPasswordMode;
  hasExistingPin: boolean;
  maxLength: number;
  onDone: () => void;
  onRemoved: () => void;
}

interface IResult {
  step: INumericPasswordStep;
  pin: string;
  error: string;
  submitting: boolean;
  success: boolean;
  shakeKey: number;
  canRemove: boolean;
  pushDigit: (digit: string) => void;
  deleteDigit: () => void;
  removePin: () => Promise<void>;
}

const COMPLETE_DELAY_MS = 120;
const SUCCESS_DELAY_MS = 700;
const INCORRECT_PIN_MESSAGE = 'Incorrect PIN. Please try again.';
const MISMATCH_MESSAGE = "PINs didn't match. Please try again.";
const SAVE_ERROR_MESSAGE = 'Could not save your PIN. Please try again.';
const REMOVE_ERROR_MESSAGE = 'Could not remove your PIN. Please try again.';

export function useNumericPassword({
  mode,
  hasExistingPin,
  maxLength,
  onDone,
  onRemoved,
}: IParams): IResult {
  const initialStep: INumericPasswordStep =
    mode === 'set' && !hasExistingPin ? 'create' : 'verify';

  const [step, setStep] = useState<INumericPasswordStep>(initialStep);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const pinRef = useRef('');
  const stepRef = useRef<INumericPasswordStep>(initialStep);
  const firstPinRef = useRef('');
  const busyRef = useRef(false);
  const successRef = useRef(false);
  const doneRef = useRef(false);

  const exit = useCallback(() => {
    if (doneRef.current) {
      return;
    }
    doneRef.current = true;
    onDone();
  }, [onDone]);

  const updatePin = useCallback((value: string) => {
    pinRef.current = value;
    setPin(value);
  }, []);

  const goToStep = useCallback((next: INumericPasswordStep) => {
    stepRef.current = next;
    setStep(next);
  }, []);

  const fail = useCallback(
    (message: string) => {
      setError(message);
      setShakeKey(prev => prev + 1);
      updatePin('');
    },
    [updatePin],
  );

  const markSuccess = useCallback(
    (message: string) => {
      successRef.current = true;
      setSuccess(true);
      setError('');
      CustomSnackbar.success(message);
      setTimeout(exit, SUCCESS_DELAY_MS);
    },
    [exit],
  );

  const clearStoredPin = useCallback(async (): Promise<boolean> => {
    const removed = await BiometricAuthService.setNumericPassword('');
    if (!removed) {
      return false;
    }

    const biometricEnabled = await BiometricAuthService.isBiometricEnabled();
    if (biometricEnabled) {
      await BiometricAuthService.setBiometricEnabled(false);
    }

    return true;
  }, []);

  const handleComplete = useCallback(
    async (value: string) => {
      if (busyRef.current) {
        return;
      }
      busyRef.current = true;

      try {
        if (stepRef.current === 'verify') {
          const isValid = await BiometricAuthService.verifyNumericPassword(
            value,
          );
          if (!isValid) {
            fail(INCORRECT_PIN_MESSAGE);
            return;
          }

          if (mode === 'remove') {
            const removed = await clearStoredPin();
            if (!removed) {
              fail(REMOVE_ERROR_MESSAGE);
              return;
            }
            markSuccess('Numeric PIN removed');
            return;
          }

          if (mode === 'verify') {
            markSuccess('Verified');
            return;
          }

          setError('');
          goToStep('create');
          updatePin('');
          return;
        }

        if (stepRef.current === 'create') {
          firstPinRef.current = value;
          setError('');
          goToStep('confirm');
          updatePin('');
          return;
        }

        if (value !== firstPinRef.current) {
          firstPinRef.current = '';
          goToStep('create');
          fail(MISMATCH_MESSAGE);
          return;
        }

        setSubmitting(true);
        const saved = await BiometricAuthService.setNumericPassword(value);
        if (!saved) {
          fail(SAVE_ERROR_MESSAGE);
          return;
        }
        markSuccess(hasExistingPin ? 'Numeric PIN updated' : 'Numeric PIN set');
      } finally {
        setSubmitting(false);
        busyRef.current = false;
      }
    },
    [
      clearStoredPin,
      fail,
      goToStep,
      hasExistingPin,
      markSuccess,
      mode,
      updatePin,
    ],
  );

  const pushDigit = useCallback(
    (digit: string) => {
      if (busyRef.current || successRef.current) {
        return;
      }
      if (pinRef.current.length >= maxLength) {
        return;
      }

      setError('');
      const next = `${pinRef.current}${digit}`;
      updatePin(next);

      if (next.length === maxLength) {
        setTimeout(() => {
          if (pinRef.current === next) {
            handleComplete(next);
          }
        }, COMPLETE_DELAY_MS);
      }
    },
    [handleComplete, maxLength, updatePin],
  );

  const deleteDigit = useCallback(() => {
    if (busyRef.current || successRef.current) {
      return;
    }
    setError('');
    updatePin(pinRef.current.slice(0, -1));
  }, [updatePin]);

  const removePin = useCallback(async () => {
    if (busyRef.current) {
      return;
    }
    busyRef.current = true;
    setSubmitting(true);

    try {
      const removed = await clearStoredPin();
      if (!removed) {
        setError(REMOVE_ERROR_MESSAGE);
        return;
      }

      CustomSnackbar.success('Numeric PIN removed');
      onRemoved();
    } finally {
      busyRef.current = false;
      setSubmitting(false);
    }
  }, [clearStoredPin, onRemoved]);

  return {
    step,
    pin,
    error,
    submitting,
    success,
    shakeKey,
    canRemove: mode === 'set' && hasExistingPin && step === 'create',
    pushDigit,
    deleteDigit,
    removePin,
  };
}
