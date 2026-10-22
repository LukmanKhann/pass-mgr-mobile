import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import MaterialSymbols from '../../../components/widgets/material-icon';

import { AppBottomSheet } from '../../../components/widgets/bottom-sheet';
import { Typography } from '../../../components/widgets/typography';
import { useTheme } from '../../../hooks/use-theme.hook';
import {
  AUTO_LOCK_OPTIONS,
  type IAutoLockOption,
} from '../../../components/Biometric/auto-lock.constants';

interface IProps {
  visible: boolean;
  value: number;
  onClose: () => void;
  onSelect: (minutes: number) => void;
}

interface IAutoLockOptionRowProps {
  option: IAutoLockOption;
  selected: boolean;
  onPress: () => void;
}

function AutoLockOptionRow({
  option,
  selected,
  onPress,
}: IAutoLockOptionRowProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const selectedStyle = selected
    ? { backgroundColor: colors.surfaceElevated }
    : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${option.label}. ${option.description}`}
      style={[
        styles.option,
        { borderRadius: borderRadius.md, padding: spacing.md },
        selectedStyle,
      ]}
    >
      <View style={styles.optionText}>
        <Typography
          variant="bodyMd"
          color={colors.textPrimary}
          fontWeight={selected ? '600' : '400'}
        >
          {option.label}
        </Typography>
        <Typography variant="caption" color={colors.textTertiary}>
          {option.description}
        </Typography>
      </View>
      <MaterialSymbols
        name={selected ? 'radio_button_checked' : 'radio_button_unchecked'}
        size={22}
        color={selected ? colors.accent : colors.textTertiary}
      />
    </TouchableOpacity>
  );
}

export function AutoLockSheet({
  visible,
  value,
  onClose,
  onSelect,
}: IProps): JSX.Element {
  const { spacing } = useTheme();

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title="Auto-lock"
      subtitle="Choose how long the app can stay in the background before it locks."
    >
      <View
        style={[styles.options, { gap: spacing.xs, marginTop: spacing.md }]}
      >
        {AUTO_LOCK_OPTIONS.map(option => (
          <AutoLockOptionRow
            key={option.minutes}
            option={option}
            selected={option.minutes === value}
            onPress={() => onSelect(option.minutes)}
          />
        ))}
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  options: {
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
});
