import React from 'react';
import { StyleSheet, View } from 'react-native';

import MaterialSymbols from '../../widgets/material-icon';

import { Button } from '../../controls/button';
import { Typography } from '../../widgets/typography';
import { useTheme } from '../../../hooks/use-theme.hook';

interface IProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  fullScreen,
}: IProps) {
  const { colors, spacing } = useTheme();

  const content = (
    <View
      style={[styles.content, { padding: spacing.xxl, gap: spacing.md }]}
    >
      <MaterialSymbols name="warning" size={48} color={colors.error} />
      <Typography variant="headingMd" color={colors.textPrimary} align="center">
        {title}
      </Typography>
      <Typography variant="bodyMd" color={colors.textSecondary} align="center">
        {message}
      </Typography>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="outline"
          size="sm"
        />
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={[styles.fullScreen, { backgroundColor: colors.background }]}
      >
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
    justifyContent: 'center',
  },
});
