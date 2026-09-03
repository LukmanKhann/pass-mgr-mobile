import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';

interface IProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export function Loader({ size = 'small', color, fullScreen }: IProps) {
  const { colors } = useTheme();

  const spinner = (
    <ActivityIndicator size={size} color={color || colors.accent} />
  );

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: colors.background }]}>
        {spinner}
      </View>
    );
  }

  return spinner;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
