import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../widgets/typography';
import type { IInputProps } from './input.type';

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  helperText,
  style,
  ...props
}: IInputProps) {
  const { colors, borderRadius: br, spacing: sp } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, { gap: sp.xs }]}>
      {label && (
        <Typography variant="label" color={colors.textSecondary}>
          {label}
        </Typography>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : isFocused ? colors.accent : colors.border,
            borderRadius: br.md,
            paddingHorizontal: sp.lg,
          },
        ]}
      >
        {leftIcon && <View style={{ marginRight: sp.sm }}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.textInput,
            { color: colors.textPrimary },
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity style={{ marginLeft: sp.sm }} onPress={onRightIconPress} disabled={!onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Typography variant="caption" color={colors.error}>{error}</Typography>
      )}
      {helperText && !error && (
        <Typography variant="caption" color={colors.textTertiary}>{helperText}</Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 52,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    paddingVertical: 12,
  },
});
