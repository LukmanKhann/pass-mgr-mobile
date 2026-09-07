import { useEffect } from 'react';
import { showToast, dismissToast, configure } from 'react-native-nitro-toast';

import { useTheme } from '../../hooks/use-theme.hook';
import type { IColorTokens } from '../../theme/colors.theme';

let currentColors: IColorTokens | null = null;

function getBackgroundColor(type: string): string {
  if (!currentColors) return '#2E3440';
  const map: Record<string, string> = {
    success: currentColors.successLight ?? currentColors.surface,
    error: currentColors.errorLight ?? currentColors.surface,
    warning: currentColors.warningLight ?? currentColors.surface,
    info: currentColors.infoLight ?? currentColors.surface,
    default: currentColors.surface,
    loading: currentColors.surface,
  };
  return map[type] ?? currentColors.surface;
}

function getTextColor(type: string): string {
  if (!currentColors) return '#ECEFF4';
  const map: Record<string, string> = {
    success: currentColors.success,
    error: currentColors.error,
    warning: currentColors.warning,
    info: currentColors.info,
    default: currentColors.textPrimary,
    loading: currentColors.textPrimary,
  };
  return map[type] ?? currentColors.textPrimary;
}

export function nitroToast(
  message: string,
  options: {
    type?: 'success' | 'error' | 'warning' | 'info' | 'default';
    title?: string;
    duration?: number;
    position?: 'top' | 'bottom';
  } = {},
): void {
  const {
    type = 'default',
    title,
    duration = 4000,
    position = 'bottom',
  } = options;

  showToast(message, {
    type: type === 'warning' ? 'warning' : type,
    title: title ?? '',
    duration,
    position,
    useOverlay: false,
    backgroundColor: getBackgroundColor(type),
    messageColor: getTextColor(type),
    titleColor: getTextColor(type),
  });
}

export const CustomSnackbar = {
  show: nitroToast,
  success: (message: string, detail?: string): void =>
    nitroToast(detail ? `${message}: ${detail}` : message, {
      type: 'success',
      title: 'Success',
    }),
  error: (message: string, detail?: string): void =>
    nitroToast(detail ? `${message}: ${detail}` : message, {
      type: 'error',
      title: 'Error',
      duration: 6000,
    }),
  warning: (message: string, detail?: string): void =>
    nitroToast(detail ? `${message}: ${detail}` : message, {
      type: 'warning',
      title: 'Warning',
    }),
  info: (message: string, detail?: string): void =>
    nitroToast(detail ? `${message}: ${detail}` : message, {
      type: 'info',
      title: 'Info',
    }),
};

export function setToastColors(colors: IColorTokens): void {
  currentColors = colors;
}

export function ToastHost(): null {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    setToastColors(colors);
    configure({
      position: 'bottom',
      presentation: 'stacked',
      haptics: false,
      useOverlay: false,
      backgroundColor: colors.surface,
      messageColor: colors.textPrimary,
      titleColor: colors.textPrimary,
    });
  }, [colors, isDark]);

  return null;
}

export { dismissToast };

export default CustomSnackbar;
