import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import MaterialSymbols from '../../widgets/material-icon';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../widgets/typography';

const KEYPAD_ROWS: Array<Array<string>> = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

const MAX_KEY_SIZE = 72;
const MIN_KEY_SIZE = 56;
const KEY_GAP = 18;
const KEYPAD_HORIZONTAL_PADDING = 24;

export interface IPinKeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
  keyBackgroundColor?: string;
  keyBorderColor?: string;
  keyTextColor?: string;
}

export function PinKeypad({
  onDigitPress,
  onBackspace,
  disabled = false,
  keyBackgroundColor,
  keyBorderColor,
  keyTextColor,
}: IPinKeypadProps): JSX.Element {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const resolvedKeyBackground = keyBackgroundColor ?? colors.surface;
  const resolvedKeyBorder = keyBorderColor ?? colors.borderLight;
  const resolvedKeyText = keyTextColor ?? colors.textPrimary;

  const maxKeySizeForHeight = Math.floor(
    (height * 0.4 - KEY_GAP * (KEYPAD_ROWS.length - 1)) / KEYPAD_ROWS.length,
  );
  const maxKeySize = Math.max(
    MIN_KEY_SIZE,
    Math.min(MAX_KEY_SIZE, maxKeySizeForHeight),
  );
  const availableWidth =
    width -
    KEYPAD_HORIZONTAL_PADDING * 2 -
    KEY_GAP * (KEYPAD_ROWS[0].length - 1);
  const keySize = Math.max(
    MIN_KEY_SIZE,
    Math.min(maxKeySize, Math.floor(availableWidth / KEYPAD_ROWS[0].length)),
  );

  const renderKey = (key: string): JSX.Element => {
    if (key === '') {
      return <View key="empty" style={{ width: keySize, height: keySize }} />;
    }

    if (key === 'backspace') {
      return (
        <TouchableOpacity
          key="backspace"
          style={[styles.key, { width: keySize, height: keySize }]}
          onPress={onBackspace}
          disabled={disabled}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel="Delete last digit"
        >
          <MaterialSymbols name="delete" size={28} color={resolvedKeyText} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.key,
          styles.digitKey,
          {
            width: keySize,
            height: keySize,
            borderRadius: keySize / 2,
            backgroundColor: resolvedKeyBackground,
            borderColor: resolvedKeyBorder,
          },
        ]}
        onPress={() => onDigitPress(key)}
        disabled={disabled}
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel={`Digit ${key}`}
      >
        <Typography variant="headingMd" color={resolvedKeyText}>
          {key}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { gap: KEY_GAP }]}>
      {KEYPAD_ROWS.map((row, rowIndex) => (
        <View
          key={`keypad-row-${rowIndex}`}
          style={[styles.row, { gap: KEY_GAP }]}
        >
          {row.map(renderKey)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  key: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitKey: {
    borderWidth: 1,
  },
});
