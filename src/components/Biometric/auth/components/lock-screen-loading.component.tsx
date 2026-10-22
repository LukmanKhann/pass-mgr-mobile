import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Typography } from '../../../widgets/typography';
import { useTheme } from '../../../../hooks/use-theme.hook';

export function LockScreenLoading(): JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Typography
        variant="bodyMd"
        color={colors.textSecondary}
        style={{ marginTop: spacing.md }}
      >
        Securing your vault...
      </Typography>
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
