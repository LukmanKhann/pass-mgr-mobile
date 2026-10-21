import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';

export type IPinCirclesStatus = 'default' | 'error' | 'success';

export interface IPinCirclesProps {
  length: number;
  maxLength: number;
  status?: IPinCirclesStatus;
}

export function PinCircles({
  length,
  maxLength,
  status = 'default',
}: IPinCirclesProps): JSX.Element {
  const { colors, borderRadius } = useTheme();

  const filledColor =
    status === 'error'
      ? colors.error
      : status === 'success'
      ? colors.success
      : colors.accent;

  const emptyBorderColor = status === 'error' ? colors.error : colors.border;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`PIN, ${length} of ${maxLength} digits entered`}
    >
      {Array.from({ length: maxLength }).map((_, index: number) => {
        const filled = index < length;
        return (
          <View
            key={`pin-${index}`}
            style={[
              styles.circle,
              { borderRadius: borderRadius.full },
              filled
                ? { backgroundColor: filledColor, borderColor: filledColor }
                : { borderColor: emptyBorderColor },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginVertical: 20,
  },
  circle: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
  },
});
