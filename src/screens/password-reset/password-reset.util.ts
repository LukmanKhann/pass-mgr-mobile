import { sendPasswordResetEmail } from 'firebase/auth';

import { FIREBASE_AUTH } from '../../Firebase/firebase-config';

export const RESET_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RESEND_COOLDOWN_SECONDS = 60;

const isFirebaseError = (error: unknown): error is { code: string } =>
  typeof error === 'object' && error !== null && 'code' in error;

export const requestPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(FIREBASE_AUTH, email.trim());
};

export const mapPasswordResetError = (error: unknown): string => {
  if (!isFirebaseError(error)) {
    return 'Could not send the reset email. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid. Please check and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return 'Could not send the reset email. Please try again.';
  }
};
