import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/use-theme.hook';
import { Loader } from '../../components/widgets/loader';
import { Typography } from '../../components/widgets/typography';
import MaterialSymbols from '../../components/widgets/material-icon';
import { MotionView } from '../../motion';

export default function LoadingScreen(): JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MotionView
        enter="zoom-in"
        transition={{ type: 'spring', spring: 'gentle', duration: 'normal' }}
      >
        <MaterialSymbols name="shield_lock" variant="filled" size={80} color={colors.accent} />
      </MotionView>
      <MotionView
        enter="fade-up"
        transition={{ duration: 'fast', delay: 80 }}
      >
        <Typography variant="headingLg" color={colors.textPrimary} style={{ marginTop: spacing.lg }}>
          SecureVault
        </Typography>
      </MotionView>
      <View style={{ marginTop: spacing.xl }}>
        <Loader size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
