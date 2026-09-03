import React from 'react';

import { useTheme } from '../../../hooks/use-theme.hook';
import {
  MaterialSymbolRounded,
  MaterialSymbolRoundedFilled,
} from './material-symbols';

interface IProps {
  name: string;
  size?: number;
  color?: string;
  variant?: 'rounded' | 'filled';
  style?: object;
  [key: string]: unknown;
}

export default function MaterialSymbols({
  name,
  size = 24,
  color,
  variant = 'rounded',
  ...rest
}: IProps): JSX.Element {
  const { colors } = useTheme();
  const iconColor = color ?? colors.textPrimary;

  if (variant === 'filled') {
    return (
      <MaterialSymbolRoundedFilled name={name} size={size} color={iconColor} {...rest} />
    );
  }

  return (
    <MaterialSymbolRounded name={name} size={size} color={iconColor} {...rest} />
  );
}
