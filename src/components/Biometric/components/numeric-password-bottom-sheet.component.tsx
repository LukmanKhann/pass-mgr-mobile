import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

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

export default function NumericPasswordBottomSheet({
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
  const sheetRef = useRef<BottomSheetModal>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const passwordInputRef = useRef<any>(null);
  const [attempts, setAttempts] = useState(0);

  const snapPoints = useMemo(() => ['55%', '90%'], []);

  useEffect(() => {
    if (visible) {
      resetForm();
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setIsConfirmMode(false);
    setAttempts(0);
  };

  const handlePasswordChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (mode === 'set' && isConfirmMode) {
      if (numericText.length <= maxLength) {
        setConfirmPassword(numericText);
        if (numericText.length === maxLength) {
          setTimeout(() => handlePasswordSubmit(numericText, true), 100);
        }
      }
    } else {
      if (numericText.length <= maxLength) {
        setPassword(numericText);
        if (numericText.length === maxLength) {
          setTimeout(() => handlePasswordSubmit(numericText, false), 100);
        }
      }
    }
  };

  const handlePasswordSubmit = (inputPassword: string = '', isConfirm: boolean = false) => {
    if (mode === 'set') {
      if (!isConfirmMode && inputPassword.length === maxLength) {
        setIsConfirmMode(true);
        setPassword('');
        return true;
      }
      if (isConfirmMode && confirmPassword.length === maxLength) {
        if (password === confirmPassword) {
          const result = onSuccess(password);
          if (result === true || result === undefined) {
            onClose();
          }
          return true;
        } else {
          setConfirmPassword('');
          setPassword('');
          setIsConfirmMode(false);
          setAttempts(a => a + 1);
          return false;
        }
      }
    } else {
      const result = onSuccess(inputPassword);
      if (result === true || result === undefined) {
        onClose();
      }
      return true;
    }
    return false;
  };

  const handleBackspace = () => {
    if (mode === 'set' && isConfirmMode) {
      if (confirmPassword.length > 0) {
        setConfirmPassword(confirmPassword.slice(0, -1));
      } else {
        setIsConfirmMode(false);
        setPassword('');
      }
    } else {
      if (password.length > 0) {
        setPassword(password.slice(0, -1));
      }
    }
  };

  const getCurrentPassword = () => (mode === 'set' && isConfirmMode ? confirmPassword : password);
  const getCurrentTitle = () => (mode === 'set' && isConfirmMode ? 'Confirm Password' : title);
  const getCurrentSubtitle = () => (mode === 'set' && isConfirmMode ? 'Re-enter your password to confirm' : subtitle);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />,
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onDismiss={onClose}
      handleIndicatorStyle={{ backgroundColor: colors.textTertiary, width: 40, height: 4 }}
      backgroundStyle={{ backgroundColor: colors.surface }}
    >
      <View style={[styles.container, { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, paddingTop: spacing.sm }]}>
        <View style={styles.closeRow}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <MaterialSymbols name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.header, { gap: spacing.sm, marginTop: spacing.sm }]}>
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

        <View style={[styles.footer, { gap: spacing.sm, marginTop: spacing.sm }]}>
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
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
  },
  headerIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
  },
});
