import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';

export function HeaderShadow(): JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={[styles.shadow, { backgroundColor: colors.headerShadow }]} />
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
});
