import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Icon } from '../../../components/widgets/icon';
import { Typography } from '../../../components/widgets/typography';
import MaterialSymbols from '../../../components/widgets/material-icon';

interface IProps {
  icon: string;
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
  disabled?: boolean;
}

export function SettingItem({
  icon,
  title,
  subtitle,
  rightComponent,
  onPress,
  showArrow = false,
  disabled = false,
}: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress || disabled}
      activeOpacity={0.7}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
        },
        disabled && { opacity: 0.5 },
      ]}
    >
      <View style={[styles.left, { gap: spacing.md }]}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceElevated, borderRadius: borderRadius.md }]}>
          <Icon name={icon} size={22} color={disabled ? colors.textTertiary : colors.accent} />
        </View>
        <View style={styles.textBlock}>
          <Typography variant="bodyMd" color={disabled ? colors.textTertiary : colors.textPrimary} fontWeight="600">
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" color={colors.textTertiary}>
              {subtitle}
            </Typography>
          ) : null}
        </View>
      </View>
      <View style={[styles.right, { gap: spacing.sm }]}>
        {rightComponent}
        {showArrow ? <MaterialSymbols name="chevron_right" size={20} color={colors.textTertiary} /> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex:  1,
  },
  iconWrap: {
    width: 40,
    height:  40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex:  1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
