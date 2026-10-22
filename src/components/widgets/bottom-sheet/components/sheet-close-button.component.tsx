import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import MaterialSymbols from '../../material-icon';
import { useTheme } from '../../../../hooks/use-theme.hook';

interface IProps {
  onClose: () => void;
  top: number;
}

export function SheetCloseButton({ onClose, top }: IProps): JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <TouchableOpacity
      onPress={onClose}
      activeOpacity={0.7}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Close"
      style={[styles.button, { top, right: spacing.lg }]}
    >
      <MaterialSymbols name="close" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
