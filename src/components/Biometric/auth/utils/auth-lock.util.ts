import type { IAuthMethods } from '../auth-lock.type';

const BIOMETRIC_BUTTON_LABELS: Record<string, string> = {
  'Face ID': 'Unlock with Face ID',
  'Touch ID': 'Unlock with Touch ID',
  Fingerprint: 'Unlock with Fingerprint',
  Biometric: 'Unlock with Biometrics',
};

const BIOMETRIC_ICONS: Record<string, string> = {
  'Face ID': 'person',
  'Touch ID': 'fingerprint',
  Fingerprint: 'fingerprint',
  Biometric: 'fingerprint',
};

export function getBiometricButtonLabel(biometryType: string): string {
  return (
    BIOMETRIC_BUTTON_LABELS[biometryType] ?? BIOMETRIC_BUTTON_LABELS.Biometric
  );
}

export function getBiometricIcon(biometryType: string): string {
  return BIOMETRIC_ICONS[biometryType] ?? BIOMETRIC_ICONS.Biometric;
}

export function getUnlockSubtitle(methods: IAuthMethods): string {
  if (methods.biometric && methods.numeric) {
    return 'Use biometrics or your PIN to continue';
  }
  if (methods.biometric) {
    return 'Use your biometrics to continue';
  }
  if (methods.numeric) {
    return 'Enter your PIN to continue';
  }
  return 'Unlock your vault to continue';
}
