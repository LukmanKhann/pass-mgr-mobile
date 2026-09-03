import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../hooks/use-theme.hook';

interface IProps {
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
}

export function Icon({ name, size = 24, color, onPress }: IProps): JSX.Element {
  const { colors } = useTheme();
  const icon = (
    <MaterialCommunityIcons name={name} size={size} color={color ?? colors.textPrimary} />
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
        {icon}
      </TouchableOpacity>
    );
  }

  return icon;
}

const styles = StyleSheet.create({
  touchable: {
    padding: 4,
  },
});
