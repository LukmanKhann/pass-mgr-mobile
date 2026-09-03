import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';

export interface IPinCirclesProps {
  length: number;
  maxLength: number;
}

export function PinCircles({ length, maxLength }: IPinCirclesProps): JSX.Element {
  const { colors, borderRadius } = useTheme();

  return (
    <View style={styles.row}>
      {Array.from({ length: maxLength }).map((_, index: number) => {
        const filled = index < length;
        return (
          <View
            key={`pin-${index}`}
            style={[
              styles.circle,
              { borderRadius: borderRadius.full },
              filled ? { backgroundColor: colors.accent } : { backgroundColor: colors.border },
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
    gap: 8,
    marginVertical: 6,
  },
  circle: {
    width: 12,
    height:  12,
  },
});
