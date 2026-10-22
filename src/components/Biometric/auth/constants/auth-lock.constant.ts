import type { IAuthMethods } from '../auth-lock.type';

export const PIN_LENGTH = 4;
export const MAX_PIN_ATTEMPTS = 5;
export const BIOMETRIC_PROMPT_DELAY_MS = 500;
export const AUTH_SUCCESS_DELAY_MS = 200;
export const PIN_AUTO_SUBMIT_DELAY_MS = 150;

export const INCORRECT_PIN_MESSAGE = 'Incorrect PIN. Please try again.';
export const LIMIT_REACHED_TITLE = 'Too Many Attempts';
export const LIMIT_REACHED_MESSAGE =
  'Too many incorrect PIN attempts. Please wait a moment and try again.';

export const EMPTY_AUTH_METHODS: IAuthMethods = {
  biometric: false,
  numeric: false,
  biometryType: 'Biometric',
};
