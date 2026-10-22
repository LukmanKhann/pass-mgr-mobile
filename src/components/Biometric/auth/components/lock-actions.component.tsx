import React from 'react';
import { StyleSheet, View } from 'react-native';

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
}

export function LockActions({ authMethods, onBiometricPress }: IProps): JSX.Element {
  const { colors, spacing } = useTheme();

  if (!authMethods.biometric) {
    return (
      <View style={[styles.container, { paddingHorizontal: spacing.xl }]}>
        <Typography variant="headingMd" color={colors.textPrimary}>
          Welcome back
        </Typography>
        <Typography variant="bodyMd" color={colors.textSecondary} align="center">
          {getUnlockSubtitle(authMethods)}
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.xl }]}>
      <Typography variant="headingMd" color={colors.textPrimary}>
        Welcome back
      </Typography>
      <Typography variant="bodyMd" color={colors.textSecondary} align="center">
        {getUnlockSubtitle(authMethods)}
      </Typography>

      <Button
        title={getBiometricButtonLabel(authMethods.biometryType)}
        onPress={onBiometricPress}
        size="lg"
        fullWidth
        icon={
          <MaterialSymbols
            name={getBiometricIcon(authMethods.biometryType)}
            size={20}
            color={colors.textOnPrimary}
          />
        }
        style={styles.primaryButton}
      />
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
});
