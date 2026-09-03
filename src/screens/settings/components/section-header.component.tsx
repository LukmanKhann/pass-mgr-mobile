import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../../components/widgets/typography';

interface IProps {
  title: string;
}

export function SectionHeader({ title }: IProps): JSX.Element {
  const { colors, spacing } = useTheme();
  return (
    <View style={[styles.wrapper, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>
      <Typography variant="label" color={colors.textTertiary}>
        {title.toUpperCase()}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
  },
});
