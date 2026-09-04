import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Button } from '../../controls/button';
import MaterialSymbols from '../material-icon';
import { Typography } from '../typography';

interface IProps {
  icon?: string;
  title?: string;
  message?: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

export function EmptyState({
  icon = 'lock',
  title,
  message,
  actionTitle,
  onActionPress,
}: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xxl }]}>
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        <MaterialSymbols name={icon} size={48} color={colors.accent} />
      </View>
      {title ? (
        <Typography
          variant="headingMd"
          color={colors.textPrimary}
          align="center"
          style={{ alignSelf: 'center', marginTop: spacing.lg }}
        >
          {title}
        </Typography>
      ) : null}
      {message ? (
        <Typography
          variant="bodyMd"
          color={colors.textTertiary}
          align="center"
          style={{ alignSelf: 'center', marginTop: spacing.xs }}
        >
          {message}
        </Typography>
      ) : null}
      {onActionPress ? (
        <Button
          title={actionTitle ?? 'Add Password'}
          onPress={onActionPress}
          variant="primary"
          style={{ alignSelf: 'center', marginTop: spacing.xl }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
