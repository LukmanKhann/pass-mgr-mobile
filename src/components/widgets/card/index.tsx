import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import type { ICardProps, ICardVariant } from './card.type';

export function Card({
  children,
  onPress,
  style,
  variant = 'elevated' as ICardVariant,
  padding,
}: ICardProps) {
  const { colors, borderRadius, spacing } = useTheme();
  const pad = padding ?? spacing.lg;

  const variantStyles: Record<ICardVariant, ViewStyle> = {
    elevated: {
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 3,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    flat: {
      backgroundColor: colors.surface,
    },
  };

  const content = (
    <View style={[
      { borderRadius: borderRadius.lg },
      variantStyles[variant],
      { padding: pad },
      style,
    ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({});
