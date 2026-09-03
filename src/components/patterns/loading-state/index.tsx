import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Loader } from '../../widgets/loader';
import { Typography } from '../../widgets/typography';
interface IProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message, fullScreen }: IProps) {
  const { colors, spacing } = useTheme();

  const content = (
    <View style={[styles.content, { gap: spacing.md, padding: spacing.xxl }]}>
      <Loader size="large" />
      {message && (
        <Typography variant="bodyMd" color={colors.textSecondary}>{message}</Typography>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: colors.background }]}>
        {content}
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
});
