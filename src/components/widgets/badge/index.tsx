import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../typography';

interface IProps {
  label: string;
  color?: string;
   textColor?: string;
}

export function Badge({ label, color, textColor }: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const backgroundColor = color ?? colors.accent;
  const foregroundColor = textColor ?? colors.textOnAccent;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderRadius: borderRadius.full,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
        },
      ]}
    >
      <Typography variant="caption" color={foregroundColor} fontWeight="600">
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
});