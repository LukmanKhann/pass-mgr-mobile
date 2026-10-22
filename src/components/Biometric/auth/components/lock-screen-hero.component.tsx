import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import MaterialSymbols from '../../../widgets/material-icon';

import { Typography } from '../../../widgets/typography';
import { useTheme } from '../../../../hooks/use-theme.hook';

export function LockScreenHero(): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.container, { opacity, marginTop: spacing.xxl }]}
    >
      <View
        style={[
          styles.logo,
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        <MaterialSymbols
          name="shield_lock"
          variant="filled"
          size={40}
          color={colors.accent}
        />
      </View>
      <Typography variant="headingXl" color={colors.textPrimary}>
        SecureVault
      </Typography>
      <Typography variant="bodyMd" color={colors.textSecondary}>
        Your passwords, secured
      </Typography>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  logo: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
