import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AUTO_LOCK_OPTIONS,
  type IAutoLockOption,
} from '../../../components/Biometric/auto-lock.constants';
import MaterialSymbols from '../../../components/widgets/material-icon';
import { Typography } from '../../../components/widgets/typography';
import { useTheme } from '../../../hooks/use-theme.hook';

interface IProps {
  visible: boolean;
  value: number;
  onClose: () => void;
  onSelect: (minutes: number) => void;
}

export function AutoLockModal({
  visible,
  value,
  onClose,
  onSelect,
}: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  const renderOption = (option: IAutoLockOption): JSX.Element => {
    const selected = option.minutes === value;

    return (
      <TouchableOpacity
        key={option.minutes}
        onPress={() => onSelect(option.minutes)}
        activeOpacity={0.7}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={`${option.label}. ${option.description}`}
        style={[
          styles.option,
          {
            backgroundColor: selected ? colors.surfaceElevated : 'transparent',
            borderRadius: borderRadius.md,
            padding: spacing.md,
          },
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
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Close auto-lock options"
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.sm,
              paddingBottom: insets.bottom + spacing.lg,
            },
          ]}
        >
          <View
            style={[
              styles.handle,
              {
                backgroundColor: colors.border,
                borderRadius: borderRadius.full,
                marginBottom: spacing.md,
              },
            ]}
          />
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Typography variant="headingMd" color={colors.textPrimary}>
                Auto-lock
              </Typography>
              <Typography variant="caption" color={colors.textTertiary}>
                Choose how long the app can stay in the background before it
                locks.
              </Typography>
            </View>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={styles.closeButton}
            >
              <MaterialSymbols
                name="close"
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={{ gap: spacing.xs }}>
            {AUTO_LOCK_OPTIONS.map(renderOption)}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    width: '100%',
  },
  handle: {
    width: 40,
    height: 4,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  closeButton: {
    padding: 4,
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
