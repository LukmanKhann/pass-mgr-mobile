import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppBottomSheet } from '../../../widgets/bottom-sheet';
import { Typography } from '../../../widgets/typography';
import { useTheme } from '../../../../hooks/use-theme.hook';
import { PinCircles } from '../../components/pin-circles.component';
import { PinKeypad } from '../../components/pin-keypad.component';
import {
  INCORRECT_PIN_MESSAGE,
  PIN_AUTO_SUBMIT_DELAY_MS,
  PIN_LENGTH,
} from '../constants/auth-lock.constant';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (pin: string) => Promise<boolean>;
  onForgot: () => void;
  onDismissed?: () => void;
}

export function PinUnlockSheet({
  visible,
  onClose,
  onVerify,
  onForgot,
  onDismissed,
}: IProps): JSX.Element {
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pinRef = useRef('');
  const submittingRef = useRef(false);
  const pendingForgotRef = useRef(false);
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const clearSubmitTimeout = useCallback((): void => {
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
  }, []);

  const shake = useCallback((): void => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  const showError = useCallback((): void => {
    pinRef.current = '';
    setPin('');
    setError(INCORRECT_PIN_MESSAGE);
    shake();
  }, [shake]);

  const submitPin = useCallback(
    async (value: string): Promise<void> => {
      if (submittingRef.current) {
        return;
      }

      submittingRef.current = true;
      setSubmitting(true);
      try {
        const isValid = await onVerify(value);
        if (!isValid) {
          showError();
        }
      } catch {
        showError();
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [onVerify, showError],
  );

  const scheduleSubmit = useCallback(
    (value: string): void => {
      clearSubmitTimeout();
      submitTimeoutRef.current = setTimeout(() => {
        submitTimeoutRef.current = null;
        submitPin(value);
      }, PIN_AUTO_SUBMIT_DELAY_MS);
    },
    [clearSubmitTimeout, submitPin],
  );

  const handleDigitPress = useCallback(
    (digit: string): void => {
      if (submittingRef.current || pinRef.current.length >= PIN_LENGTH) {
        return;
      }

      const nextPin = `${pinRef.current}${digit}`;
      pinRef.current = nextPin;
      setPin(nextPin);
      setError('');

      if (nextPin.length === PIN_LENGTH) {
        scheduleSubmit(nextPin);
      }
    },
    [scheduleSubmit],
  );

  const handleBackspace = useCallback((): void => {
    if (submittingRef.current || pinRef.current.length === 0) {
      return;
    }

    clearSubmitTimeout();
    const nextPin = pinRef.current.slice(0, -1);
    pinRef.current = nextPin;
    setPin(nextPin);
    setError('');
  }, [clearSubmitTimeout]);

  const handleForgotPress = useCallback((): void => {
    pendingForgotRef.current = true;
    onClose();
  }, [onClose]);

  const handleSheetDidDismiss = useCallback((): void => {
    onDismissed?.();
    if (!pendingForgotRef.current) {
      return;
    }
    pendingForgotRef.current = false;
    onForgot();
  }, [onDismissed, onForgot]);

  useEffect(() => {
    if (visible) {
      pendingForgotRef.current = false;
      return;
    }
    clearSubmitTimeout();
    pinRef.current = '';
    submittingRef.current = false;
    setPin('');
    setError('');
    setSubmitting(false);
  }, [visible, clearSubmitTimeout]);

  useEffect(() => {
    return () => {
      clearSubmitTimeout();
    };
  }, [clearSubmitTimeout]);

  const translateX = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-8, 0, 8],
  });

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      onDidDismiss={handleSheetDidDismiss}
      title="Enter PIN"
      subtitle="Enter your 4-digit PIN to unlock your vault."
    >
      <View style={styles.content}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <PinCircles
            length={pin.length}
            maxLength={PIN_LENGTH}
            status={error ? 'error' : 'default'}
          />
        </Animated.View>

        <View style={styles.messageContainer}>
          <Typography
            variant="bodyMd"
            color={error ? colors.error : colors.textTertiary}
            align="center"
          >
            {error}
          </Typography>
        </View>

        <PinKeypad
          onDigitPress={handleDigitPress}
          onBackspace={handleBackspace}
          disabled={submitting}
          keyBackgroundColor={colors.background}
          keyBorderColor={colors.border}
          keyTextColor={colors.textPrimary}
        />

        <TouchableOpacity
          onPress={handleForgotPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Forgot PIN"
          style={styles.forgotButton}
        >
          <Typography variant="bodyMd" color={colors.accent} fontWeight="600">
            Forgot PIN?
          </Typography>
        </TouchableOpacity>
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 4,
  },
  messageContainer: {
    justifyContent: 'center',
    marginBottom: 16,
  },
  forgotButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
