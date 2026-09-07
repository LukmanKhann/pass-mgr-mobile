import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { TextInputInstance } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../widgets/typography';
import MaterialSymbols from '../../widgets/material-icon';
import { NumericKeypad } from './numeric-keypad.component';
import { PinCircles } from './pin-circles.component';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (password: string) => boolean | void;
  onForgot?: () => void;
  title?: string;
  subtitle?: string;
  mode?: 'verify' | 'set';
  maxLength?: number;
 }

export default function NumericPasswordModal({
  visible,
  onClose,
  onSuccess,
  onForgot,
  title = 'Enter Password',
  subtitle = 'Enter your 4-digit password',
  mode = 'verify',
  maxLength = 4,
}: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const passwordInputRef = useRef<TextInputInstance | null>(null);

  useEffect(() => {
    if (visible) {
      resetForm();
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setIsConfirmMode(false);
    setAttempts(0);
  };

  const showModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration:  200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension:  150, friction:  7, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 300);
    });
  };

  const hideModal = () => {
    Keyboard.dismiss();
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    shakeAnimation.setValue(0);
  };

  const shakeError = useCallback(() => {
    const sequence = [10, -10, 8, -8, 0];
    const animations = sequence.map((value: number, index: number) =>
      Animated.timing(shakeAnimation, { toValue: value, duration: 60, useNativeDriver: true }),
    );
    Animated.sequence(animations).start();
  }, [shakeAnimation]);

  const handlePasswordChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');

    if (mode === 'set' && isConfirmMode) {
      if (numericText.length <= maxLength) {
        setConfirmPassword(numericText);
        if (numericText.length === maxLength) {
          setTimeout(() => {
            handlePasswordSubmit(numericText, true);
          }, 100);
        }
      }
    } else {
      if (numericText.length <= maxLength) {
        setPassword(numericText);
        if (numericText.length === maxLength) {
          setTimeout(() => {
            handlePasswordSubmit(numericText, false);
          }, 100);
        }
      }
    }
  };

  const handlePasswordSubmit = (inputPassword: string = '', isConfirming: boolean = false) => {
    const currentPassword = inputPassword || (isConfirming ? confirmPassword : password);

    if (currentPassword.length !== maxLength) {
      return;
    }

    if (mode === 'set' && (isConfirming || isConfirmMode)) {
      if (currentPassword === password) {
        Keyboard.dismiss();
        onSuccess(password);
      } else {
        setConfirmPassword('');
        setPassword('');
        setIsConfirmMode(false);
        setAttempts(prev => prev + 1);
        shakeError();
        setTimeout(() => {
          passwordInputRef.current?.focus();
        }, 500);
      }
    } else if (mode === 'verify') {
      const result = onSuccess(currentPassword);
      if (result === false) {
        setTimeout(() => {
          setPassword('');
          setAttempts(prev => prev + 1);
          shakeError();
          setTimeout(() => {
            passwordInputRef.current?.focus();
          }, 500);
        }, 100);
      } else {
        Keyboard.dismiss();
      }
    } else if (mode === 'set' && !isConfirmMode) {
      setIsConfirmMode(true);
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  };

  const handleBackspace = () => {
    if (mode === 'set' && isConfirmMode) {
      if (confirmPassword.length > 0) {
        setConfirmPassword(confirmPassword.slice(0, -1));
      } else {
        setIsConfirmMode(false);
      }
    } else {
      if (password.length > 0) {
        setPassword(password.slice(0, -1));
      }
    }
  };

  const getCurrentPassword = (): string =>
    mode === 'set' && isConfirmMode ? confirmPassword : password;

  const getCurrentTitle = (): string =>
    mode === 'set' && isConfirmMode ? 'Confirm Password' : title;

  const getCurrentSubtitle = (): string =>
    mode === 'set' && isConfirmMode ? 'Re-enter your password to confirm' : subtitle;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }, { translateX: shakeAnimation }],
              backgroundColor: colors.surface,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
            },
          ]}
        >
          <View style={styles.closeRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <MaterialSymbols name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <View style={[styles.header, { gap: spacing.sm }]}>
            <View style={[styles.headerIcon, { borderRadius: borderRadius.full, backgroundColor: colors.surfaceElevated }]}>
              <MaterialSymbols name="lock" size={32} color={colors.accent} />
            </View>
            <Typography variant="headingMd" color={colors.textPrimary}>{getCurrentTitle()}</Typography>
            <Typography variant="bodyMd" color={colors.textSecondary} align="center">{getCurrentSubtitle()}</Typography>
          </View>

          <PinCircles length={getCurrentPassword().length} maxLength={maxLength} />
          <NumericKeypad
            value={getCurrentPassword()}
            onChangeText={handlePasswordChange}
            onBackspace={handleBackspace}
            onSubmit={() => handlePasswordSubmit()}
            maxLength={maxLength}
            inputRef={passwordInputRef}
          />

          <View style={[styles.footer, { gap: spacing.sm }]}>
            {mode === 'verify' && onForgot ? (
              <Typography variant="bodyMd" color={colors.warning} align="center" onPress={onForgot}>
                Forgot Password?
              </Typography>
            ) : null}
            {attempts > 0 ? (
              <Typography variant="caption" color={colors.textTertiary} align="center">
                Attempts: {attempts}
              </Typography>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  closeRow: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  headerIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
});
