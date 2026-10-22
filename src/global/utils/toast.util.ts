import { toast } from 'burnt';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface IToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
  position?: 'top' | 'bottom';
}

interface IPresetConfig {
  preset: 'done' | 'error' | 'none';
  haptic: 'success' | 'warning' | 'error' | 'none';
  duration: number;
}

const DEFAULT_DURATION_SECONDS = 4;
const ERROR_DURATION_SECONDS = 6;
const DEFAULT_POSITION: 'bottom' = 'bottom';

const PRESET_BY_TYPE: Record<ToastType, IPresetConfig> = {
  success: {
    preset: 'done',
    haptic: 'success',
    duration: DEFAULT_DURATION_SECONDS,
  },
  error: {
    preset: 'error',
    haptic: 'error',
    duration: ERROR_DURATION_SECONDS,
  },
  warning: {
    preset: 'none',
    haptic: 'warning',
    duration: DEFAULT_DURATION_SECONDS,
  },
  info: {
    preset: 'none',
    haptic: 'none',
    duration: DEFAULT_DURATION_SECONDS,
  },
};

function present(
  title: string,
  type: ToastType,
  detail?: string,
  options: Pick<IToastOptions, 'duration' | 'position'> = {},
): void {
  const preset = PRESET_BY_TYPE[type];

  try {
    toast({
      title,
      message: detail,
      preset: preset.preset,
      haptic: preset.haptic,
      duration: options.duration ?? preset.duration,
      from: options.position ?? DEFAULT_POSITION,
    }).catch(() => undefined);
  } catch {
    // Toasts are non-critical UI; never let a native failure break the caller.
  }
}

export function showToast(message: string, options: IToastOptions = {}): void {
  const { type = 'info', title, duration, position } = options;
  const toastTitle = title ?? message;
  const toastDetail = title ? message : undefined;

  present(toastTitle, type, toastDetail, { duration, position });
}

export const CustomSnackbar = {
  show: showToast,
  success: (message: string, detail?: string): void =>
    present(message, 'success', detail),
  error: (message: string, detail?: string): void =>
    present(message, 'error', detail),
  warning: (message: string, detail?: string): void =>
    present(message, 'warning', detail),
  info: (message: string, detail?: string): void =>
    present(message, 'info', detail),
};

export default CustomSnackbar;
