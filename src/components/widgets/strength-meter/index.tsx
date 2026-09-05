import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';

interface IProps {
  /** 0–3 — how many segments are lit. */
  level: number;
  color: string;
  style?: ViewStyle;
}

export function StrengthMeter({ level, color, style }: IProps): JSX.Element {
  const { colors, borderRadius } = useTheme();

  return (
    <View style={[styles.row, style]}>
      {[1, 2, 3].map(segment => (
        <View
          key={segment}
          style={[
            styles.segment,
            {
              borderRadius: borderRadius.full,
              backgroundColor: segment <= level ? color : colors.surfaceElevated,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 4,
  },
});