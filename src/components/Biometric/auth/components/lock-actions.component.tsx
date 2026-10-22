import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import MaterialSymbols from '../../../widgets/material-icon';

import { Button } from '../../../controls/button';
import { Typography } from '../../../widgets/typography';
import { useTheme } from '../../../../hooks/use-theme.hook';
import {
  getBiometricButtonLabel,
  getBiometricIcon,
  getUnlockSubtitle,
} from '../utils/auth-lock.util';
import type { IAuthMethods } from '../auth-lock.type';

interface IProps {
  authMethods: IAuthMethods;
  onBiometricPress: () => void;
  onPinPress: () => void;
}

export function LockActions({
  authMethods,
  onBiometricPress,
  onPinPress,
}: IProps): JSX.Element {
  const { colors, spacing } = useTheme();
  const hasBiometric = authMethods.biometric;
  const hasNumeric = authMethods.numeric;
  const hasAction = hasBiometric || hasNumeric;

  const primaryTitle = hasBiometric
    ? getBiometricButtonLabel(authMethods.biometryType)
    : 'Enter PIN';
  const primaryIcon = hasBiometric
    ? getBiometricIcon(authMethods.biometryType)
    : 'dialpad';

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.xl }]}>
      <Typography variant="headingMd" color={colors.textPrimary}>
        Welcome back
      </Typography>
      <Typography variant="bodyMd" color={colors.textSecondary} align="center">
        {getUnlockSubtitle(authMethods)}
      </Typography>

      {hasAction ? (
        <Button
          title={primaryTitle}
          onPress={hasBiometric ? onBiometricPress : onPinPress}
          size="lg"
          fullWidth
          icon={
            <MaterialSymbols
              name={primaryIcon}
              size={20}
              color={colors.textOnPrimary}
            />
          }
          style={styles.primaryButton}
        />
      ) : null}

      {hasBiometric && hasNumeric ? (
        <TouchableOpacity
          onPress={onPinPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Use PIN instead of biometrics"
          style={styles.linkButton}
        >
          <Typography variant="bodyMd" color={colors.accent} fontWeight="600">
            Use PIN instead
          </Typography>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButton: {
    marginTop: 12,
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 4,
  },
});
