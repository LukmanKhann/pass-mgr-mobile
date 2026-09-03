import React, { useEffect } from 'react';
import { Snackbar } from 'react-native-snackbar';

import { useTheme } from '../../hooks/use-theme.hook';
import type { IColorTokens } from '../../theme/colors.theme';

let currentColors: IColorTokens | null = null;

interface ISnackbarOptions {
  duration?: number;
  actionText?: string;
  onActionPress?: () => void;
}

function show(message: string, options: ISnackbarOptions = {}): void {
  Snackbar.show({
    text: message,
    duration: options.duration ?? Snackbar.LENGTH_SHORT,
    backgroundColor: currentColors?.surface ?? '#2E3440',
    textColor: currentColors?.textPrimary ?? '#ECEFF4',
    action: {
      text: options.actionText ?? 'Close',
      textColor: currentColors?.textTertiary ?? '#000000',
      onPress: options.onActionPress ?? Snackbar.dismiss,
    },
  });
}

export const CustomSnackbar = {
  show,
  success: (message: string, detail?: string): void =>
    show(detail ? `${message}: ${detail}` : message, { actionText: 'Done' }),
  error: (message: string, detail?: string): void =>
    show(detail ? `${message}: ${detail}` : message, {
      duration: Snackbar.LENGTH_LONG,
      actionText: 'Dismiss',
    }),
  warning: (message: string, detail?: string): void =>
    show(detail ? `${message}: ${detail}` : message, { actionText: 'OK' }),
  info: (message: string, detail?: string): void =>
    show(detail ? `${message}: ${detail}` : message, { actionText: 'Got it' }),
};

export function setSnackbarColors(colors: IColorTokens): void {
  currentColors = colors;
}

export function SnackbarHost(): null {
  const { colors } = useTheme();

  useEffect(() => {
    setSnackbarColors(colors);
  }, [colors]);

  return null;
}

export default CustomSnackbar;
