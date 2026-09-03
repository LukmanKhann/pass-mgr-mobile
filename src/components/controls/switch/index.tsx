import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../widgets/typography';
import type { ISwitchProps } from './switch.type';

export function SwitchControl({
  label,
  value,
  onValueChange,
  description,
}: ISwitchProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.row, { paddingVertical: spacing.sm }]}>
      <View style={styles.labelContainer}>
        <Typography variant="bodyMd" fontWeight="500">{label}</Typography>
        {description && (
          <Typography variant="caption" color={colors.textTertiary}>{description}</Typography>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.accentLight }}
        thumbColor={value ? colors.accent : colors.textTertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labelContainer: {
    flex: 1,
    gap: 2,
  },
});
