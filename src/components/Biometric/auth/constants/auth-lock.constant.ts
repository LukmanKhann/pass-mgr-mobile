import type { IAuthMethods } from '../auth-lock.type';

export const BIOMETRIC_PROMPT_DELAY_MS = 500;
export const AUTH_SUCCESS_DELAY_MS = 200;

export const EMPTY_AUTH_METHODS: IAuthMethods = {
  biometric: false,
  biometryType: 'Biometric',
};
