import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../widgets/typography';
import type { IButtonProps, IButtonSize, IButtonVariant } from './button.type';

export function Button({
  title,
  onPress,
  variant = 'primary' as IButtonVariant,
  size = 'md' as IButtonSize,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}: IButtonProps) {
  const { colors, borderRadius, spacing } = useTheme();
  const isDisabled = disabled || loading;

  const variantStyles: Record<IButtonVariant, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.accent },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: colors.error },
  };

  const sizeStyles: Record<IButtonSize, ViewStyle> = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
    md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
    lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl },
  };

  const textColors: Record<IButtonVariant, string> = {
    primary: colors.textOnPrimary,
    secondary: colors.textInverse,
    outline: colors.primary,
    ghost: colors.primary,
    danger: colors.textInverse,
  };

  const textSizeStyles: Record<IButtonSize, 'buttonLg' | 'buttonMd'> = {
    sm: 'buttonMd',
    md: 'buttonLg',
    lg: 'buttonLg',
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        { borderRadius: borderRadius.lg },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textOnPrimary : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Typography
            variant={textSizeStyles[size]}
            color={textColors[variant]}
            style={icon ? styles.iconMargin : undefined}
          >
            {title}
          </Typography>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  iconMargin: {
    marginLeft: 8,
  },
});
