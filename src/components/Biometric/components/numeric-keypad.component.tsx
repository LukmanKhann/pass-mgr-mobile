import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import type { TextInputInstance } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import MaterialSymbols from '../../widgets/material-icon';

export interface INumericKeypadProps {
  value: string;
  onChangeText: (text: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  maxLength: number;
  inputRef: React.RefObject<TextInputInstance | null>;
}

export function NumericKeypad({
  value,
  onChangeText,
  onBackspace,
  onSubmit,
  maxLength,
  inputRef,
}: INumericKeypadProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View style={styles.inputRow}>
      <TextInput
        ref={inputRef}
        style={[
          styles.visibleInput,
          {
            color: colors.textPrimary,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            backgroundColor: colors.surface,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        keyboardType="numeric"
        secureTextEntry
        maxLength={maxLength}
        autoFocus={false}
        caretHidden
        contextMenuHidden
        placeholder="Tap to enter password"
        placeholderTextColor={colors.textTertiary}
      />
      <TouchableOpacity
        style={[
          styles.backspaceButton,
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: borderRadius.md,
            marginLeft: spacing.md,
          },
        ]}
        onPress={onBackspace}
        activeOpacity={0.7}>
        <MaterialSymbols name="delete" size={20} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibleInput: {
    flex:  1,
    fontSize:  16,
    paddingHorizontal:  12,
    paddingVertical:  8,
    borderWidth:  1,
    minWidth:  120,
  },
  backspaceButton: {
    padding:  8,
  },
});
