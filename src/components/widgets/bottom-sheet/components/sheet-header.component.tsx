import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Typography } from '../../typography';
import { useTheme } from '../../../../hooks/use-theme.hook';

interface IProps {
  title: string;
  subtitle?: string;
}

export function SheetHeader({ title, subtitle }: IProps): JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.xxxl }]}>
      <Typography variant="headingMd" color={colors.textPrimary} align="center">
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          variant="bodyMd"
          color={colors.textSecondary}
          align="center"
        >
          {subtitle}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
});
